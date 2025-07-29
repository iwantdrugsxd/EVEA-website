const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const EmailService = require('../email/EmailService');
const logger = require('../../config/logger');

class AuthService {
  constructor() {
    console.log('🔐 Initializing Auth Service...');
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
        role: userData.role || 'customer'
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

      // Generate JWT token
      const token = this.generateToken(user._id, user.role);

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;
      delete userResponse.emailVerificationToken;
      delete userResponse.emailVerificationExpires;

      console.log('🎉 User registration completed successfully');
      logger.info(`User registered successfully: ${userData.email}`);

      return {
        user: userResponse,
        token,
        message: 'Registration successful. Please check your email to verify your account.'
      };
    } catch (error) {
      console.error('❌ User registration failed:', error);
      logger.error('User registration failed:', error);
      throw error;
    }
  }

  async loginUser(email, password) {
    try {
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

      console.log('🎉 Login successful for:', email);
      logger.info(`User logged in successfully: ${email}`);

      return { user: userResponse, token, refreshToken };
    } catch (error) {
      console.error('❌ Login failed:', error);
      logger.error('Login failed:', error);
      throw error;
    }
  }

  async verifyEmail(token) {
    try {
      console.log('📧 Starting email verification with token:', token.substring(0, 10) + '...');
      logger.info('Email verification attempt');

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

      // Mark email as verified
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      
      await user.save();

      console.log('📧 Sending welcome email...');

      // Send welcome email
      await this.emailService.sendWelcomeEmail(user.email, user.firstName);

      console.log('🎉 Email verification completed successfully');
      logger.info(`Email verified successfully: ${user.email}`);

      return {
        user: user.toObject(),
        message: 'Email verified successfully!'
      };
    } catch (error) {
      console.error('❌ Email verification failed:', error);
      logger.error('Email verification failed:', error);
      throw error;
    }
  }

  generateToken(userId, role) {
    console.log('🎫 Generating JWT token for user:', userId);
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  }

  generateRefreshToken(userId) {
    console.log('🔄 Generating refresh token for user:', userId);
    return jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
    );
  }
}

module.exports = AuthService;