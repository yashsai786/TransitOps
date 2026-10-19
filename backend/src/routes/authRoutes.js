import { Router } from 'express';
import { 
  register, 
  login, 
  getCurrentUser, 
  logout 
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes (require valid JWT)
router.get('/me', authenticateToken, getCurrentUser);

export default router;

