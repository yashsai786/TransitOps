import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';
import { connectDatabase } from './config/db.js';
import { initializeRoles } from './services/roleService.js';
import { logger } from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env or root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // fallback to current working directory .env if present

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Startup procedure
const startServer = async () => {
  logger.info(`Starting TransitOps Backend API in [${process.env.NODE_ENV || 'development'}] mode...`);

  // Attempt database connection (graceful fallback if unconfigured)
  const isConnected = await connectDatabase();
  if (isConnected) {
    await initializeRoles();
  }

  server.listen(PORT, () => {
    logger.success(`TransitOps Server is running on http://localhost:${PORT}`);
    logger.info(`Health check available at: http://localhost:${PORT}/api/health`);
    logger.info(`Static assets served at:   http://localhost:${PORT}/static`);
  });
};

// Graceful shutdown handling
const shutdown = () => {
  logger.info('Received termination signal. Shutting down TransitOps server gracefully...');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  // Force shutdown after timeout if pending connections hang
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();

