// services/googleDriveService.js
const { google } = require('googleapis');
const stream = require('stream');

class GoogleDriveService {
  constructor() {
    this.drive = null;
    this.auth = null;
    this.initializeAuth();
  }

  async initializeAuth() {
    try {
      // Initialize Google Auth
      this.auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE, // Path to service account key file
        scopes: ['https://www.googleapis.com/auth/drive'],
      });

      // Alternative: Use service account credentials from environment variables
      if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE && process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
        this.auth = google.auth.fromJSON(credentials);
        this.auth.scopes = ['https://www.googleapis.com/auth/drive'];
      }

      this.drive = google.drive({ version: 'v3', auth: this.auth });
      console.log('Google Drive API initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Drive API:', error);
      throw error;
    }
  }

  async uploadToGoogleDrive({ fileName, fileBuffer, mimeType, folderId = null }) {
    try {
      if (!this.drive) {
        await this.initializeAuth();
      }

      // Create a readable stream from buffer
      const bufferStream = new stream.PassThrough();
      bufferStream.end(fileBuffer);

      // File metadata
      const fileMetadata = {
        name: fileName,
        parents: folderId ? [folderId] : undefined,
      };

      // Upload file
      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: {
          mimeType: mimeType,
          body: bufferStream,
        },
        fields: 'id, name, size, mimeType, createdTime',
      });

      // Set file permissions (optional - make it accessible by link)
      await this.drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      console.log(`File uploaded successfully: ${fileName} (ID: ${response.data.id})`);
      
      return {
        id: response.data.id,
        name: response.data.name,
        size: response.data.size,
        mimeType: response.data.mimeType,
        createdTime: response.data.createdTime,
        webViewLink: `https://drive.google.com/file/d/${response.data.id}/view`,
        downloadLink: `https://drive.google.com/uc?export=download&id=${response.data.id}`
      };

    } catch (error) {
      console.error('Error uploading file to Google Drive:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFromGoogleDrive(fileId) {
    try {
      if (!this.drive) {
        await this.initializeAuth();
      }

      await this.drive.files.delete({
        fileId: fileId,
      });

      console.log(`File deleted successfully: ${fileId}`);
      return { success: true, fileId };

    } catch (error) {
      console.error('Error deleting file from Google Drive:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async getFileInfo(fileId) {
    try {
      if (!this.drive) {
        await this.initializeAuth();
      }

      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'id, name, size, mimeType, createdTime, modifiedTime',
      });

      return response.data;

    } catch (error) {
      console.error('Error getting file info from Google Drive:', error);
      throw new Error(`Failed to get file info: ${error.message}`);
    }
  }

  async downloadFile(fileId) {
    try {
      if (!this.drive) {
        await this.initializeAuth();
      }

      const response = await this.drive.files.get({
        fileId: fileId,
        alt: 'media',
      });

      return response.data;

    } catch (error) {
      console.error('Error downloading file from Google Drive:', error);
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }

  async createFolder(folderName, parentFolderId = null) {
    try {
      if (!this.drive) {
        await this.initializeAuth();
      }

      const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentFolderId ? [parentFolderId] : undefined,
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        fields: 'id, name',
      });

      console.log(`Folder created successfully: ${folderName} (ID: ${response.data.id})`);
      return response.data;

    } catch (error) {
      console.error('Error creating folder in Google Drive:', error);
      throw new Error(`Failed to create folder: ${error.message}`);
    }
  }

  async listFiles(folderId = null, maxResults = 10) {
    try {
      if (!this.drive) {
        await this.initializeAuth();
      }

      const query = folderId ? `'${folderId}' in parents` : undefined;

      const response = await this.drive.files.list({
        q: query,
        pageSize: maxResults,
        fields: 'nextPageToken, files(id, name, size, mimeType, createdTime)',
      });

      return response.data.files;

    } catch (error) {
      console.error('Error listing files from Google Drive:', error);
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }

  async shareFile(fileId, email, role = 'reader') {
    try {
      if (!this.drive) {
        await this.initializeAuth();
      }

      const response = await this.drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: role,
          type: 'user',
          emailAddress: email,
        },
        fields: 'id',
      });

      console.log(`File shared successfully with ${email}`);
      return response.data;

    } catch (error) {
      console.error('Error sharing file:', error);
      throw new Error(`Failed to share file: ${error.message}`);
    }
  }
}

// Create a singleton instance
const googleDriveService = new GoogleDriveService();

// Export individual functions for easier use
module.exports = {
  uploadToGoogleDrive: googleDriveService.uploadToGoogleDrive.bind(googleDriveService),
  deleteFromGoogleDrive: googleDriveService.deleteFromGoogleDrive.bind(googleDriveService),
  getFileInfo: googleDriveService.getFileInfo.bind(googleDriveService),
  downloadFile: googleDriveService.downloadFile.bind(googleDriveService),
  createFolder: googleDriveService.createFolder.bind(googleDriveService),
  listFiles: googleDriveService.listFiles.bind(googleDriveService),
  shareFile: googleDriveService.shareFile.bind(googleDriveService),
  googleDriveService
};

