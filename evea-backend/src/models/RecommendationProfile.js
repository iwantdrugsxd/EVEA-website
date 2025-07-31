// evea-backend/src/services/recommendationService.js
const RecommendationProfile = require('../models/RecommendationProfile');
const VendorService = require('../models/VendorService');
const Vendor = require('../models/Vendor');
const logger = require('../config/logger');

class RecommendationService {
  
  // Get vendor recommendations based on event requirements
  async getVendorRecommendations(eventRequirements) {
    try {
      const {
        eventType,
        guestCount,
        budget,
        location,
        date,
        style,
        serviceCategories = [],
        specialRequirements = {}
      } = eventRequirements;

      logger.info('[RECOMMENDATION] Getting vendor recommendations', {
        eventType,
        guestCount,
        budget,
        location
      });

      // Build aggregation pipeline for complex matching
      const pipeline = [
        // Match basic criteria
        {
          $match: {
            'eventExpertise.primaryEventTypes': eventType,
            'geographicExpertise.serviceAreas.city': { $regex: location, $options: 'i' }
          }
        },
        
        // Join with vendor services
        {
          $lookup: {
            from: 'vendorservices',
            localField: 'vendorId',
            foreignField: 'vendorId',
            as: 'services'
          }
        },
        
        // Join with vendor details
        {
          $lookup: {
            from: 'vendors',
            localField: 'vendorId',
            foreignField: '_id',
            as: 'vendor'
          }
        },
        
        // Filter out vendors without services or vendor details
        {
          $match: {
            'services.0': { $exists: true },
            'vendor.0': { $exists: true }
          }
        },
        
        // Add computed scores
        {
          $addFields: {
            vendorInfo: { $arrayElemAt: ['$vendor', 0] },
            avgRating: { $avg: '$services.metrics.rating' },
            budgetScore: this.calculateBudgetScoreAggregation(budget),
            guestCountScore: this.calculateGuestCountScoreAggregation(guestCount),
            experienceScore: '$qualityIndicators.yearsOfExperience',
            responseScore: {
              $cond: {
                if: { $lte: ['$qualityIndicators.responseTime', 4] },
                then: 10,
                else: { $subtract: [10, { $divide: ['$qualityIndicators.responseTime', 2] }] }
              }
            }
          }
        },
        
        // Calculate final recommendation score
        {
          $addFields: {
            totalScore: {
              $add: [
                { $multiply: ['$budgetScore', '$algorithmWeights.priceWeight'] },
                { $multiply: [{ $ifNull: ['$avgRating', 4] }, '$algorithmWeights.ratingWeight'] },
                { $multiply: ['$experienceScore', '$algorithmWeights.experienceWeight'] },
                { $multiply: ['$responseScore', '$algorithmWeights.availabilityWeight'] }
              ]
            }
          }
        },
        
        // Sort by recommendation score
        { $sort: { totalScore: -1 } },
        
        // Limit results
        { $limit: 20 },
        
        // Project final result
        {
          $project: {
            vendorId: 1,
            vendor: '$vendorInfo',
            services: 1,
            totalScore: 1,
            budgetScore: 1,
            guestCountScore: 1,
            avgRating: 1,
            experienceScore: 1,
            responseScore: 1,
            qualityIndicators: 1,
            eventExpertise: 1,
            geographicExpertise: 1
          }
        }
      ];

      const recommendations = await RecommendationProfile.aggregate(pipeline);
      
      // Add match reasons for each recommendation
      const enhancedRecommendations = recommendations.map(rec => ({
        ...rec,
        matchReasons: this.generateMatchReasons(rec, eventRequirements),
        compatibilityPercentage: Math.round((rec.totalScore / 10) * 100)
      }));

      logger.info('[RECOMMENDATION] Generated recommendations', {
        count: enhancedRecommendations.length,
        avgScore: enhancedRecommendations.reduce((sum, r) => sum + r.totalScore, 0) / enhancedRecommendations.length
      });

      return {
        recommendations: enhancedRecommendations,
        eventRequirements,
        totalFound: enhancedRecommendations.length
      };

    } catch (error) {
      logger.logError(error, { action: 'get_vendor_recommendations', eventRequirements });
      throw error;
    }
  }

