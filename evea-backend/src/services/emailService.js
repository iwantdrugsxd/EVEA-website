const nodemailer = require('nodemailer');
const logger = require('../../config/logger');

class EmailService {
  constructor() {
    console.log('📧 Initializing Email Service...');
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    try {
      let transporter;
      
      if (process.env.EMAIL_SERVICE === 'sendgrid') {
        // SendGrid configuration
        console.log('📧 Using SendGrid for email service');
        transporter = nodemailer.createTransport({
          service: 'SendGrid',
          auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY
          }
        });
      } else if (process.env.EMAIL_SERVICE === 'ses') {
        // AWS SES configuration
        console.log('📧 Using AWS SES for email service');
        transporter = nodemailer.createTransport({
          SES: {
            aws: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
              region: process.env.AWS_REGION || 'us-east-1'
            }
          }
        });
      } else {
        // Gmail/SMTP configuration
        console.log('📧 Using SMTP/Gmail for email service');
        transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT) || 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
      }

      console.log('✅ Email transporter created successfully');
      return transporter;
    } catch (error) {
      console.error('❌ Failed to create email transporter:', error);
      logger.error('Failed to create email transporter:', error);
      throw error;
    }
  }

  async sendVerificationEmail(email, token, firstName) {
    try {
      console.log(`📧 Sending verification email to: ${email}`);
      
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
      
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Verify Your EVEA Account',
        html: this.getVerificationEmailTemplate(firstName, verificationUrl)
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Verification email sent successfully');
      logger.info(`Verification email sent to: ${email}`);
      
      return result;
    } catch (error) {
      console.error('❌ Failed to send verification email:', error);
      logger.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendWelcomeEmail(email, firstName) {
    try {
      console.log(`📧 Sending welcome email to: ${email}`);
      
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Welcome to EVEA!',
        html: this.getWelcomeEmailTemplate(firstName)
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Welcome email sent successfully');
      logger.info(`Welcome email sent to: ${email}`);
      
      return result;
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      logger.error('Failed to send welcome email:', error);
      // Don't throw error for welcome email failure
    }
  }

  getVerificationEmailTemplate(firstName, verificationUrl) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verify Your EVEA Account</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to EVEA!</h1>
              <p>Your Event Planning Journey Starts Here</p>
            </div>
            <div class="content">
              <h2>Hi ${firstName},</h2>
              <p>Thank you for joining EVEA! To get started with planning amazing events, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>This verification link will expire in 24 hours for security reasons.</p>
              
              <p>If you can't click the button, copy and paste this URL into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              
              <p>If you didn't create this account, please ignore this email.</p>
              
              <p>Best regards,<br>The EVEA Team</p>
            </div>
            <div class="footer">
              <p>© 2025 EVEA. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  getWelcomeEmailTemplate(firstName) {
    return `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
              <h1>🎉 Welcome to EVEA, ${firstName}!</h1>
              <p>Your email has been successfully verified!</p>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 10px; margin-top: 20px;">
              <h2>What's Next?</h2>
              <ul>
                <li>🎯 Plan your first event</li>
                <li>🔍 Explore our verified vendors</li>
                <li>💼 Complete your profile</li>
                <li>📞 Get 24/7 support</li>
              </ul>
              <p>Need help? Our support team is here to assist you!</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

module.exports = EmailService;