// evea-backend/src/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Import routes
const authRoutes = require('./routes/authRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
// const adminRoutes = require('./routes/adminRoutes'); // Uncomment when ready

console.log('🚀 Starting EVEA Backend Server...');

// ==================== SECURITY MIDDLEWARE ====================

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression
app.use(compression());

// Data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// Data sanitization against XSS
// app.use(xss());

// ==================== CORS CONFIGURATION ====================

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
};

app.use(cors(corsOptions));

// ==================== RATE LIMITING ====================

// General rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs for auth
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== BODY PARSING MIDDLEWARE ====================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==================== DATABASE CONNECTION ====================

console.log('🔌 Connecting to MongoDB...');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
  console.log('📍 Database:', mongoose.connection.name);
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// ==================== GOOGLE DRIVE INITIALIZATION ====================

const initializeServices = async () => {
  try {
    console.log('🔧 Initializing external services...');
    
    // Initialize Google Drive service
    if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_DRIVE_FOLDER_ID) {
      console.log('📁 Initializing Google Drive service...');
      
      // CORRECTED: Fixed import path
      const { initializeGoogleDrive } = require('./services/googleDriveService');
      await initializeGoogleDrive();
      console.log('✅ Google Drive service ready');
    } else {
      console.log('⚠️ Google Drive configuration missing - documents will not be uploaded');
      console.log('💡 Required environment variables:');
      console.log('   - GOOGLE_CLIENT_EMAIL');
      console.log('   - GOOGLE_PRIVATE_KEY'); 
      console.log('   - GOOGLE_DRIVE_FOLDER_ID');
      console.log('📄 Check your .env file and Google Cloud Console setup');
    }
    
  } catch (error) {
    console.error('❌ External service initialization failed:', error);
    console.log('⚠️ Server will continue but Google Drive uploads may fail');
    console.log('🔧 Troubleshooting tips:');
    console.log('   1. Verify Google service account credentials');
    console.log('   2. Check Google Drive API is enabled');
    console.log('   3. Ensure service account has Drive access');
  }
};

// ==================== ROUTES ====================

// Health check route with extended information
app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    services: {
      googleDrive: process.env.GOOGLE_CLIENT_EMAIL ? 'Configured' : 'Not Configured'
    },
    uptime: process.uptime(),
    memory: process.memoryUsage()
  };
  
  res.json(healthCheck);
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'EVEA Backend API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      health: '/health',
      auth: '/auth',
      vendors: '/api/vendors',
      testGoogleDrive: '/test/google-drive'
    },
    documentation: 'https://github.com/your-org/evea-backend'
  });
});

// ==================== API ROUTES ====================

// Authentication routes (FIXED - no /api prefix to match frontend calls)
app.use('/auth', authLimiter, authRoutes);

// API routes
app.use('/api/vendors', vendorRoutes);
// app.use('/api/admin', adminRoutes); // Uncomment when ready

// ==================== GOOGLE DRIVE TEST ENDPOINT ====================

// Test Google Drive endpoint (for debugging and verification)
app.get('/test/google-drive', async (req, res) => {
  try {
    // CORRECTED: Fixed import path
    const { testGoogleDriveConnection } = require('./services/googleDriveService');
    await testGoogleDriveConnection();
    
    res.json({
      success: true,
      message: 'Google Drive connection successful',
      timestamp: new Date().toISOString(),
      folderUrl: `https://drive.google.com/drive/folders/${process.env.GOOGLE_DRIVE_FOLDER_ID}`,
      config: {
        clientEmail: process.env.GOOGLE_CLIENT_EMAIL ? '✅ Set' : '❌ Missing',
        privateKey: process.env.GOOGLE_PRIVATE_KEY ? '✅ Set' : '❌ Missing',
        folderId: process.env.GOOGLE_DRIVE_FOLDER_ID ? '✅ Set' : '❌ Missing'
      }
    });
  } catch (error) {
    console.error('Google Drive test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Google Drive connection failed',
      error: error.message,
      troubleshooting: [
        'Check Google service account credentials',
        'Verify Google Drive API is enabled',
        'Ensure service account has folder access',
        'Check environment variables are properly set'
      ]
    });
  }
});

// ==================== ERROR HANDLING ====================

// Catch-all route for undefined endpoints
app.use((req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    availableRoutes: {
      auth: '/auth/*',
      vendors: '/api/vendors/*',
      health: '/health',
      testGoogleDrive: '/test/google-drive'
    },
    requestedPath: req.path,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('🚨 Global error handler:', error);
  
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
      duplicateField: field,
      duplicateValue: value
    });
  }

  // MongoDB connection errors
  if (error.name === 'MongooseError' || error.name === 'MongoError') {
    return res.status(503).json({
      success: false,
      message: 'Database connection error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Database unavailable'
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Multer file upload errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large',
      maxSize: '10MB'
    });
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Too many files or unexpected file field'
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
});

// ==================== SERVER STARTUP ====================

const PORT = process.env.PORT || 5000;

// const initializeServices = async () => {
//   try {
//     console.log('🔧 Initializing external services...');
    
//     // Initialize Google Drive service
//     if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_DRIVE_FOLDER_ID) {
//       console.log('📁 Initializing Google Drive service...');
      
//       // CORRECTED: Fixed import path
//       const { initializeGoogleDrive } = require('./services/googleDriveService');
//       await initializeGoogleDrive();
//       console.log('✅ Google Drive service ready');
//     } else {
//       console.log('⚠️ Google Drive configuration missing - documents will not be uploaded');
//       console.log('💡 Required environment variables:');
//       console.log('   - GOOGLE_CLIENT_EMAIL');
//       console.log('   - GOOGLE_PRIVATE_KEY'); 
//       console.log('   - GOOGLE_DRIVE_FOLDER_ID');
//     }
    
//   } catch (error) {
//     console.error('❌ External service initialization failed:', error);
//     console.log('⚠️ Server will continue but Google Drive uploads may fail');
//   }
// };

const server = app.listen(PORT, async () => {
  console.log(`
    ================================================
    🚀 EVEA Backend Server is RUNNING!
    ================================================
    Environment: ${process.env.NODE_ENV || 'development'}
    Port: ${PORT}
    MongoDB: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}
    Time: ${new Date().toLocaleString()}
    
    Available Endpoints:
    📍 Health Check: http://localhost:${PORT}/health
    🔐 Authentication: http://localhost:${PORT}/auth/*
    👥 Vendors: http://localhost:${PORT}/api/vendors/*
    🧪 Google Drive Test: http://localhost:${PORT}/test/google-drive
    ================================================
  `);
  
  // Initialize external services after server starts
  await initializeServices();
  
  console.log(`
    ================================================
    ✅ Server fully initialized and ready!
    📡 API Base URL: http://localhost:${PORT}
    📋 Health Check: http://localhost:${PORT}/health
    🔗 Google Drive Folder: ${process.env.GOOGLE_DRIVE_FOLDER_ID ? 
      `https://drive.google.com/drive/folders/${process.env.GOOGLE_DRIVE_FOLDER_ID}` : 
      'Not configured'}
    ================================================
  `);
});

// ==================== GRACEFUL SHUTDOWN ====================

const gracefulShutdown = (signal) => {
  console.log(`📴 ${signal} signal received: closing HTTP server`);
  server.close(() => {
    console.log('🔌 HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('📊 MongoDB connection closed');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  console.log('🚨 Server is shutting down due to uncaught exception');
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('💥 Unhandled Rejection:', error);
  console.log('🚨 Server is shutting down due to unhandled promise rejection');
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;