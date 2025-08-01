require('dotenv').config();

console.log('🧪 Environment Variable Test');
console.log('============================');

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

console.log('\n📧 Google Drive Service Account:');
console.log('GOOGLE_CLIENT_EMAIL:', process.env.GOOGLE_CLIENT_EMAIL);
console.log('GOOGLE_PRIVATE_KEY exists:', !!process.env.GOOGLE_PRIVATE_KEY);
console.log('GOOGLE_PRIVATE_KEY length:', process.env.GOOGLE_PRIVATE_KEY?.length || 'undefined');
console.log('GOOGLE_DRIVE_FOLDER_ID:', process.env.GOOGLE_DRIVE_FOLDER_ID);

console.log('\n🔑 Google OAuth (for login):');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);

console.log('\n📄 .env file location check:');
console.log('Current working directory:', process.cwd());
console.log('Expected .env location:', process.cwd() + '/.env');

// Test if .env file exists
const fs = require('fs');
const path = require('path');
const envPath = path.join(process.cwd(), '.env');

try {
  const envExists = fs.existsSync(envPath);
  console.log('.env file exists:', envExists);
  
  if (envExists) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('.env file size:', envContent.length, 'characters');
    console.log('Contains GOOGLE_CLIENT_EMAIL:', envContent.includes('GOOGLE_CLIENT_EMAIL'));
  }
} catch (error) {
  console.log('Error reading .env file:', error.message);
}