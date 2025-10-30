import { Router } from 'express';
import * as universitiesController from '../controllers/universities.controller';
import { authenticate, requireGodMode } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Universities routes
router.get('/', universitiesController.listUniversities);
router.get('/:id', universitiesController.getUniversity);
router.post('/', requireGodMode, universitiesController.createUniversity);
router.patch('/:id', requireGodMode, universitiesController.updateUniversity);
router.delete('/:id', requireGodMode, universitiesController.deleteUniversity);

export default router;
