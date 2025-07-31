// evea-backend/src/controllers/vendorController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Vendor = require('../models/Vendor');
const VendorService = require('../models/VendorService');

// Helper function to generate JWT token
const generateToken = (vendorId) => {
  return jwt.sign(
    { id: vendorId },
    process.env.JWT_SECRET || 'fallback-secret-key',
    { expiresIn: '7d' }
  );
};

// ==================== REGISTRATION STEP 1 ====================
exports.registerVendorStep1 = async (req, res) => {
  try {
    console.log('📝 Step 1 Registration Started');
    console.log('📦 Request Body:', { ...req.body, password: '[HIDDEN]' });

    const {
      businessName,
      businessType,
      ownerName,
      email,
      phone,
      alternatePhone,
      password,
      businessAddress,
      businessDescription,
      establishedYear,
      website,
      socialMedia,
      gstNumber,
      panNumber
    } = req.body;

    // Validate required fields
    const requiredFields = {
      businessName: 'Business name',
      businessType: 'Business type',
      ownerName: 'Owner name',
      email: 'Email address',
      phone: 'Phone number',
      password: 'Password',
      panNumber: 'PAN number'
    };

    const missingFields = [];
    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!req.body[field] || req.body[field].toString().trim() === '') {
        missingFields.push(label);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number'
      });
    }

    // PAN validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panNumber.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid PAN number (e.g., ABCDE1234F)'
      });
    }

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({
      $or: [
        { 'businessInfo.email': email.toLowerCase() },
        { 'verification.panNumber': panNumber.toUpperCase() }
      ]
    });

    if (existingVendor) {
      const field = existingVendor.businessInfo.email === email.toLowerCase() ? 'email' : 'PAN number';
      return res.status(400).json({
        success: false,
        message: `A vendor with this ${field} already exists`
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create vendor document
    const vendorData = {
      businessInfo: {
        businessName: businessName.trim(),
        businessType,
        ownerName: ownerName.trim(),
        email: email.toLowerCase(),
        phone: phone.trim(),
        alternatePhone: alternatePhone?.trim() || '',
        businessAddress: {
          street: businessAddress?.street || '',
          city: businessAddress?.city || '',
          state: businessAddress?.state || '',
          pincode: businessAddress?.pincode || '',
          country: 'India'
        },
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
      verification: {
        gstNumber: gstNumber?.trim().toUpperCase() || '',
        panNumber: panNumber.trim().toUpperCase(),
        documents: {
          businessRegistration: { verified: false },
          gstCertificate: { verified: false },
          panCard: { verified: false },
          bankStatement: { verified: false },
          identityProof: { verified: false }
        }
      },
      password: hashedPassword,
     registrationStatus: 'pending_review',
      registrationStep: 1,
      profileCompletion: 25,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const vendor = await Vendor.create(vendorData);
    console.log('✅ Vendor created successfully with ID:', vendor._id);

    // Generate JWT token
    const token = generateToken(vendor._id);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Step 1 completed successfully! Please upload your documents.',
      data: {
        vendorId: vendor._id,
        token,
        vendor: {
          id: vendor._id,
          businessName: vendor.businessInfo.businessName,
          email: vendor.businessInfo.email,
          registrationStatus: vendor.registrationStatus,
          registrationStep: vendor.registrationStep,
          profileCompletion: vendor.profileCompletion
        }
      }
    });

  } catch (error) {
    console.error('❌ Step 1 Registration Error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `This ${field.includes('email') ? 'email' : 'information'} is already registered`
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
          
          // Upload file to Google Drive with retry logic
          let driveResult;
          let retryCount = 0;
          const maxRetries = 3;
          
          while (retryCount < maxRetries) {
            try {
              driveResult = await uploadToGoogleDrive(file, uniqueFileName, vendorFolder.id);
              break; // Success, exit retry loop
            } catch (uploadError) {
              retryCount++;
              console.warn(`⚠️ Upload attempt ${retryCount} failed for ${docType}:`, uploadError.message);
              
              if (retryCount >= maxRetries) {
                throw uploadError;
              }
              
              // Wait before retry (exponential backoff)
              await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
            }
          }
          
          if (!driveResult) {
            throw new Error('Upload failed after all retry attempts');
          }
          
          // Store document metadata
          updatedDocuments[docType] = {
            driveFileId: driveResult.fileId,
            fileName: file.originalname,
            uniqueFileName: uniqueFileName,
            uploadDate: new Date(),
            verified: false,
            fileSize: file.size,
            mimeType: file.mimetype,
            driveUrl: driveResult.driveUrl,
            webViewLink: driveResult.webViewLink,
            uploadAttempts: retryCount + 1
          };

          uploadResults.push({
            type: docType,
            name: documentTypes[docType],
            fileName: file.originalname,
            status: 'uploaded',
            fileId: driveResult.fileId
          });

          console.log(`✅ ${docType} processed successfully - File ID: ${driveResult.fileId}`);
          
        } catch (uploadError) {
          console.error(`❌ Failed to upload ${docType}:`, uploadError);
          
          uploadErrors.push({
            type: docType,
            name: documentTypes[docType],
            error: uploadError.message
          });
          
          // For critical documents, fail the entire process
          if (['businessRegistration', 'panCard', 'identityProof'].includes(docType)) {
            return res.status(500).json({
              success: false,
              message: `Failed to upload ${documentTypes[docType]}. This is a required document.`,
              error: uploadError.message,
              uploadResults,
              uploadErrors
            });
          }
        }
      }
    }

    // Check if we have at least some successful uploads
    if (uploadResults.length === 0) {
      console.error('❌ No documents were uploaded successfully');
      return res.status(500).json({
        success: false,
        message: 'Failed to upload any documents. Please check your files and try again.',
        uploadErrors
      });
    }

    // Update vendor with new documents
    try {
      vendor.verification.documents = updatedDocuments;
      vendor.registrationStatus = 'step2_completed';
      vendor.registrationStep = 2;
      
      // Calculate profile completion based on uploaded documents
      const totalRequiredDocs = Object.values(documentTypes).length;
      const uploadedRequiredDocs = uploadResults.length;
      vendor.profileCompletion = Math.min(75, Math.round((uploadedRequiredDocs / totalRequiredDocs) * 75));
      
      vendor.updatedAt = new Date();
      
      await vendor.save();
      
      console.log(`✅ Vendor profile updated successfully`);
      
    } catch (saveError) {
      console.error('❌ Failed to save vendor profile:', saveError);
      return res.status(500).json({
        success: false,
        message: 'Documents uploaded but failed to update profile. Please contact support.',
        error: saveError.message,
        uploadResults
      });
    }

    // Log successful completion
    console.log(`✅ Documents processed successfully for vendor: ${vendor.businessInfo.businessName}`);
    console.log(`📊 Upload summary: ${uploadResults.length} successful, ${uploadErrors.length} failed`);

    // Prepare response
    const responseMessage = uploadErrors.length > 0 
      ? `Successfully uploaded ${uploadResults.length} document(s). ${uploadErrors.length} upload(s) failed.`
      : `Successfully uploaded ${uploadResults.length} document(s). Please complete your service information.`;

    const response = {
      success: true,
      message: responseMessage,
      data: {
        vendorId: vendor._id,
        documentsUploaded: uploadResults,
        documentsSkipped: uploadErrors,
        registrationStatus: vendor.registrationStatus,
        registrationStep: vendor.registrationStep,
        profileCompletion: vendor.profileCompletion,
        nextStep: 'Complete your service information to finish registration',
        summary: {
          totalUploaded: uploadResults.length,
          totalFailed: uploadErrors.length,
          requiredCompleted: uploadResults.filter(doc => 
            ['businessRegistration', 'panCard', 'identityProof'].includes(doc.type)
          ).length
        }
      }
    };

    // Add warnings if there were any failures
    if (uploadErrors.length > 0) {
      response.warnings = uploadErrors.map(error => 
        `Failed to upload ${error.name}: ${error.error}`
      );
    }

    res.json(response);

  } catch (error) {
    console.error('❌ Document Upload Error:', error);
    
    // Provide specific error messages based on error type
    let errorMessage = 'Document upload failed. Please try again.';
    
    if (error.message.includes('Google Drive')) {
      errorMessage = 'Document storage service is temporarily unavailable. Please try again later.';
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
      vendorId: req.params.vendorId
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
              eventTypes: service.eventTypes || [],
              budgetRange: {
                min: service.budgetRange?.min || 0,
                max: service.budgetRange?.max || 0,
                currency: 'INR'
              }
            },
            packages: service.packages || [],
            media: {
              images: [],
              videos: []
            },
            isApproved: false,
            isActive: false,
            createdAt: new Date()
          });

          createdServices.push({
            id: vendorService._id,
            title: vendorService.serviceInfo.title,
            category: vendorService.serviceInfo.category
          });

          console.log(`✅ Service created: ${service.title}`);
        } catch (serviceError) {
          console.error(`❌ Failed to create service: ${service.title}`, serviceError);
        }
      }
    }

    console.log(`✅ Registration completed successfully for: ${vendor.businessInfo.businessName}`);

    res.json({
      success: true,
      message: 'Registration completed successfully! Your application is now under review.',
      data: {
        vendorId: vendor._id,
        registrationStatus: vendor.registrationStatus,
        profileCompletion: vendor.profileCompletion,
        servicesCreated: createdServices.length,
        services: createdServices,
        nextSteps: [
          'Your application will be reviewed by our team',
          'You will receive an email notification once approved',
          'You can check your application status in the vendor dashboard'
        ]
      }
    });

  } catch (error) {
    console.error('❌ Step 3 Registration Error:', error);
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
    console.log('🔐 Vendor login attempt for:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find vendor by email
    const vendor = await Vendor.findOne({ 'businessInfo.email': email.toLowerCase() });
    if (!vendor) {
      console.log('❌ Vendor not found for email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, vendor.password);
    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(vendor._id);

    // Update last login
    vendor.lastLogin = new Date();
    await vendor.save();

    console.log('✅ Login successful for:', vendor.businessInfo.businessName);

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
          registrationStep: vendor.registrationStep,
          profileCompletion: vendor.profileCompletion
        }
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ==================== GET VENDOR PROFILE ====================
exports.getVendorProfile = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    console.log('👤 Getting profile for vendor:', vendorId);

    const vendor = await Vendor.findById(vendorId).select('-password');
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      data: {
        vendor
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

// ==================== GET REGISTRATION STATUS ====================
exports.getRegistrationStatus = async (req, res) => {
  try {
    const { vendorId } = req.params;
    console.log('📊 Getting registration status for vendor:', vendorId);

    const vendor = await Vendor.findById(vendorId).select('registrationStatus registrationStep profileCompletion businessInfo.businessName');
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
        registrationStatus: vendor.registrationStatus,
        registrationStep: vendor.registrationStep,
        profileCompletion: vendor.profileCompletion
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

// ==================== GET DASHBOARD STATS ====================
exports.getDashboardStats = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    console.log('📊 Getting dashboard stats for vendor:', vendorId);

    const vendor = await Vendor.findById(vendorId);
    const services = await VendorService.find({ vendorId }).countDocuments();
    const approvedServices = await VendorService.find({ vendorId, isApproved: true }).countDocuments();

    res.json({
      success: true,
      data: {
        vendor: {
          businessName: vendor.businessInfo.businessName,
          registrationStatus: vendor.registrationStatus,
          profileCompletion: vendor.profileCompletion
        },
        stats: {
          totalServices: services,
          approvedServices: approvedServices,
          pendingApproval: services - approvedServices,
          totalBookings: 0, // Implement when booking system is ready
          totalRevenue: 0 // Implement when payment system is ready
        }
      }
    });

  } catch (error) {
    console.error('❌ Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

// ==================== UPDATE VENDOR PROFILE ====================
exports.updateVendorProfile = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const updates = req.body;

    console.log('📝 Updating profile for vendor:', vendorId);

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Update allowed fields
    if (updates.businessInfo) {
      vendor.businessInfo = { ...vendor.businessInfo, ...updates.businessInfo };
    }

    if (updates.verification) {
      vendor.verification = { ...vendor.verification, ...updates.verification };
    }

    vendor.updatedAt = new Date();
    await vendor.save();

    console.log('✅ Profile updated successfully');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        vendor: vendor
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

// ==================== VENDOR SERVICES ====================
exports.getVendorServices = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    console.log('🎪 Getting services for vendor:', vendorId);

    const services = await VendorService.find({ vendorId });

    res.json({
      success: true,
      data: {
        services
      }
    });

  } catch (error) {
    console.error('❌ Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

exports.createVendorService = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const serviceData = req.body;

    console.log('🎪 Creating new service for vendor:', vendorId);

    const service = await VendorService.create({
      vendorId,
      ...serviceData,
      isApproved: false,
      isActive: false
    });

    console.log('✅ Service created successfully:', service._id);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: {
        service
      }
    });

  } catch (error) {
    console.error('❌ Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service',
      error: error.message
    });
  }
};

exports.updateVendorService = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const { serviceId } = req.params;
    const updates = req.body;

    const service = await VendorService.findOne({ _id: serviceId, vendorId });
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    Object.assign(service, updates);
    await service.save();

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: { service }
    });

  } catch (error) {
    console.error('❌ Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service',
      error: error.message
    });
  }
};

