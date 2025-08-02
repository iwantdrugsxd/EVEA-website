// evea-backend/final-drive-check.js
// This will definitively tell you if you're using Shared Drive or Personal Drive

require('dotenv').config();

async function finalDriveCheck() {
  try {
    console.log('🔍 FINAL DRIVE TYPE CHECK');
    console.log('=========================');
    
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    console.log('📁 Current GOOGLE_DRIVE_FOLDER_ID:', folderId);
    
    // Import and test with your exact service
    const { google } = require('googleapis');
    
    // Use exact same auth as your service
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\n/g, '\n');
    
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: privateKey,
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file'
      ]
    });
    
    const drive = google.drive({ version: 'v3', auth });
    
    console.log('\n🔍 Checking drive type...');
    
    const response = await drive.files.get({
      fileId: folderId,
      fields: 'id,name,mimeType,driveId,parents',
      supportsAllDrives: true
    });
    
    console.log('\n📊 DEFINITIVE RESULT:');
    console.log('======================================');
    console.log('📁 Folder Name:', response.data.name);
    console.log('📁 Folder ID:', response.data.id);
    console.log('🌐 Drive ID:', response.data.driveId || 'NONE');
    
    if (response.data.driveId) {
      console.log('\n✅ RESULT: This IS a SHARED DRIVE! 🎉');
      console.log('✅ Your storage quota error should be fixed');
      console.log('✅ Make sure your service account is added to this Shared Drive');
      console.log('\n🔧 If still getting errors, restart your server');
    } else {
      console.log('\n❌ RESULT: This is a PERSONAL DRIVE! 🚨');
      console.log('❌ This WILL cause storage quota errors');
      console.log('❌ Service accounts CANNOT upload files to Personal Drive');
      console.log('\n💡 MANDATORY FIX REQUIRED:');
      console.log('You MUST create a proper Shared Drive');
    }
    
    console.log('\n📋 SHARED DRIVE CREATION STEPS:');
    console.log('================================');
    console.log('1. Go to Google Drive (drive.google.com)');
    console.log('2. Look for "Shared drives" in LEFT SIDEBAR');
    console.log('3. Click "+" next to "Shared drives"');
    console.log('4. Click "New shared drive"');
    console.log('5. Name it "EVEA Documents"');
    console.log('6. Click "Create"');
    console.log('7. Click "Manage members" (person icon)');
    console.log('8. Add your service account email as Manager');
    console.log('9. Copy the NEW folder ID from URL');
    console.log('10. Update GOOGLE_DRIVE_FOLDER_ID in .env');
    
    console.log('\n🎯 Your service account email:');
    console.log(process.env.GOOGLE_CLIENT_EMAIL);
    
  } catch (error) {
    console.error('\n❌ Check failed:', error.message);
    
    if (error.code === 403) {
      console.error('💡 Permission denied - service account needs access');
    } else if (error.code === 404) {
      console.error('💡 Folder not found - check folder ID');
    }
  }
}

finalDriveCheck();