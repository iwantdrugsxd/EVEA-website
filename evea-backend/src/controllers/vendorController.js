// controllers/vendorController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor');
const VendorService = require('../models/VendorService');
const { uploadToGoogleDrive, deleteFromGoogleDrive } = require('../services/googleDriveService');
// const { sendVendorWelcomeEmail, sendVendorApprovalEmail } = require('../services/emailService');
const { generateVendorId } = require('../utils/helpers');

// ==================== REGISTRATION CONTROLLERS ====================

// Step 1: Register basic business information
exports.registerVendorStep1 = async (req, res) => {
  try {
    const {
      businessInfo,
      password,
      primaryCategories
    } = req.body;

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ 
      'businessInfo.email': businessInfo.email 
    });

    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: 'Vendor with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create vendor
    const vendor = new Vendor({
      businessInfo: {
        ...businessInfo,
        email: businessInfo.email.toLowerCase()
      },
      password: hashedPassword,
      primaryCategories,
      registrationStatus: 'pending_documents',
      profileCompletion: 25 // 25% after step 1
    });

    // Set location coordinates if address provided
    if (businessInfo.businessAddress?.city) {
      // You can integrate with a geocoding service here
      // For now, we'll set default coordinates
      vendor.location.coordinates = [77.1025, 28.7041]; // Delhi coordinates as default
    }

    await vendor.save();

    // Generate JWT token for temporary authentication during registration
    const tempToken = jwt.sign(
      { vendorId: vendor._id, step: 1 },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Step 1 completed successfully',
      data: {
        vendorId: vendor._id,
        tempToken,
        nextStep: 2,
        profileCompletion: vendor.profileCompletion
      }
    });

  } catch (error) {
    console.error('Step 1 registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Step 2: Upload documents to Google Drive
exports.uploadDocuments = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { 
      registrationNumber, 
      gstNumber, 
      panNumber, 
      bankDetails 
    } = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    if (vendor.registrationStatus !== 'pending_documents') {
      return res.status(400).json({
        success: false,
        message: 'Invalid registration step'
      });
    }

    // Update verification data
    vendor.verification.registrationNumber = registrationNumber;
    vendor.verification.gstNumber = gstNumber;
    vendor.verification.panNumber = panNumber;
    vendor.verification.bankDetails = bankDetails;

    // Process uploaded files
    const documents = {};
    const documentTypes = ['businessRegistration', 'gstCertificate', 'panCard', 'bankStatement', 'identityProof'];

    for (const docType of documentTypes) {
      if (req.files[docType] && req.files[docType][0]) {
        const file = req.files[docType][0];
        
        try {
          // Upload to Google Drive
          const driveResponse = await uploadToGoogleDrive({
            fileName: `${vendorId}_${docType}_${Date.now()}.${file.originalname.split('.').pop()}`,
            fileBuffer: file.buffer,
            mimeType: file.mimetype,
            folderId: process.env.VENDOR_DOCUMENTS_FOLDER_ID
          });

          documents[docType] = {
            driveFileId: driveResponse.id,
            fileName: file.originalname,
            uploadDate: new Date(),
            verified: false
          };

        } catch (uploadError) {
          console.error(`Error uploading ${docType}:`, uploadError);
          return res.status(500).json({
            success: false,
            message: `Failed to upload ${docType}`,
            error: uploadError.message
          });
        }
      }
    }

    // Update vendor with document information
    vendor.verification.documents = {
      ...vendor.verification.documents,
      ...documents
    };

    vendor.registrationStatus = 'pending_review';
    vendor.profileCompletion = 75; // 75% after step 2

    await vendor.save();

    // Send notification email to admin
    // await sendAdminNotificationEmail(vendor);

    res.json({
      success: true,
      message: 'Documents uploaded successfully',
      data: {
        vendorId: vendor._id,
        nextStep: 3,
        profileCompletion: vendor.profileCompletion,
        uploadedDocuments: Object.keys(documents)
      }
    });

  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Document upload failed',
      error: error.message
    });
  }
};

// Step 3: Register services and packages
exports.registerVendorStep3 = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { services } = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Create vendor services
    const createdServices = [];
    for (const serviceData of services) {
      const service = new VendorService({
        vendorId: vendor._id,
        serviceInfo: serviceData.serviceInfo,
        packages: serviceData.packages,
        availability: serviceData.availability,
        searchTags: serviceData.searchTags || []
      });

      await service.save();
      createdServices.push(service);
    }

    // Update vendor registration completion
    vendor.profileCompletion = 100;
    await vendor.save();

    // Send welcome email
    await sendVendorWelcomeEmail(vendor);

    res.json({
      success: true,
      message: 'Registration completed successfully! Your application is under review.',
      data: {
        vendorId: vendor._id,
        registrationStatus: vendor.registrationStatus,
        profileCompletion: vendor.profileCompletion,
        servicesCreated: createdServices.length
      }
    });

  } catch (error) {
    console.error('Step 3 registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Service registration failed',
      error: error.message
    });
  }
};

