// evea-backend/src/controllers/vendorController.js - COMPLETE FIXED VERSION
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor');
const VendorService = require('../models/VendorService');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
// ==================== REGISTRATION STEP 1 ====================
exports.registerVendorStep1 = async (req, res) => {
  try {
    console.log('🚀 Step 1 Registration Started');
    console.log('📦 Request Body Keys:', Object.keys(req.body));

    const {
      businessName,
      businessType,
      ownerName,
      email,
      phone,
      alternatePhone,
      businessAddress,
      businessDescription,
      establishedYear,
      website,
      socialMedia,
      gstNumber,
      panNumber,
      password
    } = req.body;

    // Validation
    if (!businessName || !ownerName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: businessName, ownerName, email, phone, password'
      });
    }

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({
      $or: [
        { 'contactInfo.email': email.toLowerCase() },
        { 'contactInfo.phone': phone },
        { 'verification.panNumber': panNumber?.toUpperCase() }
      ]
    });

    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: 'Vendor with this email, phone, or PAN number already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create vendor
    const vendor = new Vendor({
      businessInfo: {
        businessName: businessName.trim(),
        businessType: businessType || 'private_limited',
        ownerName: ownerName.trim(),
        businessDescription: businessDescription?.trim() || '',
        establishedYear: establishedYear ? parseInt(establishedYear) : null,
        website: website?.trim() || '',
        socialMedia: {
          instagram: socialMedia?.instagram || '',
          facebook: socialMedia?.facebook || '',
          youtube: socialMedia?.youtube || '',
          linkedin: socialMedia?.linkedin || ''
        }
      },
      contactInfo: {
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        alternatePhone: alternatePhone?.trim() || '',
        businessAddress: {
          street: businessAddress?.street?.trim() || '',
          city: businessAddress?.city?.trim() || '',
          state: businessAddress?.state?.trim() || '',
          pincode: businessAddress?.pincode?.trim() || '',
          country: businessAddress?.country?.trim() || 'India'
        }
      },
      verification: {
        gstNumber: gstNumber?.trim().toUpperCase() || '',
        panNumber: panNumber?.trim().toUpperCase() || '',
        documents: {},
        bankDetails: {}
      },
      authentication: {
        password: hashedPassword,
        isEmailVerified: false
      },
      registrationStep: 1,
      registrationStatus: 'pending_review',
      profileCompletion: 25,
      isActive: false
    });

    await vendor.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: vendor._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Step 1 completed successfully for vendor:', vendor._id);

    res.status(201).json({
      success: true,
      message: 'Step 1 completed successfully! Please upload your documents.',
      data: {
        vendorId: vendor._id,
        token,
        vendor: {
          id: vendor._id,
          businessName: vendor.businessInfo.businessName,
          email: vendor.contactInfo.email,
          registrationStatus: vendor.registrationStatus,
          profileCompletion: vendor.profileCompletion
        }
      }
    });

  } catch (error) {
    console.error('❌ Step 1 registration error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `This ${field === 'contactInfo.email' ? 'email' : 'information'} is already registered`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ==================== REGISTRATION STEP 2 - DOCUMENTS ====================
// ==================== REGISTRATION STEP 2 - DOCUMENTS (FIXED) ====================
const initializeDrive = () => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE, // Path to your service account JSON file
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    return google.drive({ version: 'v3', auth });
  } catch (error) {
    console.error('Failed to initialize Google Drive:', error);
    throw new Error('Google Drive initialization failed');
  }
};

// Upload file to Google Drive
const uploadToGoogleDrive = async (file, fileName, folderId = null) => {
  try {
    const drive = initializeDrive();
    
    const fileMetadata = {
      name: fileName,
      parents: folderId ? [folderId] : undefined, // Optional: specify folder
    };

    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path), // Use file.path for multer temporary files
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id,name,webViewLink,webContentLink',
    });

    // Make the file publicly viewable (adjust permissions as needed)
    await drive.permissions.create({
      fileId: response.data.id,
      resource: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return {
      fileId: response.data.id,
      fileName: response.data.name,
      webViewLink: response.data.webViewLink,
      downloadUrl: response.data.webContentLink,
    };
  } catch (error) {
    console.error('Google Drive upload error:', error);
    throw new Error(`Failed to upload ${fileName} to Google Drive`);
  }
};

// evea-backend/src/controllers/vendorController.js
// ONLY REPLACE THE uploadDocuments FUNCTION - keep everything else the same

