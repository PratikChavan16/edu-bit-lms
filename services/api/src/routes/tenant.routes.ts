import { Router } from 'express';
import * as tenantController from '../controllers/tenant.controller';

const router = Router();

// Database connection test
router.get('/db-test', tenantController.testDbConnection);

// Tenant management routes
router.get('/', tenantController.listTenants);
router.post('/', tenantController.createTenant);

export default router;
