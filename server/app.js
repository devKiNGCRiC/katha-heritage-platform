// 🚀 KATHA Heritage Platform - Express App Configuration
// 🎯 Purpose: Builds and configures the Express app (no listening, no DB connect)
// 📚 Kept separate from server.js so tests can import `app` without starting a real server

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import dbManager from './utils/database.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// 🛡️ Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      scriptSrc: ["'self'"]
    }
  }
}));

// 🌐 CORS Configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://katha.vercel.app', 'https://www.katha.in']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ⚡ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', limiter);

// 📝 Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 📊 Basic Logging Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 🚀 Root Route
app.get('/', (req, res) => {
  res.json({
    message: '🙏 Namaste! Welcome to KATHA Heritage Platform API',
    version: '1.0.0',
    status: 'active',
    features: [
      '🏛️ Indian Heritage Stories',
      '🗺️ Interactive Cultural Maps',
      '👥 Community Features',
      '🤖 AI-Powered Recommendations',
      '📱 Progressive Web App'
    ],
    developer: 'RKC_BHARAT Initiative',
    timestamp: new Date().toISOString()
  });
});

// 🔍 Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    database: dbManager.getStatus()
  });
});

// 📝 API Routes
app.use('/api/auth', authRoutes);

// 🚨 Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.stack);

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Something went wrong!'
      : err.message,
    code: err.code || 'INTERNAL_SERVER_ERROR',
    timestamp: new Date().toISOString()
  });
});

// 🔍 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    code: 'NOT_FOUND',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
});

export default app;
