// evea-backend/src/services/googleDriveService.js
// REPLACE YOUR ENTIRE CURRENT FILE WITH THIS OAUTH VERSION

const { google } = require('googleapis');
const stream = require('stream');

class OAuthGoogleDriveService {
  constructor() {
    this.drive = null;
    this.oauth2Client = null;
    this.initialized = false;
  }

  // Initialize Google Drive API with OAuth
  async initialize() {
    try {
      console.log('🔧 Initializing OAuth Google Drive Service...');

      // Check required environment variables
      const requiredEnvVars = [
        'GOOGLE_OAUTH_CLIENT_ID', 
        'GOOGLE_OAUTH_CLIENT_SECRET', 
        'GOOGLE_OAUTH_REDIRECT_URI',
        'GOOGLE_DRIVE_FOLDER_ID'
      ];
      
      const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
      
      if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
      }

      console.log('✅ Environment variables check passed');

      // Create OAuth2 client
      this.oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        process.env.GOOGLE_OAUTH_REDIRECT_URI
      );

      console.log('✅ OAuth2 client created');

      // Check if we have a refresh token
      if (!process.env.GOOGLE_REFRESH_TOKEN) {
        console.error('❌ GOOGLE_REFRESH_TOKEN not found in .env');
        console.error('🔧 You need to complete the one-time OAuth setup');
        console.error('📋 Steps:');
        console.error('   1. Start your server');
        console.error('   2. Visit: http://localhost:5000/setup-google-auth');
        console.error('   3. Complete OAuth flow');
        console.error('   4. Copy refresh token to .env');
        throw new Error('GOOGLE_REFRESH_TOKEN missing - complete OAuth setup first');
      }

