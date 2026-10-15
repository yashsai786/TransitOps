import { Router } from 'express';
import healthRoutes from './healthRoutes.js';

const apiRouter = Router();

// Platform health and status monitoring
apiRouter.use('/health', healthRoutes);

// Base API route
apiRouter.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'TransitOps Platform API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: '/api/health',
      documentation: '/api/docs'
    }
  });
});

export default apiRouter;
