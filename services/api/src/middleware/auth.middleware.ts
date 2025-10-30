import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../lib/auth';
import { prisma } from '../lib/prisma';

export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  universityId: string | null;
  roles: Array<{
    roleId: string;
    roleName: string;
    permissions: string[];
  }>;
  isGodMode: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Authentication middleware - verifies JWT token and attaches user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    if (!payload || !payload.userId) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    // Fetch user with roles and permissions
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        roleAssignments: {
          where: {
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } }
            ]
          },
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user || user.status === 'deleted') {
      res.status(401).json({ error: 'User not found or inactive' });
      return;
    }

    // Check if user has active session
    const activeSession = await prisma.session.findFirst({
      where: {
        userId: user.id,
        isValid: true,
        expiresAt: { gt: new Date() }
      }
    });

    if (!activeSession) {
      res.status(401).json({ error: 'No active session found' });
      return;
    }

    // Transform roles and permissions
    const roles = user.roleAssignments.map((ra: any) => ({
      roleId: ra.role.id,
      roleName: ra.role.name,
      permissions: ra.role.rolePermissions.map((rp: any) => rp.permission.name)
    }));

    // Check if user has God Mode (Bitflow Owner or Bitflow Admin)
    const isGodMode = roles.some((r: any) => 
      r.roleName === 'Bitflow Owner' || r.roleName === 'Bitflow Admin'
    );

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      universityId: user.universityId,
      roles,
      isGodMode
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * Optional authentication - doesn't fail if no token, but attaches user if valid
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    if (payload && payload.userId) {
      // Reuse authenticate logic
      await authenticate(req, res, next);
    } else {
      next();
    }
  } catch (error) {
    // Don't fail, just continue without user
    next();
  }
};

/**
 * Require specific permissions
 */
export const requirePermissions = (...permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // God Mode bypasses all permission checks
    if (req.user.isGodMode) {
      next();
      return;
    }

    // Check if user has all required permissions
    const userPermissions = req.user.roles.flatMap(r => r.permissions);
    const hasAllPermissions = permissions.every(p => userPermissions.includes(p));

    if (!hasAllPermissions) {
      res.status(403).json({ 
        error: 'Insufficient permissions',
        required: permissions,
        userHas: userPermissions
      });
      return;
    }

    next();
  };
};

/**
 * Require specific roles
 */
export const requireRoles = (...roleNames: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // God Mode bypasses all role checks
    if (req.user.isGodMode) {
      next();
      return;
    }

    // Check if user has any of the required roles
    const userRoles = req.user.roles.map(r => r.roleName);
    const hasRequiredRole = roleNames.some(r => userRoles.includes(r));

    if (!hasRequiredRole) {
      res.status(403).json({ 
        error: 'Insufficient role',
        required: roleNames,
        userHas: userRoles
      });
      return;
    }

    next();
  };
};

/**
 * Require God Mode access
 */
export const requireGodMode = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  if (!req.user.isGodMode) {
    res.status(403).json({ error: 'God Mode access required' });
    return;
  }

  next();
};

/**
 * Require university context (non-God Mode users must have universityId)
 */
export const requireUniversityContext = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  // God Mode users can access any university
  if (req.user.isGodMode) {
    next();
    return;
  }

  if (!req.user.universityId) {
    res.status(403).json({ error: 'University context required' });
    return;
  }

  next();
};

/**
 * Verify user has access to specific university
 */
export const verifyUniversityAccess = (universityIdParam: string = 'universityId') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // God Mode can access any university
    if (req.user.isGodMode) {
      next();
      return;
    }

    const requestedUniversityId = req.params[universityIdParam] || req.body.universityId;

    if (!requestedUniversityId) {
      res.status(400).json({ error: 'University ID required' });
      return;
    }

    if (req.user.universityId !== requestedUniversityId) {
      res.status(403).json({ error: 'Access denied to this university' });
      return;
    }

    next();
  };
};
