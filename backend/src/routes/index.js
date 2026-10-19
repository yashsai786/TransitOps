import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';

const apiRouter = Router();

// Platform health and status monitoring
apiRouter.use('/health', healthRoutes);

// Authentication & Identity
apiRouter.use('/auth', authRoutes);

// Base API route
apiRouter.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'TransitOps Platform API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        logout: 'POST /api/auth/logout'
      }
    }
  });
});

export default apiRouter;
