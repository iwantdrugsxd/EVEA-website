// evea-backend/src/config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const logger = require('./logger');

console.log('🔐 Initializing Passport Configuration...');

// Serialize user for session
passport.serializeUser((user, done) => {
  console.log('📝 Serializing user:', user._id);
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    console.log('🔍 Deserializing user:', id);
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error('❌ Error deserializing user:', error);
    done(error, null);
  }
});

// Local Strategy for email/password authentication
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      console.log('🔑 Local Strategy - Login attempt:', email);
      
      // Find user with password field
      const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');
      
      if (!user) {
        console.log('❌ User not found:', email);
        return done(null, false, { message: 'Invalid credentials' });
      }

      // Check if account is locked
      if (user.isAccountLocked()) {
        console.log('🔒 Account is locked:', email);
        return done(null, false, { message: 'Account temporarily locked due to too many failed login attempts' });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        console.log('❌ Invalid password for:', email);
        await user.incrementLoginAttempts();
        return done(null, false, { message: 'Invalid credentials' });
      }

      // Check if account is active
      if (user.status !== 'active') {
        console.log('⚠️ Account not active:', email);
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

      console.log('✅ Local authentication successful for:', email);
      logger.info(`User logged in successfully via local: ${email}`);
      
      return done(null, user);
    } catch (error) {
      console.error('❌ Local Strategy error:', error);
      logger.error('Local Strategy error:', error);
      return done(error);
    }
  }
));

// Google OAuth Strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('🔍 Google Strategy - Processing profile:', profile.id);
      
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
        
        console.log('✅ Google authentication successful for existing user:', user.email);
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
      console.error('❌ Google Strategy error:', error);
      logger.error('Google Strategy error:', error);
      return done(error);
    }
  }
));

module.exports = passport;