// ==================== REGISTRATION STEP 2 - DOCUMENTS (GOOGLE DRIVE INTEGRATION) ====================
exports.uploadDocuments = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const files = req.files;

    console.log('📄 Document Upload Process Started');
    console.log('👥 Vendor ID:', vendorId);
    console.log('📁 Files received:', files ? Object.keys(files) : 'none');

    // Validate vendor ID
    if (!vendorId) {
      return res.status(400).json({
        success: false,
        message: 'Vendor ID is required'
      });
    }

    // Validate files
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded. Please select documents to upload.'
      });
    }

    // Find vendor
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found. Please try registering again.'
      });
    }

    // Check registration step
    if (vendor.registrationStep < 1) {
      return res.status(400).json({
        success: false,
        message: 'Please complete Step 1 first'
      });
    }

    // Document types mapping
    const documentTypes = {
      businessRegistration: 'Business Registration Certificate',
      gstCertificate: 'GST Certificate',
      panCard: 'PAN Card',
      bankStatement: 'Bank Statement',
      identityProof: 'Identity Proof'
    };

    // Validate file types and sizes
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const maxSizes = {
      businessRegistration: 5 * 1024 * 1024, // 5MB
      gstCertificate: 5 * 1024 * 1024,      // 5MB
      panCard: 2 * 1024 * 1024,             // 2MB
      bankStatement: 10 * 1024 * 1024,      // 10MB
      identityProof: 5 * 1024 * 1024        // 5MB
    };

    // Pre-validate all files before processing
    for (const [docType, fileArray] of Object.entries(files)) {
      if (fileArray && fileArray[0]) {
        const file = fileArray[0];
        
        // Check file type
        if (!allowedTypes.includes(file.mimetype)) {
          return res.status(400).json({
            success: false,
            message: `Invalid file type for ${documentTypes[docType]}. Only PDF, JPG, and PNG files are allowed.`
          });
        }
        
        // Check file size
        const maxSize = maxSizes[docType] || 5 * 1024 * 1024;
        if (file.size > maxSize) {
          return res.status(400).json({
            success: false,
            message: `File too large for ${documentTypes[docType]}. Maximum size: ${maxSize / (1024 * 1024)}MB`
          });
        }
        
        // Check if file is empty
        if (file.size === 0) {
          return res.status(400).json({
            success: false,
            message: `Empty file detected for ${documentTypes[docType]}`
          });
        }
        
        console.log(`✅ File validation passed: ${docType} - ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      }
    }

    // Initialize Google Drive service
    const { uploadToGoogleDrive, getOrCreateVendorFolder } = require('../services/googleDriveService');
    
    // Get or create vendor-specific folder
    let vendorFolder;
    try {
      vendorFolder = await getOrCreateVendorFolder(vendorId, vendor.businessInfo.businessName);
      console.log(`📁 Vendor folder ready: ${vendorFolder.id}`);
    } catch (folderError) {
      console.error('❌ Failed to create vendor folder:', folderError);
      return res.status(500).json({
        success: false,
        message: 'Failed to prepare document storage. Please try again.',
        error: process.env.NODE_ENV === 'development' ? folderError.message : undefined
      });
    }

    const updatedDocuments = { ...vendor.verification.documents };
    const uploadResults = [];
    const uploadErrors = [];

    // Process each uploaded file
    for (const [docType, fileArray] of Object.entries(files)) {
      if (fileArray && fileArray[0]) {
        const file = fileArray[0];
        
        try {
          console.log(`📎 Processing ${docType}: ${file.originalname}`);
          
          // Generate unique filename
          const timestamp = Date.now();
          const sanitizedBusinessName = vendor.businessInfo.businessName.replace(/[^a-zA-Z0-9]/g, '_');
          const fileExtension = file.originalname.split('.').pop();
          const uniqueFileName = `${sanitizedBusinessName}_${docType}_${timestamp}.${fileExtension}`;
          
          console.log(`📤 Uploading to Google Drive: ${uniqueFileName}`);
          
          // Upload to Google Drive
          const driveResult = await uploadToGoogleDrive(file, uniqueFileName, vendorFolder.id);
          
          console.log(`✅ Google Drive upload successful for ${docType}`);
          console.log(`🆔 File ID: ${driveResult.fileId}`);
          console.log(`🔗 View Link: ${driveResult.webViewLink}`);
          
          // Store document information with real Google Drive data
          const documentInfo = {
            originalName: file.originalname,
            storedName: uniqueFileName,
            mimeType: file.mimetype,
            size: file.size,
            uploadedAt: new Date(),
            verificationStatus: 'pending',
            // Google Drive specific fields
            fileId: driveResult.fileId,
            webViewLink: driveResult.webViewLink,
            webContentLink: driveResult.webContentLink || driveResult.downloadUrl,
            driveUrl: `https://drive.google.com/file/d/${driveResult.fileId}/view`,
            parentFolderId: vendorFolder.id,
            folderName: vendorFolder.name
          };

          updatedDocuments[docType] = documentInfo;
          uploadResults.push({
            documentType: docType,
            fileName: file.originalname,
            storedName: uniqueFileName,
            size: file.size,
            status: 'uploaded_to_drive',
            fileId: driveResult.fileId,
            driveUrl: `https://drive.google.com/file/d/${driveResult.fileId}/view`
          });

          console.log(`✅ Document processed successfully: ${docType}`);
          
        } catch (uploadError) {
          console.error(`❌ Failed to upload ${docType}:`, uploadError);
          uploadErrors.push({
            documentType: docType,
            fileName: file.originalname,
            error: uploadError.message
          });
          
          // Continue processing other files even if one fails
        }
      }
    }

    // Check if any uploads succeeded
    if (uploadResults.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'All document uploads failed. Please try again.',
        errors: uploadErrors,
        troubleshooting: [
          'Check your Google Drive configuration',
          'Verify service account permissions',
          'Ensure files are not corrupted',
          'Try with smaller file sizes'
        ]
      });
    }

    // Update vendor with document information
    vendor.verification.documents = updatedDocuments;
    vendor.registrationStep = 2;
    vendor.profileCompletion = 60;
    vendor.updatedAt = new Date();
    
    await vendor.save();

    const responseMessage = uploadErrors.length > 0 
      ? `Successfully uploaded ${uploadResults.length} document(s). ${uploadErrors.length} upload(s) failed.`
      : `Successfully uploaded ${uploadResults.length} document(s) to Google Drive. Please proceed to Step 3.`;

    console.log('✅ Document upload process completed');
    console.log(`📊 Success: ${uploadResults.length}, Errors: ${uploadErrors.length}`);

    res.json({
      success: true,
      message: responseMessage,
      data: {
        vendorId: vendor._id,
        uploadedDocuments: uploadResults,
        failedUploads: uploadErrors.length > 0 ? uploadErrors : undefined,
        registrationStep: vendor.registrationStep,
        profileCompletion: vendor.profileCompletion,
        nextStep: 'services-and-bank-details',
        googleDriveFolder: {
          folderId: vendorFolder.id,
          folderName: vendorFolder.name,
          folderUrl: `https://drive.google.com/drive/folders/${vendorFolder.id}`
        }
      }
    });

  } catch (error) {
    console.error('❌ Document upload error:', error);
    
    let errorMessage = 'Document upload failed. Please try again.';
    
    if (error.message.includes('Google Drive initialization failed')) {
      errorMessage = 'Google Drive service unavailable. Please contact support.';
    } else if (error.message.includes('authentication')) {
      errorMessage = 'Google Drive authentication failed. Please contact support.';
    } else if (error.message.includes('quotaExceeded')) {
      errorMessage = 'Storage quota exceeded. Please contact support.';
    } else if (error.message.includes('file too large')) {
      errorMessage = 'One or more files are too large. Please compress your files and try again.';
    } else if (error.message.includes('invalid file')) {
      errorMessage = 'Invalid file format detected. Please ensure all files are PDF, JPG, or PNG.';
    } else if (error.message.includes('network')) {
      errorMessage = 'Network connection error. Please check your internet connection and try again.';
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString(),
      vendorId: req.params.vendorId,
      troubleshooting: [
        'Verify Google Drive service account is configured',
        'Check GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY in .env',
        'Ensure GOOGLE_DRIVE_FOLDER_ID is valid',
        'Verify internet connectivity'
      ]
    });
  }
};

