// evea-backend/src/middleware/auth.js - FIXED VERSION
const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor');

// Vendor Authentication Middleware
const vendorAuth = async (req, res, next) => {
  try {
    console.log('🔐 Vendor auth middleware triggered');
    
    // Get token from header
    const authHeader = req.header('Authorization');
    console.log('📋 Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Access denied.'
      });
    }

    // Extract token (format: "Bearer TOKEN")
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format. Access denied.'
      });
    }

    console.log('🔑 Token extracted:', token.substring(0, 20) + '...');

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified for vendor ID:', decoded.id);

    // Get vendor from database
    const vendor = await Vendor.findById(decoded.id).select('-authentication.password');
    
    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: 'Vendor not found. Token invalid.'
      });
    }

    console.log('👤 Vendor authenticated:', vendor.businessInfo.businessName);

    // Add vendor info to request
    req.vendor = {
      id: vendor._id,
      businessName: vendor.businessInfo.businessName,
      email: vendor.contactInfo.email,
      registrationStatus: vendor.registrationStatus,
      isActive: vendor.isActive
    };

    next();

  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Access denied.'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Authentication failed. Please try again.'
      });
    }
  }
};

// Admin Authentication Middleware (placeholder)
const adminAuth = async (req, res, next) => {
  try {
    console.log('🔐 Admin auth middleware triggered');
    
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No admin token provided. Access denied.'
      });
    }

    // Extract token
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin token format. Access denied.'
      });
    }

    // Verify admin token (implement admin logic here)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // For now, mock admin validation
    // In real implementation, check if user is admin
    req.admin = {
      id: decoded.id,
      role: 'admin'
    };

    next();

  } catch (error) {
    console.error('❌ Admin auth error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin token. Access denied.'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Admin token expired. Please login again.'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Admin authentication failed.'
      });
    }
  }
};

// Optional Authentication Middleware (for public routes that can benefit from auth data)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (authHeader) {
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
      
      if (token && token !== 'null' && token !== 'undefined') {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const vendor = await Vendor.findById(decoded.id).select('-authentication.password');
        
        if (vendor) {
          req.vendor = {
            id: vendor._id,
            businessName: vendor.businessInfo.businessName,
            email: vendor.contactInfo.email,
            registrationStatus: vendor.registrationStatus,
            isActive: vendor.isActive
          };
        }
      }
    }
    
    // Continue regardless of auth status
    next();
    
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};

module.exports = {
  vendorAuth,
  adminAuth,
  optionalAuth
};