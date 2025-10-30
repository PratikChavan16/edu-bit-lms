import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

// ============= FEE STRUCTURES =============

const createFeeStructureSchema = z.object({
  universityId: z.string().uuid(),
  collegeId: z.string().uuid(),
  academicYearId: z.string().uuid(),
  name: z.string().min(1).max(100),
  course: z.string().min(1),
  year: z.number().int().min(1),
  amount: z.string().or(z.number()),
  currency: z.string().length(3).default('USD'),
  installments: z.number().int().default(1),
  dueDates: z.any().optional(),
  lateFeePerDay: z.string().or(z.number()).default(0),
  components: z.any().optional(),
  status: z.string().default('active')
});

const updateFeeStructureSchema = createFeeStructureSchema.partial();

export const listFeeStructures = async (req: Request, res: Response): Promise<void> => {
  try {
    const { universityId, applicableTo, isActive, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};

    // God Mode can see all, others only their university
    if (!req.user?.isGodMode) {
      where.universityId = req.user?.universityId;
    } else if (universityId) {
      where.universityId = universityId;
    }

    if (applicableTo) where.applicableTo = applicableTo;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const [feeStructures, total] = await Promise.all([
      prisma.feeStructure.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.feeStructure.count({ where })
    ]);

    res.json({
      data: feeStructures,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('List fee structures error:', error);
    res.status(500).json({ error: 'Failed to fetch fee structures' });
  }
};

export const getFeeStructure = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id }
    });

    if (!feeStructure) {
      res.status(404).json({ error: 'Fee structure not found' });
      return;
    }

    // Check access
    if (!req.user?.isGodMode && feeStructure.universityId !== req.user?.universityId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(feeStructure);
  } catch (error) {
    console.error('Get fee structure error:', error);
    res.status(500).json({ error: 'Failed to fetch fee structure' });
  }
};

export const createFeeStructure = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createFeeStructureSchema.parse(req.body);

    // Check access
    if (!req.user?.isGodMode && data.universityId !== req.user?.universityId) {
      res.status(403).json({ error: 'Cannot create fee structure for other universities' });
      return;
    }

    const feeStructure = await prisma.feeStructure.create({
      data
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'CREATE',
        entityType: 'FeeStructure',
        entityId: feeStructure.id,
        newValues: feeStructure,
        universityId: data.universityId,
        isGodModeAction: req.user?.isGodMode || false
      }
    });

    res.status(201).json(feeStructure);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Create fee structure error:', error);
    res.status(500).json({ error: 'Failed to create fee structure' });
  }
};

export const updateFeeStructure = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = updateFeeStructureSchema.parse(req.body);

    const existing = await prisma.feeStructure.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Fee structure not found' });
      return;
    }

    // Check access
    if (!req.user?.isGodMode && existing.universityId !== req.user?.universityId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const feeStructure = await prisma.feeStructure.update({
      where: { id },
      data
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE',
        entityType: 'FeeStructure',
        entityId: id,
        oldValues: existing,
        newValues: feeStructure,
        universityId: existing.universityId,
        isGodModeAction: req.user?.isGodMode || false
      }
    });

    res.json(feeStructure);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Update fee structure error:', error);
    res.status(500).json({ error: 'Failed to update fee structure' });
  }
};

export const deleteFeeStructure = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.feeStructure.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Fee structure not found' });
      return;
    }

    // Check access - only God Mode or University Owner can delete
    if (!req.user?.isGodMode) {
      const isOwner = req.user?.roles.some((r: any) => r.roleName === 'University Owner');
      if (!isOwner || existing.universityId !== req.user?.universityId) {
        res.status(403).json({ error: 'Only University Owners can delete fee structures' });
        return;
      }
    }

    // Soft delete by marking inactive
    const feeStructure = await prisma.feeStructure.update({
      where: { id },
      data: { status: 'inactive' }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'DELETE',
        entityType: 'FeeStructure',
        entityId: id,
        oldValues: existing,
        universityId: existing.universityId,
        isGodModeAction: req.user?.isGodMode || false
      }
    });

    res.json({ message: 'Fee structure deactivated', data: feeStructure });
  } catch (error) {
    console.error('Delete fee structure error:', error);
    res.status(500).json({ error: 'Failed to delete fee structure' });
  }
};

// ============= FEE PAYMENTS =============

