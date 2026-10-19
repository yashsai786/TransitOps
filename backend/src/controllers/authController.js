import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';

const JWT_DEFAULT_SECRET = 'transitops_jwt_secret_key_change_in_production';
const JWT_DEFAULT_EXPIRY = '7d';

/**
 * Helper to generate signed JWT token
 */
const generateToken = (userId, email, roleName) => {
  const secret = process.env.JWT_SECRET || JWT_DEFAULT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || JWT_DEFAULT_EXPIRY;

  return jwt.sign(
    {
      id: userId,
      email,
      role: roleName
    },
    secret,
    { expiresIn }
  );
};

/**
 * Controller: Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Input Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Full name is required.'
        }
      });
    }

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Valid email address is required.'
        }
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Please provide a valid email format.'
        }
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Password must be at least 6 characters long.'
        }
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Check for duplicate email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'An account with this email address already exists.'
        }
      });
    }

    // 3. Assign safe default role (dispatcher)
    // Public registration must never grant unrestricted fleet_manager privileges
    let defaultRole = await Role.findOne({ name: 'dispatcher' });

    if (!defaultRole) {
      // Auto-initialize safe default role if database hasn't been seeded yet
      defaultRole = await Role.create({
        name: 'dispatcher',
        description: 'Standard dispatch and trip coordinator role',
        permissions: ['trips:read', 'trips:create', 'vehicles:read', 'drivers:read']
      });
    }

    // 4. Hash password with bcrypt salt rounds = 10
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 5. Create user
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: defaultRole._id,
      isActive: true
    });

    // 6. Generate JWT
    const token = generateToken(newUser._id, newUser.email, defaultRole.name);

    // 7. Return sanitized response (never leak passwordHash)
    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: defaultRole.name,
          isActive: newUser.isActive,
          createdAt: newUser.createdAt
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Authenticate user & issue JWT
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Input Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required.'
        }
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Find user by email and populate assigned role
    const user = await User.findOne({ email: normalizedEmail }).populate('role');

    // Generic error message to prevent account enumeration / timing attacks
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.'
        }
      });
    }

    // 3. Verify user active status
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_DEACTIVATED',
          message: 'This account has been deactivated. Please contact an administrator.'
        }
      });
    }

    // 4. Compare password with bcrypt hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.'
        }
      });
    }

    const roleName = user.role?.name || 'dispatcher';

    // 5. Issue JWT
    const token = generateToken(user._id, user.email, roleName);

    // 6. Return sanitized user profile & token
    res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: roleName,
          isActive: user.isActive,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Get current authenticated user profile
 * GET /api/auth/me
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    // req.user is set by authenticateToken middleware
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role?.name || user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Logout user
 * POST /api/auth/logout
 * Explains stateless JWT discarding semantics to client.
 */
export const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful. Please discard the stored JWT on the client side.'
  });
};

