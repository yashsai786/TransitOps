import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

/**
 * Maps Mongoose readyState number to human-readable string
 */
export const getDatabaseStatus = () => {
  const readyStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const isConfigured = Boolean(
    process.env.MONGO_URI &&
    !process.env.MONGO_URI.includes('<username>') &&
    !process.env.MONGO_URI.includes('<db_username>') &&
    process.env.MONGO_URI.trim().length > 0
  );

  return {
    configured: isConfigured,
    state: isConfigured ? (readyStates[mongoose.connection.readyState] || 'unknown') : 'unconfigured',
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null
  };
};

/**
 * Connect to MongoDB Atlas via Mongoose with resilient error handling
 */
export const connectDatabase = async () => {
  const uri = process.env.MONGO_URI;

  if (
    !uri || 
    uri.includes('<username>') || 
    uri.includes('<db_username>') || 
    uri.trim() === ''
  ) {
    logger.warn('MongoDB Atlas URI contains placeholder (<db_username> or <username>) or is not set in .env.');
    logger.warn('The backend server is running in offline/disconnected mode for database operations.');
    logger.info('To connect to MongoDB Atlas, add your connection string to backend/.env and restart.');
    return false;
  }

  try {
    logger.info('Attempting to connect to MongoDB Atlas...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // fail fast if Atlas cluster is unreachable
    });

    logger.success(`MongoDB Connected successfully! Host: ${conn.connection.host}, DB: ${conn.connection.name}`);
    return true;
  } catch (error) {
    logger.error('Failed to connect to MongoDB Atlas:', error.message);
    logger.warn('Server will continue running, but database features will be unavailable until reconnected.');
    return false;
  }
};

// Event listeners for Mongoose connection lifecycle
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB connection disconnected.');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection runtime error:', err.message);
});

mongoose.connection.on('reconnected', () => {
  logger.success('MongoDB reconnected successfully.');
});

