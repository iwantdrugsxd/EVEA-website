const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Vendor = require('../models/Vendor');
const VendorService = require('../models/VendorService');
const RecommendationProfile = require('../models/RecommendationProfile');

async function migrateVendorData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🔄 Running data migration...');

    // Example migration: Add profileCompletion field to existing vendors
    const vendorsWithoutCompletion = await Vendor.find({ profileCompletion: { $exists: false } });
    
    for (const vendor of vendorsWithoutCompletion) {
      let completion = 0;
      
      // Calculate completion based on filled fields
      if (vendor.businessInfo?.businessName) completion += 20;
      if (vendor.businessInfo?.email) completion += 10;
      if (vendor.businessInfo?.phone) completion += 10;
      if (vendor.verification?.panNumber) completion += 20;
      if (vendor.registrationStatus === 'approved') completion += 40;
      
      vendor.profileCompletion = completion;
      await vendor.save();
    }

    // Example migration: Create recommendation profiles for approved vendors without them
    const approvedVendors = await Vendor.find({ 
      registrationStatus: 'approved',
      _id: { 
        $nin: await RecommendationProfile.distinct('vendorId')
      }
    });

    for (const vendor of approvedVendors) {
      const profile = new RecommendationProfile({
        vendorId: vendor._id,
        eventExpertise: {
          primaryEventTypes: vendor.primaryCategories || ['wedding'],
          eventSizeExpertise: {
            medium: { min: 51, max: 200, isExpert: true }
          }
        },
        qualityIndicators: {
          responseTime: 24,
          yearsOfExperience: vendor.businessInfo?.establishedYear ? 
            new Date().getFullYear() - vendor.businessInfo.establishedYear : 1,
          completionRate: 100,
          repeatClientRate: 0,
          referralRate: 0
        }
      });

      await profile.save();
    }

    console.log(`✅ Migration completed:`);
    console.log(`   - Updated ${vendorsWithoutCompletion.length} vendor profiles`);
    console.log(`   - Created ${approvedVendors.length} recommendation profiles`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📄 Database connection closed');
  }
}

if (require.main === module) {
  migrateVendorData();
}

module.exports = { migrateVendorData };