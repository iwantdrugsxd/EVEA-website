const mongoose = require('mongoose');
require('dotenv').config();

console.log('🧪 Database Connection Test');
console.log('===========================');

async function testDatabase() {
  try {
    console.log('📍 Environment variables check:');
    console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'Missing!');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in .env file');
      console.log('🔧 Make sure your .env file contains:');
      console.log('MONGODB_URI=mongodb+srv://evea-backend:Cherry@user.hf5zeco.mongodb.net/evea?retryWrites=true&w=majority&appName=User');
      return;
    }
    
    // Hide password in logs
    const safeUri = process.env.MONGODB_URI.replace(/\/\/.*@/, '//*****@');
    console.log('📍 MongoDB URI:', safeUri);
    
    console.log('\n🔄 Attempting to connect to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increase timeout
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('✅ MongoDB connected successfully!');
    
    // Test creating a simple document
    console.log('\n🧪 Testing database operations...');
    
    const testSchema = new mongoose.Schema({ 
      test: String, 
      timestamp: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('ConnectionTest', testSchema);
    
    // Create test document
    const testDoc = await TestModel.create({ 
      test: 'Database connection successful!' 
    });
    console.log('✅ Test document created:', testDoc._id);
    
    // Read test document
    const foundDoc = await TestModel.findById(testDoc._id);
    console.log('✅ Test document retrieved:', foundDoc.test);
    
    // Delete test document
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Test document deleted');
    
    console.log('\n🎉 Database test completed successfully!');
    console.log('✅ Your MongoDB Atlas connection is working perfectly');
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    
  } catch (error) {
    console.error('\n❌ Database test failed!');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    
    // Provide specific troubleshooting
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 AUTHENTICATION ERROR:');
      console.log('1. Check your MongoDB username and password');
      console.log('2. Verify the password doesn\'t contain special characters');
      console.log('3. Make sure you created a database user in MongoDB Atlas');
    } else if (error.message.includes('IP address')) {
      console.log('\n🔧 IP ADDRESS ERROR:');
      console.log('1. Add your IP address to MongoDB Atlas Network Access');
      console.log('2. Or allow access from anywhere (0.0.0.0/0)');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n🔧 CONNECTION ERROR:');
      console.log('1. Check your internet connection');
      console.log('2. Verify the cluster hostname in your connection string');
    } else if (error.message.includes('timeout')) {
      console.log('\n🔧 TIMEOUT ERROR:');
      console.log('1. Check your internet connection');
      console.log('2. Try connecting from a different network');
      console.log('3. Increase the timeout in connection options');
    }
    
    console.log('\n📋 Your connection string format should be:');
    console.log('mongodb+srv://username:password@cluster.xxxxx.mongodb.net/database_name?retryWrites=true&w=majority');
  }
}

console.log('🚀 Starting database test...\n');
testDatabase();