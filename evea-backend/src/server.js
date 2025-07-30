// evea-backend/src/server.js - Debug version with enhanced logging
require('dotenv').config();

console.log('🚀 Starting server.js execution...');
console.log('📍 Current working directory:', process.cwd());
console.log('📍 Node version:', process.version);

// Import Passport configuration before anything else
console.log('🔐 Loading Passport configuration...');
try {
  require('./config/passport'); // Initialize Passport strategies
  console.log('✅ Passport configuration loaded successfully');
} catch (error) {
  console.error('❌ Failed to load Passport configuration:', error);
  process.exit(1);
}

console.log('📦 Loading database configuration...');
let connectDatabase;
try {
  const dbConfig = require('./config/database');
  connectDatabase = dbConfig.connectDatabase;
  console.log('✅ Database configuration loaded successfully');
} catch (error) {
  console.error('❌ Failed to load database configuration:', error);
  console.error('❌ Make sure ./config/database.js exists and exports connectDatabase');
  process.exit(1);
}

console.log('📱 Loading app configuration...');
let app;
try {
  app = require('./app');
  console.log('✅ App configuration loaded successfully');
} catch (error) {
  console.error('❌ Failed to load app configuration:', error);
  process.exit(1);
}

console.log('📝 Loading logger configuration...');
let logger;
try {
  logger = require('./config/logger');
  console.log('✅ Logger configuration loaded successfully');
} catch (error) {
  console.error('⚠️ Logger configuration not found, continuing without logger');
  logger = null;
}

console.log('🌟 Starting EVEA Backend Server with Passport.js...');
console.log('📍 Environment:', process.env.NODE_ENV || 'development');
console.log('📡 Port:', process.env.PORT || 5000);

// Enhanced error handling
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error('Name:', err.name);
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  if (logger && logger.error) {
    logger.error('Uncaught Exception:', err);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error('Promise:', promise);
  console.error('Reason:', reason);
  if (logger && logger.error) {
    logger.error('Unhandled Rejection:', { reason, promise });
  }
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log('🔄 Starting server initialization...');
    
    console.log('🔄 Connecting to database...');
    console.log('📍 MongoDB URI check:', process.env.MONGODB_URI ? 'URI found in env' : '❌ URI missing!');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    console.log('📍 Database URI (first 20 chars):', process.env.MONGODB_URI.substring(0, 20) + '...');
    
    // Connect to database with timeout
    console.log('🔄 Calling connectDatabase function...');
    const connectionTimeout = setTimeout(() => {
      console.error('❌ Database connection timeout (30 seconds)');
      process.exit(1);
    }, 30000);
    
    await connectDatabase();
    clearTimeout(connectionTimeout);
    console.log('✅ Database connected successfully');
    
    console.log('🚀 Starting HTTP server...');
    console.log('📍 Attempting to bind to port:', PORT);
    
    // Start server with enhanced error handling
    const server = app.listen(PORT, (err) => {
      if (err) {
        console.error('❌ Server failed to start:', err);
        throw err;
      }
      
      console.log('🎉 🎉 🎉 SERVER STARTED SUCCESSFULLY! 🎉 🎉 🎉');
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
      console.log(`🔗 Auth endpoints: http://localhost:${PORT}/auth`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
      console.log('🎉 EVEA Backend with Passport.js is ready to accept requests!');
      console.log('');
      console.log('🧪 Test your server:');
      console.log(`   curl http://localhost:${PORT}/health`);
      console.log(`   curl http://localhost:${PORT}/auth`);
      
      if (logger && logger.info) {
        logger.info(`Server started on port ${PORT} with Passport.js`);
      }
    });

    // Enhanced error handling for server
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        console.error('🔧 Try using a different port or kill the process using this port');
        console.error(`🔧 Command: lsof -ti:${PORT} | xargs kill -9`);
      }
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('💥 UNHANDLED REJECTION! Shutting down...');
      console.error('Name:', err.name);
      console.error('Message:', err.message);
      console.error('Stack:', err.stack);
      
      if (logger && logger.error) {
        logger.error('Unhandled Rejection:', err);
      }
      
      server.close(() => {
        console.log('🔴 Server closed due to unhandled rejection');
        process.exit(1);
      });
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM received. Shutting down gracefully...');
      if (logger && logger.info) {
        logger.info('SIGTERM received - shutting down gracefully');
      }
      
      server.close(() => {
        console.log('💥 Process terminated');
        if (logger && logger.info) {
          logger.info('Process terminated');
        }
      });
    });

    process.on('SIGINT', () => {
      console.log('👋 SIGINT received. Shutting down gracefully...');
      if (logger && logger.info) {
        logger.info('SIGINT received - shutting down gracefully');
      }
      
      server.close(() => {
        console.log('💥 Process terminated');
        if (logger && logger.info) {
          logger.info('Process terminated');
        }
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    
    if (logger && logger.error) {
      logger.error('Failed to start server:', error);
    }
    
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Check your MongoDB connection string in .env');
    console.log('2. Ensure MongoDB Atlas allows your IP address');
    console.log('3. Verify your database credentials');
    console.log('4. Check if port', PORT, 'is available');
    console.log('5. Verify Passport.js configuration');
    console.log('6. Check if ./config/database.js exists');
    console.log('7. Verify all required dependencies are installed');
    
    process.exit(1);
  }
}

console.log('🎬 Calling startServer function...');
console.log('⏰ Server startup initiated at:', new Date().toISOString());

startServer().catch((error) => {
  console.error('❌ Critical startup error:', error);
  console.error('❌ Error details:', {
    name: error.name,
    message: error.message,
    stack: error.stack
  });
  console.error('❌ Server will now exit');
  process.exit(1);
});