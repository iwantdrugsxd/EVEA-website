// src/controllers/vendorController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Vendor = require('../models/Vendor');
const VendorService = require('../models/VendorService');

// Register Vendor - Step 1: Basic Information
exports.registerVendorStep1 = async (req, res) => {
  try {
    const {
      businessName,
      businessType,
      ownerName,
      email,
      phone,
      password,
      address,
      city,
      state,
      pincode,
      gstNumber,
      panNumber
    } = req.body;

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ 
      $or: [
        { 'contactInfo.email': email },
        { 'businessInfo.gstNumber': gstNumber },
        { 'businessInfo.panNumber': panNumber }
      ]
    });

    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: 'Vendor already exists with this email, GST, or PAN number'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create vendor with step 1 data
    const vendor = await Vendor.create({
      businessInfo: {
        businessName,
        businessType,
        gstNumber,
        panNumber
      },
      contactInfo: {
        ownerName,
        email,
        phone,
        address,
        city,
        state,
        pincode
      },
      password: hashedPassword,
      registrationStatus: 'incomplete',
      registrationStep: 1
    });

    res.status(201).json({
      success: true,
      message: 'Step 1 completed successfully',
      data: {
        vendorId: vendor._id,
        businessName: vendor.businessInfo.businessName,
        email: vendor.contactInfo.email,
        currentStep: 1,
        nextStep: 'documents'
      }
    });

  } catch (error) {
    console.error('Vendor registration step 1 error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Register Vendor - Step 2: Document Upload
exports.uploadDocuments = async (req, res) => {
  try {
    const { vendorId } = req.params;
    
    // Find vendor
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Check if files were uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No documents uploaded'
      });
    }

    // Process uploaded documents
    const documents = {};
    const requiredDocs = ['businessRegistration', 'gstCertificate', 'panCard', 'bankStatement', 'identityProof'];
    
    for (const docType of requiredDocs) {
      if (req.files[docType] && req.files[docType][0]) {
        const file = req.files[docType][0];
        
        // In a real implementation, upload to Google Drive or cloud storage
        // For now, store file metadata
        documents[docType] = {
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
          uploadDate: new Date(),
          verificationStatus: 'pending'
        };
      }
    }

    // Update vendor with documents
    vendor.documents = documents;
    vendor.registrationStep = 2;
    await vendor.save();

    res.json({
      success: true,
      message: 'Documents uploaded successfully',
      data: {
        vendorId: vendor._id,
        documentsUploaded: Object.keys(documents),
        currentStep: 2,
        nextStep: 'services'
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

// Register Vendor - Step 3: Services and Packages
exports.registerVendorStep3 = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { services, serviceAreas, experience, description } = req.body;

    // Find vendor
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Update vendor with service information
    vendor.serviceInfo = {
      services,
      serviceAreas,
      experience,
      description
    };
    vendor.registrationStep = 3;
    vendor.registrationStatus = 'pending';
    vendor.registrationCompletedAt = new Date();

    await vendor.save();

    res.json({
      success: true,
      message: 'Vendor registration completed successfully. Your application is now pending admin approval.',
      data: {
        vendorId: vendor._id,
        businessName: vendor.businessInfo.businessName,
        registrationStatus: vendor.registrationStatus,
        submittedAt: vendor.registrationCompletedAt
      }
    });

  } catch (error) {
    console.error('Vendor registration step 3 error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration completion failed',
      error: error.message
    });
  }
};

// Vendor Login
exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find vendor by email
    const vendor = await Vendor.findOne({ 'contactInfo.email': email }).select('+password');
    
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

    // Check registration status
    if (vendor.registrationStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        message: `Your vendor account is ${vendor.registrationStatus}. Please wait for admin approval.`,
        registrationStatus: vendor.registrationStatus
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        vendorId: vendor._id, 
        email: vendor.contactInfo.email,
        role: 'vendor' 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        vendor: {
          id: vendor._id,
          businessName: vendor.businessInfo.businessName,
          email: vendor.contactInfo.email,
          phone: vendor.contactInfo.phone,
          role: 'vendor',
          registrationStatus: vendor.registrationStatus
        },
        token
      }
    });

  } catch (error) {
    console.error('Vendor login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Get Vendor Profile
exports.getVendorProfile = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;

    const vendor = await Vendor.findById(vendorId).select('-password');
    
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
    console.error('Get vendor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor profile',
      error: error.message
    });
  }
};