// ==================== REGISTRATION STEP 3 - SERVICES ====================
exports.registerVendorStep3 = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { services, bankDetails } = req.body;

    console.log('🎯 Step 3 Registration Process Started');
    console.log('👥 Vendor ID:', vendorId);

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    if (vendor.registrationStep < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please complete document upload first'
      });
    }

    // Update bank details if provided
    if (bankDetails) {
      console.log('🏦 Updating bank details');
      vendor.verification.bankDetails = {
        accountHolderName: bankDetails.accountHolderName?.trim(),
        accountNumber: bankDetails.accountNumber?.trim(),
        ifscCode: bankDetails.ifscCode?.trim().toUpperCase(),
        bankName: bankDetails.bankName?.trim(),
        branch: bankDetails.branch?.trim()
      };
    }

    // Complete registration
    vendor.registrationStatus = 'pending_approval';
    vendor.registrationStep = 3;
    vendor.profileCompletion = 100;
    vendor.submittedAt = new Date();
    vendor.updatedAt = new Date();
    
    await vendor.save();

    // Create vendor services if provided
    const createdServices = [];
    if (services && services.length > 0) {
      console.log(`🎪 Creating ${services.length} service(s)`);
      
      for (const service of services) {
        try {
          const vendorService = await VendorService.create({
            vendorId: vendor._id,
            serviceInfo: {
              title: service.title?.trim(),
              category: service.category,
              description: service.description?.trim(),
              eventTypes: service.eventTypes || []
            },
            pricing: {
              budgetRange: {
                min: parseInt(service.budgetRange?.min) || 0,
                max: parseInt(service.budgetRange?.max) || 0
              }
            },
            availability: {
              isActive: true,
              bookingEnabled: false // Will be enabled after approval
            },
            createdAt: new Date(),
            updatedAt: new Date()
          });

          createdServices.push({
            serviceId: vendorService._id,
            title: vendorService.serviceInfo.title,
            category: vendorService.serviceInfo.category
          });

          console.log(`✅ Service created: ${vendorService.serviceInfo.title}`);
        } catch (serviceError) {
          console.error('❌ Service creation error:', serviceError);
          // Continue with other services even if one fails
        }
      }
    }

    console.log('✅ Step 3 registration completed successfully');

    res.json({
      success: true,
      message: 'Registration completed successfully! Your application is now under review.',
      data: {
        vendorId: vendor._id,
        businessName: vendor.businessInfo.businessName,
        registrationStatus: vendor.registrationStatus,
        registrationStep: vendor.registrationStep,
        profileCompletion: vendor.profileCompletion,
        services: createdServices,
        submittedAt: vendor.submittedAt,
        nextSteps: [
          'Your application will be reviewed within 2-3 business days',
          'You will receive an email notification once approved',
          'After approval, you can start accepting bookings'
        ]
      }
    });

  } catch (error) {
    console.error('❌ Step 3 registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration completion failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ==================== VENDOR LOGIN ====================
exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Vendor login attempt:', email);

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find vendor
    const vendor = await Vendor.findOne({ 'contactInfo.email': email.toLowerCase() });
    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, vendor.authentication.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: vendor._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Update last login
    vendor.authentication.lastLogin = new Date();
    await vendor.save();

    console.log('✅ Vendor login successful:', vendor._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        vendor: {
          id: vendor._id,
          businessName: vendor.businessInfo.businessName,
          email: vendor.contactInfo.email,
          registrationStatus: vendor.registrationStatus,
          registrationStep: vendor.registrationStep,
          profileCompletion: vendor.profileCompletion,
          isActive: vendor.isActive
        }
      }
    });

  } catch (error) {
    console.error('❌ Vendor login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: error.message
    });
  }
};

