// evea-backend/src/services/googleDriveService.js
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const stream = require('stream');

class GoogleDriveService {
  constructor() {
    this.auth = null;
    this.drive = null;
    this.initialized = false;
  }

  // Initialize Google Drive API
  async initialize() {
    try {
      console.log('🔧 Initializing Google Drive service...');

      // Check if service account file exists
      const serviceAccountPath = path.join(__dirname, '../config/google-service-account.json');
      
      if (!fs.existsSync(serviceAccountPath)) {
        console.warn('⚠️ Google service account file not found, using environment variables');
        
        // Use environment variables if service account file doesn't exist
        if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
          throw new Error('Google Drive credentials not configured');
        }

        this.auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          },
          scopes: ['https://www.googleapis.com/auth/drive.file']
        });
      } else {
        // Use service account file
        this.auth = new google.auth.GoogleAuth({
          keyFile: serviceAccountPath,
          scopes: ['https://www.googleapis.com/auth/drive.file']
        });
      }

      this.drive = google.drive({ version: 'v3', auth: this.auth });
      this.initialized = true;
      
      console.log('✅ Google Drive service initialized successfully');
      
      // Test the connection
      await this.testConnection();
      
    } catch (error) {
      console.error('❌ Failed to initialize Google Drive service:', error);
      this.initialized = false;
      throw error;
    }
  }

  // Test the connection
  async testConnection() {
    try {
      const response = await this.drive.about.get({ fields: 'user' });
      console.log('✅ Google Drive connection test successful');
      console.log('📧 Connected as:', response.data.user?.emailAddress);
    } catch (error) {
      console.error('❌ Google Drive connection test failed:', error);
      throw error;
    }
  }

  // Upload file to Google Drive
  async uploadFile(file, fileName, folderId = null) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      console.log(`📁 Uploading file to Google Drive: ${fileName}`);
      console.log(`📊 File size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      console.log(`📋 File type: ${file.mimetype}`);

      // Ensure we have a folder ID
      const targetFolderId = folderId || process.env.GOOGLE_DRIVE_FOLDER_ID;
      
      if (!targetFolderId) {
        throw new Error('Google Drive folder ID not configured');
      }

      // Create file metadata
      const fileMetadata = {
        name: fileName,
        parents: [targetFolderId]
      };

      // Create media object from buffer
      const media = {
        mimeType: file.mimetype,
        body: stream.Readable.from(file.buffer)
      };

      // Upload file to Google Drive
      const response = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id,name,webViewLink,webContentLink,size,createdTime'
      });

      console.log(`✅ File uploaded successfully to Google Drive`);
      console.log(`🆔 File ID: ${response.data.id}`);
      console.log(`🔗 View Link: ${response.data.webViewLink}`);

      return {
        fileId: response.data.id,
        fileName: response.data.name,
        webViewLink: response.data.webViewLink,
        webContentLink: response.data.webContentLink,
        size: response.data.size,
        uploadedAt: response.data.createdTime,
        driveUrl: `https://drive.google.com/file/d/${response.data.id}/view`
      };

    } catch (error) {
      console.error('❌ Google Drive upload error:', error);
      throw new Error(`Failed to upload to Google Drive: ${error.message}`);
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
        fields: 'id,name,mimeType,size,createdTime,webViewLink'
      });

      console.log(`✅ File retrieved successfully: ${response.data.name}`);
      return response.data;

    } catch (error) {
      console.error('❌ Google Drive download error:', error);
      throw new Error(`Failed to retrieve from Google Drive: ${error.message}`);
    }
  }

  // Download file content from Google Drive
  async downloadFile(fileId) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      console.log(`📥 Downloading file content from Google Drive: ${fileId}`);

      const response = await this.drive.files.get({
        fileId: fileId,
        alt: 'media'
      });

      console.log(`✅ File content downloaded successfully`);
      return response.data;

    } catch (error) {
      console.error('❌ Google Drive download error:', error);
      throw new Error(`Failed to download from Google Drive: ${error.message}`);
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
      
      console.log(`✅ File deleted successfully from Google Drive`);
      return true;

    } catch (error) {
      console.error('❌ Google Drive delete error:', error);
      throw new Error(`Failed to delete from Google Drive: ${error.message}`);
    }
  }

  // Create a folder in Google Drive
  async createFolder(folderName, parentFolderId = null) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      console.log(`📁 Creating folder in Google Drive: ${folderName}`);

      const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        ...(parentFolderId && { parents: [parentFolderId] })
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        fields: 'id,name,webViewLink'
      });

      console.log(`✅ Folder created successfully: ${response.data.id}`);
      return response.data;

    } catch (error) {
      console.error('❌ Google Drive folder creation error:', error);
      throw new Error(`Failed to create folder in Google Drive: ${error.message}`);
    }
  }

  // Generate shareable link for a file
  async generateShareableLink(fileId, permission = 'reader') {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      console.log(`🔗 Generating shareable link for file: ${fileId}`);

      // Create permission for anyone with the link
      await this.drive.permissions.create({
        fileId: fileId,
        resource: {
          role: permission,
          type: 'anyone'
        }
      });

      // Get the file with webViewLink
      const file = await this.drive.files.get({
        fileId: fileId,
        fields: 'webViewLink,webContentLink'
      });

      console.log(`✅ Shareable link generated successfully`);
      return {
        viewLink: file.data.webViewLink,
        downloadLink: file.data.webContentLink
      };

    } catch (error) {
      console.error('❌ Google Drive share link error:', error);
      throw new Error(`Failed to generate shareable link: ${error.message}`);
    }
  }

  // List files in a folder
  async listFiles(folderId, maxResults = 100) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      console.log(`📋 Listing files in folder: ${folderId}`);

      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        pageSize: maxResults,
        fields: 'files(id,name,mimeType,size,createdTime,webViewLink)'
      });

      console.log(`✅ Found ${response.data.files.length} files`);
      return response.data.files;

    } catch (error) {
      console.error('❌ Google Drive list files error:', error);
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }

  // Get folder info and create vendor-specific folder
  async getOrCreateVendorFolder(vendorId, vendorName) {
    try {
      const folderName = `Vendor_${vendorId}_${vendorName.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const mainFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

      if (!mainFolderId) {
        throw new Error('Main Google Drive folder ID not configured');
      }

      // Check if vendor folder already exists
      const existingFolders = await this.drive.files.list({
        q: `name='${folderName}' and '${mainFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id,name)'
      });

      if (existingFolders.data.files.length > 0) {
        console.log(`📁 Using existing vendor folder: ${existingFolders.data.files[0].id}`);
        return existingFolders.data.files[0];
      }

      // Create new vendor folder
      const newFolder = await this.createFolder(folderName, mainFolderId);
      console.log(`📁 Created new vendor folder: ${newFolder.id}`);
      return newFolder;

    } catch (error) {
      console.error('❌ Vendor folder creation error:', error);
      throw new Error(`Failed to get or create vendor folder: ${error.message}`);
    }
  }
}

// Create singleton instance
const googleDriveService = new GoogleDriveService();

// Export individual functions for backward compatibility
const uploadToGoogleDrive = async (file, fileName, folderId = null) => {
  return await googleDriveService.uploadFile(file, fileName, folderId);
};

const getFileFromDrive = async (fileId) => {
  return await googleDriveService.getFile(fileId);
};

const downloadFileFromDrive = async (fileId) => {
  return await googleDriveService.downloadFile(fileId);
};

const deleteFileFromDrive = async (fileId) => {
  return await googleDriveService.deleteFile(fileId);
};

const createDriveFolder = async (folderName, parentFolderId = null) => {
  return await googleDriveService.createFolder(folderName, parentFolderId);
};

const generateShareableLink = async (fileId, permission = 'reader') => {
  return await googleDriveService.generateShareableLink(fileId, permission);
};

const getOrCreateVendorFolder = async (vendorId, vendorName) => {
  return await googleDriveService.getOrCreateVendorFolder(vendorId, vendorName);
};

module.exports = {
  googleDriveService,
  uploadToGoogleDrive,
  getFileFromDrive,
  downloadFileFromDrive,
  deleteFileFromDrive,
  createDriveFolder,
  generateShareableLink,
  getOrCreateVendorFolder
};