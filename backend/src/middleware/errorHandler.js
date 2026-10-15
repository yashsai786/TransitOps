import { logger } from '../utils/logger.js';

/**
 * Centralized Global Error Handler Middleware
 * Catches all sync and async unhandled errors forwarded by next(err).
 * Formats errors into a unified API response schema.
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  
  logger.error(`Unhandled Error [${req.id || 'N/A'}] - ${err.message}`, err.stack);

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected server error occurred.',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

