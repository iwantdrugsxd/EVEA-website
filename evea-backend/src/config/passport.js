// evea-backend/src/config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const logger = require('./logger');

console.log('🔐 Initializing Enhanced Passport Configuration (Users + Vendors)...');

// ==================== SERIALIZATION ====================
// Enhanced serialization to handle both users and vendors
passport.serializeUser((entity, done) => {
  console.log('📝 Serializing entity:', entity._id, 'Type:', entity.constructor.modelName);
  
  // Store both ID and type to distinguish between users and vendors
  const serializedData = {
    id: entity._id,
    type: entity.constructor.modelName // 'User' or 'Vendor'
  };
  
  done(null, serializedData);
});

// Enhanced deserialization to handle both users and vendors
passport.deserializeUser(async (serializedData, done) => {
  try {
    console.log('🔍 Deserializing entity:', serializedData);
    
    let entity;
    
    if (serializedData.type === 'User') {
      entity = await User.findById(serializedData.id);
    } else if (serializedData.type === 'Vendor') {
      entity = await Vendor.findById(serializedData.id);
    } else {
      // Handle legacy serialization (just ID) - assume User for backward compatibility
      entity = await User.findById(serializedData);
    }
    
    done(null, entity);
  } catch (error) {
    console.error('❌ Error deserializing entity:', error);
    done(error, null);
  }
});

// ==================== USER STRATEGIES ====================

// Local Strategy for USER email/password authentication
passport.use('user-local', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      console.log('🔑 User Local Strategy - Login attempt:', email);
      
      // Find user with password field
      const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');
      
      if (!user) {
        console.log('❌ User not found:', email);
        return done(null, false, { message: 'Invalid credentials' });
      }

      // Check if account is locked
      if (user.isAccountLocked && user.isAccountLocked()) {
        console.log('🔒 User account is locked:', email);
        return done(null, false, { message: 'Account temporarily locked due to too many failed login attempts' });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        console.log('❌ Invalid password for user:', email);
        if (user.incrementLoginAttempts) {
          await user.incrementLoginAttempts();
        }
        return done(null, false, { message: 'Invalid credentials' });
      }

      // Check if account is active
      if (user.status !== 'active') {
        console.log('⚠️ User account not active:', email);
        return done(null, false, { message: 'Account is not active' });
      }

      // Reset login attempts on successful login
      if (user.loginAttempts > 0) {
        await user.updateOne({
          $unset: { loginAttempts: 1, lockUntil: 1 }
        });
      }

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      console.log('✅ User local authentication successful for:', email);
      logger.info(`User logged in successfully via local: ${email}`);
      
      return done(null, user);
    } catch (error) {
      console.error('❌ User Local Strategy error:', error);
      logger.error('User Local Strategy error:', error);
      return done(error);
    }
  }
));

// Google OAuth Strategy for USERS
passport.use('user-google', new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('🔍 User Google Strategy - Processing profile:', profile.id);
      
      // Check if user already exists with this Google ID
      let user = await User.findOne({ 
        $or: [
          { googleId: profile.id },
          { email: profile.emails[0].value }
        ]
      });

      if (user) {
        // User exists - update Google ID if not set
        if (!user.googleId) {
          user.googleId = profile.id;
          user.profileImage = user.profileImage || profile.photos[0]?.value;
          await user.save();
          console.log('✅ Updated existing user with Google ID:', user.email);
        }
        
        // Update last login
        user.lastLoginAt = new Date();
        await user.save();
        
        console.log('✅ User Google authentication successful for existing user:', user.email);
        logger.info(`User logged in successfully via Google: ${user.email}`);
        
        return done(null, user);
      }

      // Create new user
      const newUser = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0]?.value,
        isEmailVerified: true, // Google emails are pre-verified
        lastLoginAt: new Date()
      });

      // Generate a random password for Google users (required by schema)
      const crypto = require('crypto');
      newUser.password = crypto.randomBytes(32).toString('hex');

      await newUser.save();
      
      console.log('✅ Created new Google user:', newUser.email);
      logger.info(`New user registered via Google: ${newUser.email}`);
      
      return done(null, newUser);
    } catch (error) {
      console.error('❌ User Google Strategy error:', error);
      logger.error('User Google Strategy error:', error);
      return done(error);
    }
  }
));

// ==================== VENDOR STRATEGIES ====================

