// src/controllers/marketplaceController.js
const Vendor = require('../models/Vendor');
const VendorService = require('../models/VendorService');

// Get marketplace services with filtering
exports.getMarketplaceServices = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      location,
      minPrice,
      maxPrice,
      rating,
      eventType,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build aggregation pipeline
    const pipeline = [
      // Match approved vendors with active services
      {
        $match: {
          isApproved: true,
          isActive: true
        }
      },
      
      // Lookup vendor information
      {
        $lookup: {
          from: 'vendors',
          localField: 'vendorId',
          foreignField: '_id',
          as: 'vendor'
        }
      },
      
      // Filter out vendors that aren't approved
      {
        $match: {
          'vendor.registrationStatus': 'approved',
          'vendor.isActive': true
        }
      },
      
      // Add filtering conditions
      ...(category ? [{ $match: { 'serviceInfo.category': category } }] : []),
      ...(location ? [{ $match: { 'vendor.contactInfo.city': { $regex: location, $options: 'i' } } }] : []),
      ...(eventType ? [{ $match: { 'serviceInfo.eventTypes': eventType } }] : []),
      ...(search ? [{
        $match: {
          $or: [
            { 'serviceInfo.title': { $regex: search, $options: 'i' } },
            { 'serviceInfo.description': { $regex: search, $options: 'i' } },
            { 'vendor.businessInfo.businessName': { $regex: search, $options: 'i' } }
          ]
        }
      }] : []),
      
      // Price filtering
      ...(minPrice || maxPrice ? [{
        $match: {
          'packages.price': {
            ...(minPrice && { $gte: parseInt(minPrice) }),
            ...(maxPrice && { $lte: parseInt(maxPrice) })
          }
        }
      }] : []),
      
      // Add calculated fields
      {
        $addFields: {
          averageRating: { $ifNull: ['$metrics.averageRating', 0] },
          totalReviews: { $ifNull: ['$metrics.totalReviews', 0] },
          completedEvents: { $ifNull: ['$metrics.completedEvents', 0] },
          responseTime: { $ifNull: ['$metrics.averageResponseTime', '24 hours'] }
        }
      },
      
      // Rating filtering
      ...(rating ? [{ $match: { averageRating: { $gte: parseFloat(rating) } } }] : []),
      
      // Sorting
      {
        $sort: {
          [sortBy === 'rating' ? 'averageRating' : sortBy]: sortOrder === 'desc' ? -1 : 1
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

    // Get vendor reviews (you'll need to create this model)
    // const reviews = await VendorReview.find({ vendorId, isVisible: true })
    //   .populate('customerId', 'name')
    //   .sort({ createdAt: -1 })
    //   .limit(10);

    // Calculate vendor statistics
    const stats = {
      totalServices: services.length,
      averageRating: 4.5, // Placeholder - calculate from reviews
      totalReviews: 0, // Placeholder
      completedEvents: 0, // Placeholder
      responseTime: '2-4 hours', // Placeholder
      joinedDate: vendor.createdAt
    };

    res.json({
      success: true,
      data: {
        vendor,
        services,
        stats,
        // reviews: reviews || []
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

// Search vendors
exports.searchVendors = async (req, res) => {
  try {
    const { 
      q: query,
      location,
      category,
      limit = 10
    } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    // Build search conditions
    const searchConditions = {
      registrationStatus: 'approved',
      isActive: true,
      $or: [
        { 'businessInfo.businessName': { $regex: query, $options: 'i' } },
        { 'serviceInfo.services': { $regex: query, $options: 'i' } },
        { 'contactInfo.city': { $regex: query, $options: 'i' } }
      ]
    };

    // Add location filter
    if (location) {
      searchConditions['contactInfo.city'] = { $regex: location, $options: 'i' };
    }

    // Add category filter
    if (category) {
      searchConditions['serviceInfo.services'] = { $regex: category, $options: 'i' };
    }

    const vendors = await Vendor.find(searchConditions)
      .select('businessInfo contactInfo serviceInfo createdAt')
      .limit(parseInt(limit))
      .lean();

    // Get services for these vendors
    const vendorIds = vendors.map(v => v._id);
    const services = await VendorService.find({
      vendorId: { $in: vendorIds },
      isApproved: true,
      isActive: true
    }).select('vendorId serviceInfo packages media metrics').lean();

    // Group services by vendor
    const vendorServices = {};
    services.forEach(service => {
      if (!vendorServices[service.vendorId]) {
        vendorServices[service.vendorId] = [];
      }
      vendorServices[service.vendorId].push(service);
    });

    // Combine vendor data with their services
    const results = vendors.map(vendor => ({
      ...vendor,
      services: vendorServices[vendor._id] || [],
      serviceCount: vendorServices[vendor._id]?.length || 0
    }));

    res.json({
      success: true,
      data: {
        vendors: results,
        total: results.length,
        query,
        filters: { location, category }
      }
    });

  } catch (error) {
    console.error('Search vendors error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
};