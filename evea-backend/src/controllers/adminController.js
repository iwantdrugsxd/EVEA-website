// controllers/adminController.js
const Vendor = require('../models/Vendor');
const VendorService = require('../models/VendorService');
const RecommendationProfile = require('../models/RecommendationProfile');
const { sendVendorApprovalEmail, sendVendorRejectionEmail } = require('../services/emailService');
const { getFileInfo } = require('../services/googleDriveService');

// ==================== VENDOR APPLICATION MANAGEMENT ====================

// Get all vendor applications
exports.getAllVendorApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, sortBy = 'submittedAt', sortOrder = 'desc' } = req.query;
    
    const query = {};
    if (status) {
      query.registrationStatus = status;
    }

    const vendors = await Vendor.find(query)
      .select('-password')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Vendor.countDocuments(query);

    // Enhance vendor data with document verification status
    const enhancedVendors = await Promise.all(
      vendors.map(async (vendor) => {
        const documents = vendor.verification?.documents || {};
        const documentStatus = {
          total: Object.keys(documents).length,
          verified: Object.values(documents).filter(doc => doc.verified).length,
          pending: Object.values(documents).filter(doc => !doc.verified).length
        };

        return {
          ...vendor,
          documentStatus
        };
      })
    );

    res.json({
      success: true,
      data: {
        vendors: enhancedVendors,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalVendors: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get vendor applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor applications',
      error: error.message
    });
  }
};

// Get specific vendor application by ID
exports.getVendorApplicationById = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await Vendor.findById(vendorId)
      .select('-password')
      .lean();

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Get vendor services
    const services = await VendorService.find({ vendorId }).lean();

    // Get document details from Google Drive
    const documents = vendor.verification?.documents || {};
    const documentDetails = {};

    for (const [docType, docInfo] of Object.entries(documents)) {
      if (docInfo.driveFileId) {
        try {
          const fileInfo = await getFileInfo(docInfo.driveFileId);
          documentDetails[docType] = {
            ...docInfo,
            fileInfo,
            downloadUrl: `https://drive.google.com/uc?export=download&id=${docInfo.driveFileId}`,
            viewUrl: `https://drive.google.com/file/d/${docInfo.driveFileId}/view`
          };
        } catch (error) {
          console.error(`Error getting file info for ${docType}:`, error);
          documentDetails[docType] = docInfo;
        }
      }
    }

    res.json({
      success: true,
      data: {
        vendor: {
          ...vendor,
          verification: {
            ...vendor.verification,
            documents: documentDetails
          }
        },
        services
      }
    });

  } catch (error) {
    console.error('Get vendor application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor application',
      error: error.message
    });
  }
};

// Approve vendor application
exports.approveVendorApplication = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { adminNotes } = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    if (vendor.registrationStatus !== 'pending_review') {
      return res.status(400).json({
        success: false,
        message: 'Vendor application is not in pending review status'
      });
    }

    // Check if all documents are verified
    const documents = vendor.verification?.documents || {};
    const allDocsVerified = Object.values(documents).every(doc => doc.verified);

    if (!allDocsVerified) {
      return res.status(400).json({
        success: false,
        message: 'All documents must be verified before approval'
      });
    }

    // Update vendor status
    vendor.registrationStatus = 'approved';
    vendor.approvedAt = new Date();
    
    if (adminNotes) {
      vendor.adminNotes.push({
        note: adminNotes,
        addedBy: req.admin.email,
        addedAt: new Date()
      });
    }

    await vendor.save();

    // Approve all vendor services
    await VendorService.updateMany(
      { vendorId },
      { $set: { isApproved: true, isActive: true } }
    );

    // Create recommendation profile
    await this.createRecommendationProfile(vendorId);

    // Send approval email
    await sendVendorApprovalEmail(vendor);

    res.json({
      success: true,
      message: 'Vendor application approved successfully',
      data: {
        vendorId: vendor._id,
        status: vendor.registrationStatus,
        approvedAt: vendor.approvedAt
      }
    });

  } catch (error) {
    console.error('Approve vendor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve vendor application',
      error: error.message
    });
  }
};

// Reject vendor application
exports.rejectVendorApplication = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { rejectionReason, adminNotes } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Update vendor status
    vendor.registrationStatus = 'rejected';
    vendor.rejectedAt = new Date();
    
    vendor.adminNotes.push({
      note: `Rejected: ${rejectionReason}${adminNotes ? ` - ${adminNotes}` : ''}`,
      addedBy: req.admin.email,
      addedAt: new Date()
    });

    await vendor.save();

    // Send rejection email
    await sendVendorRejectionEmail(vendor, rejectionReason);

    res.json({
      success: true,
      message: 'Vendor application rejected',
      data: {
        vendorId: vendor._id,
        status: vendor.registrationStatus,
        rejectedAt: vendor.rejectedAt
      }
    });

  } catch (error) {
    console.error('Reject vendor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject vendor application',
      error: error.message
    });
  }
};

// Update document verification status
exports.updateDocumentVerification = async (req, res) => {
  try {
    const { vendorId, documentType } = req.params;
    const { verified, notes } = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    const documentPath = `verification.documents.${documentType}.verified`;
    const updateObj = { [documentPath]: verified };

    if (notes) {
      vendor.adminNotes.push({
        note: `Document ${documentType} ${verified ? 'verified' : 'rejected'}: ${notes}`,
        addedBy: req.admin.email,
        addedAt: new Date()
      });
    }

    await Vendor.updateOne({ _id: vendorId }, updateObj);
    await vendor.save();

    res.json({
      success: true,
      message: `Document ${documentType} ${verified ? 'verified' : 'rejected'} successfully`,
      data: {
        vendorId,
        documentType,
        verified
      }
    });

  } catch (error) {
    console.error('Update document verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update document verification',
      error: error.message
    });
  }
};

// Helper function to create recommendation profile
exports.createRecommendationProfile = async (vendorId) => {
  try {
    const vendor = await Vendor.findById(vendorId);
    const services = await VendorService.find({ vendorId });

    // Extract data for recommendation profile from vendor and services
    const profile = new RecommendationProfile({
      vendorId,
      eventExpertise: {
        primaryEventTypes: this.extractEventTypes(services),
        eventSizeExpertise: this.extractSizeExpertise(services)
      },
      budgetExpertise: this.extractBudgetExpertise(services),
      geographicExpertise: {
        serviceAreas: [{
          city: vendor.businessInfo.businessAddress.city,
          state: vendor.businessInfo.businessAddress.state,
          radiusKm: 50, // Default radius
          isHomeBased: true
        }]
      },
      qualityIndicators: {
        responseTime: 24, // Default
        yearsOfExperience: new Date().getFullYear() - (vendor.businessInfo.establishedYear || new Date().getFullYear()),
        completionRate: 100, // Starting value
        repeatClientRate: 0, // Will be updated based on bookings
        referralRate: 0
      }
    });

    await profile.save();
    console.log('Recommendation profile created for vendor:', vendorId);
  } catch (error) {
    console.error('Error creating recommendation profile:', error);
  }
};
