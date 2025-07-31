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

      // Create JWT client
      const jwtClient = new google.auth.JWT(
        process.env.GOOGLE_CLIENT_EMAIL,
        null,
        process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/drive.file']
      );

      // Authorize the client
      await jwtClient.authorize();
      console.log('✅ Google Drive authorization successful');

      // Create Drive instance
      this.drive = google.drive({ version: 'v3', auth: jwtClient });
      this.initialized = true;

      // Test connection
      await this.testConnection();
      
      console.log('✅ Google Drive Service initialized successfully');
      return true;

    } catch (error) {
      console.error('❌ Google Drive initialization failed:', error);
      throw new Error(`Google Drive initialization failed: ${error.message}`);
    }
  }

  // Test Google Drive connection
  async testConnection() {
    try {
      console.log('🔍 Testing Google Drive connection...');
      
      const response = await this.drive.about.get({
        fields: 'user'
      });
      
      console.log('✅ Google Drive connection test successful');
      console.log('👤 Connected as:', response.data.user?.emailAddress);
      return true;

    } catch (error) {
      console.error('❌ Google Drive connection test failed:', error);
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

  // Upload file to Google Drive
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

      console.log('🚀 Starting upload to Google Drive...');

      // Upload file to Google Drive with retry logic
      let uploadResponse;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          uploadResponse = await this.drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id,name,webViewLink,webContentLink,size,createdTime,parents'
          });
          break; // Success, exit retry loop
        } catch (uploadError) {
          retryCount++;
          console.warn(`⚠️ Upload attempt ${retryCount} failed:`, uploadError.message);
          
          if (retryCount >= maxRetries) {
            throw uploadError;
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          
          // Recreate stream for retry
          const retryBufferStream = new stream.PassThrough();
          retryBufferStream.end(file.buffer);
          media.body = retryBufferStream;
        }
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
          fields: 'id,name,size'
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
      
      if (error.message.includes('insufficient authentication scopes')) {
        errorMessage = 'Google Drive authentication scope insufficient';
      } else if (error.message.includes('quotaExceeded')) {
        errorMessage = 'Google Drive storage quota exceeded';
      } else if (error.message.includes('rateLimitExceeded')) {
        errorMessage = 'Google Drive rate limit exceeded, please try again later';
      } else if (error.message.includes('File buffer is missing')) {
        errorMessage = 'File data is missing or corrupted';
      } else if (error.code === 'ENOTFOUND') {
        errorMessage = 'Network connection failed';
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
        fields: 'id,name,webViewLink,webContentLink,size,createdTime,mimeType'
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
        fileId: fileId
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
        pageSize: options.pageSize || 100
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