import crypto from 'crypto';

/**
 * Custom Middleware 1: Request Context
 * Attaches a unique request ID and high-resolution start time to each request.
 * Demonstrates custom middleware creation and feeds into requestLogger for middleware chaining.
 */
export const requestContext = (req, res, next) => {
  req.id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10);
  req.startTime = process.hrtime();
  
  // Set custom response header for tracking
  res.setHeader('X-Request-Id', req.id);
  next();
};

