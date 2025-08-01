require('dotenv').config();

const fs = require('fs');
const path = require('path');

// Read the actual .env file content
const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

// Find the GOOGLE_PRIVATE_KEY line
const lines = envContent.split('\n');
const privateKeyLine = lines.find(line => line.startsWith('GOOGLE_PRIVATE_KEY'));

console.log('🔍 Raw .env file analysis:');
console.log('Private key line from file:');
console.log('---');
console.log(privateKeyLine);
console.log('---');
console.log('Line length:', privateKeyLine?.length);
console.log('Starts with quote:', privateKeyLine?.includes('GOOGLE_PRIVATE_KEY="'));

// Show what Node.js actually loaded
console.log('\n📝 What Node.js loaded:');
console.log('Environment variable value:');
console.log('---');
console.log(process.env.GOOGLE_PRIVATE_KEY);
console.log('---');