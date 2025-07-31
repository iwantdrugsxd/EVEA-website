// evea-backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor');

// Vendor authentication middleware
const vendorAuth = async (req, res, next) => {
  try {
    console.log('🔐 Vendor auth middleware triggered');
    
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      console.log('❌ No Authorization header found');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      console.log('❌ No token in Authorization header');
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.'
      });
    }

    console.log('🔍 Verifying token...');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    console.log('✅ Token verified for vendor ID:', decoded.id);

    // Get vendor from database
    const vendor = await Vendor.findById(decoded.id).select('-password');
    if (!vendor) {
      console.log('❌ Vendor not found for ID:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'Access denied. Vendor not found.'
      });
    }

    // Add vendor to request object
    req.vendor = {
      id: vendor._id,
      businessName: vendor.businessInfo.businessName,
      email: vendor.businessInfo.email,
      registrationStatus: vendor.registrationStatus
    };

    console.log('✅ Vendor authenticated:', vendor.businessInfo.businessName);
    next();

  } catch (error) {
    console.error('❌ Vendor auth error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token expired.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    console.log('👑 Admin auth middleware triggered');
    
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.'
      });
    }

    // Verify admin token (you might have a separate Admin model)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    
    // For now, we'll check if it's a special admin token or vendor with admin privileges
    // You can modify this based on your admin system
    req.admin = {
      id: decoded.id,
      role: 'admin'
    };

    console.log('✅ Admin authenticated');
    next();

  } catch (error) {
    console.error('❌ Admin auth error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid admin token.'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Admin token expired.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Admin authentication error',
      error: error.message
    });
  }
};

// Optional middleware to check if vendor registration is complete
const requireCompleteRegistration = (req, res, next) => {
  if (req.vendor && req.vendor.registrationStatus !== 'approved') {
    return res.status(403).json({
      success: false,
      message: 'Complete registration required',
      data: {
        registrationStatus: req.vendor.registrationStatus,
        redirectTo: '/vendor/registration'
      }
    });
  }
  next();
};

module.exports = {
  vendorAuth,
  adminAuth,
  requireCompleteRegistration
};