// ==================== GET VENDOR PROFILE ====================
exports.getVendorProfile = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    console.log('👤 Getting profile for vendor:', vendorId);

    const vendor = await Vendor.findById(vendorId).select('-authentication.password');
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      data: {
        vendor: {
          id: vendor._id,
          businessInfo: vendor.businessInfo,
          contactInfo: vendor.contactInfo,
          verification: {
            gstNumber: vendor.verification.gstNumber,
            panNumber: vendor.verification.panNumber,
            documents: Object.keys(vendor.verification.documents || {}),
            bankDetails: vendor.verification.bankDetails ? {
              accountHolderName: vendor.verification.bankDetails.accountHolderName,
              bankName: vendor.verification.bankDetails.bankName,
              // Don't expose sensitive banking info
            } : null
          },
          registrationStatus: vendor.registrationStatus,
          registrationStep: vendor.registrationStep,
          profileCompletion: vendor.profileCompletion,
          isActive: vendor.isActive,
          createdAt: vendor.createdAt,
          updatedAt: vendor.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

// ==================== UPDATE VENDOR PROFILE ====================
exports.updateVendorProfile = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const updates = req.body;

    console.log('✏️ Updating profile for vendor:', vendorId);

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Update allowed fields
    if (updates.businessInfo) {
      Object.assign(vendor.businessInfo, updates.businessInfo);
    }

    if (updates.contactInfo) {
      // Don't allow email changes through this endpoint
      const { email, ...otherContactInfo } = updates.contactInfo;
      Object.assign(vendor.contactInfo, otherContactInfo);
    }

    vendor.updatedAt = new Date();
    await vendor.save();

    console.log('✅ Profile updated successfully');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        vendor: {
          id: vendor._id,
          businessInfo: vendor.businessInfo,
          contactInfo: vendor.contactInfo,
          updatedAt: vendor.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// ==================== GET REGISTRATION STATUS ====================
exports.getRegistrationStatus = async (req, res) => {
  try {
    const { vendorId } = req.params;
    console.log('📊 Getting registration status for vendor:', vendorId);

    const vendor = await Vendor.findById(vendorId).select(
      'registrationStatus registrationStep profileCompletion businessInfo.businessName contactInfo.email submittedAt approvedAt rejectedAt'
    );
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      data: {
        vendorId: vendor._id,
        businessName: vendor.businessInfo.businessName,
        email: vendor.contactInfo.email,
        registrationStatus: vendor.registrationStatus,
        registrationStep: vendor.registrationStep,
        profileCompletion: vendor.profileCompletion,
        submittedAt: vendor.submittedAt,
        approvedAt: vendor.approvedAt,
        rejectedAt: vendor.rejectedAt,
        statusDescription: getStatusDescription(vendor.registrationStatus, vendor.registrationStep)
      }
    });

  } catch (error) {
    console.error('❌ Get registration status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registration status',
      error: error.message
    });
  }
};

