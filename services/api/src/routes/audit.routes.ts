import { Router } from 'express';
import * as auditController from '../controllers/audit.controller';
import { authenticate, requireUniversityContext } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication and university context
router.use(authenticate);
router.use(requireUniversityContext);

router.get('/', auditController.listAuditLogs);
router.get('/stats', auditController.getAuditLogStats);
router.get('/export', auditController.exportAuditLogs);
router.get('/:id', auditController.getAuditLog);

export default router;
