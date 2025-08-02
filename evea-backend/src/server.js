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
const oauthSetupRoutes = require('./routes/oauthSetupRoutes');

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

// ==================== GOOGLE DRIVE OAUTH INITIALIZATION ====================

const initializeServices = async () => {
  try {
    console.log('🔧 Initializing external services...');
    
    // Check OAuth configuration (NEW - replaces service account check)
    const hasOAuthConfig = process.env.GOOGLE_OAUTH_CLIENT_ID && 
                          process.env.GOOGLE_OAUTH_CLIENT_SECRET && 
                          process.env.GOOGLE_OAUTH_REDIRECT_URI &&
                          process.env.GOOGLE_DRIVE_FOLDER_ID;
    
    if (hasOAuthConfig) {
      console.log('✅ OAuth configuration found');
      
      if (process.env.GOOGLE_REFRESH_TOKEN) {
        console.log('📁 Initializing OAuth Google Drive service...');
        
        try {
          const { initializeGoogleDrive } = require('./services/googleDriveService');
          await initializeGoogleDrive();
          console.log('✅ OAuth Google Drive service ready');
        } catch (initError) {
          console.error('❌ OAuth Google Drive initialization failed:', initError.message);
          
          if (initError.message.includes('invalid_grant')) {
            console.error('🔧 Refresh token may be expired - re-run OAuth setup');
            console.error('   Visit: http://localhost:5000/setup-google-auth');
          }
        }
      } else {
        console.log('⚠️ OAuth setup incomplete - GOOGLE_REFRESH_TOKEN missing');
        console.log('🔧 Complete OAuth setup:');
        console.log('   1. Visit: http://localhost:5000/setup-google-auth');
        console.log('   2. Complete authentication flow');
        console.log('   3. Add refresh token to .env');
        console.log('   4. Restart server');
      }
    } else {
      console.log('⚠️ OAuth configuration missing - documents will not be uploaded');
      console.log('💡 Required environment variables for OAuth:');
      console.log('   - GOOGLE_OAUTH_CLIENT_ID');
      console.log('   - GOOGLE_OAUTH_CLIENT_SECRET');
      console.log('   - GOOGLE_OAUTH_REDIRECT_URI');
      console.log('   - GOOGLE_DRIVE_FOLDER_ID');
      console.log('   - GOOGLE_REFRESH_TOKEN (get via /setup-google-auth)');
      console.log('📄 Check your .env file and Google Cloud Console OAuth setup');
    }
    
  } catch (error) {
    console.error('❌ External service initialization failed:', error);
    console.log('⚠️ Server will continue but Google Drive uploads may fail');
    console.log('🔧 Troubleshooting tips:');
    console.log('   1. Verify OAuth credentials in Google Cloud Console');
    console.log('   2. Check Google Drive API is enabled');
    console.log('   3. Complete OAuth setup at /setup-google-auth');
  }
};

// ==================== OAUTH ROUTES ====================

// OAuth setup routes (must be before other routes)
app.use('/', oauthSetupRoutes);

// OAuth info route for easy access
app.get('/oauth-info', (req, res) => {
  const hasOAuthConfig = !!(process.env.GOOGLE_OAUTH_CLIENT_ID && 
                            process.env.GOOGLE_OAUTH_CLIENT_SECRET);
  const hasRefreshToken = !!process.env.GOOGLE_REFRESH_TOKEN;
  
  res.json({
    message: 'OAuth setup for Google Drive',
    status: hasRefreshToken ? 'Ready' : hasOAuthConfig ? 'Needs OAuth Setup' : 'Needs Configuration',
    setupUrl: 'http://localhost:5000/setup-google-auth',
    statusUrl: 'http://localhost:5000/oauth-status',
    instructions: hasOAuthConfig ? [
      '1. Visit /setup-google-auth to start OAuth flow',
      '2. Complete Google authentication',
      '3. Copy refresh token to .env file',
      '4. Restart server',
      '5. Test document upload'
    ] : [
      '1. Set up OAuth credentials in Google Cloud Console',
      '2. Add GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET to .env',
      '3. Then visit /setup-google-auth'
    ],
    configuration: {
      clientId: hasOAuthConfig ? '✅ Set' : '❌ Missing',
      clientSecret: hasOAuthConfig ? '✅ Set' : '❌ Missing',
      redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI ? '✅ Set' : '❌ Missing',
      refreshToken: hasRefreshToken ? '✅ Set' : '❌ Missing',
      folderId: process.env.GOOGLE_DRIVE_FOLDER_ID ? '✅ Set' : '❌ Missing'
    }
  });
});

// ==================== ROUTES ====================

// Health check route with OAuth information
app.get('/health', (req, res) => {
  const hasOAuthConfig = !!(process.env.GOOGLE_OAUTH_CLIENT_ID && 
                            process.env.GOOGLE_OAUTH_CLIENT_SECRET);
  const hasRefreshToken = !!process.env.GOOGLE_REFRESH_TOKEN;
  
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    services: {
      googleDrive: hasRefreshToken ? 'OAuth Ready' : hasOAuthConfig ? 'OAuth Configured (Setup Required)' : 'Not Configured'
    },
    oauth: {
      configured: hasOAuthConfig,
      authenticated: hasRefreshToken,
      setupUrl: hasOAuthConfig ? '/setup-google-auth' : null
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
      oauthSetup: '/setup-google-auth',
      oauthStatus: '/oauth-status',
      oauthInfo: '/oauth-info',
      testGoogleDrive: '/test/google-drive'
    },
    documentation: 'https://github.com/your-org/evea-backend'
  });
});

