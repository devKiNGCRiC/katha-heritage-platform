// 🚀 KATHA Heritage Platform - Main Server File
// 🎯 Purpose: Entry point for Express.js backend server
// 📚 Features: Authentication, CORS, Security, Rate Limiting

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes (we'll create these next)
// const authRoutes = require('./routes/auth');
// const storyRoutes = require('./routes/stories');
// const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

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

// 🚀 Test Route - Our first endpoint!
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

// 📝 API Routes (will be uncommented as we create them)
// app.use('/api/auth', authRoutes);
// app.use('/api/stories', storyRoutes);
// app.use('/api/users', userRoutes);

// 🌍 Database Connection
import dbManager from './utils/database.js';

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

// 🚀 Start Server
const startServer = async () => {
  // Setup database event listeners
  dbManager.setupEventListeners();
  
  // Connect to database
  await dbManager.connect();
  
  // Create indexes and seed data if needed
  if (dbManager.isConnected) {
    await dbManager.createIndexes();
    // Uncomment the line below to seed initial data (run only once)
    // await dbManager.seedInitialData();
  }
  
  app.listen(PORT, () => {
    console.log('🚀 KATHA Heritage Platform Server Started!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🌐 Server running on: http://localhost:${PORT}`);
    console.log(`📱 API Endpoint: http://localhost:${PORT}/api`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 Ready for KATHA development!');
    console.log('🙏 Jai Hind! Let\'s build something amazing!');
  });
};

// 🎯 Graceful Shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  await dbManager.disconnect();
  process.exit(0);
});

// Start the server
startServer();

export default app;