const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Vendor = require('../models/Vendor');
const VendorService = require('../models/VendorService');
const RecommendationProfile = require('../models/RecommendationProfile');

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

async function createIndexes() {
  try {
    console.log('📄 Creating database indexes...');

    // Vendor indexes
    await Vendor.collection.createIndex({ 'businessInfo.email': 1 }, { unique: true });
    await Vendor.collection.createIndex({ registrationStatus: 1 });
    await Vendor.collection.createIndex({ location: '2dsphere' });
    await Vendor.collection.createIndex({ 'businessInfo.businessName': 'text' });
    
    // VendorService indexes
    await VendorService.collection.createIndex({ vendorId: 1 });
    await VendorService.collection.createIndex({ 'serviceInfo.category': 1, 'serviceInfo.eventTypes': 1 });
    await VendorService.collection.createIndex({ 'serviceInfo.budgetRange.min': 1, 'serviceInfo.budgetRange.max': 1 });
    await VendorService.collection.createIndex({ 'metrics.rating': -1 });
    await VendorService.collection.createIndex({ 'serviceInfo.title': 'text', 'serviceInfo.description': 'text' });
    await VendorService.collection.createIndex({ isApproved: 1, isActive: 1 });
    
    // RecommendationProfile indexes
    await RecommendationProfile.collection.createIndex({ vendorId: 1 }, { unique: true });
    await RecommendationProfile.collection.createIndex({ 'eventExpertise.primaryEventTypes': 1 });
    await RecommendationProfile.collection.createIndex({ 'geographicExpertise.serviceAreas.city': 1 });

    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
}

async function seedSampleData() {
  try {
    console.log('🌱 Seeding sample data...');

    // Check if sample data already exists
    const existingVendor = await Vendor.findOne({ 'businessInfo.email': 'demo@photographyplus.com' });
    if (existingVendor) {
      console.log('⏭️  Sample data already exists, skipping...');
      return;
    }

    // Create sample vendor
    const hashedPassword = await bcrypt.hash('demopassword123', 12);
    
    const sampleVendor = new Vendor({
      businessInfo: {
        businessName: 'Photography Plus Studio',
        businessType: 'sole_proprietorship',
        ownerName: 'Rajesh Kumar',
        email: 'demo@photographyplus.com',
        phone: '9876543210',
        businessAddress: {
          street: '123 Photography Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India'
        },
        businessDescription: 'Professional wedding and event photography services with 8+ years of experience.',
        establishedYear: 2015,
        website: 'https://photographyplus.demo.com'
      },
      password: hashedPassword,
      verification: {
        panNumber: 'ABCDE1234F',
        gstNumber: 'DEMO123456789',
        registrationNumber: 'REG123456789',
        bankDetails: {
          accountHolderName: 'Rajesh Kumar',
          accountNumber: '1234567890',
          ifscCode: 'DEMO0001234',
          bankName: 'Demo Bank',
          branch: 'Mumbai Central'
        },
        documents: {
          businessRegistration: { verified: true, uploadDate: new Date() },
          panCard: { verified: true, uploadDate: new Date() },
          bankStatement: { verified: true, uploadDate: new Date() },
          identityProof: { verified: true, uploadDate: new Date() }
        }
      },
      registrationStatus: 'approved',
      primaryCategories: ['photography'],
      approvedAt: new Date(),
      profileCompletion: 100,
      location: {
        type: 'Point',
        coordinates: [72.8777, 19.0760] // Mumbai coordinates
      }
    });

    await sampleVendor.save();

    // Create sample service
    const sampleService = new VendorService({
      vendorId: sampleVendor._id,
      serviceInfo: {
        title: 'Professional Wedding Photography',
        category: 'photography',
        subcategory: 'wedding_photography',
        description: 'Complete wedding photography coverage with pre-wedding, ceremony, and reception shoots. Includes edited photos, albums, and digital delivery.',
        features: [
          'Pre-wedding photoshoot',
          'Complete ceremony coverage',
          'Reception photography',
          'Professional editing',
          'Digital gallery',
          'Premium wedding album'
        ],
        eventTypes: ['wedding', 'engagement', 'anniversary'],
        guestCapacity: { min: 50, max: 500 },
        budgetRange: { min: 50000, max: 200000 },
        serviceArea: {
          cities: ['Mumbai', 'Pune', 'Nashik'],
          radiusKm: 100
        },
        specializations: ['Traditional Indian Weddings', 'Destination Weddings', 'Candid Photography'],
        themes: ['traditional', 'modern', 'vintage']
      },
      packages: [
        {
          name: 'Basic Package',
          description: 'Essential wedding photography coverage',
          price: 50000,
          duration: '8 hours',
          features: [
            'Single photographer',
            '300+ edited photos',
            'Digital gallery',
            'Basic album (50 photos)'
          ],
          isPopular: false
        },
        {
          name: 'Premium Package',
          description: 'Complete wedding photography experience',
          price: 100000,
          duration: '12 hours',
          features: [
            'Dual photographers',
            '500+ edited photos',
            'Pre-wedding shoot',
            'Premium album (100 photos)',
            'Digital gallery',
            'Same day highlights'
          ],
          isPopular: true
        },
        {
          name: 'Luxury Package',
          description: 'Ultimate wedding photography coverage',
          price: 200000,
          duration: '2 days',
          features: [
            'Team of 3 photographers',
            '800+ edited photos',
            'Pre-wedding + post-wedding shoots',
            'Luxury album (150 photos)',
            'Cinematic highlights video',
            'Drone photography',
            'Digital gallery with unlimited access'
          ],
          isPopular: false
        }
      ],
      availability: {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        workingHours: { start: '08:00', end: '22:00' },
        advanceBookingDays: 60
      },
      metrics: {
        totalBookings: 45,
        completedEvents: 42,
        rating: 4.8,
        reviewCount: 38,
        responseTimeHours: 2,
        repeatCustomerRate: 25
      },
      isActive: true,
      isApproved: true
    });

    await sampleService.save();

    // Create recommendation profile
    const recommendationProfile = new RecommendationProfile({
      vendorId: sampleVendor._id,
      eventExpertise: {
        primaryEventTypes: ['wedding', 'engagement', 'anniversary'],
        weddingSpecialties: ['traditional_indian', 'destination', 'grand_celebration'],
        eventSizeExpertise: {
          intimate: { min: 1, max: 50, isExpert: false },
          medium: { min: 51, max: 200, isExpert: true },
          large: { min: 201, max: 500, isExpert: true },
          massive: { min: 501, max: 2000, isExpert: false }
        }
      },
      budgetExpertise: {
        economySegment: { min: 5000, max: 50000, isExpert: true },
        midSegment: { min: 50000, max: 200000, isExpert: true },
        premiumSegment: { min: 200000, max: 500000, isExpert: false },
        luxurySegment: { min: 500000, max: 2000000, isExpert: false }
      },
      geographicExpertise: {
        serviceAreas: [{
          city: 'Mumbai',
          state: 'Maharashtra',
          radiusKm: 100,
          isHomeBased: true,
          travelCharges: 5000
        }],
        culturalExpertise: ['north_indian', 'south_indian', 'gujarati', 'maharashtrian'],
        languagesSpoken: ['Hindi', 'English', 'Marathi', 'Gujarati']
      },
      styleExpertise: {
        aestheticStyles: ['traditional', 'modern', 'vintage', 'candid'],
        colorSchemeExpertise: ['gold_red', 'pink_gold', 'vibrant', 'pastels']
      },
      qualityIndicators: {
        responseTime: 2,
        yearsOfExperience: 8,
        completionRate: 95,
        repeatClientRate: 25,
        referralRate: 40,
        qualityMarkers: {
          punctuality: 9,
          creativity: 8,
          problemSolving: 9,
          customerService: 9
        }
      }
    });

    await recommendationProfile.save();

    console.log('✅ Sample data created successfully');
    console.log('📧 Demo vendor email: demo@photographyplus.com');
    console.log('🔑 Demo vendor password: demopassword123');
    
  } catch (error) {
    console.error('❌ Error seeding sample data:', error);
  }
}

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...');
    
    await connectDatabase();
    await createIndexes();
    await seedSampleData();
    
    console.log('✅ Database setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Start your backend server: npm run dev');
    console.log('2. Start your frontend: npm start');
    console.log('3. Test vendor login with demo credentials');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📄 Database connection closed');
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase, createIndexes, seedSampleData };