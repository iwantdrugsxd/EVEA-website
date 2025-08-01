require('dotenv').config();

console.log('🔑 Private Key Deep Analysis');
console.log('============================');

const rawKey = process.env.GOOGLE_PRIVATE_KEY;
console.log('Raw key length:', rawKey.length);

// Test the exact transformation your service does
const processedKey = rawKey.replace(/\\n/g, '\n');
console.log('Processed key length:', processedKey.length);

console.log('\n📝 Raw key (first 100 chars):');
console.log(JSON.stringify(rawKey.substring(0, 100)));

console.log('\n📝 Raw key (last 100 chars):');
console.log(JSON.stringify(rawKey.substring(rawKey.length - 100)));

console.log('\n🔄 After \\n replacement (first 100 chars):');
console.log(JSON.stringify(processedKey.substring(0, 100)));

console.log('\n🔄 After \\n replacement (last 100 chars):');
console.log(JSON.stringify(processedKey.substring(processedKey.length - 100)));

// Test if it looks like a valid PEM format
const lines = processedKey.split('\n');
console.log('\n📋 Key structure analysis:');
console.log('Total lines after split:', lines.length);
console.log('First line:', JSON.stringify(lines[0]));
console.log('Last line:', JSON.stringify(lines[lines.length - 1]));

// Check for common formatting issues
console.log('\n🔍 Common formatting checks:');
console.log('Starts with BEGIN:', processedKey.startsWith('-----BEGIN PRIVATE KEY-----'));
console.log('Ends with END:', processedKey.endsWith('-----END PRIVATE KEY-----'));
console.log('Has Windows line endings (\\r\\n):', processedKey.includes('\r\n'));
console.log('Has extra spaces:', processedKey.includes('  '));

// Test direct Google JWT creation with detailed logging
console.log('\n🧪 Testing Google JWT with processed key...');

try {
  const { google } = require('googleapis');
  
  // Create JWT with detailed error catching
  const jwtClient = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    processedKey,  // Use the processed key
    ['https://www.googleapis.com/auth/drive.file']
  );
  
  console.log('JWT created. Email set to:', jwtClient.email);
  console.log('JWT created. Has key:', !!jwtClient.key);
  console.log('JWT created. Key type:', typeof jwtClient.key);
  
} catch (error) {
  console.error('❌ JWT creation failed:', error.message);
}