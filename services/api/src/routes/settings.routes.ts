import { Router } from 'express';
import * as settingsController from '../controllers/settings.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', settingsController.listSettings);
router.get('/:key', settingsController.getSetting);
router.post('/', settingsController.createSetting);
router.patch('/:id', settingsController.updateSetting);
router.delete('/:id', settingsController.deleteSetting);

export default router;
