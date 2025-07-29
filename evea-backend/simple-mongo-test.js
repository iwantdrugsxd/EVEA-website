// simple-mongo-test.js - Clean test without deprecated options
const mongoose = require('mongoose');
require('dotenv').config();

console.log('🧪 Simple MongoDB Connection Test');
console.log('==================================');

async function simpleTest() {
  try {
    console.log('📍 Testing with your credentials:');
    console.log('   Username: EVEA-BACKEND');
    console.log('   Database: evea');
    console.log('   Cluster: user.hf5zeco.mongodb.net');
    
    console.log('\n🔄 Connecting to MongoDB...');
    
    // Simple connection with minimal options
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });
    
    console.log('✅ SUCCESS! MongoDB Atlas connected');
    
    // Test basic database operation
    const TestSchema = new mongoose.Schema({ 
      message: String, 
      timestamp: { type: Date, default: Date.now } 
    });
    
    const TestModel = mongoose.model('ConnectionTest', TestSchema);
    
    console.log('🧪 Testing database operations...');
    
    // Create test document
    const testDoc = await TestModel.create({ 
      message: 'EVEA Backend connection test successful!' 
    });
    console.log('✅ Test document created with ID:', testDoc._id);
    
    // Read the document back
    const foundDoc = await TestModel.findById(testDoc._id);
    console.log('✅ Document retrieved:', foundDoc.message);
    
    // Clean up - delete test document
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Test document cleaned up');
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    
    console.log('\n🎉 PERFECT! Your MongoDB setup is working completely!');
    console.log('✅ You can now start your EVEA backend server');
    console.log('✅ Run: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Connection test failed!');
    console.error('Error:', error.message);
    
    // Specific error handling
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Authentication Issue:');
      console.log('1. Verify username is exactly: EVEA-BACKEND');
      console.log('2. Verify password is exactly: Cherry');
      console.log('3. Check Database Access in MongoDB Atlas');
    } else if (error.message.includes('IP') || error.message.includes('not authorized')) {
      console.log('\n🔧 Network Access Issue:');
      console.log('1. Go to MongoDB Atlas → Network Access');
      console.log('2. Make sure your IP address is whitelisted');
      console.log('3. Or allow access from anywhere (0.0.0.0/0)');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n🔧 DNS/Connection Issue:');
      console.log('1. Check your internet connection');
      console.log('2. Try again in a few minutes');
    } else {
      console.log('\n🔧 Unexpected Error:');
      console.log('Please share this error message for further help');
    }
  }
}

simpleTest();