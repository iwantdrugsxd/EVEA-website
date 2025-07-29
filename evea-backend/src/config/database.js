const mongoose = require('mongoose');
const logger = require('./logger');

const connectDatabase = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('📍 MongoDB URI:', mongoUri.replace(/\/\/.*@/, '//*****@')); // Hide credentials in logs

    // Updated connection options (removed deprecated options)
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      retryWrites: true,
      w: 'majority'
    };

    await mongoose.connect(mongoUri, options);
    
    console.log('✅ MongoDB connected successfully');
    if (logger && logger.info) {
      logger.info('MongoDB connected successfully');
    }
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      if (logger && logger.error) {
        logger.error('MongoDB connection error:', err);
      }
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      if (logger && logger.warn) {
        logger.warn('MongoDB disconnected');
      }
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
      if (logger && logger.info) {
        logger.info('MongoDB reconnected');
      }
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    if (logger && logger.error) {
      logger.error('MongoDB connection failed:', error);
    }
    process.exit(1);
  }
};

module.exports = { connectDatabase };