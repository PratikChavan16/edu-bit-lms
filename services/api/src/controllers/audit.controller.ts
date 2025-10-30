import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const listAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      universityId,
      userId,
      action,
      entityType,
      entityId,
      isGodModeAction,
      startDate,
      endDate,
      page = '1',
      limit = '50'
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
    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (isGodModeAction !== undefined) where.isGodModeAction = isGodModeAction === 'true';

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              username: true
            }
          }
        },
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.auditLog.count({ where })
    ]);

    res.json({
      data: logs,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('List audit logs error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

export const getAuditLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const log = await prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            username: true
          }
        }
      }
    });

    if (!log) {
      res.status(404).json({ error: 'Audit log not found' });
      return;
    }

    // Check access
    if (!req.user?.isGodMode && log.universityId !== req.user?.universityId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(log);
  } catch (error) {
    console.error('Get audit log error:', error);
    res.status(500).json({ error: 'Failed to fetch audit log' });
  }
};

export const getAuditLogStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { universityId, startDate, endDate } = req.query;

    const where: any = {};

    // Access control
    if (!req.user?.isGodMode) {
      where.universityId = req.user?.universityId;
    } else if (universityId) {
      where.universityId = universityId;
    }

    // Date range
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    const [
      total,
      byAction,
      byEntityType,
      godModeActions,
      topUsers
    ] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.groupBy({
        by: ['action'],
        where,
        _count: { id: true }
      }),
      prisma.auditLog.groupBy({
        by: ['entityType'],
        where,
        _count: { id: true }
      }),
      prisma.auditLog.count({
        where: {
          ...where,
          isGodModeAction: true
        }
      }),
      prisma.auditLog.groupBy({
        by: ['userId'],
        where,
        _count: { id: true },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 10
      })
    ]);

    // Fetch user details for top users
    const userIds = topUsers.map((u: any) => u.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true
      }
    });

    const topUsersWithDetails = topUsers.map((tu: any) => {
      const user = users.find((u: any) => u.id === tu.userId);
      return {
        userId: tu.userId,
        user,
        count: tu._count.id
      };
    });

    res.json({
      total,
      godModeActions,
      byAction: byAction.map((a: any) => ({
        action: a.action,
        count: a._count.id
      })),
      byEntityType: byEntityType.map((et: any) => ({
        entityType: et.entityType,
        count: et._count.id
      })),
      topUsers: topUsersWithDetails
    });
  } catch (error) {
    console.error('Audit log stats error:', error);
    res.status(500).json({ error: 'Failed to fetch audit log statistics' });
  }
};

export const exportAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      universityId,
      startDate,
      endDate,
      format = 'json'
    } = req.query;

    const where: any = {};

    // Access control
    if (!req.user?.isGodMode) {
      where.universityId = req.user?.universityId;
    } else if (universityId) {
      where.universityId = universityId;
    }

    // Date range (required for export)
    if (!startDate || !endDate) {
      res.status(400).json({ error: 'startDate and endDate are required for export' });
      return;
    }

    where.createdAt = {
      gte: new Date(startDate as string),
      lte: new Date(endDate as string)
    };

    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            username: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10000 // Limit export to 10k records
    });

    if (format === 'csv') {
      // Convert to CSV
      const headers = 'ID,User,Email,Action,Entity Type,Entity ID,God Mode,Created At\n';
      const rows = logs.map((log: any) => {
        const userName = `${log.user.firstName} ${log.user.lastName}`;
        return `${log.id},${userName},${log.user.email},${log.action},${log.entityType},${log.entityId || ''},${log.isGodModeAction},${log.createdAt.toISOString()}`;
      }).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="audit-logs-${new Date().toISOString()}.csv"`);
      res.send(headers + rows);
    } else {
      // Return JSON
      res.json({
        data: logs,
        total: logs.length,
        exportedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Export audit logs error:', error);
    res.status(500).json({ error: 'Failed to export audit logs' });
  }
};
