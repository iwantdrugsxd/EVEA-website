require('dotenv').config();

console.log('🧪 Google Drive Service Direct Test');
console.log('===================================');

// Test environment variables first
console.log('📧 GOOGLE_CLIENT_EMAIL:', process.env.GOOGLE_CLIENT_EMAIL);
console.log('🔑 GOOGLE_PRIVATE_KEY exists:', !!process.env.GOOGLE_PRIVATE_KEY);
console.log('🔑 GOOGLE_PRIVATE_KEY length:', process.env.GOOGLE_PRIVATE_KEY?.length);
console.log('📁 GOOGLE_DRIVE_FOLDER_ID:', process.env.GOOGLE_DRIVE_FOLDER_ID);

// Now test the Google Auth JWT creation directly
console.log('\n🔧 Testing Google JWT Client Creation...');

try {
  const { google } = require('googleapis');
  
  console.log('📦 Googleapis imported successfully');
  
  // Test the exact same code as your service
  const jwtClient = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/drive.file']
  );
  
  console.log('✅ JWT Client created successfully');
  console.log('👤 Client email set to:', jwtClient.email);
  console.log('🔑 Has private key:', !!jwtClient.key);
  
  // Test authorization
  console.log('\n🔐 Testing authorization...');
  
  jwtClient.authorize((err, tokens) => {
    if (err) {
      console.error('❌ Authorization failed:', err.message);
      console.error('💡 Full error:', err);
    } else {
      console.log('✅ Authorization successful!');
      console.log('🎫 Access token received:', !!tokens.access_token);
    }
  });
  
} catch (error) {
  console.error('❌ JWT Client creation failed:', error.message);
  console.error('💡 Full error:', error);
}