// Local Strategy for VENDOR email/password authentication
passport.use('vendor-local', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      console.log('🔑 Vendor Local Strategy - Login attempt:', email);
      
      const vendor = await Vendor.findOne({ 'businessInfo.email': email.toLowerCase() });
      
      if (!vendor) {
        console.log('❌ Vendor not found:', email);
        return done(null, false, { message: 'Invalid credentials' });
      }

      // Check if vendor is approved or suspended
      if (vendor.registrationStatus === 'rejected') {
        console.log('⛔ Vendor application rejected:', email);
        return done(null, false, { message: 'Your application has been rejected. Please contact support.' });
      }

      if (vendor.registrationStatus === 'suspended') {
        console.log('🔒 Vendor account suspended:', email);
        return done(null, false, { message: 'Your account has been suspended. Please contact support.' });
      }

      // Check password using bcrypt compare
      const bcrypt = require('bcryptjs');
      const isPasswordValid = await bcrypt.compare(password, vendor.password);
      
      if (!isPasswordValid) {
        console.log('❌ Invalid password for vendor:', email);
        return done(null, false, { message: 'Invalid credentials' });
      }

      // Update last login
      vendor.lastLoginAt = new Date();
      await vendor.save();

      console.log('✅ Vendor local authentication successful for:', email);
      logger.info(`Vendor logged in successfully via local: ${email} (${vendor.businessInfo.businessName})`);
      
      return done(null, vendor);
    } catch (error) {
      console.error('❌ Vendor Local Strategy error:', error);
      logger.error('Vendor Local Strategy error:', error);
      return done(error);
    }
  }
));

// Google OAuth Strategy for VENDORS
passport.use('vendor-google', new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_VENDOR_CALLBACK_URL || 'http://localhost:5000/api/vendors/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('🔍 Vendor Google Strategy - Processing profile:', profile.id);
      
      // Check if vendor already exists with this Google ID or email
      let vendor = await Vendor.findOne({ 
        $or: [
          { googleId: profile.id },
          { 'businessInfo.email': profile.emails[0].value }
        ]
      });

      if (vendor) {
        // Vendor exists - update Google ID if not set
        if (!vendor.googleId) {
          vendor.googleId = profile.id;
          vendor.businessInfo.profileImage = vendor.businessInfo.profileImage || profile.photos[0]?.value;
          await vendor.save();
          console.log('✅ Updated existing vendor with Google ID:', vendor.businessInfo.email);
        }
        
        // Update last login
        vendor.lastLoginAt = new Date();
        await vendor.save();
        
        console.log('✅ Vendor Google authentication successful for existing vendor:', vendor.businessInfo.email);
        logger.info(`Vendor logged in successfully via Google: ${vendor.businessInfo.email}`);
        
        return done(null, vendor);
      }

      // Create new vendor with minimal info (they'll need to complete registration)
      const bcrypt = require('bcryptjs');
      const randomPassword = require('crypto').randomBytes(32).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 12);

      const newVendor = new Vendor({
        googleId: profile.id,
        businessInfo: {
          ownerName: profile.displayName,
          email: profile.emails[0].value,
          businessName: '', // Will be filled during registration
          businessType: '',
          phone: '',
          businessAddress: {
            country: 'India'
          },
          profileImage: profile.photos[0]?.value
        },
        password: hashedPassword,
        registrationStatus: 'pending_documents',
        profileCompletion: 10, // Just basic Google info
        lastLoginAt: new Date()
      });

      await newVendor.save();
      
      console.log('✅ Created new Google vendor:', newVendor.businessInfo.email);
      logger.info(`New vendor registered via Google: ${newVendor.businessInfo.email}`);
      
      return done(null, newVendor);
    } catch (error) {
      console.error('❌ Vendor Google Strategy error:', error);
      logger.error('Vendor Google Strategy error:', error);
      return done(error);
    }
  }
));

// ==================== ADMIN STRATEGIES ====================

// Simple admin strategy (you can expand this with a proper Admin model)
passport.use('admin-local', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      console.log('🔑 Admin Local Strategy - Login attempt:', email);
      
      // Simple admin check (expand with proper Admin model)
      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const admin = {
          id: 'admin',
          email: email,
          role: 'admin',
          name: 'Admin User'
        };
        
        console.log('✅ Admin authentication successful');
        logger.info(`Admin logged in: ${email}`);
        
        return done(null, admin);
      }
      
      console.log('❌ Invalid admin credentials');
      return done(null, false, { message: 'Invalid admin credentials' });
    } catch (error) {
      console.error('❌ Admin Local Strategy error:', error);
      logger.error('Admin Local Strategy error:', error);
      return done(error);
    }
  }
));

// ==================== UTILITY FUNCTIONS ====================

// Helper function to authenticate specific user types
const authenticateUser = (strategyName, options = {}) => {
  return passport.authenticate(strategyName, {
    session: false, // We'll use JWT instead of sessions for API
    ...options
  });
};

// Export configured passport and utility functions
module.exports = {
  passport,
  authenticateUser,
  
  // Specific authentication middleware
  authenticateLocalUser: authenticateUser('user-local'),
  authenticateGoogleUser: authenticateUser('user-google'),
  authenticateLocalVendor: authenticateUser('vendor-local'),
  authenticateGoogleVendor: authenticateUser('vendor-google'),
  authenticateAdmin: authenticateUser('admin-local'),
  
  // Initialize function for Express app
  initialize: (app) => {
    console.log('🚀 Initializing Passport middleware...');
    app.use(passport.initialize());
    // Note: We're not using sessions for API, so no passport.session()
    console.log('✅ Passport middleware initialized');
  }
};