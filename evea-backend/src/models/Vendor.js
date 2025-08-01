const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  // Business Information
  businessInfo: {
    businessName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    businessType: {
      type: String,
      enum: ['private_limited', 'partnership', 'sole_proprietorship', 'llp', 'public_limited'],
      default: 'private_limited'
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    businessDescription: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    establishedYear: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear()
    },
    website: {
      type: String,
      trim: true
    },
    socialMedia: {
      instagram: { type: String, trim: true },
      facebook: { type: String, trim: true },
      youtube: { type: String, trim: true },
      linkedin: { type: String, trim: true }
    }
  },

  // Contact Information
  contactInfo: {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    phone: {
      type: String,
      required: true,
      unique: true, // Added unique constraint
      trim: true,
      index: true
    },
    alternatePhone: {
      type: String,
      trim: true
    },
    businessAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
      country: { type: String, default: 'India' }
    }
  },

  // Verification & Documents
  verification: {
    gstNumber: {
      type: String,
      uppercase: true,
      trim: true,
      sparse: true // Allow multiple null/undefined values
    },
    panNumber: {
      type: String,
      uppercase: true,
      trim: true,
      unique: true,
      sparse: true // This is critical - allows multiple null values
    },
  
  documents: {
    type: Map,
    of: {
      originalName: String,
      storedName: String,
      mimeType: String,
      size: Number,
      uploadedAt: Date,
      verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
      },
      verifiedAt: Date,
      verifiedBy: mongoose.Schema.Types.ObjectId,
      rejectionReason: String,
      // Google Drive specific fields
      fileId: String,
      webViewLink: String,
      webContentLink: String,
      driveUrl: String,
      parentFolderId: String,
      folderName: String
    }
    },
    bankDetails: {
      accountHolderName: { type: String, trim: true },
      accountNumber: { type: String, trim: true },
      ifscCode: { type: String, uppercase: true, trim: true },
      bankName: { type: String, trim: true },
      branch: { type: String, trim: true }
    }
  },

  // Authentication
  authentication: {
    password: {
      type: String,
      required: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: Date
  },

  // Registration Status
  registrationStep: {
    type: Number,
    min: 0,
    max: 3,
    default: 0
  },
  registrationStatus: {
    type: String,
    enum: ['pending_review', 'pending_approval', 'approved', 'rejected', 'suspended', 'needs_revision'],
    default: 'pending_review'
  },
  profileCompletion: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },

  // Activity Status
  isActive: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },

  // Admin Actions
  approvedAt: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  approvalNotes: String,
  rejectedAt: Date,
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  rejectionReason: String,
  submittedAt: Date,

  // Performance Metrics
  metrics: {
    totalBookings: { type: Number, default: 0 },
    completedBookings: { type: Number, default: 0 },
    cancelledBookings: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    responseTime: { type: Number, default: 0 }, // in minutes
    profileViews: { type: Number, default: 0 }
  },

  // SEO & Search
  searchTags: [String],
  serviceCategories: [String],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  }
}, {
  timestamps: true,
  collection: 'vendors'
});

// IMPORTANT: Updated Indexes with proper configuration
vendorSchema.index({ 'contactInfo.email': 1 }, { unique: true });
vendorSchema.index({ 'contactInfo.phone': 1 }, { unique: true });
vendorSchema.index({ 'verification.panNumber': 1 }, { unique: true, sparse: true }); // sparse allows multiple nulls
vendorSchema.index({ 'verification.gstNumber': 1 }, { sparse: true });
vendorSchema.index({ registrationStatus: 1 });
vendorSchema.index({ isActive: 1 });
vendorSchema.index({ serviceCategories: 1 });
vendorSchema.index({ location: '2dsphere' });

// Compound indexes for better query performance
vendorSchema.index({ 'contactInfo.email': 1, registrationStatus: 1 });
vendorSchema.index({ registrationStatus: 1, registrationStep: 1 });

// Virtual for full address
vendorSchema.virtual('fullAddress').get(function() {
  const addr = this.contactInfo.businessAddress;
  return [addr.street, addr.city, addr.state, addr.pincode, addr.country]
    .filter(Boolean)
    .join(', ');
});

// Methods
vendorSchema.methods.isDocumentUploaded = function(docType) {
  return this.verification.documents && this.verification.documents.has(docType);
};

vendorSchema.methods.getUploadedDocuments = function() {
  if (!this.verification.documents) return [];
  return Array.from(this.verification.documents.keys());
};

vendorSchema.methods.canProceedToNextStep = function() {
  if (this.registrationStep === 0) return true; // Can always start Step 1
  if (this.registrationStep === 1) return true; // Can proceed to Step 2 after Step 1
  if (this.registrationStep === 2) {
    // Check if required documents are uploaded
    const requiredDocs = ['businessRegistration', 'panCard', 'bankStatement', 'identityProof'];
    return requiredDocs.some(doc => this.isDocumentUploaded(doc));
  }
  return false;
};

// Pre-save middleware to handle PAN number uniqueness
vendorSchema.pre('save', function(next) {
  // Ensure PAN number is either a proper string or undefined (not empty string)
  if (this.verification && this.verification.panNumber === '') {
    this.verification.panNumber = undefined;
  }
  next();
});

module.exports = mongoose.model('Vendor', vendorSchema);