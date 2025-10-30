import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

// Validation schemas
const createUniversitySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  subdomain: z.string().min(2, 'Subdomain must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Subdomain must contain only lowercase letters, numbers, and hyphens'),
  domain: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  establishedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  timezone: z.string().default('UTC'),
  storageQuotaGb: z.number().int().min(1).default(1000),
  branding: z.object({
    primary_color: z.string().optional(),
    logo_url: z.string().url().optional(),
    favicon_url: z.string().url().optional()
  }).optional()
});

const updateUniversitySchema = createUniversitySchema.partial();

// List universities with pagination
export const listUniversities = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // @ts-ignore
    const user = req.user;
    
    if (!user) {
      res.status(401).json({
        error: 'Unauthorized'
      });
      return;
    }
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const status = req.query.status as string;
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    // Only Bitflow Owner/Admin can see all universities
    if (!user.isGodMode) {
      where.id = user.universityId;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status) {
      where.status = status;
    }
    
    const [universities, total] = await Promise.all([
      prisma.university.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          subdomain: true,
          domain: true,
          email: true,
          phone: true,
          status: true,
          storageQuotaGb: true,
          storageUsedMb: true,
          establishedYear: true,
          branding: true,
          active: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.university.count({ where })
    ]);
    
    // Log God Mode access if applicable
    if (user.isGodMode) {
      await prisma.auditLog.create({
        data: {
          universityId: 'PLATFORM',
          userId: user.id,
          action: 'GOD_MODE_LIST_UNIVERSITIES',
          entityType: 'university',
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          isGodModeAction: true
        }
      });
    }
    
    res.json({
      success: true,
      data: universities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('List universities error:', error);
    res.status(500).json({
      error: 'Failed to fetch universities',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get university by ID
export const getUniversity = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // @ts-ignore
    const user = req.user;
    const { id } = req.params;
    
    if (!user) {
      res.status(401).json({
        error: 'Unauthorized'
      });
      return;
    }
    
    // Check access permissions
    if (!user.isGodMode && user.universityId !== id) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to access this university'
      });
      return;
    }
    
    const university = await prisma.university.findUnique({
      where: { id }
    });
    
    if (!university) {
      res.status(404).json({
        error: 'University not found'
      });
      return;
    }
    
    // Log God Mode access
    if (user.isGodMode) {
      await prisma.auditLog.create({
        data: {
          universityId: 'PLATFORM',
          userId: user.id,
          action: 'GOD_MODE_VIEW_UNIVERSITY',
          entityType: 'university',
          entityId: id,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          isGodModeAction: true
        }
      });
    }
    
    res.json({
      success: true,
      data: university
    });
    
  } catch (error) {
    console.error('Get university error:', error);
    res.status(500).json({
      error: 'Failed to fetch university',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create new university
export const createUniversity = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // @ts-ignore
    const user = req.user;
    
    if (!user) {
      res.status(401).json({
        error: 'Unauthorized'
      });
      return;
    }
    
    // Only Bitflow Owner can create universities
    if (!user.isGodMode) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only Bitflow Owner can create universities'
      });
      return;
    }
    
    const validatedData = createUniversitySchema.parse(req.body);
    
    // Check if slug or subdomain already exists
    const existing = await prisma.university.findFirst({
      where: {
        OR: [
          { slug: validatedData.slug },
          { subdomain: validatedData.subdomain }
        ]
      }
    });
    
    if (existing) {
      res.status(400).json({
        error: 'University already exists',
        message: existing.slug === validatedData.slug 
          ? 'Slug already taken' 
          : 'Subdomain already taken'
      });
      return;
    }
    
    const university = await prisma.university.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        subdomain: validatedData.subdomain,
        domain: validatedData.domain,
        email: validatedData.email,
        phone: validatedData.phone,
        address: validatedData.address,
        establishedYear: validatedData.establishedYear,
        timezone: validatedData.timezone,
        storageQuotaGb: validatedData.storageQuotaGb,
        branding: validatedData.branding as any,
        status: 'setup',
        active: true
      }
    });
    
    // Log creation
    await prisma.auditLog.create({
      data: {
        universityId: 'PLATFORM',
        userId: user.id,
        action: 'CREATE_UNIVERSITY',
        entityType: 'university',
        entityId: university.id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        newValues: university as any,
        isGodModeAction: true
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'University created successfully',
      data: university
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
      return;
    }
    
    console.error('Create university error:', error);
    res.status(500).json({
      error: 'Failed to create university',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update university
export const updateUniversity = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // @ts-ignore
    const user = req.user;
    const { id } = req.params;
    
    if (!user) {
      res.status(401).json({
        error: 'Unauthorized'
      });
      return;
    }
    
    // Check permissions
    const canUpdate = user.isGodMode || (user.universityId === id);
    
    if (!canUpdate) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to update this university'
      });
      return;
    }
    
    const validatedData = updateUniversitySchema.parse(req.body);
    
    // Get current university
    const existingUniversity = await prisma.university.findUnique({
      where: { id }
    });
    
    if (!existingUniversity) {
      res.status(404).json({
        error: 'University not found'
      });
      return;
    }
    
    // Check if slug/subdomain conflicts with another university
    if (validatedData.slug || validatedData.subdomain) {
      const conflict = await prisma.university.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                validatedData.slug ? { slug: validatedData.slug } : {},
                validatedData.subdomain ? { subdomain: validatedData.subdomain } : {}
              ]
            }
          ]
        }
      });
      
      if (conflict) {
        res.status(400).json({
          error: 'Conflict',
          message: 'Slug or subdomain already taken by another university'
        });
        return;
      }
    }
    
    const university = await prisma.university.update({
      where: { id },
      data: {
        ...validatedData,
        branding: validatedData.branding as any
      }
    });
    
    // Log update with God Mode indicator
    await prisma.auditLog.create({
      data: {
        universityId: user.isGodMode ? 'PLATFORM' : id,
        userId: user.id,
        action: user.isGodMode ? 'GOD_MODE_UPDATE_UNIVERSITY' : 'UPDATE_UNIVERSITY',
        entityType: 'university',
        entityId: id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        oldValues: existingUniversity as any,
        newValues: university as any,
        isGodModeAction: user.isGodMode
      }
    });
    
    res.json({
      success: true,
      message: 'University updated successfully',
      data: university
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
      return;
    }
    
    console.error('Update university error:', error);
    res.status(500).json({
      error: 'Failed to update university',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete university (soft delete)
export const deleteUniversity = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // @ts-ignore
    const user = req.user;
    const { id } = req.params;
    
    if (!user) {
      res.status(401).json({
        error: 'Unauthorized'
      });
      return;
    }
    
    // Only Bitflow Owner can delete universities
    if (!user.isGodMode) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only Bitflow Owner can delete universities'
      });
      return;
    }
    
    const university = await prisma.university.findUnique({
      where: { id }
    });
    
    if (!university) {
      res.status(404).json({
        error: 'University not found'
      });
      return;
    }
    
    // Soft delete - update status to archived and set deletedAt
    const deletedUniversity = await prisma.university.update({
      where: { id },
      data: {
        status: 'archived',
        active: false,
        deletedAt: new Date()
      }
    });
    
    // Log deletion
    await prisma.auditLog.create({
      data: {
        universityId: 'PLATFORM',
        userId: user.id,
        action: 'DELETE_UNIVERSITY',
        entityType: 'university',
        entityId: id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        oldValues: university as any,
        isGodModeAction: true
      }
    });
    
    res.json({
      success: true,
      message: 'University deleted successfully',
      data: deletedUniversity
    });
    
  } catch (error) {
    console.error('Delete university error:', error);
    res.status(500).json({
      error: 'Failed to delete university',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
