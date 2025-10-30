import { Router } from 'express';
import * as uploadController from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/upload', uploadController.uploadMiddleware, uploadController.uploadFile);
router.get('/', uploadController.listFiles);
router.get('/:id', uploadController.getFile);
router.get('/:id/download', uploadController.downloadFile);
router.delete('/:id', uploadController.deleteFile);

export default router;
