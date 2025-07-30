const RecommendationProfile = require('../models/RecommendationProfile');
const VendorService = require('../models/VendorService');
const Vendor = require('../models/Vendor');

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
        
        // Add computed scores
        {
          $addFields: {
            // Calculate compatibility scores
            budgetScore: this.calculateBudgetScore(budget),
            guestCountScore: this.calculateGuestCountScore(guestCount),
            styleScore: this.calculateStyleScore(style),
            experienceScore: '$qualityIndicators.yearsOfExperience',
            ratingScore: { $avg: '$services.metrics.rating' },
            
            // Calculate overall recommendation score
            totalScore: {
              $add: [
                { $multiply: [this.calculateBudgetScore(budget), '$algorithmWeights.priceWeight'] },
                { $multiply: [this.calculateLocationScore(location), '$algorithmWeights.locationWeight'] },
                { $multiply: [{ $avg: '$services.metrics.rating' }, '$algorithmWeights.ratingWeight'] },
                { $multiply: [this.calculateAvailabilityScore(date), '$algorithmWeights.availabilityWeight'] },
                { $multiply: ['$qualityIndicators.yearsOfExperience', '$algorithmWeights.experienceWeight'] },
                { $multiply: [this.calculateStyleScore(style), '$algorithmWeights.styleMatchWeight'] }
              ]
            }
          }
        },
        
        // Sort by recommendation score
        { $sort: { totalScore: -1 } },
        
        // Limit results
        { $limit: 20 }
      ];

      const recommendations = await RecommendationProfile.aggregate(pipeline);
      
      return {
        success: true,
        recommendations: recommendations.map(rec => ({
          vendorId: rec.vendorId,
          vendor: rec.vendor[0],
          services: rec.services,
          scores: {
            overall: rec.totalScore,
            budget: rec.budgetScore,
            guestCount: rec.guestCountScore,
            style: rec.styleScore,
            experience: rec.experienceScore,
            rating: rec.ratingScore
          },
          matchReasons: this.generateMatchReasons(rec, eventRequirements)
        }))
      };

    } catch (error) {
      console.error('Recommendation service error:', error);
      throw error;
    }
  }

  // Calculate budget compatibility score
  calculateBudgetScore(eventBudget) {
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

  // Generate human-readable match reasons
  generateMatchReasons(recommendation, eventRequirements) {
    const reasons = [];
    
    if (recommendation.budgetScore >= 8) {
      reasons.push('Perfect budget match for your event');
    }
    
    if (recommendation.guestCountScore >= 8) {
      reasons.push(`Expert in ${eventRequirements.guestCount}-guest events`);
    }
    
    if (recommendation.ratingScore >= 4.5) {
      reasons.push('Highly rated by previous clients');
    }
    
    if (recommendation.qualityIndicators?.yearsOfExperience >= 5) {
      reasons.push(`${recommendation.qualityIndicators.yearsOfExperience}+ years of experience`);
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

      return { success: true };
    } catch (error) {
      console.error('Learning data update error:', error);
      throw error;
    }
  }
}

module.exports = new RecommendationService();

// Recommendation System Questions for Vendor Registration
export const RECOMMENDATION_QUESTIONS = {
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