const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');

console.log('🚀 Initializing EVEA Backend Application...');

const app = express();

// Trust proxy for production
app.set('trust proxy', 1);

console.log('🔐 Setting up security middlewares...');

try {
  app.use(helmet());
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }));
  console.log('✅ Security middlewares configured');
} catch (error) {
  console.error('❌ Error setting up security middlewares:', error);
  throw error;
}

console.log('🛡️ Setting up data sanitization...');

try {
  // Data sanitization
  app.use(mongoSanitize()); // Against NoSQL injection
  app.use(xss()); // Against XSS attacks
  console.log('✅ Data sanitization configured');
} catch (error) {
  console.error('❌ Error setting up data sanitization:', error);
  throw error;
}

console.log('📦 Setting up body parsing...');

try {
  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());
  console.log('✅ Body parsing configured');
} catch (error) {
  console.error('❌ Error setting up body parsing:', error);
  throw error;
}

console.log('🗜️ Setting up compression...');

try {
  // Compression
  app.use(compression());
  console.log('✅ Compression configured');
} catch (error) {
  console.error('❌ Error setting up compression:', error);
  throw error;
}

console.log('🏥 Setting up health check endpoint...');

try {
  // Health check endpoint
  app.get('/health', (req, res) => {
    console.log('💓 Health check requested');
    res.status(200).json({
      success: true,
      message: 'EVEA Backend is running!',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    });
  });
  console.log('✅ Health check endpoint configured');
} catch (error) {
  console.error('❌ Error setting up health check:', error);
  throw error;
}

console.log('🛣️ Setting up API routes...');

try {
  // Import and use auth routes
  const authRoutes = require('./routes/auth');
  app.use('/api/v1/auth', authRoutes);
  console.log('✅ Auth routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading auth routes:', error.message);
  console.error('Stack:', error.stack);
  throw error;
}

console.log('🔍 Setting up 404 handler...');

try {
  // Alternative 404 handler that avoids path-to-regexp issues
  app.use((req, res, next) => {
    console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
    
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
      availableRoutes: [
        'GET /health',
        'POST /api/v1/auth/register',
        'POST /api/v1/auth/login',
        'GET /api/v1/auth/verify-email/:token',
        'POST /api/v1/auth/logout'
      ]
    });
  });
  console.log('✅ 404 handler configured');
} catch (error) {
  console.error('❌ Error setting up 404 handler:', error);
  throw error;
}

console.log('🚨 Setting up global error handler...');

try {
  // Global error handler
  app.use((err, req, res, next) => {
    console.error('🚨 Global error handler triggered:', {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip
    });

    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Server Error',
      ...(process.env.NODE_ENV === 'development' && { 
        stack: err.stack,
        error: err 
      })
    });
  });
  console.log('✅ Global error handler configured');
} catch (error) {
  console.error('❌ Error setting up global error handler:', error);
  throw error;
}

console.log('✅ EVEA Backend Application initialized successfully');

module.exports = app;