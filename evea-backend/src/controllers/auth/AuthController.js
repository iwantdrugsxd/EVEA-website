// src/controllers/auth/AuthController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { validationResult } = require('express-validator');
const User = require('../../models/User');
const Vendor = require('../../models/Vendor');
const Admin = require('../../models/Admin');

class AuthController {
  constructor() {
    console.log('🎮 Initializing Auth Controller...');
  }

  // Generate JWT Token
  generateToken(userId, role) {
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  // Generate refresh token
  generateRefreshToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    );
  }

  // Set authentication cookies
  setAuthCookies(res, token, refreshToken) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.cookie('token', token, {
      ...cookieOptions,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
  }

  // Register User
  async register(req, res, next) {
    try {
      console.log('📝 Registration request received:', req.body.email);
      
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Validation errors:', errors.array());
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { firstName, lastName, email, password, phone, role = 'customer' } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        role
      });

      // Generate tokens
      const token = this.generateToken(user._id, user.role);
      const refreshToken = this.generateRefreshToken(user._id);
      
      // Set cookies
      this.setAuthCookies(res, token, refreshToken);

      console.log('✅ Registration successful:', email);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role
          },
          token,
          refreshToken
        }
      });

    } catch (error) {
      console.error('❌ Registration error:', error);
      
      // Handle specific MongoDB errors
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({
          success: false,
          message: `${field === 'email' ? 'Email' : field} already exists`
        });
      }

      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Login with Passport (for the route that calls loginWithPassport)
  async loginWithPassport(req, res, next) {
    try {
      console.log('🔐 Login attempt for:', req.body.email);
      
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
          console.error('❌ Passport authentication error:', err);
          return res.status(500).json({
            success: false,
            message: 'Authentication error',
            error: err.message
          });
        }

        if (!user) {
          console.log('❌ Authentication failed:', info.message);
          return res.status(401).json({
            success: false,
            message: info.message || 'Invalid credentials'
          });
        }

        // Generate tokens
        const token = this.generateToken(user._id, user.role);
        const refreshToken = this.generateRefreshToken(user._id);
        
        // Set cookies
        this.setAuthCookies(res, token, refreshToken);

        console.log('✅ Login successful for:', user.email);

        res.json({
          success: true,
          message: 'Login successful',
          data: {
            user: {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
              role: user.role
            },
            token,
            refreshToken
          }
        });

      })(req, res, next);

    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Regular login method (fallback)
  async login(req, res) {
    try {
      const { email, password, loginType = 'customer' } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
      }

      let user;

      // Determine which model to use based on login type
      switch (loginType) {
        case 'vendor':
          user = await Vendor.findOne({ 'contactInfo.email': email }).select('+password');
          break;
        case 'admin':
          user = await Admin.findOne({ email }).select('+password');
          break;
        default:
          user = await User.findOne({ email }).select('+password');
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check vendor approval status
      if (loginType === 'vendor' && user.registrationStatus !== 'approved') {
        return res.status(403).json({
          success: false,
          message: 'Your vendor account is pending approval'
        });
      }

      // Generate tokens
      const token = this.generateToken(user._id, loginType);
      const refreshToken = this.generateRefreshToken(user._id);
      
      // Set cookies
      this.setAuthCookies(res, token, refreshToken);

      // Prepare user data based on type
      let userData;
      if (loginType === 'vendor') {
        userData = {
          id: user._id,
          businessName: user.businessInfo.businessName,
          email: user.contactInfo.email,
          phone: user.contactInfo.phone,
          role: 'vendor',
          registrationStatus: user.registrationStatus
        };
      } else if (loginType === 'admin') {
        userData = {
          id: user._id,
          name: user.name,
          email: user.email,
          role: 'admin',
          permissions: user.permissions
        };
      } else {
        userData = {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role
        };
      }

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userData,
          token,
          refreshToken
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message
      });
    }
  }

  // Logout
  async logout(req, res) {
    try {
      // Clear authentication cookies
      res.clearCookie('token');
      res.clearCookie('refreshToken');

      res.json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        error: error.message
      });
    }
  }

  // Get Current User
  async getCurrentUser(req, res) {
    try {
      const userId = req.user?.userId || req.user?.id;
      const userRole = req.user?.role;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      let user;
      switch (userRole) {
        case 'vendor':
          user = await Vendor.findById(userId).select('-password');
          break;
        case 'admin':
          user = await Admin.findById(userId).select('-password');
          break;
        default:
          user = await User.findById(userId).select('-password');
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: { user }
      });

    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user data',
        error: error.message
      });
    }
  }

  // Refresh Token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        });
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
      
      // Find user
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Generate new tokens
      const newToken = this.generateToken(user._id, user.role);
      const newRefreshToken = this.generateRefreshToken(user._id);
      
      // Set new cookies
      this.setAuthCookies(res, newToken, newRefreshToken);

      res.json({
        success: true,
        message: 'Tokens refreshed successfully',
        data: {
          token: newToken,
          refreshToken: newRefreshToken
        }
      });

    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
      }

      console.error('Refresh token error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to refresh token',
        error: error.message
      });
    }
  }

  // Google OAuth Callback
  async googleCallback(req, res) {
    try {
      console.log('🔄 Google OAuth callback initiated');
      console.log('👤 User from Google:', req.user?.email);
      
      if (!req.user) {
        console.log('❌ No user found in Google callback');
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return res.redirect(`${frontendUrl}/login?error=no_user`);
      }

      // Generate tokens
      const token = this.generateToken(req.user._id, req.user.role);
      const refreshToken = this.generateRefreshToken(req.user._id);
      
      // Set cookies
      this.setAuthCookies(res, token, refreshToken);

      // Determine redirect URL based on user role
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      let redirectPath = '/shop'; // Default redirect
      
      if (req.user.role === 'vendor') {
        redirectPath = '/vendor-dashboard';
      } else if (req.user.role === 'customer') {
        redirectPath = '/shop';
      }

      const fullRedirectUrl = `${frontendUrl}${redirectPath}?auth=success&method=google`;

      console.log('🔄 Redirecting to:', fullRedirectUrl);
      res.redirect(fullRedirectUrl);
      
    } catch (error) {
      console.error('❌ Google OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/login?error=callback_failed`);
    }
  }

  // Verify Email
  async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Verification token is required'
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find and update user
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (user.emailVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email already verified'
        });
      }

      user.emailVerified = true;
      user.emailVerifiedAt = new Date();
      await user.save();

      res.json({
        success: true,
        message: 'Email verified successfully'
      });

    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification token'
        });
      }

      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Email verification failed',
        error: error.message
      });
    }
  }

  // Forgot Password
  async forgotPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, userType = 'customer' } = req.body;

      let user;
      switch (userType) {
        case 'vendor':
          user = await Vendor.findOne({ 'contactInfo.email': email });
          break;
        case 'admin':
          user = await Admin.findOne({ email });
          break;
        default:
          user = await User.findOne({ email });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No account found with this email address'
        });
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user._id, type: 'password-reset', userType },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // In a real implementation, send email with reset link
      // For now, just return success (remove resetToken in production)
      res.json({
        success: true,
        message: 'Password reset link sent to your email',
        ...(process.env.NODE_ENV === 'development' && { resetToken })
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process password reset request',
        error: error.message
      });
    }
  }

  // Reset Password
  async resetPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { token } = req.params;
      const { password } = req.body;

      if (!token || !password) {
        return res.status(400).json({
          success: false,
          message: 'Token and new password are required'
        });
      }

      // Verify reset token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.type !== 'password-reset') {
        return res.status(400).json({
          success: false,
          message: 'Invalid reset token'
        });
      }

      let user;
      switch (decoded.userType) {
        case 'vendor':
          user = await Vendor.findById(decoded.userId);
          break;
        case 'admin':
          user = await Admin.findById(decoded.userId);
          break;
        default:
          user = await User.findById(decoded.userId);
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Update password
      user.password = hashedPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password reset successfully'
      });

    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token'
        });
      }

      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reset password',
        error: error.message
      });
    }
  }

  // Change Password (for authenticated users)
  async changePassword(req, res) {
    try {
      const userId = req.user?.userId || req.user?.id;
      const userRole = req.user?.role;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Please provide current and new passwords'
        });
      }

      let user;
      switch (userRole) {
        case 'vendor':
          user = await Vendor.findById(userId).select('+password');
          break;
        case 'admin':
          user = await Admin.findById(userId).select('+password');
          break;
        default:
          user = await User.findById(userId).select('+password');
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      user.password = hashedNewPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password',
        error: error.message
      });
    }
  }

  // Test redirect method
  async testRedirect(req, res) {
    try {
      console.log('🧪 Testing redirect...');
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const testUrl = `${frontendUrl}/shop?test=redirect`;
      console.log('🔄 Test redirect URL:', testUrl);
      res.redirect(testUrl);
    } catch (error) {
      console.error('Test redirect error:', error);
      res.status(500).json({
        success: false,
        message: 'Test redirect failed',
        error: error.message
      });
    }
  }
}

module.exports = AuthController;