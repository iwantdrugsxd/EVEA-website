require('dotenv').config();

const { connectDatabase } = require('./config/database');
const app = require('./app');
const logger = require('./config/logger');

console.log('🌟 Starting EVEA Backend Server...');
console.log('📍 Environment:', process.env.NODE_ENV || 'development');
console.log('📡 Port:', process.env.PORT || 5000);

// Handle uncaught exceptions
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

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log('🔄 Connecting to database...');
    console.log('📍 MongoDB URI check:', process.env.MONGODB_URI ? 'URI found in env' : 'URI missing!');
    
    // Connect to database
    await connectDatabase();
    console.log('✅ Database connected successfully');
    
    console.log('🚀 Starting HTTP server...');
    
    // Start server
    const server = app.listen(PORT, (err) => {
      if (err) {
        console.error('❌ Server failed to start:', err);
        throw err;
      }
      
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
      console.log('🎉 EVEA Backend is ready to accept requests!');
      
      if (logger && logger.info) {
        logger.info(`Server started on port ${PORT}`);
      }
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
    
    process.exit(1);
  }
}

console.log('🎬 Calling startServer function...');
startServer().catch((error) => {
  console.error('❌ Startup error:', error);
  process.exit(1);
});