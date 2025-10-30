import { Router } from 'express';
import * as billingController from '../controllers/billing.controller';
import { authenticate, requireUniversityContext } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication and university context
router.use(authenticate);
router.use(requireUniversityContext);

// Fee Structures
router.get('/fee-structures', billingController.listFeeStructures);
router.get('/fee-structures/:id', billingController.getFeeStructure);
router.post('/fee-structures', billingController.createFeeStructure);
router.patch('/fee-structures/:id', billingController.updateFeeStructure);
router.delete('/fee-structures/:id', billingController.deleteFeeStructure);

// Fee Payments
router.get('/payments', billingController.listFeePayments);
router.post('/payments', billingController.createFeePayment);

// Analytics
router.get('/analytics', billingController.getBillingAnalytics);

export default router;