// ==================== AUTHENTICATION CONTROLLERS ====================

// Vendor login
exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find vendor
    const vendor = await Vendor.findOne({ 
      'businessInfo.email': email.toLowerCase() 
    });

    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, vendor.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if vendor is approved
    if (vendor.registrationStatus === 'rejected') {
      return res.status(403).json({
        success: false,
        message: 'Your application has been rejected. Please contact support.'
      });
    }

    if (vendor.registrationStatus === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        vendorId: vendor._id,
        email: vendor.businessInfo.email,
        status: vendor.registrationStatus
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Update last login
    vendor.lastLoginAt = new Date();
    await vendor.save();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        vendor: {
          id: vendor._id,
          businessName: vendor.businessInfo.businessName,
          email: vendor.businessInfo.email,
          registrationStatus: vendor.registrationStatus,
          profileCompletion: vendor.profileCompletion
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// ==================== DASHBOARD CONTROLLERS ====================

// Get vendor profile
exports.getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.vendorId)
      .select('-password');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      data: { vendor }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const vendorId = req.vendor.vendorId;

    // Get vendor services
    const services = await VendorService.find({ vendorId });
    
    // Calculate statistics
    const stats = {
      totalServices: services.length,
      activeServices: services.filter(s => s.isActive).length,
      totalBookings: services.reduce((sum, s) => sum + s.metrics.totalBookings, 0),
      completedEvents: services.reduce((sum, s) => sum + s.metrics.completedEvents, 0),
      averageRating: services.reduce((sum, s) => sum + s.metrics.rating, 0) / services.length || 0,
      totalReviews: services.reduce((sum, s) => sum + s.metrics.reviewCount, 0),
      // Add more statistics as needed
    };

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

// ==================== SERVICE MANAGEMENT CONTROLLERS ====================

// Get vendor services
exports.getVendorServices = async (req, res) => {
  try {
    const services = await VendorService.find({ 
      vendorId: req.vendor.vendorId 
    });

    res.json({
      success: true,
      data: { services }
    });

  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

// Create vendor service
exports.createVendorService = async (req, res) => {
  try {
    const serviceData = req.body;
    
    // Process uploaded media files
    const media = {};
    
    if (req.files.coverImage && req.files.coverImage[0]) {
      const coverImage = await uploadToGoogleDrive({
        fileName: `service_cover_${Date.now()}.${req.files.coverImage[0].originalname.split('.').pop()}`,
        fileBuffer: req.files.coverImage[0].buffer,
        mimeType: req.files.coverImage[0].mimetype,
        folderId: process.env.VENDOR_MEDIA_FOLDER_ID
      });
      media.coverImage = coverImage.id;
    }

    // Process gallery images
    if (req.files.gallery) {
      media.gallery = [];
      for (const file of req.files.gallery) {
        const galleryImage = await uploadToGoogleDrive({
          fileName: `gallery_${Date.now()}_${Math.random().toString(36).substring(7)}.${file.originalname.split('.').pop()}`,
          fileBuffer: file.buffer,
          mimeType: file.mimetype,
          folderId: process.env.VENDOR_MEDIA_FOLDER_ID
        });
        media.gallery.push(galleryImage.id);
      }
    }

    // Create service
    const service = new VendorService({
      vendorId: req.vendor.vendorId,
      ...serviceData,
      media
    });

    await service.save();

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: { service }
    });

  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service',
      error: error.message
    });
  }
};

// ==================== UTILITY CONTROLLERS ====================

// Get registration status
exports.getRegistrationStatus = async (req, res) => {
  try {
    const { vendorId } = req.params;
    
    const vendor = await Vendor.findById(vendorId)
      .select('registrationStatus profileCompletion submittedAt approvedAt rejectedAt adminNotes');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      data: { 
        registrationStatus: vendor.registrationStatus,
        profileCompletion: vendor.profileCompletion,
        submittedAt: vendor.submittedAt,
        approvedAt: vendor.approvedAt,
        rejectedAt: vendor.rejectedAt,
        adminNotes: vendor.adminNotes
      }
    });

  } catch (error) {
    console.error('Get registration status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registration status',
      error: error.message
    });
  }
};

// Additional controllers for update, delete operations...
exports.updateVendorProfile = async (req, res) => {
  // Implementation for updating vendor profile
};

exports.updateVendorService = async (req, res) => {
  // Implementation for updating vendor service
};

exports.deleteVendorService = async (req, res) => {
  // Implementation for deleting vendor service
};

exports.resendVerificationEmail = async (req, res) => {
  // Implementation for resending verification email
};