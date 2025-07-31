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
        serviceCategories,
        specialRequirements
      } = eventRequirements;

      logger.info('[RECOMMENDATION] Processing request', {
        eventType, guestCount, budget, location
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
        
        // Filter out vendors without services or details
        {
          $match: {
            'services.0': { $exists: true },
            'vendor.0': { $exists: true }
          }
        },
        
        // Add computed scores using static aggregation expressions
        {
          $addFields: {
            vendorInfo: { $arrayElemAt: ['$vendor', 0] },
            avgRating: { $avg: '$services.metrics.rating' },
            
            // Budget compatibility score
            budgetScore: {
              $cond: {
                if: {
                  $and: [
                    { $gte: [budget, '$budgetExpertise.midSegment.min'] },
                    { $lte: [budget, '$budgetExpertise.midSegment.max'] },
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
                            { $gte: [budget, '$budgetExpertise.economySegment.min'] },
                            { $lte: [budget, '$budgetExpertise.economySegment.max'] },
                            { $eq: ['$budgetExpertise.economySegment.isExpert', true] }
                          ]
                        },
                        {
                          $and: [
                            { $gte: [budget, '$budgetExpertise.premiumSegment.min'] },
                            { $lte: [budget, '$budgetExpertise.premiumSegment.max'] },
                            { $eq: ['$budgetExpertise.premiumSegment.isExpert', true] }
                          ]
                        },
                        {
                          $and: [
                            { $gte: [budget, '$budgetExpertise.luxurySegment.min'] },
                            { $lte: [budget, '$budgetExpertise.luxurySegment.max'] },
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
            },
            
            // Guest count compatibility score
            guestCountScore: {
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
            },
            
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
        
        // Calculate overall recommendation score
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
      
      // Enhance recommendations with match reasons
      const enhancedRecommendations = recommendations.map(rec => ({
        vendorId: rec.vendorId,
        vendor: rec.vendor,
        services: rec.services,
        scores: {
          overall: rec.totalScore,
          budget: rec.budgetScore,
          guestCount: rec.guestCountScore,
          experience: rec.experienceScore,
          rating: rec.avgRating,
          response: rec.responseScore
        },
        matchReasons: this.generateMatchReasons(rec, eventRequirements),
        compatibilityPercentage: Math.round((rec.totalScore / 10) * 100)
      }));

      logger.info('[RECOMMENDATION] Generated recommendations', {
        count: enhancedRecommendations.length
      });

      return {
        success: true,
        recommendations: enhancedRecommendations,
        eventRequirements,
        totalFound: enhancedRecommendations.length
      };

    } catch (error) {
      logger.logError(error, { action: 'get_vendor_recommendations', eventRequirements });
      throw error;
    }
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

      logger.info('[RECOMMENDATION] Learning data updated', { vendorId, wasSuccessful });
      return { success: true };
    } catch (error) {
      logger.logError(error, { action: 'update_learning_data', vendorId });
      throw error;
    }
  }

  // Helper methods for learning data
  extractMatchFactors(feedback) {
    const factors = [];
    
    if (feedback.pricing && feedback.pricing >= 4) factors.push('competitive_pricing');
    if (feedback.communication && feedback.communication >= 4) factors.push('excellent_communication');
    if (feedback.quality && feedback.quality >= 4) factors.push('high_quality_service');
    if (feedback.punctuality && feedback.punctuality >= 4) factors.push('punctual_delivery');
    
    return factors;
  }

  extractLearningPoints(feedback) {
    const points = [];
    
    if (feedback.pricing && feedback.pricing < 3) points.push('pricing_too_high');
    if (feedback.communication && feedback.communication < 3) points.push('poor_communication');
    if (feedback.availability && feedback.availability < 3) points.push('availability_issues');
    
    return points;
  }

  // Get available vendor categories for location
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

  // Create recommendation profile for vendor
  async createRecommendationProfile(vendorId, profileData) {
    try {
      const profile = new RecommendationProfile({
        vendorId,
        ...profileData
      });

      await profile.save();
      logger.info('[RECOMMENDATION] Profile created for vendor', { vendorId });
      return profile;
    } catch (error) {
      logger.logError(error, { action: 'create_recommendation_profile', vendorId });
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
      type: 'multiple_choice',
      options: [
        { value: 'wedding', label: 'Weddings', description: 'Traditional & destination weddings' },
        { value: 'corporate', label: 'Corporate Events', description: 'Conferences, team building, launches' },
        { value: 'birthday', label: 'Birthday Parties', description: 'All age groups and themes' },
        { value: 'anniversary', label: 'Anniversaries', description: 'Milestone celebrations' },
        { value: 'religious', label: 'Religious Ceremonies', description: 'Festivals and rituals' }
      ],
      required: true,
      multiple: true
    },
    {
      id: 'guest_capacity_expertise',
      question: 'What guest count ranges do you handle best?',
      type: 'checkbox_range',
      options: [
        { value: 'intimate', label: 'Intimate (1-50 guests)', range: [1, 50] },
        { value: 'medium', label: 'Medium (51-200 guests)', range: [51, 200] },
        { value: 'large', label: 'Large (201-500 guests)', range: [201, 500] },
        { value: 'massive', label: 'Grand (500+ guests)', range: [500, 2000] }
      ],
      required: true,
      multiple: true
    }
  ],
  
  budgetExpertise: [
    {
      id: 'budget_segments',
      question: 'Which budget segments do you cater to?',
      type: 'budget_range',
      options: [
        { value: 'economy', label: 'Budget-Friendly', range: [5000, 50000] },
        { value: 'mid', label: 'Mid-Range', range: [50000, 200000] },
        { value: 'premium', label: 'Premium', range: [200000, 500000] },
        { value: 'luxury', label: 'Luxury', range: [500000, 2000000] }
      ],
      required: true,
      multiple: true
    }
  ],
  
  geographicExpertise: [
    {
      id: 'service_areas',
      question: 'What are your primary service areas?',
      type: 'location_picker',
      fields: ['city', 'state', 'radius_km'],
      required: true,
      multiple: true
    },
    {
      id: 'cultural_expertise',
      question: 'Which cultural traditions do you specialize in?',
      type: 'multiple_choice',
      options: [
        { value: 'north_indian', label: 'North Indian' },
        { value: 'south_indian', label: 'South Indian' },
        { value: 'bengali', label: 'Bengali' },
        { value: 'punjabi', label: 'Punjabi' },
        { value: 'gujarati', label: 'Gujarati' },
        { value: 'western', label: 'Western' },
        { value: 'international', label: 'International' }
      ],
      multiple: true
    }
  ],
  
  styleExpertise: [
    {
      id: 'aesthetic_styles',
      question: 'What aesthetic styles do you excel in?',
      type: 'style_picker',
      options: [
        { value: 'traditional', label: 'Traditional', image: '/styles/traditional.jpg' },
        { value: 'modern', label: 'Modern', image: '/styles/modern.jpg' },
        { value: 'vintage', label: 'Vintage', image: '/styles/vintage.jpg' },
        { value: 'minimalist', label: 'Minimalist', image: '/styles/minimalist.jpg' },
        { value: 'glamorous', label: 'Glamorous', image: '/styles/glamorous.jpg' },
        { value: 'royal', label: 'Royal', image: '/styles/royal.jpg' }
      ],
      multiple: true
    }
  ],
  
  qualityIndicators: [
    {
      id: 'years_of_experience',
      question: 'How many years of experience do you have?',
      type: 'number',
      min: 0,
      max: 50,
      required: true
    },
    {
      id: 'response_time',
      question: 'What is your typical response time to client inquiries?',
      type: 'single_choice',
      options: [
        { value: 1, label: 'Within 1 hour' },
        { value: 4, label: 'Within 4 hours' },
        { value: 12, label: 'Within 12 hours' },
        { value: 24, label: 'Within 24 hours' },
        { value: 48, label: 'Within 48 hours' }
      ],
      required: true
    }
  ]
};

// Export both the service instance and questions using CommonJS
module.exports = {
  recommendationService: new RecommendationService(),
  RECOMMENDATION_QUESTIONS
};