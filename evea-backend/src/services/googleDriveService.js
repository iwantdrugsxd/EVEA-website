// evea-backend/src/services/googleDriveService.js
const { google } = require('googleapis');
const stream = require('stream');
const path = require('path');

class GoogleDriveService {
  constructor() {
    this.drive = null;
    this.initialized = false;
  }

  // Initialize Google Drive API
  async initialize() {
    try {
      console.log('🔧 Initializing Google Drive Service...');

      // Check required environment variables
      const requiredEnvVars = ['GOOGLE_CLIENT_EMAIL', 'GOOGLE_PRIVATE_KEY', 'GOOGLE_DRIVE_FOLDER_ID'];
      const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
      
      if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
      }

      console.log('✅ Environment variables check passed');

      // Prepare credentials
      const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
      
      // Better private key processing
      let privateKey = process.env.GOOGLE_PRIVATE_KEY;
      
      // Handle if private key is wrapped in quotes
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      }
      
      // Replace escaped newlines with actual newlines
      privateKey = privateKey.replace(/\\n/g, '\n');

      console.log('📧 Client Email:', clientEmail);
      console.log('🔑 Private Key Length:', privateKey.length);
      console.log('🔑 Private Key starts with BEGIN:', privateKey.includes('-----BEGIN PRIVATE KEY-----'));
      console.log('🔑 Private Key ends with END:', privateKey.includes('-----END PRIVATE KEY-----'));

