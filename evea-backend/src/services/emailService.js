// evea-backend/src/services/emailService.js
const nodemailer = require('nodemailer');
const logger = require('../config/logger');

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    try {
      const config = {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      };

      const transporter = nodemailer.createTransporter(config);
      logger.info('📧 Email transporter created successfully');
      return transporter;
    } catch (error) {
      logger.error('❌ Failed to create email transporter:', error);
      throw error;
    }
  }

  async sendVerificationEmail(email, token, firstName) {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your EVEA Account',
        html: this.getVerificationTemplate(firstName, verificationUrl)
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.email.sent(email, 'Email Verification', result);
      return result;
    } catch (error) {
      logger.email.failed(email, 'Email Verification', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendWelcomeEmail(email, firstName) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to EVEA!',
        html: this.getWelcomeTemplate(firstName)
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.email.sent(email, 'Welcome Email', result);
      return result;
    } catch (error) {
      logger.email.failed(email, 'Welcome Email', error);
      throw new Error('Failed to send welcome email');
    }
  }

  async sendVendorApprovalEmail(email, firstName, status) {
    try {
      const isApproved = status === 'approved';
      const subject = isApproved ? 'Your EVEA Vendor Application Approved!' : 'Update on Your EVEA Vendor Application';
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject,
        html: this.getVendorApprovalTemplate(firstName, isApproved)
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.email.sent(email, 'Vendor Approval', result);
      return result;
    } catch (error) {
      logger.email.failed(email, 'Vendor Approval', error);
      throw new Error('Failed to send vendor approval email');
    }
  }

  async sendPasswordResetEmail(email, token, firstName) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Your EVEA Password',
        html: this.getPasswordResetTemplate(firstName, resetUrl)
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.email.sent(email, 'Password Reset', result);
      return result;
    } catch (error) {
      logger.email.failed(email, 'Password Reset', error);
      throw new Error('Failed to send password reset email');
    }
  }

  // Email Templates
  getVerificationTemplate(firstName, verificationUrl) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Verify Your EVEA Account</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white;">
            <div style="background: linear-gradient(135deg, #8B2635 0%, #A53F50 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to EVEA!</h1>
              <p style="color: #f0f0f0; margin: 10px 0 0; font-size: 16px;">Please verify your email address</p>
            </div>
            
            <div style="padding: 40px 20px;">
              <h2 style="color: #333; margin: 0 0 20px;">Hi ${firstName}!</h2>
              <p style="color: #666; line-height: 1.6; margin: 0 0 30px;">Thank you for joining EVEA. To complete your registration, please click the button below to verify your email address:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="background-color: #8B2635; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Verify Email Address</a>
              </div>
              
              <p style="color: #999; font-size: 14px; margin: 30px 0 0;">If you didn't create an account, please ignore this email.</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
              <p style="margin: 0;">© 2025 EVEA. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  getWelcomeTemplate(firstName) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Welcome to EVEA</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white;">
            <div style="background: linear-gradient(135deg, #8B2635 0%, #A53F50 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to EVEA!</h1>
              <p style="color: #f0f0f0; margin: 10px 0 0; font-size: 16px;">Your account is now active</p>
            </div>
            
            <div style="padding: 40px 20px;">
              <h2 style="color: #333; margin: 0 0 20px;">Hello ${firstName}!</h2>
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px;">Your email has been successfully verified! You can now start planning amazing events with EVEA.</p>
              
              <h3 style="color: #8B2635; margin: 30px 0 15px;">What's Next?</h3>
              <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
                <li>🎯 Plan your first event</li>
                <li>🔍 Explore our verified vendors</li>
                <li>💼 Complete your profile</li>
                <li>📞 Get 24/7 support</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="background-color: #8B2635; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Start Planning</a>
              </div>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
              <p style="margin: 0;">© 2025 EVEA. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  getVendorApprovalTemplate(firstName, isApproved) {
    const bgColor = isApproved ? '#22c55e' : '#ef4444';
    const title = isApproved ? '🎉 Application Approved!' : '📋 Application Update';
    const message = isApproved 
      ? 'Congratulations! Your vendor application has been approved.'
      : 'We need additional information to process your application.';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>EVEA Vendor Application Update</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white;">
            <div style="background: ${bgColor}; padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">${title}</h1>
              <p style="color: #f0f0f0; margin: 10px 0 0; font-size: 16px;">${message}</p>
            </div>
            
            <div style="padding: 40px 20px;">
              <h2 style="color: #333; margin: 0 0 20px;">Hi ${firstName}!</h2>
              <p style="color: #666; line-height: 1.6;">${message}</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/vendor/dashboard" style="background-color: #8B2635; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Go to Dashboard</a>
              </div>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
              <p style="margin: 0;">© 2025 EVEA. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  getPasswordResetTemplate(firstName, resetUrl) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Reset Your EVEA Password</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white;">
            <div style="background: linear-gradient(135deg, #8B2635 0%, #A53F50 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Password Reset</h1>
              <p style="color: #f0f0f0; margin: 10px 0 0; font-size: 16px;">Reset your EVEA account password</p>
            </div>
            
            <div style="padding: 40px 20px;">
              <h2 style="color: #333; margin: 0 0 20px;">Hi ${firstName}!</h2>
              <p style="color: #666; line-height: 1.6; margin: 0 0 30px;">You requested to reset your password. Click the button below to set a new password:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #8B2635; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Reset Password</a>
              </div>
              
              <p style="color: #999; font-size: 14px; margin: 30px 0 0;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
              <p style="margin: 0;">© 2025 EVEA. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

module.exports = EmailService;