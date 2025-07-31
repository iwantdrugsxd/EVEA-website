// src/controllers/adminController.js
const Vendor = require('../models/Vendor');
const VendorService = require('../models/VendorService');
const User = require('../models/User');

// Get All Vendor Applications
exports.getAllVendorApplications = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status = 'all', 
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter query
    const filter = {};
    
    if (status !== 'all') {
      filter.registrationStatus = status;
    }

    if (search) {
      filter.$or = [
        { 'businessInfo.businessName': { $regex: search, $options: 'i' } },
        { 'contactInfo.email': { $regex: search, $options: 'i' } },
        { 'contactInfo.ownerName': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const vendors = await Vendor.find(filter)
      .select('-password')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const total = await Vendor.countDocuments(filter);

    // Calculate statistics
    const stats = await Vendor.aggregate([
      {
        $group: {
          _id: '$registrationStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusStats = {
      pending: 0,
      approved: 0,
      rejected: 0,
      incomplete: 0
    };

    stats.forEach(stat => {
      statusStats[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        vendors,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalVendors: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        },
        statistics: statusStats,
        filters: {
          status,
          search,
          sortBy,
          sortOrder
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

// Get Vendor Application by ID
exports.getVendorApplicationById = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await Vendor.findById(vendorId)
      .select('-password')
      .lean();

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor application not found'
      });
    }

    // Get vendor services if any
    const services = await VendorService.find({ vendorId }).lean();

    // Calculate document verification status
    const documentStats = {
      total: 0,
      verified: 0,
      pending: 0,
      rejected: 0
    };

    if (vendor.documents) {
      documentStats.total = Object.keys(vendor.documents).length;
      
      Object.values(vendor.documents).forEach(doc => {
        if (doc.verificationStatus === 'verified') {
          documentStats.verified++;
        } else if (doc.verificationStatus === 'rejected') {
          documentStats.rejected++;
        } else {
          documentStats.pending++;
        }
      });
    }

    res.json({
      success: true,
      data: {
        vendor,
        services,
        documentStats,
        timeline: generateVendorTimeline(vendor)
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

// Approve Vendor Application
exports.approveVendorApplication = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { approvalNotes } = req.body;
    const adminId = req.user.adminId || req.user.id;

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

    // Update vendor status
    vendor.registrationStatus = 'approved';
    vendor.approvedAt = new Date();
    vendor.approvedBy = adminId;
    vendor.approvalNotes = approvalNotes;
    vendor.isActive = true;

    await vendor.save();

    // In a real implementation, send approval email to vendor
    // await sendVendorApprovalEmail(vendor);

    res.json({
      success: true,
      message: 'Vendor application approved successfully',
      data: {
        vendorId: vendor._id,
        businessName: vendor.businessInfo.businessName,
        email: vendor.contactInfo.email,
        approvedAt: vendor.approvedAt
      }
    });

  } catch (error) {
    console.error('Approve vendor application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve vendor application',
      error: error.message
    });
  }
};

// Reject Vendor Application
exports.rejectVendorApplication = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { rejectionReason, rejectionNotes } = req.body;
    const adminId = req.user.adminId || req.user.id;

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
    vendor.rejectedBy = adminId;
    vendor.rejectionReason = rejectionReason;
    vendor.rejectionNotes = rejectionNotes;

    await vendor.save();

    // In a real implementation, send rejection email to vendor
    // await sendVendorRejectionEmail(vendor);

    res.json({
      success: true,
      message: 'Vendor application rejected',
      data: {
        vendorId: vendor._id,
        businessName: vendor.businessInfo.businessName,
        email: vendor.contactInfo.email,
        rejectedAt: vendor.rejectedAt,
        rejectionReason: vendor.rejectionReason
      }
    });

  } catch (error) {
    console.error('Reject vendor application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject vendor application',
      error: error.message
    });
  }
};

// Update Document Verification Status
exports.updateDocumentVerification = async (req, res) => {
  try {
    const { vendorId, documentType } = req.params;
    const { verificationStatus, verificationNotes } = req.body;
    const adminId = req.user.adminId || req.user.id;

    if (!['verified', 'rejected', 'pending'].includes(verificationStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification status'
      });
    }

    const vendor = await Vendor.findById(vendorId);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    if (!vendor.documents || !vendor.documents[documentType]) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Update document verification
    vendor.documents[documentType].verificationStatus = verificationStatus;
    vendor.documents[documentType].verifiedBy = adminId;
    vendor.documents[documentType].verifiedAt = new Date();
    vendor.documents[documentType].verificationNotes = verificationNotes;

    // Mark the documents field as modified for Mongoose
    vendor.markModified('documents');
    await vendor.save();

    // Check if all documents are verified
    const allDocuments = Object.values(vendor.documents);
    const allVerified = allDocuments.every(doc => doc.verificationStatus === 'verified');
    const hasRejected = allDocuments.some(doc => doc.verificationStatus === 'rejected');

    let autoStatusUpdate = null;
    if (allVerified && vendor.registrationStatus === 'pending') {
      // All documents verified - could auto-approve or mark as ready for review
      autoStatusUpdate = 'ready_for_review';
    } else if (hasRejected && vendor.registrationStatus === 'pending') {
      // Has rejected documents - mark as needs_revision
      autoStatusUpdate = 'needs_revision';
    }

    res.json({
      success: true,
      message: 'Document verification updated successfully',
      data: {
        vendorId: vendor._id,
        documentType,
        verificationStatus,
        verifiedAt: vendor.documents[documentType].verifiedAt,
        autoStatusUpdate,
        allDocumentsVerified: allVerified
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

// Helper function to generate vendor timeline
function generateVendorTimeline(vendor) {
  const timeline = [];

  // Registration started
  if (vendor.createdAt) {
    timeline.push({
      event: 'Registration Started',
      date: vendor.createdAt,
      status: 'completed',
      description: 'Vendor initiated registration process'
    });
  }

  // Documents uploaded
  if (vendor.documents && Object.keys(vendor.documents).length > 0) {
    timeline.push({
      event: 'Documents Uploaded',
      date: vendor.updatedAt, // You might want to track this separately
      status: 'completed',
      description: `${Object.keys(vendor.documents).length} documents uploaded`
    });
  }

  // Application submitted
  if (vendor.registrationCompletedAt) {
    timeline.push({
      event: 'Application Submitted',
      date: vendor.registrationCompletedAt,
      status: 'completed',
      description: 'Complete application submitted for review'
    });
  }

  // Document verification
  if (vendor.documents) {
    const verifiedDocs = Object.values(vendor.documents).filter(doc => doc.verificationStatus === 'verified');
    if (verifiedDocs.length > 0) {
      timeline.push({
        event: 'Documents Verified',
        date: verifiedDocs[0].verifiedAt,
        status: 'completed',
        description: `${verifiedDocs.length} documents verified`
      });
    }
  }

  // Final approval/rejection
  if (vendor.approvedAt) {
    timeline.push({
      event: 'Application Approved',
      date: vendor.approvedAt,
      status: 'completed',
      description: 'Vendor application approved by admin'
    });
  } else if (vendor.rejectedAt) {
    timeline.push({
      event: 'Application Rejected',
      date: vendor.rejectedAt,
      status: 'rejected',
      description: vendor.rejectionReason || 'Application rejected by admin'
    });
  }

  return timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
}