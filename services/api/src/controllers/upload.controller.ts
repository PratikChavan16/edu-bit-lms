import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
// import { z } from 'zod';

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, _file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalName);
    const nameWithoutExt = path.basename(file.originalName, ext);
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (_req, _file, cb) => {
    // Add file type restrictions if needed
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'text/plain'
    ];

    if (allowedMimeTypes.includes(file.mimeType)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimeType} not allowed`));
    }
  }
});

export const uploadMiddleware = upload.single('file');

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { category = 'general', relatedEntityType, relatedEntityId } = req.body;

    // Determine university context
    let universityId = req.user?.universityId;
    if (req.body.universityId) {
      if (req.user?.isGodMode) {
        universityId = req.body.universityId;
      } else if (req.body.universityId !== req.user?.universityId) {
        // Delete uploaded file if unauthorized
        fs.unlinkSync(req.file.path);
        res.status(403).json({ error: 'Cannot upload files for other universities' });
        return;
      }
    }

    const fileRecord = await prisma.file.create({
      data: {
        filename: req.file!.filename,
        originalName: req.file!.originalname,
        mimeType: req.file!.mimetype,
        size: req.file!.size,
        path: req.file!.path,
        category,
        uploadedById: req.user!.id,
        universityId: universityId || null,
        relatedEntityType: relatedEntityType || null,
        relatedEntityId: relatedEntityId || null
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'CREATE',
        entityType: 'File',
        entityId: fileRecord.id,
        newValues: { filename: fileRecord.filename, size: fileRecord.size, category },
        universityId: universityId || null,
        isGodModeAction: req.user?.isGodMode || false
      }
    });

    res.status(201).json(fileRecord);
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Upload file error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

export const listFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      relatedEntityType,
      relatedEntityId,
      universityId,
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

    if (category) where.category = category;
    if (relatedEntityType) where.relatedEntityType = relatedEntityType;
    if (relatedEntityId) where.relatedEntityId = relatedEntityId;

    const [files, total] = await Promise.all([
      prisma.file.findMany({
        where,
        include: {
          uploadedBy: {
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
        orderBy: { createdAt: 'desc' }
      }),
      prisma.file.count({ where })
    ]);

    res.json({
      data: files,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};

export const getFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const file = await prisma.file.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!file) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    // Check access
    if (!req.user?.isGodMode && file.universityId !== req.user?.universityId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(file);
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ error: 'Failed to fetch file' });
  }
};

export const downloadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const file = await prisma.file.findUnique({
      where: { id }
    });

    if (!file) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    // Check access
    if (!req.user?.isGodMode && file.universityId !== req.user?.universityId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.path)) {
      res.status(404).json({ error: 'File not found on disk' });
      return;
    }

    // Set headers for download
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.setHeader('Content-Length', file.size.toString());

    // Stream file to response
    const fileStream = fs.createReadStream(file.path);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
};

export const deleteFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const file = await prisma.file.findUnique({
      where: { id }
    });

    if (!file) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    // Check access - only uploader or God Mode can delete
    if (!req.user?.isGodMode && file.uploadedById !== req.user?.id) {
      res.status(403).json({ error: 'Only the uploader or God Mode can delete files' });
      return;
    }

    // Delete file from disk
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete database record
    await prisma.file.delete({
      where: { id }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'DELETE',
        entityType: 'File',
        entityId: id,
        oldValues: { filename: file.filename },
        universityId: file.universityId,
        isGodModeAction: req.user?.isGodMode || false
      }
    });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};