const createFeePaymentSchema = z.object({
  universityId: z.string().uuid(),
  studentId: z.string().uuid(),
  feeStructureId: z.string().uuid(),
  amountPaid: z.string().or(z.number()),
  paymentMethod: z.string(),
  paymentDate: z.string().datetime().optional(),
  transactionId: z.string().optional(),
  receiptNumber: z.string(),
  installmentNumber: z.number().int().optional(),
  lateFee: z.string().or(z.number()).default(0),
  remarks: z.string().optional(),
  status: z.string().default('completed'),
  recordedBy: z.string().optional()
});

export const listFeePayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, feeStructureId, universityId, status, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};

    // Build filters
    if (studentId) where.studentId = studentId;
    if (feeStructureId) where.feeStructureId = feeStructureId;
    if (status) where.status = status;

    // Access control
    if (!req.user?.isGodMode) {
      // Non-God Mode users can only see their university's payments
      where.student = {
        universityId: req.user?.universityId
      };
    } else if (universityId) {
      where.student = {
        universityId
      };
    }

    const [payments, total] = await Promise.all([
      prisma.feePayment.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          },
          feeStructure: {
            select: {
              id: true,
              name: true,
              amount: true,
              currency: true
            }
          }
        },
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.feePayment.count({ where })
    ]);

    res.json({
      data: payments,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('List fee payments error:', error);
    res.status(500).json({ error: 'Failed to fetch fee payments' });
  }
};

export const createFeePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createFeePaymentSchema.parse(req.body);

    // Verify student belongs to user's university
    const student = await prisma.student.findUnique({
      where: { id: data.studentId },
      select: { universityId: true }
    });

    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    if (!req.user?.isGodMode && student.universityId !== req.user?.universityId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const payment = await prisma.feePayment.create({
      data: {
        ...data,
        status: 'completed',
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date()
      },
      include: {
        student: {
          select: {
            user: {
              select: { firstName: true, lastName: true, email: true }
            }
          }
        },
        feeStructure: true
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'CREATE',
        entityType: 'FeePayment',
        entityId: payment.id,
        newValues: payment,
        universityId: student.universityId,
        isGodModeAction: req.user?.isGodMode || false
      }
    });

    res.status(201).json(payment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Create fee payment error:', error);
    res.status(500).json({ error: 'Failed to create fee payment' });
  }
};

// ============= ANALYTICS =============

export const getBillingAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { universityId, startDate, endDate } = req.query;

    const where: any = {
      status: 'completed'
    };

    // Date range filter
    if (startDate || endDate) {
      where.paymentDate = {};
      if (startDate) where.paymentDate.gte = new Date(startDate as string);
      if (endDate) where.paymentDate.lte = new Date(endDate as string);
    }

    // Access control
    if (!req.user?.isGodMode) {
      where.student = {
        universityId: req.user?.universityId
      };
    } else if (universityId) {
      where.student = {
        universityId
      };
    }

    // Total revenue
    const totalRevenue = await prisma.feePayment.aggregate({
      where,
      _sum: {
        amountPaid: true
      },
      _count: {
        id: true
      }
    });

    // Monthly recurring revenue (MRR) - payments with monthly frequency
    const mrrPayments = await prisma.feePayment.findMany({
      where: {
        ...where,
        feeStructure: {
          frequency: 'monthly'
        }
      },
      include: {
        feeStructure: {
          select: {
            amount: true
          }
        }
      }
    });

    const mrr = mrrPayments.reduce((sum: number, p: any) => sum + p.feeStructure.amount, 0);

    // Revenue by payment method
    const byPaymentMethod = await prisma.feePayment.groupBy({
      by: ['paymentMethod'],
      where,
      _sum: {
        amountPaid: true
      },
      _count: {
        id: true
      }
    });

    // Pending payments (not yet paid)
    const pendingCount = await prisma.feePayment.count({
      where: {
        ...where,
        status: 'pending'
      }
    });

    res.json({
      totalRevenue: totalRevenue._sum.amountPaid || 0,
      totalTransactions: totalRevenue._count.id,
      mrr,
      pendingPayments: pendingCount,
      byPaymentMethod: byPaymentMethod.map((pm: any) => ({
        method: pm.paymentMethod,
        amount: pm._sum.amount || 0,
        count: pm._count.id
      }))
    });
  } catch (error) {
    console.error('Billing analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch billing analytics' });
  }
};