// ==================== API ROUTES ====================

// Authentication routes
app.use('/auth', authLimiter, authRoutes);

// API routes
app.use('/api/vendors', vendorRoutes);
// app.use('/api/admin', adminRoutes); // Uncomment when ready

// ==================== GOOGLE DRIVE TEST ENDPOINT ====================

// Test Google Drive endpoint (updated for OAuth)
app.get('/test/google-drive', async (req, res) => {
  try {
    console.log('🧪 Testing OAuth Google Drive connection...');
    
    // Check if OAuth is configured
    const hasOAuthConfig = !!(process.env.GOOGLE_OAUTH_CLIENT_ID && 
                              process.env.GOOGLE_OAUTH_CLIENT_SECRET);
    const hasRefreshToken = !!process.env.GOOGLE_REFRESH_TOKEN;
    
    if (!hasOAuthConfig) {
      return res.status(400).json({
        success: false,
        message: 'OAuth not configured',
        error: 'Missing OAuth credentials',
        troubleshooting: [
          'Set up OAuth credentials in Google Cloud Console',
          'Add GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET to .env',
          'Visit /oauth-info for detailed setup instructions'
        ],
        setupUrl: '/oauth-info'
      });
    }
    
    if (!hasRefreshToken) {
      return res.status(400).json({
        success: false,
        message: 'OAuth setup incomplete',
        error: 'Missing refresh token',
        troubleshooting: [
          'Complete OAuth setup by visiting /setup-google-auth',
          'Grant permissions to Google Drive',
          'Add refresh token to .env file',
          'Restart server'
        ],
        setupUrl: '/setup-google-auth'
      });
    }
    
    // Test the OAuth connection
    const { testGoogleDriveConnection } = require('./services/googleDriveService');
    await testGoogleDriveConnection();
    
    res.json({
      success: true,
      message: 'OAuth Google Drive connection successful',
      timestamp: new Date().toISOString(),
      folderUrl: `https://drive.google.com/drive/folders/${process.env.GOOGLE_DRIVE_FOLDER_ID}`,
      authType: 'OAuth 2.0',
      config: {
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID ? '✅ Set' : '❌ Missing',
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ? '✅ Set' : '❌ Missing',
        redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI ? '✅ Set' : '❌ Missing',
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN ? '✅ Set' : '❌ Missing',
        folderId: process.env.GOOGLE_DRIVE_FOLDER_ID ? '✅ Set' : '❌ Missing'
      }
    });
    
  } catch (error) {
    console.error('❌ OAuth Google Drive test failed:', error);
    
    let troubleshooting = [
      'Check OAuth configuration in Google Cloud Console',
      'Verify Google Drive API is enabled',
      'Ensure OAuth setup is complete',
      'Check environment variables are properly set'
    ];
    
    if (error.message.includes('invalid_grant')) {
      troubleshooting = [
        'Refresh token has expired',
        'Re-run OAuth setup at /setup-google-auth',
        'Get new refresh token',
        'Update .env file and restart server'
      ];
    } else if (error.message.includes('invalid_client')) {
      troubleshooting = [
        'OAuth client credentials are invalid',
        'Check GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET',
        'Verify credentials in Google Cloud Console',
        'Ensure OAuth client is properly configured'
      ];
    }
    
    res.status(500).json({
      success: false,
      message: 'OAuth Google Drive connection failed',
      error: error.message,
      authType: 'OAuth 2.0',
      troubleshooting,
      setupUrl: '/setup-google-auth'
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
      oauthSetup: '/setup-google-auth',
      oauthStatus: '/oauth-status',
      oauthInfo: '/oauth-info',
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
    🔧 OAuth Setup: http://localhost:${PORT}/setup-google-auth
    📊 OAuth Status: http://localhost:${PORT}/oauth-status
    ℹ️ OAuth Info: http://localhost:${PORT}/oauth-info
    🧪 Google Drive Test: http://localhost:${PORT}/test/google-drive
    ================================================
  `);
  
  // Initialize external services after server starts
  await initializeServices();
  
  const hasOAuthConfig = !!(process.env.GOOGLE_OAUTH_CLIENT_ID && 
                            process.env.GOOGLE_OAUTH_CLIENT_SECRET);
  const hasRefreshToken = !!process.env.GOOGLE_REFRESH_TOKEN;
  
  console.log(`
    ================================================
    ✅ Server fully initialized and ready!
    📡 API Base URL: http://localhost:${PORT}
    📋 Health Check: http://localhost:${PORT}/health
    
    🔧 Google Drive OAuth Status:
    ${hasRefreshToken ? 
      '✅ OAuth configured - Google Drive ready' : 
      hasOAuthConfig ?
        '⚠️ OAuth setup needed - visit /setup-google-auth' :
        '❌ OAuth not configured - check .env file'
    }
    
    ${!hasRefreshToken ? 
      `🔗 OAuth Setup: http://localhost:${PORT}/setup-google-auth` : 
      `🔗 Drive Folder: https://drive.google.com/drive/folders/${process.env.GOOGLE_DRIVE_FOLDER_ID}`
    }
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