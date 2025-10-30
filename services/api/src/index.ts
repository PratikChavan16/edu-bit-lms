import express, { Request, Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import tenantRoutes from './routes/tenant.routes';
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import universitiesRoutes from './routes/universities.routes';
import collegesRoutes from './routes/colleges.routes';
import usersRoutes from './routes/users.routes';
import billingRoutes from './routes/billing.routes';
import ticketsRoutes from './routes/tickets.routes';
import auditRoutes from './routes/audit.routes';
import chatRoutes from './routes/chat.routes';
import settingsRoutes from './routes/settings.routes';
import uploadRoutes from './routes/upload.routes';
import { initializeWebSocket } from './websocket';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

// Initialize WebSocket
const io = initializeWebSocket(httpServer);

// Make io accessible to routes if needed
app.set('io', io);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'bitflow-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.get('/api/v1/welcome', (_req: Request, res: Response) => {
  res.json({
    message: '🚀 Welcome to Bitflow LMS API!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Tenant routes
app.use('/api/v1/tenants', tenantRoutes);

// Auth routes
app.use('/api/v1/auth', authRoutes);

// Dashboard routes
app.use('/api/v1/dashboard', dashboardRoutes);

// Universities routes
app.use('/api/v1/universities', universitiesRoutes);

// Colleges routes
app.use('/api/v1/colleges', collegesRoutes);

// Users routes
app.use('/api/v1/users', usersRoutes);

// Billing routes
app.use('/api/v1/billing', billingRoutes);

// Tickets routes
app.use('/api/v1/tickets', ticketsRoutes);

// Audit logs routes
app.use('/api/v1/audit', auditRoutes);

// Chat routes
app.use('/api/v1/chat', chatRoutes);

// Settings routes
app.use('/api/v1/settings', settingsRoutes);

// Upload routes
app.use('/api/v1/files', uploadRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: _req.path
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`✅ Bitflow API is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🎯 Welcome endpoint: http://localhost:${PORT}/api/v1/welcome`);
  console.log(`🔌 WebSocket server ready`);
});

export default app;
