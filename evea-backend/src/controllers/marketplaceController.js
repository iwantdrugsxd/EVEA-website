const recommendationService = require('../services/recommendationService');

// Get marketplace services with filtering and search
exports.getMarketplaceServices = async (req, res) => {
  try {
    const {
      category,
      location,
      minPrice,
      maxPrice,
      rating,
      availability,
      eventType,
      guestCount,
      style,
      page = 1,
      limit = 12,
      sortBy = 'rating',
      sortOrder = 'desc',
      search
    } = req.query;

    // Build query
    const query = {
      isApproved: true,
      isActive: true
    };

    // Join with vendor data
    const pipeline = [
      // Match active and approved services
      { $match: query },
      
      // Join with vendor data
      {
        $lookup: {
          from: 'vendors',
          localField: 'vendorId',
          foreignField: '_id',
          as: 'vendor'
        }
      },
      
      // Only include approved vendors
      {
        $match: {
          'vendor.registrationStatus': 'approved'
        }
      },
      
      // Add filters
      ...(category ? [{ $match: { 'serviceInfo.category': category } }] : []),
      ...(location ? [{ 
        $match: { 
          $or: [
            { 'serviceInfo.serviceArea.cities': { $regex: location, $options: 'i' } },
            { 'vendor.businessInfo.businessAddress.city': { $regex: location, $options: 'i' } }
          ]
        } 
      }] : []),
      ...(minPrice || maxPrice ? [{
        $match: {
          'serviceInfo.budgetRange.min': { 
            ...(minPrice ? { $gte: parseInt(minPrice) } : {}),
            ...(maxPrice ? { $lte: parseInt(maxPrice) } : {})
          }
        }
      }] : []),
      ...(rating ? [{ $match: { 'metrics.rating': { $gte: parseFloat(rating) } } }] : []),
      ...(eventType ? [{ $match: { 'serviceInfo.eventTypes': eventType } }] : []),
      
      // Search functionality
      ...(search ? [{
        $match: {
          $or: [
            { 'serviceInfo.title': { $regex: search, $options: 'i' } },
            { 'serviceInfo.description': { $regex: search, $options: 'i' } },
            { 'vendor.businessInfo.businessName': { $regex: search, $options: 'i' } },
            { 'serviceInfo.specializations': { $regex: search, $options: 'i' } }
          ]
        }
      }] : []),
      
      // Add computed fields
      {
        $addFields: {
          averageRating: '$metrics.rating',
          totalReviews: '$metrics.reviewCount',
          completedEvents: '$metrics.completedEvents',
          responseTime: '$metrics.responseTimeHours'
        }
      },
      
      // Sort
      {
        $sort: {
          [sortBy]: sortOrder === 'desc' ? -1 : 1
        }
      },
      
      // Pagination
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
      
      // Project final shape
      {
        $project: {
          _id: 1,
          vendorId: 1,
          serviceInfo: 1,
          packages: 1,
          media: 1,
          metrics: 1,
          availability: 1,
          vendor: { $arrayElemAt: ['$vendor', 0] },
          averageRating: 1,
          totalReviews: 1,
          completedEvents: 1,
          responseTime: 1
        }
      }
    ];

    const services = await VendorService.aggregate(pipeline);
    
    // Get total count for pagination
    const totalQuery = [...pipeline.slice(0, -3)]; // Remove sort, skip, limit, project
    totalQuery.push({ $count: 'total' });
    const totalResult = await VendorService.aggregate(totalQuery);
    const total = totalResult[0]?.total || 0;

    res.json({
      success: true,
      data: {
        services,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalServices: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        },
        filters: {
          category,
          location,
          priceRange: { min: minPrice, max: maxPrice },
          rating,
          eventType,
          search
        }
      }
    });

  } catch (error) {
    console.error('Get marketplace services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch marketplace services',
      error: error.message
    });
  }
};

// Get vendor details for marketplace
exports.getVendorDetails = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await Vendor.findById(vendorId)
      .select('-password')
      .lean();

    if (!vendor || vendor.registrationStatus !== 'approved') {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found or not approved'
      });
    }

    // Get vendor services
    const services = await VendorService.find({ 
      vendorId, 
      isApproved: true, 
      isActive: true 
    }).lean();

    // Get vendor reviews (you'll need to create this)
    // const reviews = await VendorReview.find({ vendorId, isVisible: true })
    //   .populate('customerId', 'name')
    //   .sort({ createdAt: -1 })
    //   .limit(10);

    // Calculate vendor statistics
    const stats = {
      totalServices: services.length,
      averageRating: services.reduce((sum, s) => sum + s.metrics.rating, 0) / services.length || 0,
      totalReviews: services.reduce((sum, s) => sum + s.metrics.reviewCount, 0),
      completedEvents: services.reduce((sum, s) => sum + s.metrics.completedEvents, 0),
      responseTime: Math.min(...services.map(s => s.metrics.responseTimeHours)) || 24
    };

    res.json({
      success: true,
      data: {
        vendor,
        services,
        stats,
        // reviews
      }
    });

  } catch (error) {
    console.error('Get vendor details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor details',
      error: error.message
    });
  }
};

// Search vendors with recommendations
exports.searchVendors = async (req, res) => {
  try {
    const {
      eventType,
      guestCount,
      budget,
      location,
      date,
      style,
      serviceCategories
    } = req.query;

    // If enough parameters for recommendation, use recommendation service
    if (eventType && guestCount && budget && location) {
      const eventRequirements = {
        eventType,
        guestCount: parseInt(guestCount),
        budget: parseInt(budget),
        location,
        date: date ? new Date(date) : null,
        style,
        serviceCategories: serviceCategories ? serviceCategories.split(',') : []
      };

      const recommendations = await recommendationService.getVendorRecommendations(eventRequirements);
      
      return res.json({
        success: true,
        data: {
          recommendations: recommendations.recommendations,
          searchType: 'recommendation',
          eventRequirements
        }
      });
    }

    // Otherwise, fall back to regular search
    return this.getMarketplaceServices(req, res);

  } catch (error) {
    console.error('Search vendors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search vendors',
      error: error.message
    });
  }
};

// Get marketplace statistics
exports.getMarketplaceStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      Vendor.countDocuments({ registrationStatus: 'approved' }),
      VendorService.countDocuments({ isApproved: true, isActive: true }),
      VendorService.aggregate([
        { $match: { isApproved: true, isActive: true } },
        { $group: { _id: null, totalEvents: { $sum: '$metrics.completedEvents' } } }
      ]),
      VendorService.aggregate([
        { $match: { isApproved: true, isActive: true } },
        { $group: { _id: '$serviceInfo.category', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalVendors: stats[0],
        totalServices: stats[1],
        totalEvents: stats[2][0]?.totalEvents || 0,
        categoriesBreakdown: stats[3]
      }
    });

  } catch (error) {
    console.error('Get marketplace stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch marketplace statistics',
      error: error.message
    });
  }
};

module.exports = {
  // Admin exports
  getAllVendorApplications: exports.getAllVendorApplications,
  getVendorApplicationById: exports.getVendorApplicationById,
  approveVendorApplication: exports.approveVendorApplication,
  rejectVendorApplication: exports.rejectVendorApplication,
  updateDocumentVerification: exports.updateDocumentVerification,
  createRecommendationProfile: exports.createRecommendationProfile,
  
  // Marketplace exports
  getMarketplaceServices: exports.getMarketplaceServices,
  getVendorDetails: exports.getVendorDetails,
  searchVendors: exports.searchVendors,
  getMarketplaceStats: exports.getMarketplaceStats
};