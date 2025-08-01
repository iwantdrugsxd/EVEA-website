const mongoose = require('mongoose');
const vendorServiceSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },

  // Service Information
  serviceInfo: {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Photography & Videography',
        'Catering Services',
        'Decoration & Design',
        'Entertainment & Music',
        'Venue & Location',
        'Wedding Planning',
        'Transportation',
        'Makeup & Styling',
        'Floral Services',
        'Security Services',
        'Other Services'
      ]
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    eventTypes: [{
      type: String,
      enum: [
        'Wedding',
        'Birthday Party',
        'Corporate Event',
        'Anniversary',
        'Baby Shower',
        'Engagement',
        'Festival Celebration',
        'Conference',
        'Product Launch',
        'Social Gathering'
      ]
    }],
    tags: [String],
    location: {
      serviceAreas: [String], // Cities/areas where service is available
      travelCharges: Number,
      maxTravelDistance: Number // in kilometers
    }
  },

  // Pricing
  pricing: {
    budgetRange: {
      min: { type: Number, required: true, min: 0 },
      max: { type: Number, required: true, min: 0 }
    },
    packages: [{
      name: String,
      description: String,
      price: Number,
      duration: String,
      inclusions: [String],
      exclusions: [String]
    }],
    customPricingAvailable: { type: Boolean, default: true }
  },

  // Media
  media: {
    coverImage: {
      fileId: String,
      url: String,
      altText: String
    },
    gallery: [{
      fileId: String,
      url: String,
      caption: String,
      type: { type: String, enum: ['image', 'video'] }
    }],
    portfolio: [{
      title: String,
      description: String,
      images: [String],
      eventType: String,
      completedAt: Date
    }]
  },

  // Availability
  availability: {
    isActive: { type: Boolean, default: true },
    bookingEnabled: { type: Boolean, default: false },
    advanceBookingDays: { type: Number, default: 30 },
    blockedDates: [Date],
    workingDays: {
      monday: { type: Boolean, default: true },
      tuesday: { type: Boolean, default: true },
      wednesday: { type: Boolean, default: true },
      thursday: { type: Boolean, default: true },
      friday: { type: Boolean, default: true },
      saturday: { type: Boolean, default: true },
      sunday: { type: Boolean, default: true }
    }
  },

  // Performance Metrics
  metrics: {
    totalBookings: { type: Number, default: 0 },
    completedBookings: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    inquiryCount: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 }
  },

  // Status
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'suspended'],
    default: 'draft'
  },
  
  // Admin moderation
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  moderationNotes: String,
  moderatedAt: Date,
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true,
  collection: 'vendor_services'
});

// Indexes
vendorServiceSchema.index({ vendorId: 1 });
vendorServiceSchema.index({ 'serviceInfo.category': 1 });
vendorServiceSchema.index({ 'serviceInfo.eventTypes': 1 });
vendorServiceSchema.index({ status: 1, moderationStatus: 1 });
vendorServiceSchema.index({ 'pricing.budgetRange.min': 1, 'pricing.budgetRange.max': 1 });
vendorServiceSchema.index({ 'availability.isActive': 1, 'availability.bookingEnabled': 1 });

// Virtual for average price
vendorServiceSchema.virtual('averagePrice').get(function() {
  return (this.pricing.budgetRange.min + this.pricing.budgetRange.max) / 2;
});

// Methods
vendorServiceSchema.methods.isAvailableForBooking = function() {
  return this.availability.isActive && this.availability.bookingEnabled && this.moderationStatus === 'approved';
};

vendorServiceSchema.methods.isAvailableOnDate = function(date) {
  const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
  return this.availability.workingDays[dayOfWeek] && 
         !this.availability.blockedDates.some(blockedDate => 
           blockedDate.toDateString() === date.toDateString()
         );
};

const VendorService = mongoose.model('VendorService', vendorServiceSchema);

module.exports = VendorService;