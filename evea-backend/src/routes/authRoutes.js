// evea-backend/src/routes/auth/authRoutes.js - Fixed version without route errors
const express = require('express');
const passport = require('passport');
const { body } = require('express-validator');
const AuthController = require('../controllers/auth/AuthController');

const router = express.Router();
const authController = new AuthController();

console.log('🛣️ Initializing Authentication Routes...');

// ================================
// VALIDATION MIDDLEWARE
// ================================

const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('First name must be between 2 and 100 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Last name must be between 2 and 100 characters'),
  body('role')
    .optional()
    .isIn(['customer', 'vendor'])
    .withMessage('Role must be either customer or vendor')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// ================================
// BASIC ROUTES (No Parameters)
// ================================

// Test route to ensure router is working
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EVEA Authentication API',
    endpoints: {
      register: 'POST /auth/register',
      login: 'POST /auth/login',
      logout: 'POST /auth/logout',
      me: 'GET /auth/me',
      google: 'GET /auth/google',
      refresh: 'POST /auth/refresh'
    }
  });
});

// Register with local credentials
router.post('/register', registerValidation, (req, res, next) => {
  authController.register(req, res, next);
});

// Login with local credentials using Passport
router.post('/login', loginValidation, (req, res, next) => {
  authController.loginWithPassport(req, res, next);
});

// Logout
router.post('/logout', (req, res, next) => {
  authController.logout(req, res, next);
});

// Get current user
router.get('/me', (req, res, next) => {
  authController.getCurrentUser(req, res, next);
});

// Refresh token
router.post('/refresh', (req, res, next) => {
  authController.refreshToken(req, res, next);
});

// ================================
// GOOGLE OAUTH ROUTES
// ================================

// Start Google OAuth process
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_auth_failed` 
  }),
  (req, res, next) => {
    authController.googleCallback(req, res, next);
  }
);

// ================================
// ROUTES WITH PARAMETERS (Fixed syntax)
// ================================

// Email verification - fixed parameter syntax
router.get('/verify-email/:token', (req, res, next) => {
  // Ensure token parameter exists
  if (!req.params.token) {
    return res.status(400).json({
      success: false,
      message: 'Verification token is required'
    });
  }
  authController.verifyEmail(req, res, next);
});

// Password reset routes
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
], (req, res, next) => {
  authController.forgotPassword(req, res, next);
});

// Password reset with token - fixed parameter syntax  
router.patch('/reset-password/:token', [
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
], (req, res, next) => {
  // Ensure token parameter exists
  if (!req.params.token) {
    return res.status(400).json({
      success: false,
      message: 'Reset token is required'
    });
  }
  authController.resetPassword(req, res, next);
});

console.log('✅ Authentication routes configured successfully');

module.exports = router;