exports.deleteVendorService = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const { serviceId } = req.params;

    const service = await VendorService.findOneAndDelete({ _id: serviceId, vendorId });
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error.message
    });
  }
};

// ==================== RESEND VERIFICATION EMAIL ====================
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Here you would implement email sending logic
    console.log('📧 Verification email would be sent to:', vendor.businessInfo.email);

    res.json({
      success: true,
      message: 'Verification email sent successfully'
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
// Add other required exports to avoid missing function errors
exports.uploadDocuments = async (req, res) => {
  res.json({ success: true, message: 'Document upload endpoint - to be implemented' });
};

exports.registerVendorStep3 = async (req, res) => {
  res.json({ success: true, message: 'Step 3 endpoint - to be implemented' });
};

exports.updateVendorProfile = async (req, res) => {
  res.json({ success: true, message: 'Update profile endpoint - to be implemented' });
};

exports.getVendorServices = async (req, res) => {
  res.json({ success: true, data: { services: [] } });
};

exports.createVendorService = async (req, res) => {
  res.json({ success: true, message: 'Create service endpoint - to be implemented' });
};

exports.updateVendorService = async (req, res) => {
  res.json({ success: true, message: 'Update service endpoint - to be implemented' });
};

exports.deleteVendorService = async (req, res) => {
  res.json({ success: true, message: 'Delete service endpoint - to be implemented' });
};

exports.getDashboardStats = async (req, res) => {
  res.json({ success: true, data: { stats: {} } });
};

exports.getRegistrationStatus = async (req, res) => {
  res.json({ success: true, data: { status: 'pending' } });
};

exports.resendVerificationEmail = async (req, res) => {
  res.json({ success: true, message: 'Verification email sent' });
};