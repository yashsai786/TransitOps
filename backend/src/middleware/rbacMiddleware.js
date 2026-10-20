import { ROLE_DEFINITIONS } from '../config/roles.js';

/**
 * Helper to extract the normalized role name from req.user
 * Returns lowercase role string or null
 */
const getUserRoleName = (user) => {
  if (!user || !user.role) return null;
  if (typeof user.role === 'string') return user.role.toLowerCase();
  if (user.role.name) return user.role.name.toLowerCase();
  return null;
};

/**
 * Helper to resolve the user's active permissions list
 * Extracts permissions from the populated Role document or falls back
 * to the centralized definition in ROLE_DEFINITIONS.
 */
export const getUserPermissions = (user) => {
  if (!user || !user.role) return [];

  // If role document is populated with permissions array
  if (user.role && Array.isArray(user.role.permissions) && user.role.permissions.length > 0) {
    return user.role.permissions;
  }

  // Fallback to centralized definitions by role name
  const roleName = getUserRoleName(user);
  if (roleName && ROLE_DEFINITIONS[roleName]) {
    return ROLE_DEFINITIONS[roleName].permissions;
  }

  return [];
};

/**
 * Role-Based Access Control Middleware: requireRole
 * Restricts route access to users with one of the allowed role names.
 *
 * @param {...string} allowedRoles - Role identifiers allowed (e.g. 'fleet_manager', 'dispatcher')
 */
export const requireRole = (...allowedRoles) => {
  const normalizedAllowedRoles = allowedRoles.map((r) => r.toLowerCase());

  return (req, res, next) => {
    // 1. Verify authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. Please provide a valid Bearer token.'
        }
      });
    }

    // 2. Extract validated role from req.user (ignoring any query or body overrides)
    const userRole = getUserRoleName(req.user);

    if (!userRole) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ROLE_NOT_ASSIGNED',
          message: 'Access denied. Your account does not have an active role assignment.'
        }
      });
    }

    // 3. Match against permitted roles
    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. Required role: [${allowedRoles.join(', ')}]. Your role: [${userRole}].`
        }
      });
    }

    next();
  };
};

/**
 * Permission-Based Access Control Middleware: requirePermission
 * Requires that the authenticated user possesses ALL of the specified permissions.
 *
 * @param {...string} requiredPermissions - Permissions required (e.g. 'vehicles:manage')
 */
export const requirePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    // 1. Verify authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. Please provide a valid Bearer token.'
        }
      });
    }

    // 2. Resolve user's permissions
    const userPermissions = getUserPermissions(req.user);

    // 3. Check that user has all required permissions
    const missingPermissions = requiredPermissions.filter(
      (perm) => !userPermissions.includes(perm)
    );

    if (missingPermissions.length > 0) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `Access denied. Missing required permission(s): [${missingPermissions.join(', ')}].`
        }
      });
    }

    next();
  };
};

/**
 * Permission-Based Access Control Middleware: requireAnyPermission
 * Requires that the authenticated user possesses AT LEAST ONE of the specified permissions.
 *
 * @param {...string} permissions - Permissions list where at least one is required
 */
export const requireAnyPermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. Please provide a valid Bearer token.'
        }
      });
    }

    const userPermissions = getUserPermissions(req.user);
    const hasAny = permissions.some((perm) => userPermissions.includes(perm));

    if (!hasAny) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `Access denied. Requires at least one of the following permissions: [${permissions.join(', ')}].`
        }
      });
    }

    next();
  };
};