      // Validate private key format
      if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
        console.error('⚠️ Private key format appears invalid - missing BEGIN marker');
        console.error('🔍 First 50 chars of private key:', privateKey.substring(0, 50));
        throw new Error('Invalid private key format - missing BEGIN marker');
      }

      if (!privateKey.includes('-----END PRIVATE KEY-----')) {
        console.error('⚠️ Private key format appears invalid - missing END marker');
        console.error('🔍 Last 50 chars of private key:', privateKey.substring(privateKey.length - 50));
        throw new Error('Invalid private key format - missing END marker');
      }

      console.log('✅ Private key format validation passed');

      // Create JWT client with SHARED DRIVE SCOPES
      console.log('🔐 Creating JWT client...');
      
      const jwtClient = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: [
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/drive.file'
        ]
      });

      console.log('✅ JWT client created');
      console.log('📧 JWT email set to:', jwtClient.email);
      console.log('🔑 JWT has key:', !!jwtClient.key);

      // Validate that the key was properly set
      if (!jwtClient.key) {
        throw new Error('Private key was not properly set on JWT client');
      }

      // Authorize the client
      console.log('🔐 Authorizing JWT client...');
      
      const authResult = await jwtClient.authorize();
      console.log('✅ JWT authorization successful');
      console.log('🎫 Access token received:', !!authResult.access_token);

      // Create Drive instance
      console.log('🚗 Creating Google Drive instance...');
      
      try {
        this.drive = google.drive({ 
          version: 'v3', 
          auth: jwtClient 
        });
        
        console.log('✅ Google Drive instance created');
        console.log('🚗 Drive instance type:', typeof this.drive);
        console.log('🚗 Drive instance has about method:', !!this.drive.about);
        
      } catch (driveError) {
        console.error('❌ Failed to create Google Drive instance:', driveError);
        throw new Error(`Drive instance creation failed: ${driveError.message}`);
      }

      this.initialized = true;

      // Test connection
      console.log('🧪 Testing Google Drive connection...');
      await this.testConnection();
      
      console.log('✅ Google Drive Service initialized successfully');
      return true;

    } catch (error) {
      console.error('❌ Google Drive initialization failed:', error);
      console.error('📊 Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n')[0] // First line of stack trace
      });
      throw new Error(`Google Drive initialization failed: ${error.message}`);
    }
  }

  // Test Google Drive connection
  async testConnection() {
    try {
      console.log('🔍 Testing Google Drive connection...');
      
      // Double-check drive instance
      if (!this.drive) {
        throw new Error('Drive instance is null - initialization failed');
      }

      if (!this.drive.about) {
        throw new Error('Drive instance missing about method - API may not be enabled');
      }

      console.log('🚗 Drive instance validated, making API call...');
      
      const response = await this.drive.about.get({
        fields: 'user'
      });
      
      console.log('✅ Google Drive connection test successful');
      console.log('👤 Connected as:', response.data.user?.emailAddress);
      console.log('👤 Display name:', response.data.user?.displayName);
      
      // Test if we can access the specified folder/shared drive
      const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
      console.log('🔍 Testing access to target folder/drive...');
      
      try {
        const folderResponse = await this.drive.files.get({
          fileId: folderId,
          fields: 'id,name,mimeType,driveId',
          supportsAllDrives: true // IMPORTANT: This enables shared drive support
        });
        
        console.log('✅ Target folder/drive accessible:');
        console.log('📁 Name:', folderResponse.data.name);
        console.log('📁 Type:', folderResponse.data.mimeType);
        console.log('🌐 Drive Type:', folderResponse.data.driveId ? 'Shared Drive' : 'Regular Drive');
        
        if (folderResponse.data.driveId) {
          console.log('🌐 Shared Drive ID:', folderResponse.data.driveId);
        }
        
      } catch (accessError) {
        console.error('❌ Cannot access target folder/drive:', accessError.message);
        console.error('💡 Make sure the service account has been added to the shared drive with proper permissions');
        throw new Error(`Cannot access folder ${folderId}: ${accessError.message}`);
      }
      
      return true;

    } catch (error) {
      console.error('❌ Google Drive connection test failed:', error);
      console.error('📊 Connection test error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        status: error.status
      });
      
      // Provide specific error guidance
      if (error.code === 403) {
        console.error('💡 Error 403: Either Google Drive API not enabled OR service account not added to shared drive');
      } else if (error.code === 401) {
        console.error('💡 Error 401: Authentication failed - check service account credentials');
      } else if (error.message.includes('API not enabled')) {
        console.error('💡 Google Drive API is not enabled in your Google Cloud project');
      }
      
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

      // Search for existing folder with shared drive support
      const searchResponse = await this.drive.files.list({
        q: `name='${folderName}' and parents in '${parentFolderId}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)',
        supportsAllDrives: true,
        includeItemsFromAllDrives: true
      });

      if (searchResponse.data.files && searchResponse.data.files.length > 0) {
        const existingFolder = searchResponse.data.files[0];
        console.log(`✅ Found existing vendor folder: ${existingFolder.id}`);
        return {
          id: existingFolder.id,
          name: existingFolder.name
        };
      }

      // Create new folder with shared drive support
      console.log(`📂 Creating new vendor folder: ${folderName}`);
      
      const folderMetadata = {
        name: folderName,
        parents: [parentFolderId],
        mimeType: 'application/vnd.google-apps.folder'
      };

      const createResponse = await this.drive.files.create({
        resource: folderMetadata,
        fields: 'id, name',
        supportsAllDrives: true
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

  // Upload file to Google Drive with Shared Drive support
  async uploadFile(file, fileName, folderId = null) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      console.log(`📁 Uploading file to Google Drive: ${fileName}`);
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

      console.log('🚀 Starting upload to Google Drive (with shared drive support)...');

      // Upload file with shared drive support - NO RETRY LOGIC for storage quota errors
      let uploadResponse;
      
      try {
        uploadResponse = await this.drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: 'id,name,webViewLink,webContentLink,size,createdTime,parents',
          supportsAllDrives: true // CRITICAL: This enables shared drive support
        });
      } catch (uploadError) {
        console.error('❌ Upload failed:', uploadError.message);
        
        // Handle specific errors
        if (uploadError.message.includes('Service Accounts do not have storage quota')) {
          throw new Error('Service Account storage quota issue. Please ensure you are using a Shared Drive and the service account has been added as a member with proper permissions.');
        } else if (uploadError.code === 403) {
          throw new Error('Permission denied. Ensure the service account has access to the target folder/shared drive.');
        } else if (uploadError.code === 404) {
          throw new Error('Target folder not found. Check if the folder ID is correct and accessible.');
        }
        
        throw uploadError;
      }

      if (!uploadResponse || !uploadResponse.data) {
        throw new Error('Upload response is invalid');
      }

      const uploadedFile = uploadResponse.data;

      console.log(`✅ File uploaded successfully to Google Drive`);
      console.log(`🆔 File ID: ${uploadedFile.id}`);
      console.log(`🔗 View Link: ${uploadedFile.webViewLink}`);

      // Verify upload by checking file existence
      try {
        await this.drive.files.get({
          fileId: uploadedFile.id,
          fields: 'id,name,size',
          supportsAllDrives: true
        });
        console.log('✅ Upload verification successful');
      } catch (verifyError) {
        console.warn('⚠️ Upload verification failed:', verifyError.message);
      }

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
      console.error('❌ Google Drive upload error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to upload to Google Drive';
      
      if (error.message.includes('Service Account storage quota issue')) {
        errorMessage = 'Service Account storage quota issue. Use a Shared Drive instead';
      } else if (error.message.includes('insufficient authentication scopes')) {
        errorMessage = 'Google Drive authentication scope insufficient';
      } else if (error.message.includes('quotaExceeded')) {
        errorMessage = 'Google Drive storage quota exceeded';
      } else if (error.message.includes('rateLimitExceeded')) {
        errorMessage = 'Google Drive rate limit exceeded, please try again later';
      } else if (error.message.includes('File buffer is missing')) {
        errorMessage = 'File data is missing or corrupted';
      } else if (error.code === 'ENOTFOUND') {
        errorMessage = 'Network connection failed';
      } else if (error.code === 403) {
        errorMessage = 'Permission denied - check shared drive access';
      } else if (error.code === 404) {
        errorMessage = 'Target folder not found';
      }
      
      throw new Error(`${errorMessage}: ${error.message}`);
    }
  }

  // Get file from Google Drive
  async getFile(fileId) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      console.log(`📥 Retrieving file from Google Drive: ${fileId}`);

      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'id,name,webViewLink,webContentLink,size,createdTime,mimeType',
        supportsAllDrives: true
      });

      console.log(`✅ Retrieved file: ${response.data.name}`);

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
      console.error('❌ Error retrieving file from Google Drive:', error);
      throw new Error(`Failed to retrieve file from Google Drive: ${error.message}`);
    }
  }

  // Delete file from Google Drive
  async deleteFile(fileId) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      console.log(`🗑️ Deleting file from Google Drive: ${fileId}`);

      await this.drive.files.delete({
        fileId: fileId,
        supportsAllDrives: true
      });

      console.log(`✅ File deleted successfully: ${fileId}`);
      return true;

    } catch (error) {
      console.error('❌ Error deleting file from Google Drive:', error);
      throw new Error(`Failed to delete file from Google Drive: ${error.message}`);
    }
  }

  // List files in folder
  async listFiles(folderId, options = {}) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      console.log(`📋 Listing files in folder: ${folderId}`);

      const query = `parents in '${folderId}' and trashed=false`;
      
      const response = await this.drive.files.list({
        q: query,
        fields: 'files(id,name,webViewLink,size,createdTime,mimeType)',
        orderBy: options.orderBy || 'createdTime desc',
        pageSize: options.pageSize || 100,
        supportsAllDrives: true,
        includeItemsFromAllDrives: true
      });

      const files = response.data.files || [];
      console.log(`✅ Found ${files.length} files in folder`);

      return files.map(file => ({
        fileId: file.id,
        fileName: file.name,
        webViewLink: file.webViewLink,
        size: file.size,
        createdTime: file.createdTime,
        mimeType: file.mimeType,
        driveUrl: `https://drive.google.com/file/d/${file.id}/view`
      }));

    } catch (error) {
      console.error('❌ Error listing files:', error);
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }
  
}


// Create singleton instance
const googleDriveService = new GoogleDriveService();

// Export functions
module.exports = {
  // Initialize service
  initializeGoogleDrive: () => googleDriveService.initialize(),
  
  // Upload file
  uploadToGoogleDrive: (file, fileName, folderId) => 
    googleDriveService.uploadFile(file, fileName, folderId),
  
  // Get or create vendor folder
  getOrCreateVendorFolder: (vendorId, businessName) => 
    googleDriveService.getOrCreateVendorFolder(vendorId, businessName),
  
  // Get file
  getFileFromGoogleDrive: (fileId) => 
    googleDriveService.getFile(fileId),
  
  // Delete file
  deleteFileFromGoogleDrive: (fileId) => 
    googleDriveService.deleteFile(fileId),
  
  // List files
  listFilesInFolder: (folderId, options) => 
    googleDriveService.listFiles(folderId, options),
  
  // Test connection
  testGoogleDriveConnection: () => 
    googleDriveService.testConnection()
};