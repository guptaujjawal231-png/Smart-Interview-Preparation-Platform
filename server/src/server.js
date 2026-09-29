import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connectDB, getDbStatus } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter, sanitizeNoSql } from './middleware/securityMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Connect to MongoDB
connectDB();

// 1. Helmet HTTP Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. Strict CORS Configuration
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Body Parsing & Security Sanitization
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());
app.use(sanitizeNoSql);

// 4. Rate Limiting Middlewares (Global API throttle: 200 req / 15 mins)
app.use('/api', apiLimiter);

// System Health Diagnostic Route
app.get('/api/health', (req, res) => {
  const dbStatus = getDbStatus();
  res.status(200).json({
    success: true,
    message: 'AI Interview Prep API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      connected: dbStatus.connected,
      state: dbStatus.readyState === 1 ? 'Connected' : 'Disconnected / Fallback Mode',
    },
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root API Greeting
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to AI Interview Prep Backend REST API',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      questions: '/api/questions',
      interviews: '/api/interviews',
      resume: '/api/resume',
      dashboard: '/api/dashboard/stats',
    },
  });
});

// Centralized Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Start HTTP Listener
const server = app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log(`🛡️  Helmet & Rate Limiting security shields active`);
  console.log(`📡 CORS enabled for origin: ${CLIENT_URL}`);
  console.log(`🔍 Health check available at: http://localhost:${PORT}/api/health`);
});

export default app;
