require('dotenv').config();

console.log('🧪 Google Drive Environment Test');
console.log('================================');

const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY;
const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

console.log('📧 Client Email:', clientEmail);
console.log('📧 Is service account format:', clientEmail?.includes('.iam.gserviceaccount.com'));

console.log('\n🔑 Private Key Info:');
console.log('- Exists:', !!privateKey);
console.log('- Length:', privateKey?.length || 0);
console.log('- Starts correctly:', privateKey?.startsWith('"-----BEGIN PRIVATE KEY-----'));
console.log('- Ends correctly:', privateKey?.endsWith('-----END PRIVATE KEY-----\n"'));

console.log('\n📁 Folder ID:', folderId);
console.log('📁 Length:', folderId?.length || 0);

// Test private key format
if (privateKey) {
  console.log('\n🔍 Private Key Analysis:');
  console.log('First 50 chars:', privateKey.substring(0, 50));
  console.log('Last 50 chars:', privateKey.substring(privateKey.length - 50));
  
  // Check for common formatting issues
  const hasQuotes = privateKey.startsWith('"') && privateKey.endsWith('"');
  const hasNewlines = privateKey.includes('\\n');
  
  console.log('Has quotes:', hasQuotes);
  console.log('Has \\n characters:', hasNewlines);
}