  // Calculate budget compatibility score for aggregation
  calculateBudgetScoreAggregation(eventBudget) {
    return {
      $cond: {
        if: {
          $and: [
            { $gte: [eventBudget, '$budgetExpertise.midSegment.min'] },
            { $lte: [eventBudget, '$budgetExpertise.midSegment.max'] },
            { $eq: ['$budgetExpertise.midSegment.isExpert', true] }
          ]
        },
        then: 10,
        else: {
          $cond: {
            if: {
              $or: [
                {
                  $and: [
                    { $gte: [eventBudget, '$budgetExpertise.economySegment.min'] },
                    { $lte: [eventBudget, '$budgetExpertise.economySegment.max'] },
                    { $eq: ['$budgetExpertise.economySegment.isExpert', true] }
                  ]
                },
                {
                  $and: [
                    { $gte: [eventBudget, '$budgetExpertise.premiumSegment.min'] },
                    { $lte: [eventBudget, '$budgetExpertise.premiumSegment.max'] },
                    { $eq: ['$budgetExpertise.premiumSegment.isExpert', true] }
                  ]
                },
                {
                  $and: [
                    { $gte: [eventBudget, '$budgetExpertise.luxurySegment.min'] },
                    { $lte: [eventBudget, '$budgetExpertise.luxurySegment.max'] },
                    { $eq: ['$budgetExpertise.luxurySegment.isExpert', true] }
                  ]
                }
              ]
            },
            then: 8,
            else: 5
          }
        }
      }
    };
  }

  // Calculate guest count compatibility score for aggregation
  calculateGuestCountScoreAggregation(guestCount) {
    return {
      $cond: {
        if: {
          $or: [
            {
              $and: [
                { $gte: [guestCount, '$eventExpertise.eventSizeExpertise.intimate.min'] },
                { $lte: [guestCount, '$eventExpertise.eventSizeExpertise.intimate.max'] },
                { $eq: ['$eventExpertise.eventSizeExpertise.intimate.isExpert', true] }
              ]
            },
            {
              $and: [
                { $gte: [guestCount, '$eventExpertise.eventSizeExpertise.medium.min'] },
                { $lte: [guestCount, '$eventExpertise.eventSizeExpertise.medium.max'] },
                { $eq: ['$eventExpertise.eventSizeExpertise.medium.isExpert', true] }
              ]
            },
            {
              $and: [
                { $gte: [guestCount, '$eventExpertise.eventSizeExpertise.large.min'] },
                { $lte: [guestCount, '$eventExpertise.eventSizeExpertise.large.max'] },
                { $eq: ['$eventExpertise.eventSizeExpertise.large.isExpert', true] }
              ]
            },
            {
              $and: [
                { $gte: [guestCount, '$eventExpertise.eventSizeExpertise.massive.min'] },
                { $lte: [guestCount, '$eventExpertise.eventSizeExpertise.massive.max'] },
                { $eq: ['$eventExpertise.eventSizeExpertise.massive.isExpert', true] }
              ]
            }
          ]
        },
        then: 10,
        else: 6
      }
    };
  }

  // Generate human-readable match reasons
  generateMatchReasons(recommendation, eventRequirements) {
    const reasons = [];
    
    if (recommendation.budgetScore >= 8) {
      reasons.push('Perfect budget match for your event');
    }
    
    if (recommendation.guestCountScore >= 8) {
      reasons.push(`Expert in ${eventRequirements.guestCount}-guest events`);
    }
    
    if (recommendation.avgRating >= 4.5) {
      reasons.push('Highly rated by previous clients');
    }
    
    if (recommendation.qualityIndicators?.yearsOfExperience >= 5) {
      reasons.push(`${recommendation.qualityIndicators.yearsOfExperience}+ years of experience`);
    }

    if (recommendation.responseScore >= 8) {
      reasons.push('Quick response time');
    }
    
    return reasons;
  }

