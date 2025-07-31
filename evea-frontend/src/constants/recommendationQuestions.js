// constants/recommendationQuestions.js
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
        { value: 'religious', label: 'Religious Ceremonies', description: 'Festivals and rituals' },
        { value: 'graduation', label: 'Graduations', description: 'Academic celebrations' }
      ],
      required: true,
      multiple: true
    },
    {
      id: 'guest_capacity_expertise',
      question: 'What guest count ranges do you handle best?',
      type: 'multiple_choice',
      options: [
        { value: 'intimate', label: 'Intimate (1-50 guests)' },
        { value: 'medium', label: 'Medium (51-200 guests)' },
        { value: 'large', label: 'Large (201-500 guests)' },
        { value: 'massive', label: 'Grand (500+ guests)' }
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
      type: 'text',
      placeholder: 'Enter cities you serve (comma separated)',
      required: true
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
        { value: 'maharashtrian', label: 'Maharashtrian' },
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
      type: 'multiple_choice',
      options: [
        { value: 'traditional', label: 'Traditional' },
        { value: 'modern', label: 'Modern' },
        { value: 'vintage', label: 'Vintage' },
        { value: 'minimalist', label: 'Minimalist' },
        { value: 'glamorous', label: 'Glamorous' },
        { value: 'royal', label: 'Royal' },
        { value: 'bohemian', label: 'Bohemian' },
        { value: 'rustic', label: 'Rustic' }
      ],
      multiple: true
    },
    {
      id: 'color_schemes',
      question: 'Which color schemes do you work best with?',
      type: 'multiple_choice',
      options: [
        { value: 'pastels', label: 'Pastels' },
        { value: 'vibrant', label: 'Vibrant Colors' },
        { value: 'monochrome', label: 'Monochrome' },
        { value: 'gold_red', label: 'Gold & Red' },
        { value: 'pink_gold', label: 'Pink & Gold' },
        { value: 'blue_silver', label: 'Blue & Silver' },
        { value: 'multicolor', label: 'Multicolor' }
      ],
      multiple: true
    }
  ],
  
  qualityIndicators: [
    {
      id: 'years_of_experience',
      question: 'How many years of experience do you have in this industry?',
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
    },
    {
      id: 'team_size',
      question: 'What is your typical team size for events?',
      type: 'single_choice',
      options: [
        { value: 'solo', label: 'Solo (Just me)' },
        { value: 'small', label: 'Small team (2-5 people)' },
        { value: 'medium', label: 'Medium team (6-15 people)' },
        { value: 'large', label: 'Large team (15+ people)' }
      ],
      required: true
    }
  ]
};