// ==================== RESEND VERIFICATION EMAIL ====================
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { vendorId } = req.params;
    
    console.log('📧 Resending verification email for vendor:', vendorId);

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    if (vendor.authentication.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Here you would implement email sending logic
    console.log('📧 Verification email would be sent to:', vendor.contactInfo.email);

    res.json({
      success: true,
      message: 'Verification email sent successfully',
      data: {
        email: vendor.contactInfo.email,
        sentAt: new Date()
      }
    });

  } catch (error) {
    console.error('❌ Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email',
      error: error.message
    });
  }
};

// ==================== GET DASHBOARD STATS ====================
exports.getDashboardStats = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    console.log('📊 Getting dashboard stats for vendor:', vendorId);

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Get services count
    const servicesCount = await VendorService.countDocuments({ vendorId });

    // Mock stats for demonstration
    const stats = {
      totalServices: servicesCount,
      totalBookings: 0,
      totalRevenue: 0,
      averageRating: 0,
      profileCompletion: vendor.profileCompletion,
      registrationStatus: vendor.registrationStatus,
      recentActivity: [],
      monthlyStats: {
        bookingsThisMonth: 0,
        revenueThisMonth: 0,
        newClientsThisMonth: 0
      }
    };

    res.json({
      success: true,
      data: {
        stats,
        vendor: {
          businessName: vendor.businessInfo.businessName,
          registrationStatus: vendor.registrationStatus,
          isActive: vendor.isActive
        }
      }
    });

  } catch (error) {
    console.error('❌ Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

// ==================== GET VENDOR SERVICES ====================
exports.getVendorServices = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    console.log('🎪 Getting services for vendor:', vendorId);

    const services = await VendorService.find({ vendorId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        services,
        totalServices: services.length
      }
    });

  } catch (error) {
    console.error('❌ Get vendor services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

// ==================== PLACEHOLDER IMPLEMENTATIONS ====================
exports.createVendorService = async (req, res) => {
  res.json({ 
    success: true, 
    message: 'Create service endpoint - to be implemented',
    data: { serviceId: 'mock-service-id' }
  });
};

exports.updateVendorService = async (req, res) => {
  res.json({ success: true, message: 'Update service endpoint - to be implemented' });
};

exports.deleteVendorService = async (req, res) => {
  res.json({ success: true, message: 'Delete service endpoint - to be implemented' });
};

// ==================== HELPER FUNCTIONS ====================
function getStatusDescription(status, step) {
  switch (status) {
    case 'pending_review':
      if (step === 1) return 'Basic information submitted. Please upload documents.';
      if (step === 2) return 'Documents uploaded. Please complete services setup.';
      return 'Registration in progress.';
    case 'pending_approval':
      return 'Application submitted and under review. You will be notified within 2-3 business days.';
    case 'approved':
      return 'Application approved! You can start accepting bookings.';
    case 'rejected':
      return 'Application rejected. Please check your email for details.';
    case 'needs_revision':
      return 'Additional information required. Please check your email for details.';
    default:
      return 'Registration status unknown.';
  }
}