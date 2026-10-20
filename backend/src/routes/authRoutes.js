import { Router } from 'express';
import { 
  register, 
  login, 
  getCurrentUser, 
  logout,
  getCurrentUserPermissions,
  getSystemRoles,
  provisionAdmin,
  getManagerOverview,
  getDispatcherDashboard
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole, requirePermission } from '../middleware/rbacMiddleware.js';
import { ROLES, PERMISSIONS } from '../config/roles.js';

const router = Router();

// Public authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Controlled administrative provisioning (requires ADMIN_PROVISION_SECRET)
router.post('/provision-admin', provisionAdmin);

// Protected user identity & permissions
router.get('/me', authenticateToken, getCurrentUser);
router.get('/permissions', authenticateToken, getCurrentUserPermissions);
router.get('/roles', authenticateToken, getSystemRoles);

// Demonstration routes: Role-Based & Permission-Based Authorization
router.get(
  '/manager-only', 
  authenticateToken, 
  requireRole(ROLES.FLEET_MANAGER), 
  getManagerOverview
);

router.get(
  '/dispatcher-access', 
  authenticateToken, 
  requirePermission(PERMISSIONS.TRIPS_DISPATCH), 
  getDispatcherDashboard
);

export default router;
