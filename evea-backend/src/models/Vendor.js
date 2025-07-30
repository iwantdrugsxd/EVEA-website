const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  // Basic Information (Step 1)
  businessInfo: {
    businessName: {
      type: String,
      required: true,
      trim: true
    },
    businessType: {
      type: String,
      enum: ['sole_proprietorship', 'partnership', 'llp', 'private_limited', 'public_limited'],
      required: true
    },
    ownerName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true
    },
    alternatePhone: String,
    businessAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' }
    },
    businessDescription: String,
    establishedYear: Number,
    website: String,
    socialMedia: {
      instagram: String,
      facebook: String,
      youtube: String,
      linkedin: String
    }
  },

  // Authentication
  password: {
    type: String,
    required: true
  },
  
  // Verification & Documents (Step 2)
  verification: {
    registrationNumber: String,
    gstNumber: String,
    panNumber: {
      type: String,
      required: true
    },
    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      branch: String
    },
    documents: {
      businessRegistration: {
        driveFileId: String,
        fileName: String,
        uploadDate: Date,
        verified: { type: Boolean, default: false }
      },
      gstCertificate: {
        driveFileId: String,
        fileName: String,
        uploadDate: Date,
        verified: { type: Boolean, default: false }
      },
      panCard: {
        driveFileId: String,
        fileName: String,
        uploadDate: Date,
        verified: { type: Boolean, default: false }
      },
      bankStatement: {
        driveFileId: String,
        fileName: String,
        uploadDate: Date,
        verified: { type: Boolean, default: false }
      },
      identityProof: {
        driveFileId: String,
        fileName: String,
        uploadDate: Date,
        verified: { type: Boolean, default: false }
      }
    }
  },

  // Registration Status
  registrationStatus: {
    type: String,
    enum: ['pending_documents', 'pending_review', 'approved', 'rejected', 'suspended'],
    default: 'pending_documents'
  },
  
  // Primary Categories
  primaryCategories: [{
    type: String,
    enum: ['photography', 'catering', 'decoration', 'venue', 'music_entertainment', 'planning', 'transport', 'makeup_styling', 'floral', 'lighting']
  }],

  // Admin Notes
  adminNotes: [{
    note: String,
    addedBy: String,
    addedAt: { type: Date, default: Date.now }
  }],

  // Timestamps
  submittedAt: { type: Date, default: Date.now },
  approvedAt: Date,
  rejectedAt: Date,
  lastLoginAt: Date,

  // Profile completion
  profileCompletion: {
    type: Number,
    default: 0
  },

  // Location for geo-queries
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
  timestamps: true
});

// Index for geospatial queries
vendorSchema.index({ location: '2dsphere' });
vendorSchema.index({ email: 1 });
vendorSchema.index({ 'businessInfo.businessName': 'text' });

module.exports = mongoose.model('Vendor', vendorSchema);
