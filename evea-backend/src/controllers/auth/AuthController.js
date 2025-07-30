// evea-backend/src/controllers/auth/AuthController.js - Updated with Passport.js integration
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { validationResult } = require('express-validator');
const AuthService = require('../../services/auth/AuthService');
const User = require('../../models/User');
const logger = require('../../config/logger');

class AuthController {
  constructor() {
    console.log('🎮 Initializing Auth Controller with Passport...');
    this.authService = new AuthService();
  }

  // Generate JWT token
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
      process.env.JWT_REFRESH_SECRET,
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

  // Register user (existing method - unchanged)
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

      const result = await this.authService.registerUser(req.body);
      
      // Generate tokens
      const token = this.generateToken(result.user._id, result.user.role);
      const refreshToken = this.generateRefreshToken(result.user._id);
      
      // Set cookies
      this.setAuthCookies(res, token, refreshToken);

      console.log('✅ Registration successful:', req.body.email);

      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          user: result.user,
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
          message: `${field === 'email' ? 'Email' : 'Phone'} already exists`
        });
      }

      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }

  // Login with Passport Local Strategy
  async loginWithPassport(req, res, next) {
    try {
      console.log('🔑 Login request received:', req.body.email);
      
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Login validation errors:', errors.array());
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      passport.authenticate('local', (err, user, info) => {
        if (err) {
          console.error('❌ Passport authentication error:', err);
          return res.status(500).json({
            success: false,
            message: 'Authentication error'
          });
        }

        if (!user) {
          console.log('❌ Authentication failed:', info.message);
          return res.status(401).json({
            success: false,
            message: info.message || 'Authentication failed'
          });
        }

        // Log user in
        req.logIn(user, (err) => {
          if (err) {
            console.error('❌ Login error:', err);
            return res.status(500).json({
              success: false,
              message: 'Login failed'
            });
          }

          // Generate tokens
          const token = this.generateToken(user._id, user.role);
          const refreshToken = this.generateRefreshToken(user._id);
          
          // Set cookies
          this.setAuthCookies(res, token, refreshToken);

          // Remove sensitive data
          const userResponse = user.toObject();
          delete userResponse.password;
          delete userResponse.loginAttempts;
          delete userResponse.lockUntil;
          delete userResponse.googleId;

          console.log('✅ Local login successful:', user.email);

          res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
              user: userResponse,
              token,
              refreshToken
            }
          });
        });
      })(req, res, next);
    } catch (error) {
      console.error('❌ Login controller error:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  }

  // Google OAuth callback handler
  async googleCallback(req, res) {
    try {
      console.log('✅ Google OAuth callback successful:', req.user.email);
      
      // Generate tokens
      const token = this.generateToken(req.user._id, req.user.role);
      const refreshToken = this.generateRefreshToken(req.user._id);
      
      // Set cookies
      this.setAuthCookies(res, token, refreshToken);

      // Determine frontend redirect URL based on user role
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      let redirectPath = '/shop'; // Default redirect
      
      if (req.user.role === 'vendor') {
        redirectPath = '/vendor-dashboard';
      } else if (req.user.role === 'customer') {
        redirectPath = '/shop';
      }

      // Create full frontend URL with success parameter
      const redirectUrl = `${frontendUrl}${redirectPath}?auth=success&method=google`;

      console.log('🔄 Redirecting Google user to frontend:', redirectUrl);
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('❌ Google OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/login?error=callback_failed`);
    }
  }

  // Logout
  async logout(req, res) {
    try {
      console.log('👋 Logout request received');
      
      // Clear cookies
      res.clearCookie('token');
      res.clearCookie('refreshToken');
      
      // Logout from Passport session
      req.logout((err) => {
        if (err) {
          console.error('❌ Logout error:', err);
          return res.status(500).json({
            success: false,
            message: 'Logout failed'
          });
        }
        
        console.log('✅ Logout successful');
        res.status(200).json({
          success: true,
          message: 'Logged out successfully'
        });
      });
    } catch (error) {
      console.error('❌ Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }

  // Get current user
  async getCurrentUser(req, res) {
    try {
      // Get token from cookies or Authorization header
      const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No authentication token provided'
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Remove sensitive data
      const userResponse = user.toObject();
      delete userResponse.password;
      delete userResponse.loginAttempts;
      delete userResponse.lockUntil;
      delete userResponse.googleId;

      res.status(200).json({
        success: true,
        data: { user: userResponse }
      });
    } catch (error) {
      console.error('❌ Get user error:', error);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }

      res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }
  }

  // Email verification (existing method - unchanged)
  async verifyEmail(req, res, next) {
    try {
      console.log('📧 Email verification request received');
      
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Verification token is required'
        });
      }

      const result = await this.authService.verifyEmail(token);

      console.log('✅ Email verification successful');

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('❌ Email verification controller error:', error);
      
      res.status(400).json({
        success: false,
        message: error.message || 'Email verification failed'
      });
    }
  }

  // Refresh token
  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token required'
        });
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Generate new tokens
      const newToken = this.generateToken(user._id, user.role);
      const newRefreshToken = this.generateRefreshToken(user._id);
      
      // Set new cookies
      this.setAuthCookies(res, newToken, newRefreshToken);

      res.status(200).json({
        success: true,
        message: 'Tokens refreshed successfully',
        data: {
          token: newToken,
          refreshToken: newRefreshToken
        }
      });
    } catch (error) {
      console.error('❌ Refresh token error:', error);
      res.status(401).json({
        success: false,
        message: 'Token refresh failed'
      });
    }
  }

  // Forgot password (existing method - can remain unchanged)
  async forgotPassword(req, res, next) {
    try {
      console.log('🔐 Forgot password request received');
      
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email } = req.body;
      const result = await this.authService.forgotPassword(email);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('❌ Forgot password controller error:', error);
      
      res.status(400).json({
        success: false,
        message: error.message || 'Password reset request failed'
      });
    }
  }

  // Reset password (existing method - can remain unchanged)
  async resetPassword(req, res, next) {
    try {
      console.log('🔐 Reset password request received');
      
      // Check validation errors
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

      const result = await this.authService.resetPassword(token, password);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('❌ Reset password controller error:', error);
      
      res.status(400).json({
        success: false,
        message: error.message || 'Password reset failed'
      });
    }
  }
   async googleCallback(req, res) {
    try {
      console.log('=== GOOGLE OAUTH CALLBACK DEBUG ===');
      console.log('✅ Google OAuth callback successful:', req.user.email);
      console.log('🔍 User role:', req.user.role);
      console.log('🔍 Environment FRONTEND_URL:', process.env.FRONTEND_URL);
      console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
      
      // Generate tokens
      const token = this.generateToken(req.user._id, req.user.role);
      const refreshToken = this.generateRefreshToken(req.user._id);
      
      // Set cookies
      this.setAuthCookies(res, token, refreshToken);
      console.log('✅ Cookies set successfully');

      // Determine frontend redirect URL based on user role
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      let redirectPath = '/shop'; // Default redirect
      
      if (req.user.role === 'vendor') {
        redirectPath = '/vendor-dashboard';
      } else if (req.user.role === 'customer') {
        redirectPath = '/shop';
      }

      // Create full frontend URL with success parameter
      const fullRedirectUrl = `${frontendUrl}${redirectPath}?auth=success&method=google`;

      console.log('🔄 Frontend URL:', frontendUrl);
      console.log('🔄 Redirect path:', redirectPath);
      console.log('🔄 Full redirect URL:', fullRedirectUrl);
      console.log('🔄 About to redirect...');
      
      // Do the redirect
      res.redirect(fullRedirectUrl);
      
      console.log('✅ Redirect completed');
      
    } catch (error) {
      console.error('❌ Google OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const errorUrl = `${frontendUrl}/login?error=callback_failed`;
      console.log('🔄 Redirecting to error URL:', errorUrl);
      res.redirect(errorUrl);
    }
  }

// Also add this simple test endpoint to your AuthController to verify redirects work:
  async testRedirect(req, res) {
    console.log('🧪 Testing redirect...');
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const testUrl = `${frontendUrl}/shop?test=redirect`;
    console.log('🔄 Test redirect URL:', testUrl);
    res.redirect(testUrl);
  }
}

module.exports = AuthController;