const mongoose = require('mongoose');

const recommendationProfileSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
    unique: true
  },
  
  // Event Type Expertise & Preferences
  eventExpertise: {
    primaryEventTypes: [{
      type: String,
      enum: ['wedding', 'birthday', 'corporate', 'anniversary', 'baby_shower', 'engagement', 
             'reception', 'sangeet', 'mehendi', 'cocktail', 'conference', 'seminar', 
             'product_launch', 'exhibition', 'religious', 'graduation', 'festival']
    }],
    
    // Specialized sub-categories
    weddingSpecialties: [{
      type: String,
      enum: ['traditional_indian', 'destination', 'intimate', 'grand_celebration', 
             'multi_day', 'inter_cultural', 'themed', 'outdoor', 'palace_wedding']
    }],
    
    corporateSpecialties: [{
      type: String,
      enum: ['conferences', 'team_building', 'product_launches', 'award_ceremonies', 
             'board_meetings', 'company_parties', 'training_sessions', 'trade_shows']
    }],
    
    eventSizeExpertise: {
      intimate: { min: 1, max: 50, isExpert: Boolean },      // 1-50 guests
      medium: { min: 51, max: 200, isExpert: Boolean },       // 51-200 guests
      large: { min: 201, max: 500, isExpert: Boolean },       // 201-500 guests
      massive: { min: 501, max: 2000, isExpert: Boolean }     // 500+ guests
    }
  },

  // Budget & Pricing Expertise
  budgetExpertise: {
    economySegment: { min: 5000, max: 50000, isExpert: Boolean },      // Budget-friendly
    midSegment: { min: 50000, max: 200000, isExpert: Boolean },        // Mid-range
    premiumSegment: { min: 200000, max: 500000, isExpert: Boolean },   // Premium
    luxurySegment: { min: 500000, max: 2000000, isExpert: Boolean }    // Luxury
  },

  // Geographic & Cultural Expertise
  geographicExpertise: {
    serviceAreas: [{
      city: String,
      state: String,
      radiusKm: Number,
      isHomeBased: Boolean,
      travelCharges: Number
    }],
    
    culturalExpertise: [{
      type: String,
      enum: ['north_indian', 'south_indian', 'bengali', 'punjabi', 'gujarati', 
             'maharashtrian', 'rajasthani', 'western', 'international', 'fusion']
    }],
    
    languagesSpoken: [String],
    
    internationalExperience: {
      hasExperience: Boolean,
      countries: [String],
      destinationWeddingExpert: Boolean
    }
  },

  // Timing & Seasonal Expertise
  temporalExpertise: {
    preferredSeasons: [{
      type: String,
      enum: ['spring', 'summer', 'monsoon', 'autumn', 'winter']
    }],
    
    timePreferences: {
      morning: { start: String, end: String, isPreferred: Boolean },
      afternoon: { start: String, end: String, isPreferred: Boolean },
      evening: { start: String, end: String, isPreferred: Boolean },
      night: { start: String, end: String, isPreferred: Boolean }
    },
    
    advanceBookingPreference: {
      min: Number, // minimum days
      max: Number, // maximum days
      optimal: Number // optimal booking window
    },
    
    peakSeasonExpertise: [{
      type: String,
      enum: ['wedding_season', 'festive_season', 'summer_holidays', 'corporate_year_end']
    }]
  },

  // Service Style & Aesthetic Preferences
  styleExpertise: {
    aestheticStyles: [{
      type: String,
      enum: ['traditional', 'modern', 'vintage', 'rustic', 'minimalist', 'bohemian', 
             'glamorous', 'royal', 'contemporary', 'ethnic', 'fusion', 'themed']
    }],
    
    colorSchemeExpertise: [{
      type: String,
      enum: ['pastels', 'vibrant', 'monochrome', 'gold_red', 'pink_gold', 'blue_silver', 
             'green_gold', 'purple_silver', 'multicolor', 'neutral_tones']
    }],
    
    themeExpertise: [String], // Custom themes like "Bollywood", "Garden Party", etc.
  },

  // Client Demographics & Preferences
  clientDemographics: {
    ageGroupExpertise: [{
      type: String,
      enum: ['gen_z', 'millennials', 'gen_x', 'baby_boomers', 'mixed_age']
    }],
    
    clientPersonalities: [{
      type: String,
      enum: ['detail_oriented', 'laid_back', 'budget_conscious', 'luxury_seeking', 
             'traditional', 'modern', 'experimental', 'minimalist']
    }],
    
    specialRequirements: {
      accessibilityExpert: Boolean,
      petFriendlyEvents: Boolean,
      ecoFriendlyEvents: Boolean,
      vegan_vegetarianExpert: Boolean,
      religiousRequirements: [String]
    }
  },

  // Collaboration & Vendor Network
  collaborationProfile: {
    preferredVendorTypes: [String], // Other vendor categories they work well with
    hasEstablishedNetwork: Boolean,
    networkStrength: { type: Number, min: 1, max: 10 },
    
    workingStyle: {
      type: String,
      enum: ['lead_coordinator', 'collaborative', 'supportive', 'independent']
    },
    
    communicationStyle: {
      type: String,
      enum: ['highly_responsive', 'scheduled_updates', 'minimal_contact', 'client_preference']
    }
  },

  // Performance & Quality Indicators
  qualityIndicators: {
    responseTime: Number, // Average hours to respond
    completionRate: Number, // Percentage of completed projects
    repeatClientRate: Number, // Percentage of repeat clients
    referralRate: Number, // Percentage from referrals
    
    certifications: [String],
    awards: [String],
    yearsOfExperience: Number,
    
    qualityMarkers: {
      punctuality: { type: Number, min: 1, max: 10 },
      creativity: { type: Number, min: 1, max: 10 },
      problemSolving: { type: Number, min: 1, max: 10 },
      customerService: { type: Number, min: 1, max: 10 }
    }
  },

  // Innovation & Technology Adoption
  technologyProfile: {
    digitalPresence: {
      type: String,
      enum: ['basic', 'moderate', 'advanced', 'cutting_edge']
    },
    
    offerVirtualServices: Boolean,
    usesEventTech: [String], // AR/VR, live streaming, etc.
    onlinePaymentOptions: [String],
    
    socialMediaStrength: {
      platforms: [String],
      followerCount: Number,
      engagementRate: Number
    }
  },

  // Algorithm Weights (for fine-tuning recommendations)
  algorithmWeights: {
    priceWeight: { type: Number, default: 0.25 },
    locationWeight: { type: Number, default: 0.20 },
    ratingWeight: { type: Number, default: 0.20 },
    availabilityWeight: { type: Number, default: 0.15 },
    experienceWeight: { type: Number, default: 0.10 },
    styleMatchWeight: { type: Number, default: 0.10 }
  },

  // Dynamic Learning Data
  learningData: {
    successfulMatches: [{
      eventId: mongoose.Schema.Types.ObjectId,
      clientSatisfaction: Number,
      matchFactors: [String] // What made this match successful
    }],
    
    unsuccessfulMatches: [{
      eventId: mongoose.Schema.Types.ObjectId,
      reasonForFailure: String,
      learningPoints: [String]
    }],
    
    clientFeedbackPatterns: [{
      feedbackType: String,
      frequency: Number,
      improvementAreas: [String]
    }]
  },

  // Seasonal & Market Adaptability
  marketAdaptability: {
    trendAdoption: {
      type: String,
      enum: ['early_adopter', 'fast_follower', 'mainstream', 'traditional']
    },
    
    priceFlexibility: {
      type: String,
      enum: ['fixed', 'seasonal_variation', 'demand_based', 'negotiable']
    },
    
    serviceEvolution: [{
      quarter: String,
      newServices: [String],
      retiredServices: [String]
    }]
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
recommendationProfileSchema.index({ 'eventExpertise.primaryEventTypes': 1 });
recommendationProfileSchema.index({ 'geographicExpertise.serviceAreas.city': 1 });
recommendationProfileSchema.index({ 'budgetExpertise.midSegment.min': 1, 'budgetExpertise.midSegment.max': 1 });
recommendationProfileSchema.index({ 'qualityIndicators.responseTime': 1 });

module.exports = mongoose.model('RecommendationProfile', recommendationProfileSchema);