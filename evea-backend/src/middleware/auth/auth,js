const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor');

// Vendor authentication middleware
exports.vendorAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if vendor exists and is active
    const vendor = await Vendor.findById(decoded.vendorId);
    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Vendor not found.'
      });
    }

    if (vendor.registrationStatus === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Account suspended. Contact support.'
      });
    }

    req.vendor = {
      vendorId: decoded.vendorId,
      email: decoded.email,
      status: decoded.status
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
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
exports.adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user has admin role
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    req.admin = {
      adminId: decoded.adminId,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};