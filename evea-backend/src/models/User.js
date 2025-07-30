// evea-backend/src/models/User.js - Updated with Google OAuth support
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [255, 'Email cannot exceed 255 characters'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: function() {
      // Password required only if not using Google OAuth
      return !this.googleId;
    },
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  // Google OAuth Integration
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows null values while maintaining uniqueness
    select: false
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [100, 'First name cannot exceed 100 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [100, 'Last name cannot exceed 100 characters']
  },
  phone: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  role: {
    type: String,
    enum: ['customer', 'vendor', 'admin'],
    default: 'customer'
  },
  profileImage: {
    type: String,
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  preferences: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  lastLoginAt: {
    type: Date,
    default: null
  },
  
  // Authentication method tracking
  authMethod: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  
  // Verification tokens
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  
  // Security fields
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Additional indexes for performance (googleId index is automatic due to unique: true)
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ passwordResetToken: 1 });
userSchema.index({ lockUntil: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ authMethod: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Hash password before saving (only for local auth)
userSchema.pre('save', async function(next) {
  // Skip password hashing for Google OAuth users
  if (this.googleId && !this.isModified('password')) {
    return next();
  }
  
  if (!this.isModified('password')) return next();
  
  try {
    console.log('🔐 Hashing password for user:', this.email);
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    this.password = await bcrypt.hash(this.password, rounds);
    console.log('✅ Password hashed successfully');
    next();
  } catch (error) {
    console.error('❌ Error hashing password:', error);
    next(error);
  }
});

// Set authentication method before saving
userSchema.pre('save', function(next) {
  if (this.isNew) {
    this.authMethod = this.googleId ? 'google' : 'local';
  }
  next();
});

// Compare password method (only for local auth)
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // Skip password comparison for Google OAuth users
    if (this.googleId && this.authMethod === 'google') {
      throw new Error('Password comparison not available for Google OAuth users');
    }
    
    console.log('🔍 Comparing password for user:', this.email);
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('✅ Password comparison result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('❌ Error comparing password:', error);
    throw new Error('Password comparison failed');
  }
};

// Create email verification token
userSchema.methods.createEmailVerificationToken = function() {
  console.log('📧 Creating email verification token for:', this.email);
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = verificationToken;
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  console.log('✅ Email verification token created');
  return verificationToken;
};

// Create password reset token
userSchema.methods.createPasswordResetToken = function() {
  console.log('🔐 Creating password reset token for:', this.email);
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = resetToken;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  console.log('✅ Password reset token created');
  return resetToken;
};

// Check if account is locked
userSchema.methods.isAccountLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
userSchema.methods.incrementLoginAttempts = async function() {
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  console.log('⚠️ Incrementing login attempts for:', this.email);
  
  if (this.lockUntil && this.lockUntil < Date.now()) {
    console.log('🔓 Removing expired account lock');
    return this.updateOne({
      $unset: { lockUntil: 1, loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    console.log('🔒 Locking account due to too many failed attempts');
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};

module.exports = mongoose.model('User', userSchema);