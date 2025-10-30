import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/auth';

// Validation schemas
const createUserSchema = z.object({
  universityId: z.string().min(1),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  photoUrl: z.string().url().optional(),
  roleSlug: z.string().min(1)
});

const updateUserSchema = createUserSchema.partial().omit({ universityId: true, password: true });

const assignRoleSchema = z.object({
  roleSlug: z.string().min(1),
  expiresAt: z.string().datetime().optional()
});

// List users
export const listUsers = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // @ts-ignore
    const user = req.user;
    
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const status = req.query.status as string;
    const roleSlug = req.query.role as string;
    
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    // Access control
    if (!user.isGodMode) {
      where.universityId = user.universityId;
    }
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status) where.status = status;
    
    // Filter by role if specified
    let roleFilter = {};
    if (roleSlug) {
      const role = await prisma.role.findUnique({ where: { slug: roleSlug } });
      if (role) {
        roleFilter = {
          roleAssignments: {
            some: { roleId: role.id }
          }
        };
      }
    }
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { ...where, ...roleFilter },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          universityId: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          photoUrl: true,
          status: true,
          emailVerifiedAt: true,
          lastLoginAt: true,
          createdAt: true,
          roleAssignments: {
            include: {
              role: {
                select: {
                  slug: true,
                  name: true,
                  level: true
                }
              }
            }
          }
        }
      }),
      prisma.user.count({ where: { ...where, ...roleFilter } })
    ]);
    
    res.json({
      success: true,
      data: users.map((u: any) => ({
        ...u,
        roles: u.roleAssignments.map((ra: any) => ra.role)
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get user by ID
export const getUser = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // @ts-ignore
    const currentUser = req.user;
    const { id } = req.params;
    
    if (!currentUser) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        roleAssignments: {
          include: {
            role: true
          }
        },
        student: true,
        faculty: true,
        staff: true
      }
    });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    // Check access
    if (!currentUser.isGodMode && user.universityId !== currentUser.universityId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    
    const { passwordHash, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: {
        ...userWithoutPassword,
        roles: user.roleAssignments.map((ra: any) => ra.role)
      }
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create user
export const createUser = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // @ts-ignore
    const currentUser = req.user;
    
    if (!currentUser) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const validatedData = createUserSchema.parse(req.body);
    
    // Check if user can create users in this university
    if (!currentUser.isGodMode) {
      if (validatedData.universityId !== currentUser.universityId) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You can only create users in your university'
        });
        return;
      }
    }
    
    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username }
        ]
      }
    });
    
    if (existing) {
      res.status(400).json({
        error: 'User already exists',
        message: existing.email === validatedData.email ? 'Email already registered' : 'Username already taken'
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
    const newUser = await prisma.user.create({
      data: {
        universityId: validatedData.universityId,
        username: validatedData.username,
        email: validatedData.email,
        passwordHash,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
        photoUrl: validatedData.photoUrl,
        status: 'active',
        emailVerifiedAt: new Date()
      }
    });
    
    // Assign role
    await prisma.roleUser.create({
      data: {
        userId: newUser.id,
        roleId: role.id,
        assignedBy: currentUser.id
      }
    });
    
    // Audit log
    await prisma.auditLog.create({
      data: {
        universityId: validatedData.universityId,
        userId: currentUser.id,
        action: 'CREATE_USER',
        entityType: 'user',
        entityId: newUser.id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        changes: { user: newUser, role: role.slug }
      }
    });
    
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        ...userWithoutPassword,
        role: role.slug
      }
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
      return;
    }
    
    console.error('Create user error:', error);
    res.status(500).json({
      error: 'Failed to create user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // @ts-ignore
    const currentUser = req.user;
    const { id } = req.params;
    
    if (!currentUser) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const user = await prisma.user.findUnique({ where: { id } });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    // Check access
    if (!currentUser.isGodMode && user.universityId !== currentUser.universityId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    
    const validatedData = updateUserSchema.parse(req.body);
    
    // Check username/email conflicts
    if (validatedData.username || validatedData.email) {
      const conflict = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                validatedData.email ? { email: validatedData.email } : {},
                validatedData.username ? { username: validatedData.username } : {}
              ]
            }
          ]
        }
      });
      
      if (conflict) {
        res.status(400).json({
          error: 'Conflict',
          message: 'Email or username already taken'
        });
        return;
      }
    }
    
    const updatedUser = await prisma.user.update({
      where: { id },
      data: validatedData
    });
    
    // Audit log
    await prisma.auditLog.create({
      data: {
        universityId: user.universityId,
        userId: currentUser.id,
        action: 'UPDATE_USER',
        entityType: 'user',
        entityId: id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        changes: {
          before: user,
          after: updatedUser
        }
      }
    });
    
    const { passwordHash, ...userWithoutPassword } = updatedUser;
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: userWithoutPassword
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
      return;
    }
    
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'Failed to update user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Assign role to user
export const assignRole = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // @ts-ignore
    const currentUser = req.user;
    const { id } = req.params;
    
    if (!currentUser) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const user = await prisma.user.findUnique({ where: { id } });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    const validatedData = assignRoleSchema.parse(req.body);
    
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
    
    // Check if role already assigned
    const existing = await prisma.roleUser.findFirst({
      where: {
        userId: id,
        roleId: role.id
      }
    });
    
    if (existing) {
      res.status(400).json({
        error: 'Role already assigned',
        message: `User already has the ${role.name} role`
      });
      return;
    }
    
    const roleAssignment = await prisma.roleUser.create({
      data: {
        userId: id,
        roleId: role.id,
        assignedBy: currentUser.id,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : undefined
      }
    });
    
    // Audit log
    await prisma.auditLog.create({
      data: {
        universityId: user.universityId,
        userId: currentUser.id,
        action: 'ASSIGN_ROLE',
        entityType: 'user',
        entityId: id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        changes: {
          roleAssigned: role.slug,
          expiresAt: validatedData.expiresAt
        }
      }
    });
    
    res.json({
      success: true,
      message: 'Role assigned successfully',
      data: roleAssignment
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
      return;
    }
    
    console.error('Assign role error:', error);
    res.status(500).json({
      error: 'Failed to assign role',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete user (soft delete)
export const deleteUser = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // @ts-ignore
    const currentUser = req.user;
    const { id } = req.params;
    
    if (!currentUser) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const user = await prisma.user.findUnique({ where: { id } });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    // Check access
    if (!currentUser.isGodMode && user.universityId !== currentUser.universityId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    
    // Soft delete
    const deletedUser = await prisma.user.update({
      where: { id },
      data: {
        status: 'deleted',
        deletedAt: new Date()
      }
    });
    
    // Audit log
    await prisma.auditLog.create({
      data: {
        universityId: user.universityId,
        userId: currentUser.id,
        action: 'DELETE_USER',
        entityType: 'user',
        entityId: id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        changes: { user }
      }
    });
    
    const { passwordHash, ...userWithoutPassword } = deletedUser;
    
    res.json({
      success: true,
      message: 'User deleted successfully',
      data: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Failed to delete user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
