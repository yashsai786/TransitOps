import { logger } from '../utils/logger.js';

/**
 * Custom Middleware 2: Request Logger
 * Demonstrates middleware chaining: relies on req.startTime set by requestContext.
 * Calculates precise request execution duration and logs the HTTP transaction upon response finish.
 */
export const requestLogger = (req, res, next) => {
  res.on('finish', () => {
    let durationMs = 0;
    if (req.startTime) {
      const diff = process.hrtime(req.startTime);
      durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    }
    
    logger.http(req.method, req.originalUrl || req.url, res.statusCode, durationMs);
  });

  next();
};

