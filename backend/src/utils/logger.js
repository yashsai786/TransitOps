/**
 * TransitOps - Logger Utility
 * Provides structured, timestamped console logging for backend events.
 */

const getTimestamp = () => new Date().toISOString();

export const logger = {
  info: (message, meta = '') => {
    console.log(`[\x1b[34mINFO\x1b[0m] [${getTimestamp()}] ${message}`, meta ? meta : '');
  },
  success: (message, meta = '') => {
    console.log(`[\x1b[32mSUCCESS\x1b[0m] [${getTimestamp()}] ${message}`, meta ? meta : '');
  },
  warn: (message, meta = '') => {
    console.warn(`[\x1b[33mWARN\x1b[0m] [${getTimestamp()}] ${message}`, meta ? meta : '');
  },
  error: (message, error = '') => {
    console.error(`[\x1b[31mERROR\x1b[0m] [${getTimestamp()}] ${message}`, error ? error : '');
  },
  http: (method, url, status, duration) => {
    const statusColor = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m';
    console.log(
      `[\x1b[35mHTTP\x1b[0m] [${getTimestamp()}] ${method.padEnd(6)} ${url.padEnd(25)} ${statusColor}${status}\x1b[0m - ${duration}ms`
    );
  }
};

