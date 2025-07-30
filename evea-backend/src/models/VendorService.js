const vendorServiceSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  
  // Service Details (Step 3)
  serviceInfo: {
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['photography', 'catering', 'decoration', 'venue', 'music_entertainment', 'planning', 'transport', 'makeup_styling', 'floral', 'lighting']
    },
    subcategory: String,
    description: String,
    features: [String],
    
    // Recommendation System Data
    eventTypes: [{
      type: String,
      enum: ['wedding', 'birthday', 'corporate', 'anniversary', 'baby_shower', 'engagement', 'reception', 'sangeet', 'mehendi', 'cocktail', 'conference', 'seminar', 'product_launch', 'exhibition']
    }],
    
    guestCapacity: {
      min: Number,
      max: Number
    },
    
    budgetRange: {
      min: Number,
      max: Number
    },
    
    serviceArea: {
      cities: [String],
      states: [String],
      radiusKm: Number
    },
    
    specializations: [String],
    themes: [String], // Traditional, Modern, Vintage, Rustic, etc.
    
    // Venue specific (if applicable)
    venueDetails: {
      capacity: Number,
      isAcAvailable: Boolean,
      hasParkingSpace: Boolean,
      cateringAllowed: Boolean,
      decorationAllowed: Boolean,
      hasGreenSpace: Boolean
    }
  },

  // Packages
  packages: [{
    name: String,
    description: String,
    price: Number,
    duration: String, // "4 hours", "Full day", etc.
    features: [String],
    addOns: [{
      name: String,
      price: Number,
      description: String
    }],
    isPopular: { type: Boolean, default: false }
  }],

  // Media
  media: {
    coverImage: String, // Drive file ID
    gallery: [String], // Array of Drive file IDs
    videos: [String], // Array of Drive file IDs
    portfolio: [String] // Array of Drive file IDs
  },

  // Availability
  availability: {
    workingDays: [String],
    workingHours: {
      start: String,
      end: String
    },
    blackoutDates: [Date],
    advanceBookingDays: { type: Number, default: 30 }
  },

  // Performance Metrics
  metrics: {
    totalBookings: { type: Number, default: 0 },
    completedEvents: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    responseTimeHours: { type: Number, default: 24 },
    repeatCustomerRate: { type: Number, default: 0 }
  },

  // Status
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  
  // SEO & Search
  searchTags: [String],
  seoTitle: String,
  seoDescription: String

}, {
  timestamps: true
});

// Indexes for search and recommendations
vendorServiceSchema.index({ 'serviceInfo.category': 1, 'serviceInfo.eventTypes': 1 });
vendorServiceSchema.index({ 'serviceInfo.budgetRange.min': 1, 'serviceInfo.budgetRange.max': 1 });
vendorServiceSchema.index({ 'metrics.rating': -1 });
vendorServiceSchema.index({ 'serviceInfo.title': 'text', 'serviceInfo.description': 'text' });

module.exports = mongoose.model('VendorService', vendorServiceSchema);
