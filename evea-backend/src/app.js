// evea-backend/src/app.js - Final working version (100% clean)
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');

console.log('🚀 Initializing EVEA Backend Application (Clean Version)...');

const app = express();

// ================================
// BASIC MIDDLEWARE ONLY
// ================================

console.log('🔐 Setting up basic security...');

// Basic CORS setup
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://evea-frontend.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

console.log('✅ CORS configured');

// Basic helmet (minimal config)
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false // Disable CSP for now
}));

console.log('✅ Security headers configured');

// ================================
// BODY PARSING
// ================================

console.log('📦 Setting up body parsing...');
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
console.log('✅ Body parsing configured');

// ================================
// SESSION CONFIGURATION
// ================================

console.log('🍪 Setting up sessions...');

// Simple session without MongoDB store for testing
app.use(session({
  secret: process.env.SESSION_SECRET || 'evea-session-secret',
  resave: false,
  saveUninitialized: false,
  name: 'evea.sid',
  cookie: {
    secure: false, // Set to false for testing
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

console.log('✅ Session configured');

// ================================
// PASSPORT INITIALIZATION
// ================================

app.use(passport.initialize());
app.use(passport.session());

console.log('✅ Passport.js initialized');

// ================================
// BASIC ROUTES
// ================================

console.log('🏥 Setting up basic routes...');

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EVEA Backend Server is running (Clean Version)',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EVEA Backend API (Clean Version)',
    timestamp: new Date().toISOString()
  });
});

console.log('✅ Basic routes configured');

// ================================
// AUTHENTICATION ROUTES
// ================================

console.log('🛣️ Loading authentication routes...');

try {
  const authRoutes = require('./routes/auth/authRoutes');
  app.use('/auth', authRoutes);
  console.log('✅ Auth routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading auth routes:', error.message);
  
  // Emergency fallback routes
  app.get('/auth', (req, res) => {
    res.status(503).json({
      success: false,
      message: 'Auth routes failed to load',
      error: error.message
    });
  });
  
  app.get('/auth/me', (req, res) => {
    res.status(503).json({
      success: false,
      message: 'Auth route not available',
      error: 'Routes failed to load'
    });
  });
}

// ================================
// ERROR HANDLING
// ================================

// Simple 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Simple error handler
app.use((error, req, res, next) => {
  console.error('🚨 Error:', error.message);
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

console.log('✅ Error handling configured');
console.log('🎉 Clean EVEA Backend Application initialized');

module.exports = app;