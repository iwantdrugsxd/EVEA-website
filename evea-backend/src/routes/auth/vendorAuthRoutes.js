const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { googleAuth, googleCallback } = require('../middleware/vendorAuth');

// ==================== VENDOR AUTHENTICATION ROUTES ====================

// Local login
router.post('/vendor/login', (req, res, next) => {
  passport.authenticate('vendor-local', { session: false }, (err, vendor, info) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Authentication error',
        error: err.message
      });
    }

    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: info.message || 'Authentication failed'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        vendorId: vendor._id,
        email: vendor.businessInfo.email,
        status: vendor.registrationStatus,
        role: 'vendor'
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '30d',
        issuer: 'evea-vendor',
        audience: 'evea-app'
      }
    );

    // Update last login
    vendor.lastLoginAt = new Date();
    vendor.save();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        vendor: {
          id: vendor._id,
          businessName: vendor.businessInfo.businessName,
          email: vendor.businessInfo.email,
          registrationStatus: vendor.registrationStatus,
          profileCompletion: vendor.profileCompletion
        }
      }
    });

  })(req, res, next);
});

// Google OAuth login
router.get('/vendor/google', googleAuth);

// Google OAuth callback
router.get('/vendor/google/callback', googleCallback, (req, res) => {
  // Generate JWT token
  const token = jwt.sign(
    {
      vendorId: req.user._id,
      email: req.user.businessInfo.email,
      status: req.user.registrationStatus,
      role: 'vendor'
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: '30d',
      issuer: 'evea-vendor',
      audience: 'evea-app'
    }
  );

  // Redirect to frontend with token
  res.redirect(`${process.env.FRONTEND_URL}/vendor-dashboard?token=${token}`);
});

// ==================== ADMIN AUTHENTICATION ROUTES ====================

// Admin login
router.post('/admin/login', (req, res, next) => {
  passport.authenticate('admin-local', { session: false }, (err, admin, info) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Authentication error',
        error: err.message
      });
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: info.message || 'Authentication failed'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        adminId: admin.id,
        email: admin.email,
        role: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          role: admin.role
        }
      }
    });

  })(req, res, next);
});

module.exports = router;