import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import apiRouter from './routes/index.js';
import { requestContext } from './middleware/requestContext.js';
import { requestLogger } from './middleware/requestLogger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express application
const app = express();

// 1. Core Parsing Middleware (Faculty Requirement: express.json)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. CORS Configuration (Environment-aware)
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id']
}));

// 3. Static Assets Middleware (Faculty Requirement: express.static)
app.use('/static', express.static(path.join(__dirname, '../public')));

// 4. Custom Middleware & Chaining (Faculty Requirement: custom middleware & chaining)
app.use(requestContext); // Injects req.id and req.startTime
app.use(requestLogger);  // Uses req.startTime to calculate latency and log request

// 5. Root route
app.get('/', (req, res) => {
  res.redirect('/api');
});

// 6. API Routes
app.use('/api', apiRouter);

// 7. 404 Handler for undefined routes
app.use(notFoundHandler);

// 8. Centralized Global Error Handler
app.use(errorHandler);

export default app;

