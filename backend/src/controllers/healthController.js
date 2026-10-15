import { getDatabaseStatus } from '../config/db.js';

/**
 * Controller to handle API health check
 * Endpoint: GET /api/health
 * Used by monitoring probes, uptime checkers, and deployment orchestrators.
 */
export const getHealth = (req, res) => {
  const dbStatus = getDatabaseStatus();
  const uptimeSeconds = Math.floor(process.uptime());

  const isDbReady = dbStatus.state === 'connected';

  const responsePayload = {
    success: true,
    data: {
      service: 'TransitOps Platform API',
      version: '1.0.0',
      status: isDbReady ? 'operational' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus.state,
        connected: isDbReady
      }
    }
  };

  const httpStatus = isDbReady ? 200 : 503;
  res.status(httpStatus).json(responsePayload);
};