      // Set credentials with refresh token
      this.oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
      });

      console.log('✅ OAuth credentials set with refresh token');

      // Create Drive instance
      this.drive = google.drive({ 
        version: 'v3', 
        auth: this.oauth2Client 
      });

      console.log('✅ Google Drive instance created');

      this.initialized = true;

      // Test connection
      console.log('🧪 Testing Google Drive connection...');
      await this.testConnection();
      
      console.log('✅ OAuth Google Drive Service initialized successfully');
      return true;

    } catch (error) {
      console.error('❌ OAuth Google Drive initialization failed:', error);
      throw error;
    }
  }

  // Test Google Drive connection
  async testConnection() {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      console.log('🔍 Testing OAuth Google Drive connection...');
      
      const response = await this.drive.about.get({
        fields: 'user,storageQuota'
      });
      
      console.log('✅ Google Drive connection test successful');
      console.log('👤 Connected as:', response.data.user?.emailAddress);
      console.log('👤 Display name:', response.data.user?.displayName);
      
      // Test folder access
      const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
      console.log('🔍 Testing access to target folder...');
      
      try {
        const folderResponse = await this.drive.files.get({
          fileId: folderId,
          fields: 'id,name,mimeType'
        });
        
        console.log('✅ Target folder accessible:');
        console.log('📁 Name:', folderResponse.data.name);
        console.log('📁 Type:', folderResponse.data.mimeType);
        console.log('🎉 OAuth setup successful - can upload to personal drive!');
        
      } catch (accessError) {
        console.error('❌ Cannot access target folder:', accessError.message);
        throw new Error(`Cannot access folder ${folderId}: ${accessError.message}`);
      }
      
      return true;

    } catch (error) {
      console.error('❌ OAuth connection test failed:', error);
      throw error;
    }
  }

  // Create or get vendor folder
  async getOrCreateVendorFolder(vendorId, businessName) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      console.log(`📁 Getting/Creating vendor folder for: ${businessName} (${vendorId})`);

      const folderName = `${businessName}_${vendorId}`.replace(/[^a-zA-Z0-9_\-\s]/g, '');
      const parentFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

      // Search for existing folder
      const searchResponse = await this.drive.files.list({
        q: `name='${folderName}' and parents in '${parentFolderId}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)'
      });

      if (searchResponse.data.files && searchResponse.data.files.length > 0) {
        const existingFolder = searchResponse.data.files[0];
        console.log(`✅ Found existing vendor folder: ${existingFolder.id}`);
        return {
          id: existingFolder.id,
          name: existingFolder.name
        };
      }

      // Create new folder
      console.log(`📂 Creating new vendor folder: ${folderName}`);
      
      const folderMetadata = {
        name: folderName,
        parents: [parentFolderId],
        mimeType: 'application/vnd.google-apps.folder'
      };

      const createResponse = await this.drive.files.create({
        resource: folderMetadata,
        fields: 'id, name'
      });

      console.log(`✅ Created new vendor folder: ${createResponse.data.id}`);
      
      return {
        id: createResponse.data.id,
        name: createResponse.data.name
      };

    } catch (error) {
      console.error('❌ Error creating/getting vendor folder:', error);
      throw new Error(`Failed to create vendor folder: ${error.message}`);
    }
  }

  // Upload file to Google Drive (OAuth - works with personal drive!)
  async uploadFile(file, fileName, folderId = null) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      console.log(`📁 Uploading file to Google Drive (OAuth): ${fileName}`);
      console.log(`📊 File details:`, {
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        type: file.mimetype,
        originalName: file.originalname
      });

      // Validate file
      if (!file.buffer) {
        throw new Error('File buffer is missing');
      }

      if (file.size === 0) {
        throw new Error('File is empty');
      }

      // Use provided folder or default
      const targetFolderId = folderId || process.env.GOOGLE_DRIVE_FOLDER_ID;
      
      if (!targetFolderId) {
        throw new Error('No target folder specified');
      }

      // Sanitize filename
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._\-]/g, '_');

      // Create file metadata
      const fileMetadata = {
        name: sanitizedFileName,
        parents: [targetFolderId]
      };

      // Create readable stream from buffer
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);

      // Create media object
      const media = {
        mimeType: file.mimetype,
        body: bufferStream
      };

      console.log('🚀 Starting OAuth upload to personal Google Drive...');

      // Upload file with OAuth (works with personal drive!)
      const uploadResponse = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id,name,webViewLink,webContentLink,size,createdTime,parents'
      });

      if (!uploadResponse || !uploadResponse.data) {
        throw new Error('Upload response is invalid');
      }

      const uploadedFile = uploadResponse.data;

      console.log(`✅ File uploaded successfully to personal Google Drive!`);
      console.log(`🆔 File ID: ${uploadedFile.id}`);
      console.log(`🔗 View Link: ${uploadedFile.webViewLink}`);

      return {
        fileId: uploadedFile.id,
        fileName: uploadedFile.name,
        webViewLink: uploadedFile.webViewLink,
        webContentLink: uploadedFile.webContentLink,
        size: uploadedFile.size,
        uploadedAt: uploadedFile.createdTime,
        driveUrl: `https://drive.google.com/file/d/${uploadedFile.id}/view`,
        parentFolder: uploadedFile.parents ? uploadedFile.parents[0] : null
      };

    } catch (error) {
      console.error('❌ OAuth upload error:', error);
      
      let errorMessage = 'Failed to upload to Google Drive';
      
      if (error.message.includes('invalid_grant')) {
        errorMessage = 'OAuth token expired. Please re-authenticate.';
      } else if (error.code === 403) {
        errorMessage = 'Permission denied. Check OAuth scopes.';
      } else if (error.code === 401) {
        errorMessage = 'Authentication failed. Refresh OAuth token.';
      }
      
      throw new Error(`${errorMessage}: ${error.message}`);
    }
  }

  // Get OAuth authorization URL
  getAuthUrl() {
    if (!this.oauth2Client) {
      this.oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        process.env.GOOGLE_OAUTH_REDIRECT_URI
      );
    }

    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.metadata'
      ],
      prompt: 'consent' // Force consent to get refresh token
    });

    return authUrl;
  }

  // Exchange authorization code for tokens
  async getTokens(code) {
    if (!this.oauth2Client) {
      this.oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        process.env.GOOGLE_OAUTH_REDIRECT_URI
      );
    }

    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }

  // Get file from Google Drive
  async getFile(fileId) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'id,name,webViewLink,webContentLink,size,createdTime,mimeType'
      });

      return {
        fileId: response.data.id,
        fileName: response.data.name,
        webViewLink: response.data.webViewLink,
        webContentLink: response.data.webContentLink,
        size: response.data.size,
        createdTime: response.data.createdTime,
        mimeType: response.data.mimeType,
        driveUrl: `https://drive.google.com/file/d/${response.data.id}/view`
      };

    } catch (error) {
      console.error('❌ Error retrieving file:', error);
      throw new Error(`Failed to retrieve file: ${error.message}`);
    }
  }

  // Delete file from Google Drive
  async deleteFile(fileId) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      await this.drive.files.delete({
        fileId: fileId
      });

      console.log(`✅ File deleted successfully: ${fileId}`);
      return true;

    } catch (error) {
      console.error('❌ Error deleting file:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}

// Create singleton instance
const oauthGoogleDriveService = new OAuthGoogleDriveService();

// Export functions (same interface as before, so vendor controller doesn't need changes)
module.exports = {
  // Initialize service
  initializeGoogleDrive: () => oauthGoogleDriveService.initialize(),
  
  // Upload file (OAuth version - works with personal drive!)
  uploadToGoogleDrive: (file, fileName, folderId) => 
    oauthGoogleDriveService.uploadFile(file, fileName, folderId),
  
  // Get or create vendor folder
  getOrCreateVendorFolder: (vendorId, businessName) => 
    oauthGoogleDriveService.getOrCreateVendorFolder(vendorId, businessName),
  
  // Get file
  getFileFromGoogleDrive: (fileId) => 
    oauthGoogleDriveService.getFile(fileId),
  
  // Delete file
  deleteFileFromGoogleDrive: (fileId) => 
    oauthGoogleDriveService.deleteFile(fileId),
  
  // Test connection
  testGoogleDriveConnection: () => 
    oauthGoogleDriveService.testConnection(),

  // OAuth specific methods
  getOAuthAuthUrl: () => oauthGoogleDriveService.getAuthUrl(),
  getOAuthTokens: (code) => oauthGoogleDriveService.getTokens(code),
  
  // Get service instance
  getServiceInstance: () => oauthGoogleDriveService
};