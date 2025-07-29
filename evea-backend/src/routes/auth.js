const express = require('express');
const AuthController = require('../controllers/auth/AuthController');
const { validateRegistration, validateLogin } = require('../validators/authValidators');
const { authLimiter } = require('../middleware/rateLimiter');

console.log('🛣️ Setting up authentication routes...');

const router = express.Router();

try {
  // Initialize auth controller
  const authController = new AuthController();
  console.log('✅ Auth controller initialized');

  // Apply rate limiting to all auth routes
  router.use(authLimiter);
  console.log('✅ Rate limiting applied to auth routes');

  // Registration route
  router.post('/register', validateRegistration, authController.register);
  console.log('✅ POST /register route configured');

  // Login route
  router.post('/login', validateLogin, authController.login);
  console.log('✅ POST /login route configured');

  // Email verification route - FIXED: proper parameter name
  router.get('/verify-email/:token', authController.verifyEmail);
  console.log('✅ GET /verify-email/:token route configured');

  // Resend verification email route
  router.post('/resend-verification', authController.resendVerification);
  console.log('✅ POST /resend-verification route configured');

  // Logout route
  router.post('/logout', authController.logout);
  console.log('✅ POST /logout route configured');

  console.log('✅ Authentication routes configured successfully');

} catch (error) {
  console.error('❌ Error setting up auth routes:', error);
  throw error;
}

module.exports = router;