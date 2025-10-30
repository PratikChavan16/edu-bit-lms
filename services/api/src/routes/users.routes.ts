import { Router } from 'express';
import * as usersController from '../controllers/users.controller';
import { authenticate, requireUniversityContext } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication and university context
router.use(authenticate);
router.use(requireUniversityContext);

router.get('/', usersController.listUsers);
router.get('/:id', usersController.getUser);
router.post('/', usersController.createUser);
router.patch('/:id', usersController.updateUser);
router.post('/:id/roles', usersController.assignRole);
router.delete('/:id', usersController.deleteUser);

export default router;
