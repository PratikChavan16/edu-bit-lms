import { Router } from 'express';
import * as ticketsController from '../controllers/tickets.controller';
import { authenticate, requireUniversityContext } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication and university context
router.use(authenticate);
router.use(requireUniversityContext);

router.get('/', ticketsController.listTickets);
router.get('/stats', ticketsController.getTicketStats);
router.get('/:id', ticketsController.getTicket);
router.post('/', ticketsController.createTicket);
router.patch('/:id', ticketsController.updateTicket);
router.post('/:id/assign', ticketsController.assignTicket);
router.post('/:id/resolve', ticketsController.resolveTicket);

export default router;