// Update Vendor Profile
exports.updateVendorProfile = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
    const updateData = req.body;

    // Remove sensitive fields
    delete updateData.password;
    delete updateData._id;
    delete updateData.registrationStatus;

    const vendor = await Vendor.findByIdAndUpdate(
      vendorId, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { vendor }
    });

  } catch (error) {
    console.error('Update vendor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Get Vendor Services
exports.getVendorServices = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;

    const services = await VendorService.find({ vendorId });

    res.json({
      success: true,
      data: { services }
    });

  } catch (error) {
    console.error('Get vendor services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

// Create Vendor Service
exports.createVendorService = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
    const serviceData = { ...req.body, vendorId };

    // Process uploaded media files
    if (req.files) {
      const media = {};
      
      if (req.files.coverImage) {
        media.coverImage = {
          originalName: req.files.coverImage[0].originalname,
          size: req.files.coverImage[0].size,
          mimeType: req.files.coverImage[0].mimetype
        };
      }
      
      if (req.files.gallery) {
        media.gallery = req.files.gallery.map(file => ({
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype
        }));
      }

      serviceData.media = media;
    }

    const service = await VendorService.create(serviceData);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: { service }
    });

  } catch (error) {
    console.error('Create vendor service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service',
      error: error.message
    });
  }
};

// Update Vendor Service
exports.updateVendorService = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
    const { serviceId } = req.params;
    const updateData = req.body;

    const service = await VendorService.findOneAndUpdate(
      { _id: serviceId, vendorId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: { service }
    });

  } catch (error) {
    console.error('Update vendor service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service',
      error: error.message
    });
  }
};

// Delete Vendor Service
exports.deleteVendorService = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
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
    console.error('Delete vendor service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error.message
    });
  }
};

// Get Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;

    // Get basic stats
    const totalServices = await VendorService.countDocuments({ vendorId });
    const activeServices = await VendorService.countDocuments({ vendorId, isActive: true });
    
    // You'll need to implement these models and queries
    // const totalBookings = await Booking.countDocuments({ vendorId });
    // const pendingBookings = await Booking.countDocuments({ vendorId, status: 'pending' });
    // const monthlyRevenue = await Booking.aggregate([...]);

    const stats = {
      services: {
        total: totalServices,
        active: activeServices,
        inactive: totalServices - activeServices
      },
      bookings: {
        total: 0, // Placeholder
        pending: 0,
        completed: 0
      },
      revenue: {
        thisMonth: 0,
        lastMonth: 0,
        growth: 0
      },
      ratings: {
        average: 4.5, // Placeholder
        totalReviews: 0
      }
    };

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

// Get Registration Status
exports.getRegistrationStatus = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await Vendor.findById(vendorId)
      .select('registrationStatus registrationStep businessInfo.businessName contactInfo.email documents');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Calculate completion percentage
    let completionPercentage = 0;
    if (vendor.registrationStep >= 1) completionPercentage += 33;
    if (vendor.registrationStep >= 2) completionPercentage += 33;
    if (vendor.registrationStep >= 3) completionPercentage += 34;

    res.json({
      success: true,
      data: {
        vendorId: vendor._id,
        businessName: vendor.businessInfo.businessName,
        email: vendor.contactInfo.email,
        registrationStatus: vendor.registrationStatus,
        currentStep: vendor.registrationStep,
        completionPercentage,
        documentsUploaded: vendor.documents ? Object.keys(vendor.documents) : [],
        nextSteps: getNextSteps(vendor.registrationStep, vendor.registrationStatus)
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

// Resend Verification Email
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

    if (vendor.registrationStatus === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Vendor is already approved'
      });
    }

    // In a real implementation, send verification email
    // For now, just return success
    res.json({
      success: true,
      message: 'Verification email sent successfully',
      data: {
        email: vendor.contactInfo.email,
        sentAt: new Date()
      }
    });

  } catch (error) {
    console.error('Resend verification email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email',
      error: error.message
    });
  }
};

// Helper function to determine next steps
function getNextSteps(currentStep, status) {
  switch (currentStep) {
    case 1:
      return ['Upload required documents'];
    case 2:
      return ['Complete service information'];
    case 3:
      if (status === 'pending') {
        return ['Wait for admin approval'];
      } else if (status === 'approved') {
        return ['Start adding services to marketplace'];
      } else if (status === 'rejected') {
        return ['Review rejection reasons and resubmit'];
      }
      return ['Complete registration'];
    default:
      return ['Start registration process'];
  }
}