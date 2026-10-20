import bcrypt from 'bcryptjs';
import Role from '../models/Role.js';
import User from '../models/User.js';
import { ROLE_DEFINITIONS, ROLES } from '../config/roles.js';
import { logger } from '../utils/logger.js';

/**
 * Idempotent Role Initializer
 * Ensures the four predefined platform roles exist in the database with their configured permissions.
 * Does NOT overwrite or alter existing roles or permissions already created.
 */
export const initializeRoles = async () => {
  try {
    const roleEntries = Object.values(ROLE_DEFINITIONS);

    for (const def of roleEntries) {
      const existing = await Role.findOne({ name: def.name });

      if (!existing) {
        await Role.create({
          name: def.name,
          description: def.description,
          permissions: def.permissions
        });
        logger.info(`RBAC: Initialized predefined role [${def.name}]`);
      }
    }

    return true;
  } catch (error) {
    logger.error('RBAC: Error during role initialization:', error.message);
    return false;
  }
};

/**
 * Controlled Administrative Provisioning for Initial Fleet Manager
 * Prohibits public self-assignment while providing a secure, controlled path
 * to bootstrap the first administrator using a dedicated environment secret.
 *
 * @param {Object} params
 * @param {string} params.name - Administrator's full name
 * @param {string} params.email - Administrator's email address
 * @param {string} params.password - Secure administrator password (min 8 chars)
 * @param {string} params.adminSecretKey - Matches ADMIN_PROVISION_SECRET in .env
 */
export const provisionFleetManager = async ({ name, email, password, adminSecretKey }) => {
  const configuredSecret = process.env.ADMIN_PROVISION_SECRET;

  if (!configuredSecret || configuredSecret.trim().length === 0) {
    throw new Error('ADMIN_PROVISION_SECRET is not configured on the server. Administrative provisioning is disabled.');
  }

  if (adminSecretKey !== configuredSecret) {
    throw new Error('Invalid administrative secret key.');
  }

  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required for provisioning.');
  }

  if (password.length < 8) {
    throw new Error('Administrator password must be at least 8 characters.');
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Find or initialize fleet_manager role
  let fleetManagerRole = await Role.findOne({ name: ROLES.FLEET_MANAGER });
  if (!fleetManagerRole) {
    const def = ROLE_DEFINITIONS[ROLES.FLEET_MANAGER];
    fleetManagerRole = await Role.create({
      name: def.name,
      description: def.description,
      permissions: def.permissions
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    // Elevate existing user to fleet_manager if approved
    existingUser.role = fleetManagerRole._id;
    existingUser.isActive = true;
    await existingUser.save();
    return {
      action: 'elevated',
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: ROLES.FLEET_MANAGER
      }
    };
  }

  // Create new fleet manager user
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: fleetManagerRole._id,
    isActive: true
  });

  return {
    action: 'created',
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: ROLES.FLEET_MANAGER
    }
  };
};

