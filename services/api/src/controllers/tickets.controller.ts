import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const createTicketSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  category: z.enum(['technical', 'billing', 'academic', 'administrative', 'other']).default('other'),
  universityId: z.string().uuid().optional()
});

const updateTicketSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  category: z.enum(['technical', 'billing', 'academic', 'administrative', 'other']).optional(),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  assignedToId: z.string().uuid().optional(),
  resolution: z.string().optional()
});

export const listTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      status, 
      priority, 
      category, 
      assignedToId, 
      universityId,
      search,
      page = '1', 
      limit = '20' 
    } = req.query;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};

    // Access control
    if (!req.user?.isGodMode) {
      where.universityId = req.user?.universityId;
    } else if (universityId) {
      where.universityId = universityId;
    }

    // Filters
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;
    if (assignedToId) where.assignedToId = assignedToId;
    
    // Search in title and description
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { ticketNumber: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: {
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        skip,
        take: parseInt(limit as string),
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.ticket.count({ where })
    ]);

    res.json({
      data: tickets,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('List tickets error:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

export const getTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    // Check access
    if (!req.user?.isGodMode && ticket.universityId !== req.user?.universityId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(ticket);
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
};

export const createTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createTicketSchema.parse(req.body);

    // Determine university ID
    let universityId = data.universityId;
    if (!universityId) {
      if (req.user?.isGodMode) {
        res.status(400).json({ error: 'God Mode users must specify universityId' });
        return;
      }
      universityId = req.user!.universityId!;
    }

    // Check access
    if (!req.user?.isGodMode && universityId !== req.user?.universityId) {
      res.status(403).json({ error: 'Cannot create ticket for other universities' });
      return;
    }

    // Generate ticket number
    const ticketCount = await prisma.ticket.count({
      where: { universityId }
    });
    const ticketNumber = `TKT-${universityId.substring(0, 8).toUpperCase()}-${String(ticketCount + 1).padStart(5, '0')}`;

    const ticket = await prisma.ticket.create({
      data: {
        ...data,
        universityId,
        ticketNumber,
        createdById: req.user!.id,
        status: 'open'
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'CREATE',
        entityType: 'Ticket',
        entityId: ticket.id,
        newValues: ticket,
        universityId,
        isGodModeAction: req.user?.isGodMode || false
      }
    });

    res.status(201).json(ticket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
};

export const updateTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = updateTicketSchema.parse(req.body);

    const existing = await prisma.ticket.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    // Check access
    if (!req.user?.isGodMode && existing.universityId !== req.user?.universityId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data,
      include: {
        assignedTo: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE',
        entityType: 'Ticket',
        entityId: id,
        oldValues: existing,
        newValues: ticket,
        universityId: existing.universityId,
        isGodModeAction: req.user?.isGodMode || false
      }
    });

    res.json(ticket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Update ticket error:', error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
};

export const assignTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { assignedToId } = req.body;

    if (!assignedToId) {
      res.status(400).json({ error: 'assignedToId is required' });
      return;
    }

    const existing = await prisma.ticket.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    // Check access
    if (!req.user?.isGodMode && existing.universityId !== req.user?.universityId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Verify assignee belongs to same university
    const assignee = await prisma.user.findUnique({
      where: { id: assignedToId },
      select: { universityId: true }
    });

    if (!assignee) {
      res.status(404).json({ error: 'Assignee not found' });
      return;
    }

    if (!req.user?.isGodMode && assignee.universityId !== existing.universityId) {
      res.status(400).json({ error: 'Assignee must belong to the same university' });
      return;
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        assignedToId,
        status: existing.status === 'open' ? 'in_progress' : existing.status
      },
      include: {
        assignedTo: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE',
        entityType: 'Ticket',
        entityId: id,
        oldValues: { assignedToId: existing.assignedToId },
        newValues: { assignedToId },
        universityId: existing.universityId,
        isGodModeAction: req.user?.isGodMode || false
      }
    });

    res.json(ticket);
  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({ error: 'Failed to assign ticket' });
  }
};

export const resolveTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;

    if (!resolution) {
      res.status(400).json({ error: 'Resolution message is required' });
      return;
    }

    const existing = await prisma.ticket.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    // Check access
    if (!req.user?.isGodMode && existing.universityId !== req.user?.universityId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        status: 'resolved',
        resolution,
        resolvedAt: new Date(),
        resolvedById: req.user!.id
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE',
        entityType: 'Ticket',
        entityId: id,
        oldValues: { status: existing.status },
        newValues: { status: 'resolved', resolution },
        universityId: existing.universityId,
        isGodModeAction: req.user?.isGodMode || false
      }
    });

    res.json(ticket);
  } catch (error) {
    console.error('Resolve ticket error:', error);
    res.status(500).json({ error: 'Failed to resolve ticket' });
  }
};

export const getTicketStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { universityId } = req.query;

    const where: any = {};

    // Access control
    if (!req.user?.isGodMode) {
      where.universityId = req.user?.universityId;
    } else if (universityId) {
      where.universityId = universityId;
    }

    const [
      total,
      byStatus,
      byPriority,
      byCategory
    ] = await Promise.all([
      prisma.ticket.count({ where }),
      prisma.ticket.groupBy({
        by: ['status'],
        where,
        _count: { id: true }
      }),
      prisma.ticket.groupBy({
        by: ['priority'],
        where,
        _count: { id: true }
      }),
      prisma.ticket.groupBy({
        by: ['category'],
        where,
        _count: { id: true }
      })
    ]);

    res.json({
      total,
      byStatus: byStatus.map((s: any) => ({
        status: s.status,
        count: s._count.id
      })),
      byPriority: byPriority.map((p: any) => ({
        priority: p.priority,
        count: p._count.id
      })),
      byCategory: byCategory.map((c: any) => ({
        category: c.category,
        count: c._count.id
      }))
    });
  } catch (error) {
    console.error('Ticket stats error:', error);
    res.status(500).json({ error: 'Failed to fetch ticket statistics' });
  }
};
