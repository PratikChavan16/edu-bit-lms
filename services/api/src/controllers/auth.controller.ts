import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { hashPassword, comparePassword, generateTokenPair, verifyRefreshToken } from '../lib/auth';
import { prisma } from '../lib/prisma';

// Validation schemas
const registerSchema = z.object({
  universityId: z.string().min(1, 'University ID is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  roleSlug: z.string().min(1, 'Role is required')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

// Register new user
export const register = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username }
        ]
      }
    });
    
    if (existingUser) {
      res.status(400).json({
        error: 'User already exists',
        message: existingUser.email === validatedData.email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
      return;
    }
    
    // Verify role exists
    const role = await prisma.role.findUnique({
      where: { slug: validatedData.roleSlug }
    });
    
    if (!role) {
      res.status(400).json({
        error: 'Invalid role',
        message: `Role '${validatedData.roleSlug}' does not exist`
      });
      return;
    }
    
    // Hash password
    const passwordHash = await hashPassword(validatedData.password);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        universityId: validatedData.universityId,
        username: validatedData.username,
        email: validatedData.email,
        passwordHash,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
        status: 'active',
        emailVerifiedAt: new Date()
      },
      select: {
        id: true,
        universityId: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        status: true,
        createdAt: true
      }
    });
    
    // Assign role to user
    await prisma.roleUser.create({
      data: {
        userId: user.id,
        roleId: role.id
      }
    });
    
    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: role.slug,
      tenantId: user.universityId
    });
    
    // Store refresh token in session
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: tokens.refreshToken,
        ipAddress: req.ip,
        userAgent: req.get('user-agent') || 'unknown',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        ...user,
        role: role.slug
      },
      ...tokens
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
      return;
    }
    
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Login user
export const login = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);
    
    // Find user with roles
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: {
        roleAssignments: {
          include: {
            role: true
          }
        }
      }
    });
    
    if (!user) {
      res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
      return;
    }
    
    // Check if user is active
    if (user.status !== 'active') {
      res.status(403).json({
        error: 'Account disabled',
        message: `Your account is ${user.status}. Please contact support.`
      });
      return;
    }
    
    // Verify password
    const isPasswordValid = await comparePassword(validatedData.password, user.passwordHash);
    
    if (!isPasswordValid) {
      res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
      return;
    }
    
    // Get primary role (first assigned role)
    const primaryRole = user.roleAssignments[0]?.role;
    
    if (!primaryRole) {
      res.status(403).json({
        error: 'No role assigned',
        message: 'Your account has no role assigned. Please contact administrator.'
      });
      return;
    }
    
    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: primaryRole.slug,
      tenantId: user.universityId
    });
    
    // Store refresh token in session
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: tokens.refreshToken,
        ipAddress: req.ip,
        userAgent: req.get('user-agent') || 'unknown',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });
    
    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        universityId: user.universityId,
        userId: user.id,
        action: 'USER_LOGIN',
        entityType: 'user',
        entityId: user.id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      }
    });
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        universityId: user.universityId,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        photoUrl: user.photoUrl,
        role: primaryRole.slug,
        roles: user.roleAssignments.map(ra => ({
          slug: ra.role.slug,
          name: ra.role.name,
          level: ra.role.level,
          scope: ra.role.scope
        }))
      },
      ...tokens
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
      return;
    }
    
    console.error('Login error:', error);
    res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid credentials'
    });
  }
};

// Refresh access token
export const refreshToken = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const validatedData = refreshSchema.parse(req.body);
    
    // Verify refresh token
    let payload;
    try {
      payload = verifyRefreshToken(validatedData.refreshToken);
    } catch (error) {
      res.status(401).json({
        error: 'Invalid refresh token',
        message: 'Token expired or invalid'
      });
      return;
    }
    
    // Find session with refresh token
    const session = await prisma.session.findUnique({
      where: { refreshToken: validatedData.refreshToken },
      include: {
        user: {
          include: {
            roleAssignments: {
              include: {
                role: true
              }
            }
          }
        }
      }
    });
    
    if (!session) {
      res.status(401).json({
        error: 'Invalid refresh token',
        message: 'Session not found'
      });
      return;
    }
    
    // Check if session expired
    if (session.expiresAt < new Date()) {
      // Delete expired session
      await prisma.session.delete({
        where: { id: session.id }
      });
      
      res.status(401).json({
        error: 'Session expired',
        message: 'Please login again'
      });
      return;
    }
    
    // Check if user is active
    if (session.user.status !== 'active') {
      res.status(403).json({
        error: 'Account disabled',
        message: `Your account is ${session.user.status}`
      });
      return;
    }
    
    // Get primary role
    const primaryRole = session.user.roleAssignments[0]?.role;
    
    if (!primaryRole) {
      res.status(403).json({
        error: 'No role assigned',
        message: 'Your account has no role assigned'
      });
      return;
    }
    
    // Generate new tokens
    const tokens = generateTokenPair({
      userId: session.user.id,
      email: session.user.email,
      role: primaryRole.slug,
      tenantId: session.user.universityId
    });
    
    // Update session with new refresh token
    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: tokens.refreshToken,
        lastActivityAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });
    
    res.json({
      success: true,
      ...tokens
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
      return;
    }
    
    console.error('Refresh token error:', error);
    res.status(401).json({
      error: 'Token refresh failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Logout user
export const logout = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { refreshToken: token } = req.body;
    
    if (!token) {
      res.status(400).json({
        error: 'Refresh token required'
      });
      return;
    }
    
    // Find and delete session
    const session = await prisma.session.findUnique({
      where: { refreshToken: token }
    });
    
    if (session) {
      await prisma.session.delete({
        where: { id: session.id }
      });
      
      // Create audit log
      await prisma.auditLog.create({
        data: {
          universityId: 'PLATFORM',
          userId: session.userId,
          action: 'USER_LOGOUT',
          entityType: 'user',
          entityId: session.userId,
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // @ts-ignore - user is added by auth middleware
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
      return;
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roleAssignments: {
          include: {
            role: true
          }
        }
      }
    });
    
    if (!user) {
      res.status(404).json({
        error: 'User not found'
      });
      return;
    }
    
    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      user: {
        ...userWithoutPassword,
        roles: user.roleAssignments.map((ra: any) => ({
          slug: ra.role.slug,
          name: ra.role.name,
          level: ra.role.level,
          scope: ra.role.scope
        }))
      }
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to fetch profile',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
