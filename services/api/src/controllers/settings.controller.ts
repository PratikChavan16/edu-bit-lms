import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const updateSettingSchema = z.object({
  value: z.string()
});

const createSettingSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string(),
  dataType: z.string().default('string'),
  category: z.string().min(1).max(50),
  isPublic: z.boolean().default(false),
  universityId: z.string().uuid().optional()
});

export const listSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, universityId, isPublic } = req.query;

    const where: any = {};

    // Access control - God Mode can see all, others see their university + public platform settings
    if (!req.user?.isGodMode) {
      where.OR = [
        { universityId: req.user?.universityId },
        { universityId: null, isPublic: true }
      ];
    } else if (universityId) {
      where.universityId = universityId;
    }

    if (category) where.category = category;
    if (isPublic !== undefined) where.isPublic = isPublic === 'true';

    const settings = await prisma.setting.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { key: 'asc' }
      ]
    });

    // Group by category
    const grouped = settings.reduce((acc: any, setting: any) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      acc[setting.category].push(setting);
      return acc;
    }, {});

    res.json({
      data: settings,
      grouped
    });
  } catch (error) {
    console.error('List settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const getSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key } = req.params;
    const { universityId } = req.query;

    const where: any = { key };

    // Determine which setting to fetch
    if (universityId) {
      where.universityId = universityId;
    } else if (req.user?.universityId) {
      // Try university-specific first, then fall back to platform
      const universitySetting = await prisma.setting.findFirst({
        where: {
          key,
          universityId: req.user.universityId
        }
      });

      if (universitySetting) {
        res.json(universitySetting);
        return;
      }

      where.universityId = null;
    } else {
      where.universityId = null;
    }

    const setting = await prisma.setting.findFirst({
      where
    });

    if (!setting) {
      res.status(404).json({ error: 'Setting not found' });
      return;
    }

    // Check access for private settings
    if (!setting.isPublic && !req.user?.isGodMode) {
      if (setting.universityId && setting.universityId !== req.user?.universityId) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }
    }

    res.json(setting);
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
};

export const createSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createSettingSchema.parse(req.body);

    // Only God Mode can create platform-level settings
    if (!data.universityId && !req.user?.isGodMode) {
      res.status(403).json({ error: 'Only God Mode can create platform settings' });
      return;
    }

    // Check access for university settings
    if (data.universityId && !req.user?.isGodMode && data.universityId !== req.user?.universityId) {
      res.status(403).json({ error: 'Cannot create settings for other universities' });
      return;
    }

    // Check if setting already exists
    const existing = await prisma.setting.findFirst({
      where: {
        key: data.key,
        universityId: data.universityId || null
      }
    });

    if (existing) {
      res.status(409).json({ error: 'Setting with this key already exists' });
      return;
    }

    const setting = await prisma.setting.create({
      data
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'CREATE',
        entityType: 'Setting',
        entityId: setting.id,
        newValues: setting,
        universityId: data.universityId || null,
        isGodModeAction: req.user?.isGodMode || false
      }
    });

    res.status(201).json(setting);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Create setting error:', error);
    res.status(500).json({ error: 'Failed to create setting' });
  }
};

export const updateSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = updateSettingSchema.parse(req.body);

    const existing = await prisma.setting.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Setting not found' });
      return;
    }

    // Check access
    if (!req.user?.isGodMode) {
      // Platform settings can only be modified by God Mode
      if (!existing.universityId) {
        res.status(403).json({ error: 'Only God Mode can modify platform settings' });
        return;
      }
      // University settings can only be modified by users from that university
      if (existing.universityId !== req.user?.universityId) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }
    }

    const setting = await prisma.setting.update({
      where: { id },
      data
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE',
        entityType: 'Setting',
        entityId: id,
        oldValues: existing,
        newValues: setting,
        universityId: existing.universityId,
        isGodModeAction: req.user?.isGodMode || false
      }
    });

    res.json(setting);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
};

export const deleteSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.setting.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Setting not found' });
      return;
    }

    // Only God Mode can delete settings
    if (!req.user?.isGodMode) {
      res.status(403).json({ error: 'Only God Mode can delete settings' });
      return;
    }

    await prisma.setting.delete({ where: { id } });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'DELETE',
        entityType: 'Setting',
        entityId: id,
        oldValues: existing,
        universityId: existing.universityId,
        isGodModeAction: true
      }
    });

    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Delete setting error:', error);
    res.status(500).json({ error: 'Failed to delete setting' });
  }
};
