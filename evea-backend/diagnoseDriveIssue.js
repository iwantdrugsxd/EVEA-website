// Create: scripts/diagnoseDriveIssue.js
// Run this to identify the exact problem

const { google } = require('googleapis');
require('dotenv').config();

async function diagnoseDriveIssue() {
  console.log('🔍 DIAGNOSING GOOGLE DRIVE STORAGE QUOTA ISSUE\n');
  
  try {
    // Initialize Drive API
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\n/g, '\n');
    
    const jwtClient = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: privateKey,
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file'
      ]
    });
    
    await jwtClient.authorize();
    const drive = google.drive({ version: 'v3', auth: jwtClient });
    
    console.log('✅ Authentication successful');
    console.log(`📧 Service Account: ${process.env.GOOGLE_CLIENT_EMAIL}\n`);
    
    // Step 1: Check target folder details
    console.log('📁 STEP 1: Analyzing Target Folder');
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    console.log(`🆔 Target Folder ID: ${folderId}`);
    
    const folderDetails = await drive.files.get({
      fileId: folderId,
      fields: 'id,name,mimeType,driveId,parents,owners,permissionIds,capabilities',
      supportsAllDrives: true
    });
    
    console.log(`📂 Folder Name: ${folderDetails.data.name}`);
    console.log(`🔗 Folder Type: ${folderDetails.data.mimeType}`);
    
    // Critical: Check if it's a Shared Drive
    if (folderDetails.data.driveId) {
      console.log(`✅ SHARED DRIVE: ${folderDetails.data.driveId}`);
    } else {
      console.log(`🚨 PERSONAL DRIVE DETECTED!`);
      console.log(`   This is likely causing your storage quota error.`);
    }
    
    console.log(`👥 Owners: ${JSON.stringify(folderDetails.data.owners || 'N/A')}`);
    console.log(`🔐 Capabilities: ${JSON.stringify(folderDetails.data.capabilities || 'N/A')}`);
    
    // Step 2: Check permissions
    console.log('\n🔐 STEP 2: Checking Permissions');
    
    try {
      const permissions = await drive.permissions.list({
        fileId: folderId,
        fields: 'permissions(id,type,role,emailAddress)',
        supportsAllDrives: true
      });
      
      console.log('📋 Current Permissions:');
      permissions.data.permissions.forEach(perm => {
        console.log(`   - ${perm.emailAddress || perm.type}: ${perm.role}`);
        if (perm.emailAddress === process.env.GOOGLE_CLIENT_EMAIL) {
          console.log(`     ✅ Service account found with role: ${perm.role}`);
        }
      });
      
    } catch (permError) {
      console.log(`❌ Cannot list permissions: ${permError.message}`);
    }
    
    // Step 3: Test file creation with detailed error tracking
    console.log('\n📄 STEP 3: Testing File Upload');
    
    try {
      // First, try creating a simple text file
      const testContent = `Test file created at ${new Date().toISOString()}`;
      const testFileName = `diagnostic_test_${Date.now()}.txt`;
      
      console.log(`📤 Attempting to upload: ${testFileName}`);
      
      const uploadResult = await drive.files.create({
        resource: {
          name: testFileName,
          parents: [folderId]
        },
        media: {
          mimeType: 'text/plain',
          body: testContent
        },
        fields: 'id,name,size,parents',
        supportsAllDrives: true
      });
      
      console.log(`✅ Upload successful!`);
      console.log(`🆔 File ID: ${uploadResult.data.id}`);
      console.log(`📏 File Size: ${uploadResult.data.size} bytes`);
      
      // Clean up test file
      await drive.files.delete({
        fileId: uploadResult.data.id,
        supportsAllDrives: true
      });
      
      console.log(`🗑️ Test file cleaned up`);
      
    } catch (uploadError) {
      console.log(`❌ Upload failed: ${uploadError.message}`);
      console.log(`📊 Error Code: ${uploadError.code}`);
      console.log(`📊 Error Details: ${JSON.stringify(uploadError.errors || [])}`);
      
      // Analyze the specific error
      if (uploadError.message.includes('storage quota') || 
          uploadError.message.includes('storageQuotaExceeded')) {
        console.log('\n🚨 STORAGE QUOTA ERROR ANALYSIS:');
        
        if (!folderDetails.data.driveId) {
          console.log('   ❌ ROOT CAUSE: Personal Drive folder detected');
          console.log('   💡 SOLUTION: Switch to Shared Drive folder');
          console.log('   📋 STEPS:');
          console.log('      1. Create a Google Shared Drive');
          console.log('      2. Create a folder in the Shared Drive');
          console.log('      3. Add service account as Content Manager');
          console.log('      4. Update GOOGLE_DRIVE_FOLDER_ID to Shared Drive folder');
        } else {
          console.log('   ❌ UNUSUAL: Shared Drive detected but still quota error');
          console.log('   💡 POSSIBLE CAUSES:');
          console.log('      - Shared Drive storage full');
          console.log('      - Service account role insufficient');
          console.log('      - Workspace admin limits');
        }
      }
    }
    
    // Step 4: Check drive usage/quota if possible
    console.log('\n💾 STEP 4: Checking Drive Usage');
    
    try {
      const aboutInfo = await drive.about.get({
        fields: 'storageQuota,user'
      });
      
      if (aboutInfo.data.storageQuota) {
        console.log('📊 Storage Info:');
        console.log(`   Used: ${aboutInfo.data.storageQuota.usage || 'N/A'}`);
        console.log(`   Limit: ${aboutInfo.data.storageQuota.limit || 'N/A'}`);
        console.log(`   Usage in Drive: ${aboutInfo.data.storageQuota.usageInDrive || 'N/A'}`);
      } else {
        console.log('ℹ️ Storage quota information not available for service account');
      }
      
    } catch (aboutError) {
      console.log(`ℹ️ Could not fetch storage info: ${aboutError.message}`);
    }
    
    // Step 5: Final recommendations
    console.log('\n📋 DIAGNOSIS COMPLETE');
    console.log('\n🎯 RECOMMENDATIONS:');
    
    if (!folderDetails.data.driveId) {
      console.log('1. 🚨 CRITICAL: Change to Shared Drive folder');
      console.log('   - Your current folder is in a personal Drive');
      console.log('   - Service accounts have no storage quota in personal drives');
      console.log('   - This is 100% the cause of your error');
    } else {
      console.log('1. ✅ Using Shared Drive (good)');
      console.log('2. 🔍 Check Shared Drive storage limits');
      console.log('3. 🔍 Verify service account role (should be Content Manager or Manager)');
    }
    
  } catch (error) {
    console.error('❌ Diagnostic failed:', error.message);
  }
}

// Run the diagnostic
diagnoseDriveIssue().catch(console.error);

// Usage: node scripts/diagnoseDriveIssue.js