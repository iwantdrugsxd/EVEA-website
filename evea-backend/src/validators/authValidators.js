const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const logger = require('../config/logger');

const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .custom(async (email) => {
      console.log('🔍 Checking if email already exists:', email);
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('❌ Email already registered:', email);
        throw new Error('Email already registered');
      }
      console.log('✅ Email is available:', email);
      return true;
    }),
  
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name must contain only letters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name must contain only letters'),
  
  body('phone')
    .optional()
    .isMobilePhone('any')
    .custom(async (phone) => {
      if (phone) {
        console.log('🔍 Checking if phone already exists:', phone);
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
          console.log('❌ Phone already registered:', phone);
          throw new Error('Phone number already registered');
        }
        console.log('✅ Phone is available:', phone);
      }
      return true;
    }),
  
  (req, res, next) => {
    console.log('✅ Running registration validation...');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      logger.warn('Registration validation failed:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    console.log('✅ Registration validation passed');
    next();
  }
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  (req, res, next) => {
    console.log('✅ Running login validation...');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Login validation errors:', errors.array());
      logger.warn('Login validation failed:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    console.log('✅ Login validation passed');
    next();
  }
];

module.exports = {
  validateRegistration,
  validateLogin
};