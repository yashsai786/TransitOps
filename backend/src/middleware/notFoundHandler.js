/**
 * 404 Not Found Middleware
 * Catches any unhandled route and returns a clean, structured JSON response.
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist on this server.`,
      availableEndpoints: ['/api/health', '/api/docs', '/static']
    }
  });
};

