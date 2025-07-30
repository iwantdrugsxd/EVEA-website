// evea-backend/src/services/auth/AuthService.js - Updated with Passport.js support
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const EmailService = require('../email/EmailService');
const logger = require('../../config/logger');

class AuthService {
  constructor() {
    console.log('🔐 Initializing Auth Service with Passport.js support...');
    this.emailService = new EmailService();
  }

  async registerUser(userData) {
    try {
      console.log('👤 Starting user registration for:', userData.email);
      logger.info(`User registration started: ${userData.email}`);

      // Create user
      const user = new User({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        role: userData.role || 'customer',
        authMethod: 'local'
      });

      console.log('📝 User object created, generating verification token...');

      // Generate email verification token
      const verificationToken = user.createEmailVerificationToken();
      
      console.log('💾 Saving user to database...');
      
      // Save user to database
      await user.save();
      
      console.log('✅ User saved successfully, sending verification email...');

      // Send verification email
      await this.emailService.sendVerificationEmail(user.email, verificationToken, user.firstName);

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;
      delete userResponse.emailVerificationToken;
      delete userResponse.emailVerificationExpires;
      delete userResponse.googleId;

      console.log('🎉 User registration completed successfully');
      logger.info(`User registered successfully: ${userData.email}`);

      return {
        user: userResponse,
        message: 'Registration successful. Please check your email to verify your account.'
      };
    } catch (error) {
      console.error('❌ User registration failed:', error);
      logger.error('User registration failed:', error);
      throw error;
    }
  }

  // Legacy login method - now handled by Passport Local Strategy
  async loginUser(email, password) {
    try {
      console.log('⚠️ Using legacy loginUser method - consider using Passport Local Strategy');
      console.log('🔑 Starting login process for:', email);
      logger.info(`Login attempt: ${email}`);

      // Find user with password field
      const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');
      
      if (!user) {
        console.log('❌ User not found:', email);
        logger.warn(`Login failed - user not found: ${email}`);
        throw new Error('Invalid credentials');
      }

      console.log('👤 User found, checking account lock status...');

      // Check if account is locked
      if (user.isAccountLocked()) {
        console.log('🔒 Account is locked:', email);
        logger.warn(`Login failed - account locked: ${email}`);
        throw new Error('Account temporarily locked due to too many failed login attempts');
      }

      console.log('🔍 Verifying password...');

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        console.log('❌ Invalid password for:', email);
        await user.incrementLoginAttempts();
        logger.warn(`Login failed - invalid password: ${email}`);
        throw new Error('Invalid credentials');
      }

      console.log('✅ Password verified, checking account status...');

      // Check if account is active
      if (user.status !== 'active') {
        console.log('⚠️ Account not active:', email);
        logger.warn(`Login failed - account not active: ${email}`);
        throw new Error('Account is not active');
      }

      console.log('🔄 Resetting login attempts and updating last login...');

      // Reset login attempts on successful login
      if (user.loginAttempts > 0) {
        await user.updateOne({
          $unset: { loginAttempts: 1, lockUntil: 1 }
        });
      }

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      console.log('🎫 Generating tokens...');

      // Generate tokens
      const token = this.generateToken(user._id, user.role);
      const refreshToken = this.generateRefreshToken(user._id);

      // Remove sensitive data from response
      const userResponse = user.toObject();
      delete userResponse.password;
      delete userResponse.loginAttempts;
      delete userResponse.lockUntil;
      delete userResponse.googleId;

      console.log('🎉 Login successful for:', email);
      logger.info(`User logged in successfully: ${email}`);

      return { user: userResponse, token, refreshToken };
    } catch (error) {
      console.error('❌ Login service error:', error);
      logger.error('Login service error:', error);
      throw error;
    }
  }

  async verifyEmail(token) {
    try {
      console.log('📧 Starting email verification process');
      logger.info('Email verification attempt');

      if (!token) {
        throw new Error('Verification token is required');
      }

      // Find user with verification token
      const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() }
      });

      if (!user) {
        console.log('❌ Invalid or expired verification token');
        logger.warn('Email verification failed - invalid token');
        throw new Error('Invalid or expired verification token');
      }

      console.log('✅ Valid token found, verifying email for:', user.email);

      // Update user verification status
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;

      await user.save();

      console.log('🎉 Email verification completed for:', user.email);
      logger.info(`Email verified successfully: ${user.email}`);

      return {
        message: 'Email verified successfully'
      };
    } catch (error) {
      console.error('❌ Email verification failed:', error);
      logger.error('Email verification failed:', error);
      throw error;
    }
  }

  async requestPasswordReset(email) {
    try {
      console.log('🔐 Starting password reset request for:', email);
      logger.info(`Password reset requested: ${email}`);

      // Find user by email
      const user = await User.findOne({ email, authMethod: 'local' });

      if (!user) {
        console.log('❌ User not found for password reset:', email);
        // Don't reveal if email exists or not for security
        logger.warn(`Password reset requested for non-existent user: ${email}`);
        return {
          message: 'If an account with that email exists, we have sent a password reset link.'
        };
      }

      // Check if user uses Google OAuth (can't reset password)
      if (user.googleId) {
        console.log('⚠️ Password reset requested for Google OAuth user:', email);
        throw new Error('This account uses Google sign-in. Please sign in with Google.');
      }

      console.log('📝 Generating password reset token...');

      // Generate password reset token
      const resetToken = user.createPasswordResetToken();
      await user.save();

      console.log('📧 Sending password reset email...');

      // Send password reset email
      await this.emailService.sendPasswordResetEmail(user.email, resetToken, user.firstName);

      console.log('✅ Password reset email sent to:', email);
      logger.info(`Password reset email sent: ${email}`);

      return {
        message: 'If an account with that email exists, we have sent a password reset link.'
      };
    } catch (error) {
      console.error('❌ Password reset request failed:', error);
      logger.error('Password reset request failed:', error);
      throw error;
    }
  }

  async resetPassword(token, newPassword) {
    try {
      console.log('🔐 Starting password reset process');
      logger.info('Password reset attempt');

      if (!token || !newPassword) {
        throw new Error('Reset token and new password are required');
      }

      // Find user with valid reset token
      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() }
      }).select('+password');

      if (!user) {
        console.log('❌ Invalid or expired reset token');
        logger.warn('Password reset failed - invalid token');
        throw new Error('Invalid or expired reset token');
      }

      // Check if user uses Google OAuth
      if (user.googleId) {
        console.log('⚠️ Password reset attempted for Google OAuth user:', user.email);
        throw new Error('This account uses Google sign-in. Password reset is not available.');
      }

      console.log('✅ Valid token found, resetting password for:', user.email);

      // Update password and clear reset token
      user.password = newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      // Reset login attempts if any
      if (user.loginAttempts > 0) {
        user.loginAttempts = 0;
        user.lockUntil = undefined;
      }

      await user.save();

      console.log('🎉 Password reset completed for:', user.email);
      logger.info(`Password reset successfully: ${user.email}`);

      return {
        message: 'Password has been reset successfully'
      };
    } catch (error) {
      console.error('❌ Password reset failed:', error);
      logger.error('Password reset failed:', error);
      throw error;
    }
  }

  // JWT token generation methods
  generateToken(userId, role) {
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  generateRefreshToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    );
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Verify refresh token
  verifyRefreshToken(refreshToken) {
    try {
      return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }
}

module.exports = AuthService;