  // Get vendor categories for filtering
  async getAvailableCategories(location) {
    try {
      const categories = await RecommendationProfile.aggregate([
        {
          $match: {
            'geographicExpertise.serviceAreas.city': { $regex: location, $options: 'i' }
          }
        },
        {
          $lookup: {
            from: 'vendorservices',
            localField: 'vendorId',
            foreignField: 'vendorId',
            as: 'services'
          }
        },
        {
          $unwind: '$services'
        },
        {
          $group: {
            _id: '$services.category',
            count: { $sum: 1 },
            avgPrice: { $avg: '$services.pricing.basePrice' }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      return categories;
    } catch (error) {
      logger.logError(error, { action: 'get_available_categories', location });
      throw error;
    }
  }

  // Update recommendation profile based on booking success/failure
  async updateLearningData(vendorId, bookingData) {
    try {
      const { eventId, wasSuccessful, clientFeedback, satisfactionScore } = bookingData;
      
      const updateData = wasSuccessful ? {
        $push: {
          'learningData.successfulMatches': {
            eventId,
            clientSatisfaction: satisfactionScore,
            matchFactors: this.extractMatchFactors(clientFeedback)
          }
        }
      } : {
        $push: {
          'learningData.unsuccessfulMatches': {
            eventId,
            reasonForFailure: clientFeedback.reason,
            learningPoints: this.extractLearningPoints(clientFeedback)
          }
        }
      };

      await RecommendationProfile.findOneAndUpdate(
        { vendorId },
        updateData
      );

      return { success: true };
    } catch (error) {
      logger.logError(error, { action: 'update_learning_data', vendorId });
      throw error;
    }
  }

  // Helper method to extract match factors from feedback
  extractMatchFactors(feedback) {
    const factors = [];
    
    if (feedback.pricing && feedback.pricing >= 4) factors.push('competitive_pricing');
    if (feedback.communication && feedback.communication >= 4) factors.push('excellent_communication');
    if (feedback.quality && feedback.quality >= 4) factors.push('high_quality_service');
    if (feedback.punctuality && feedback.punctuality >= 4) factors.push('punctual_delivery');
    
    return factors;
  }

  // Helper method to extract learning points from failed bookings
  extractLearningPoints(feedback) {
    const points = [];
    
    if (feedback.pricing && feedback.pricing < 3) points.push('pricing_too_high');
    if (feedback.communication && feedback.communication < 3) points.push('poor_communication');
    if (feedback.availability && feedback.availability < 3) points.push('availability_issues');
    
    return points;
  }

  // Create or update recommendation profile for a vendor
  async createRecommendationProfile(vendorId, profileData) {
    try {
      const existingProfile = await RecommendationProfile.findOne({ vendorId });
      
      if (existingProfile) {
        // Update existing profile
        Object.assign(existingProfile, profileData);
        await existingProfile.save();
        logger.info('[RECOMMENDATION] Profile updated', { vendorId });
        return existingProfile;
      } else {
        // Create new profile
        const newProfile = new RecommendationProfile({
          vendorId,
          ...profileData
        });
        await newProfile.save();
        logger.info('[RECOMMENDATION] Profile created', { vendorId });
        return newProfile;
      }
    } catch (error) {
      logger.logError(error, { action: 'create_recommendation_profile', vendorId });
      throw error;
    }
  }

  // Get recommendation analytics for admin dashboard
  async getRecommendationAnalytics() {
    try {
      const analytics = await RecommendationProfile.aggregate([
        {
          $group: {
            _id: null,
            totalProfiles: { $sum: 1 },
            avgExperience: { $avg: '$qualityIndicators.yearsOfExperience' },
            avgResponseTime: { $avg: '$qualityIndicators.responseTime' },
            topEventTypes: { $push: '$eventExpertise.primaryEventTypes' }
          }
        },
        {
          $project: {
            _id: 0,
            totalProfiles: 1,
            avgExperience: { $round: ['$avgExperience', 1] },
            avgResponseTime: { $round: ['$avgResponseTime', 1] },
            topEventTypes: {
              $reduce: {
                input: '$topEventTypes',
                initialValue: [],
                in: { $concatArrays: ['$$value', '$$this'] }
              }
            }
          }
        }
      ]);

      return analytics[0] || {
        totalProfiles: 0,
        avgExperience: 0,
        avgResponseTime: 24,
        topEventTypes: []
      };
    } catch (error) {
      logger.logError(error, { action: 'get_recommendation_analytics' });
      throw error;
    }
  }
}

// Recommendation System Questions for Vendor Registration
const RECOMMENDATION_QUESTIONS = {
  eventExpertise: [
    {
      id: 'primary_event_types',
      question: 'What types of events do you specialize in?',
      type: 'multiselect',
      options: ['wedding', 'birthday', 'corporate', 'anniversary', 'baby_shower', 'engagement', 
               'reception', 'sangeet', 'mehendi', 'cocktail', 'conference', 'seminar']
    },
    {
      id: 'event_size_expertise',
      question: 'What event sizes are you most experienced with?',
      type: 'checkbox_grid',
      options: [
        { id: 'intimate', label: '1-50 guests', range: [1, 50] },
        { id: 'medium', label: '51-200 guests', range: [51, 200] },
        { id: 'large', label: '201-500 guests', range: [201, 500] },
        { id: 'massive', label: '500+ guests', range: [501, 2000] }
      ]
    }
  ],
  
  budgetExpertise: [
    {
      id: 'budget_segments',
      question: 'Which budget ranges do you work with most effectively?',
      type: 'checkbox_grid',
      options: [
        { id: 'economy', label: '₹5,000 - ₹50,000', range: [5000, 50000] },
        { id: 'mid', label: '₹50,000 - ₹2,00,000', range: [50000, 200000] },
        { id: 'premium', label: '₹2,00,000 - ₹5,00,000', range: [200000, 500000] },
        { id: 'luxury', label: '₹5,00,000+', range: [500000, 2000000] }
      ]
    }
  ],
  
  geographicExpertise: [
    {
      id: 'service_areas',
      question: 'What areas do you serve?',
      type: 'location_picker',
      allowMultiple: true
    },
    {
      id: 'cultural_expertise',
      question: 'What cultural styles do you specialize in?',
      type: 'multiselect',
      options: ['north_indian', 'south_indian', 'bengali', 'punjabi', 'gujarati', 
               'maharashtrian', 'rajasthani', 'western', 'international', 'fusion']
    }
  ],

  styleExpertise: [
    {
      id: 'aesthetic_styles',
      question: 'What aesthetic styles do you excel at?',
      type: 'multiselect',
      options: ['traditional', 'modern', 'vintage', 'rustic', 'minimalist', 'bohemian', 
               'glamorous', 'royal', 'contemporary', 'ethnic', 'fusion', 'themed']
    }
  ],

  qualityIndicators: [
    {
      id: 'response_time',
      question: 'What is your typical response time to client inquiries?',
      type: 'select',
      options: [
        { value: 1, label: 'Within 1 hour' },
        { value: 4, label: 'Within 4 hours' },
        { value: 12, label: 'Within 12 hours' },
        { value: 24, label: 'Within 24 hours' },
        { value: 48, label: 'Within 48 hours' }
      ]
    },
    {
      id: 'years_of_experience',
      question: 'How many years of experience do you have?',
      type: 'number',
      min: 0,
      max: 50
    }
  ]
};

// Export both the service instance and questions
module.exports = {
  recommendationService: new RecommendationService(),
  RECOMMENDATION_QUESTIONS
};