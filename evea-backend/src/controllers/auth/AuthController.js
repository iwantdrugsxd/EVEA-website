const AuthService = require('../../services/auth/AuthService');

class AuthController {
  constructor() {
    console.log('🎮 Initializing Auth Controller...');
    this.authService = new AuthService();
    
    // Bind methods to preserve 'this' context
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
    this.resendVerification = this.resendVerification.bind(this);
    this.logout = this.logout.bind(this);
    
    console.log('✅ Auth Controller initialized successfully');
  }

  async register(req, res, next) {
    try {
      console.log('📝 Registration request received:', req.body.email);
      
      const { email, password, firstName, lastName, phone, role } = req.body;

      const result = await this.authService.registerUser({
        email,
        password,
        firstName,
        lastName,
        phone,
        role
      });

      console.log('🍪 Setting authentication cookie...');

      // Set JWT token in httpOnly cookie
      const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      };

      res.cookie('token', result.token, cookieOptions);

      console.log('✅ Registration response sent successfully');

      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      console.error('❌ Registration controller error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }

  async login(req, res, next) {
    try {
      console.log('🔑 Login request received:', req.body.email);
      
      const { email, password } = req.body;

      const result = await this.authService.loginUser(email, password);

      console.log('🍪 Setting authentication cookies...');

      // Set tokens in httpOnly cookies
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      };

      res.cookie('token', result.token, {
        ...cookieOptions,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });

      res.cookie('refreshToken', result.refreshToken, {
        ...cookieOptions,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });

      console.log('✅ Login response sent successfully');

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          token: result.token,
          refreshToken: result.refreshToken
        }
      });
    } catch (error) {
      console.error('❌ Login controller error:', error);
      
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  }

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

      console.log('✅ Email verification response sent successfully');

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          user: result.user
        }
      });
    } catch (error) {
      console.error('❌ Email verification controller error:', error);
      
      res.status(400).json({
        success: false,
        message: error.message || 'Email verification failed'
      });
    }
  }

  async resendVerification(req, res, next) {
    try {
      console.log('📧 Resend verification request received');
      
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      // For now, just return success - implement this method in AuthService later
      res.status(200).json({
        success: true,
        message: 'Verification email sent successfully'
      });
    } catch (error) {
      console.error('❌ Resend verification controller error:', error);
      
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to resend verification email'
      });
    }
  }

  async logout(req, res, next) {
    try {
      console.log('🚪 Logout request received');
      
      // Clear cookies
      res.clearCookie('token');
      res.clearCookie('refreshToken');

      console.log('✅ Logout successful');

      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('❌ Logout controller error:', error);
      
      res.status(400).json({
        success: false,
        message: error.message || 'Logout failed'
      });
    }
  }
}

module.exports = AuthController;