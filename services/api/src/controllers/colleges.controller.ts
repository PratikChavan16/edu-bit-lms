import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

// Validation schemas
const createCollegeSchema = z.object({
  universityId: z.string().min(1, 'University ID is required'),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  code: z.string().min(2, 'Code must be at least 2 characters'),
  type: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  establishedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  capacity: z.number().int().min(1).optional(),
  accreditation: z.any().optional()
});

const updateCollegeSchema = createCollegeSchema.partial().omit({ universityId: true });

// List colleges
export const listColleges = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // @ts-ignore
    const user = req.user;
    
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const universityId = req.query.universityId as string;
    const search = req.query.search as string || '';
    const status = req.query.status as string;
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    // Access control
    if (user.isGodMode) {
      if (universityId) where.universityId = universityId;
    } else {
      where.universityId = user.universityId;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status) where.status = status;
    
    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          universityId: true,
          name: true,
          code: true,
          type: true,
          email: true,
          phone: true,
          status: true,
          capacity: true,
          currentEnrollment: true,
          establishedYear: true,
          accreditation: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.college.count({ where })
    ]);
    
    res.json({
      success: true,
      data: colleges,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('List colleges error:', error);
    res.status(500).json({
      error: 'Failed to fetch colleges',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get college by ID
export const getCollege = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // @ts-ignore
    const user = req.user;
    const { id } = req.params;
    
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        departments: {
          select: {
            id: true,
            name: true,
            code: true,
            status: true
          }
        },
        students: {
          where: { status: 'active' },
          select: { id: true }
        },
        faculty: {
          where: { status: 'active' },
          select: { id: true }
        },
        staff: {
          where: { status: 'active' },
          select: { id: true }
        }
      }
    });
    
    if (!college) {
      res.status(404).json({ error: 'College not found' });
      return;
    }
    
    // Check access
    if (!user.isGodMode && college.universityId !== user.universityId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to access this college'
      });
      return;
    }
    
    res.json({
      success: true,
      data: {
        ...college,
        stats: {
          departments: college.departments.length,
          students: college.students.length,
          faculty: college.faculty.length,
          staff: college.staff.length
        }
      }
    });
    
  } catch (error) {
    console.error('Get college error:', error);
    res.status(500).json({
      error: 'Failed to fetch college',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create college
export const createCollege = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // @ts-ignore
    const user = req.user;
    
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    // Check permissions
    const canCreate = user.isGodMode || user.universityId !== null;
    
    if (!canCreate) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only University Owner/Admin can create colleges'
      });
      return;
    }
    
    const validatedData = createCollegeSchema.parse(req.body);
    
    // Verify university access
    if (!user.isGodMode) {
      if (validatedData.universityId !== user.universityId) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You can only create colleges in your university'
        });
        return;
      }
    }
    
    // Check if code already exists in this university
    const existing = await prisma.college.findFirst({
      where: {
        universityId: validatedData.universityId,
        code: validatedData.code
      }
    });
    
    if (existing) {
      res.status(400).json({
        error: 'College code already exists',
        message: `Code '${validatedData.code}' is already used in this university`
      });
      return;
    }
    
    const college = await prisma.college.create({
      data: {
        universityId: validatedData.universityId,
        name: validatedData.name,
        code: validatedData.code,
        type: validatedData.type,
        email: validatedData.email,
        phone: validatedData.phone,
        address: validatedData.address,
        establishedYear: validatedData.establishedYear,
        capacity: validatedData.capacity,
        accreditation: validatedData.accreditation as any,
        status: 'active',
        currentEnrollment: 0
      }
    });
    
    // Audit log
    await prisma.auditLog.create({
      data: {
        universityId: validatedData.universityId,
        userId: user.id,
        action: 'CREATE_COLLEGE',
        entityType: 'college',
        entityId: college.id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        changes: { college }
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'College created successfully',
      data: college
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
      return;
    }
    
    console.error('Create college error:', error);
    res.status(500).json({
      error: 'Failed to create college',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update college
export const updateCollege = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // @ts-ignore
    const user = req.user;
    const { id } = req.params;
    
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const college = await prisma.college.findUnique({ where: { id } });
    
    if (!college) {
      res.status(404).json({ error: 'College not found' });
      return;
    }
    
    // Check permissions
    const canUpdate = user.isGodMode || 
                     (college.universityId === user.universityId);
    
    if (!canUpdate) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to update this college'
      });
      return;
    }
    
    const validatedData = updateCollegeSchema.parse(req.body);
    
    // Check code uniqueness if updating code
    if (validatedData.code) {
      const conflict = await prisma.college.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            { universityId: college.universityId },
            { code: validatedData.code }
          ]
        }
      });
      
      if (conflict) {
        res.status(400).json({
          error: 'Code conflict',
          message: 'This college code is already used in the university'
        });
        return;
      }
    }
    
    const updatedCollege = await prisma.college.update({
      where: { id },
      data: {
        ...validatedData,
        accreditation: validatedData.accreditation as any
      }
    });
    
    // Audit log
    await prisma.auditLog.create({
      data: {
        universityId: college.universityId,
        userId: user.id,
        action: 'UPDATE_COLLEGE',
        entityType: 'college',
        entityId: id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        changes: {
          before: college,
          after: updatedCollege
        }
      }
    });
    
    res.json({
      success: true,
      message: 'College updated successfully',
      data: updatedCollege
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
      return;
    }
    
    console.error('Update college error:', error);
    res.status(500).json({
      error: 'Failed to update college',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete college (soft delete)
export const deleteCollege = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // @ts-ignore
    const user = req.user;
    const { id } = req.params;
    
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const college = await prisma.college.findUnique({ where: { id } });
    
    if (!college) {
      res.status(404).json({ error: 'College not found' });
      return;
    }
    
    // Only university owner or platform admin can delete
    const canDelete = user.isGodMode || 
                     (college.universityId === user.universityId);
    
    if (!canDelete) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only University Owner can delete colleges'
      });
      return;
    }
    
    // Soft delete
    const deletedCollege = await prisma.college.update({
      where: { id },
      data: {
        status: 'inactive',
        deletedAt: new Date()
      }
    });
    
    // Audit log
    await prisma.auditLog.create({
      data: {
        universityId: college.universityId,
        userId: user.id,
        action: 'DELETE_COLLEGE',
        entityType: 'college',
        entityId: id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        changes: { college }
      }
    });
    
    res.json({
      success: true,
      message: 'College deleted successfully',
      data: deletedCollege
    });
    
  } catch (error) {
    console.error('Delete college error:', error);
    res.status(500).json({
      error: 'Failed to delete college',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
