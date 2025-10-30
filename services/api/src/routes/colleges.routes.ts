import { Router } from 'express';
import * as collegesController from '../controllers/colleges.controller';
import { authenticate, requireUniversityContext } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication and university context
router.use(authenticate);
router.use(requireUniversityContext);

router.get('/', collegesController.listColleges);
router.get('/:id', collegesController.getCollege);
router.post('/', collegesController.createCollege);
router.patch('/:id', collegesController.updateCollege);
router.delete('/:id', collegesController.deleteCollege);

export default router;
