// src/components/admin/settings/email-settings/EmailSettings.jsx
import React, { useState, useEffect } from 'react';
import { 
  Mail, Server, Send, Eye, Edit, TestTube,
  Check, X, AlertTriangle, RefreshCw, Bell,
  MessageSquare, UserCheck, Calendar, Receipt,
  Settings, Lock, Globe, Upload
} from 'lucide-react';
import './EmailSettings.css';

const EmailSettings = ({ onChange, isSaving }) => {
  const [activeTab, setActiveTab] = useState('smtp');
  const [emailConfig, setEmailConfig] = useState({
    // SMTP Configuration
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'noreply@evea.com',
    smtpPassword: '',
    smtpSecure: true,
    fromName: 'EVEA Team',
    fromEmail: 'noreply@evea.com',
    replyToEmail: 'support@evea.com',
    
    // Email Templates
    welcomeEmailEnabled: true,
    bookingConfirmationEnabled: true,
    paymentConfirmationEnabled: true,
    vendorApprovalEnabled: true,
    passwordResetEnabled: true,
    newsletterEnabled: true,
    
    // Notification Settings
    adminNotifications: true,
    vendorNotifications: true,
    customerNotifications: true,
    emailVerificationRequired: true,
    
    // Advanced Settings
    emailQueue: true,
    maxEmailsPerHour: 1000,
    retryFailedEmails: true,
    trackEmailOpens: true,
    trackEmailClicks: true,
    unsubscribeLink: true
  });

  const [testEmail, setTestEmail] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const tabs = [
    { id: 'smtp', name: 'SMTP Settings', icon: <Server size={16} /> },
    { id: 'templates', name: 'Email Templates', icon: <MessageSquare size={16} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={16} /> },
    { id: 'advanced', name: 'Advanced', icon: <Settings size={16} /> }
  ];

  const emailTemplates = [
    {
      id: 'welcome',
      name: 'Welcome Email',
      description: 'Sent to new users after registration',
      enabled: emailConfig.welcomeEmailEnabled,
      subject: 'Welcome to EVEA!',
      lastModified: '2024-01-15'
    },
    {
      id: 'booking_confirmation',
      name: 'Booking Confirmation',
      description: 'Sent when a booking is confirmed',
      enabled: emailConfig.bookingConfirmationEnabled,
      subject: 'Your booking has been confirmed',
      lastModified: '2024-01-14'
    },
    {
      id: 'payment_confirmation',
      name: 'Payment Confirmation',
      description: 'Sent after successful payment',
      enabled: emailConfig.paymentConfirmationEnabled,
      subject: 'Payment received - Receipt',
      lastModified: '2024-01-13'
    },
    {
      id: 'vendor_approval',
      name: 'Vendor Approval',
      description: 'Sent when vendor application is approved',
      enabled: emailConfig.vendorApprovalEnabled,
      subject: 'Your vendor application has been approved!',
      lastModified: '2024-01-12'
    },
    {
      id: 'password_reset',
      name: 'Password Reset',
      description: 'Sent when user requests password reset',
      enabled: emailConfig.passwordResetEnabled,
      subject: 'Reset your password',
      lastModified: '2024-01-11'
    }
  ];

  useEffect(() => {
    // Load email configuration
    console.log('Loading email configuration...');
  }, []);

  const handleConfigChange = (field, value) => {
    setEmailConfig(prev => ({
      ...prev,
      [field]: value
    }));
    onChange && onChange();
  };

  const handleTestEmail = async () => {
    if (!testEmail) return;
    
    setIsTesting(true);
    setTestResult(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      setTestResult({
        success: true,
        message: `Test email sent successfully to ${testEmail}`
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Failed to send test email. Please check your SMTP configuration.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleTemplateToggle = (templateId, enabled) => {
    const field = `${templateId}Enabled`;
    handleConfigChange(field, enabled);
  };

  const renderSMTPTab = () => (
    <div className="email-section">
      <div className="section-header">
        <h3>SMTP Configuration</h3>
        <p>Configure your email server settings</p>
      </div>
      
      <div className="form-grid">
        <div className="form-group">
          <label>SMTP Host</label>
          <input
            type="text"
            value={emailConfig.smtpHost}
            onChange={(e) => handleConfigChange('smtpHost', e.target.value)}
            placeholder="smtp.gmail.com"
          />
        </div>
        
        <div className="form-group">
          <label>SMTP Port</label>
          <input
            type="number"
            value={emailConfig.smtpPort}
            onChange={(e) => handleConfigChange('smtpPort', parseInt(e.target.value))}
            placeholder="587"
          />
        </div>
        
        <div className="form-group">
          <label>SMTP Username</label>
          <input
            type="email"
            value={emailConfig.smtpUser}
            onChange={(e) => handleConfigChange('smtpUser', e.target.value)}
            placeholder="noreply@evea.com"
          />
        </div>
        
        <div className="form-group">
          <label>SMTP Password</label>
          <input
            type="password"
            value={emailConfig.smtpPassword}
            onChange={(e) => handleConfigChange('smtpPassword', e.target.value)}
            placeholder="Enter SMTP password"
          />
        </div>
        
        <div className="form-group">
          <label>From Name</label>
          <input
            type="text"
            value={emailConfig.fromName}
            onChange={(e) => handleConfigChange('fromName', e.target.value)}
            placeholder="EVEA Team"
          />
        </div>
        
        <div className="form-group">
          <label>From Email</label>
          <input
            type="email"
            value={emailConfig.fromEmail}
            onChange={(e) => handleConfigChange('fromEmail', e.target.value)}
            placeholder="noreply@evea.com"
          />
        </div>
        
        <div className="form-group">
          <label>Reply-To Email</label>
          <input
            type="email"
            value={emailConfig.replyToEmail}
            onChange={(e) => handleConfigChange('replyToEmail', e.target.value)}
            placeholder="support@evea.com"
          />
        </div>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={emailConfig.smtpSecure}
              onChange={(e) => handleConfigChange('smtpSecure', e.target.checked)}
            />
            <span>Use TLS/SSL</span>
          </label>
        </div>
      </div>
      
      {/* Test Email Section */}
      <div className="test-email-section">
        <h4>Test Email Configuration</h4>
        <div className="test-email-form">
          <div className="form-group">
            <label>Test Email Address</label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>
          <button 
            className="test-email-btn"
            onClick={handleTestEmail}
            disabled={!testEmail || isTesting}
          >
            {isTesting ? (
              <>
                <RefreshCw size={16} className="spinning" />
                Sending...
              </>
            ) : (
              <>
                <TestTube size={16} />
                Send Test Email
              </>
            )}
          </button>
        </div>
        
        {testResult && (
          <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
            {testResult.success ? (
              <Check size={16} />
            ) : (
              <AlertTriangle size={16} />
            )}
            <span>{testResult.message}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="email-section">
      <div className="section-header">
        <h3>Email Templates</h3>
        <p>Manage automated email templates</p>
      </div>
      
      <div className="templates-grid">
        {emailTemplates.map((template) => (
          <div key={template.id} className="template-card">
            <div className="template-header">
              <div className="template-info">
                <h4>{template.name}</h4>
                <p>{template.description}</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={template.enabled}
                  onChange={(e) => handleTemplateToggle(template.id, e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="template-details">
              <div className="template-meta">
                <span className="template-subject">{template.subject}</span>
                <span className="template-modified">
                  Modified: {new Date(template.lastModified).toLocaleDateString()}
                </span>
              </div>
              
              <div className="template-actions">
                <button 
                  className="template-btn preview"
                  onClick={() => setPreviewTemplate(template)}
                >
                  <Eye size={14} />
                  Preview
                </button>
                <button className="template-btn edit">
                  <Edit size={14} />
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="email-section">
      <div className="section-header">
        <h3>Notification Settings</h3>
        <p>Configure who receives email notifications</p>
      </div>
      
      <div className="notifications-grid">
        <div className="notification-group">
          <div className="group-header">
            <Bell size={20} />
            <h4>Admin Notifications</h4>
          </div>
          <div className="notification-toggles">
            <label className="notification-toggle">
              <input
                type="checkbox"
                checked={emailConfig.adminNotifications}
                onChange={(e) => handleConfigChange('adminNotifications', e.target.checked)}
              />
              <span>Receive admin notifications</span>
            </label>
            <label className="notification-toggle">
              <input type="checkbox" defaultChecked />
              <span>New vendor registrations</span>
            </label>
            <label className="notification-toggle">
              <input type="checkbox" defaultChecked />
              <span>Payment notifications</span>
            </label>
            <label className="notification-toggle">
              <input type="checkbox" defaultChecked />
              <span>System alerts</span>
            </label>
          </div>
        </div>
        
        <div className="notification-group">
          <div className="group-header">
            <UserCheck size={20} />
            <h4>Vendor Notifications</h4>
          </div>
          <div className="notification-toggles">
            <label className="notification-toggle">
              <input
                type="checkbox"
                checked={emailConfig.vendorNotifications}
                onChange={(e) => handleConfigChange('vendorNotifications', e.target.checked)}
              />
              <span>Send vendor notifications</span>
            </label>
            <label className="notification-toggle">
              <input type="checkbox" defaultChecked />
              <span>New booking requests</span>
            </label>
            <label className="notification-toggle">
              <input type="checkbox" defaultChecked />
              <span>Payment confirmations</span>
            </label>
            <label className="notification-toggle">
              <input type="checkbox" defaultChecked />
              <span>Profile updates</span>
            </label>
          </div>
        </div>
        
        <div className="notification-group">
          <div className="group-header">
            <MessageSquare size={20} />
            <h4>Customer Notifications</h4>
          </div>
          <div className="notification-toggles">
            <label className="notification-toggle">
              <input
                type="checkbox"
                checked={emailConfig.customerNotifications}
                onChange={(e) => handleConfigChange('customerNotifications', e.target.checked)}
              />
              <span>Send customer notifications</span>
            </label>
            <label className="notification-toggle">
              <input type="checkbox" defaultChecked />
              <span>Booking confirmations</span>
            </label>
            <label className="notification-toggle">
              <input type="checkbox" defaultChecked />
              <span>Event reminders</span>
            </label>
            <label className="notification-toggle">
              <input type="checkbox" defaultChecked />
              <span>Newsletter updates</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="email-section">
      <div className="section-header">
        <h3>Advanced Settings</h3>
        <p>Advanced email configuration and tracking</p>
      </div>
      
      <div className="advanced-settings">
        <div className="settings-group">
          <h4>Email Queue Settings</h4>
          <div className="form-grid">
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={emailConfig.emailQueue}
                  onChange={(e) => handleConfigChange('emailQueue', e.target.checked)}
                />
                <span>Enable email queue</span>
              </label>
            </div>
            
            <div className="form-group">
              <label>Max Emails Per Hour</label>
              <input
                type="number"
                value={emailConfig.maxEmailsPerHour}
                onChange={(e) => handleConfigChange('maxEmailsPerHour', parseInt(e.target.value))}
                min="1"
                max="10000"
              />
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={emailConfig.retryFailedEmails}
                  onChange={(e) => handleConfigChange('retryFailedEmails', e.target.checked)}
                />
                <span>Retry failed emails</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="settings-group">
          <h4>Email Tracking</h4>
          <div className="form-grid">
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={emailConfig.trackEmailOpens}
                  onChange={(e) => handleConfigChange('trackEmailOpens', e.target.checked)}
                />
                <span>Track email opens</span>
              </label>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={emailConfig.trackEmailClicks}
                  onChange={(e) => handleConfigChange('trackEmailClicks', e.target.checked)}
                />
                <span>Track email clicks</span>
              </label>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={emailConfig.unsubscribeLink}
                  onChange={(e) => handleConfigChange('unsubscribeLink', e.target.checked)}
                />
                <span>Include unsubscribe link</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="email-settings">
      <div className="email-header">
        <h2>Email Settings</h2>
        <p>Configure email server, templates, and notification preferences</p>
      </div>

      {/* Email Tabs */}
      <div className="email-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`email-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="email-content">
        {activeTab === 'smtp' && renderSMTPTab()}
        {activeTab === 'templates' && renderTemplatesTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
        {activeTab === 'advanced' && renderAdvancedTab()}
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="template-preview-overlay">
          <div className="template-preview-modal">
            <div className="preview-header">
              <h3>Email Template Preview</h3>
              <button onClick={() => setPreviewTemplate(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="preview-content">
              <div className="email-preview">
                <div className="email-header-preview">
                  <strong>Subject:</strong> {previewTemplate.subject}
                </div>
                <div className="email-body-preview">
                  <p>This is a preview of the {previewTemplate.name.toLowerCase()} template.</p>
                  <p>The actual email content would be displayed here with dynamic content based on the template variables.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailSettings;