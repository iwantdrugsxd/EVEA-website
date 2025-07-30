// src/components/admin/settings/security-settings/SecuritySettings.jsx
import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, Key, Eye, EyeOff, AlertTriangle,
  CheckCircle, Clock, Users, Database, Globe,
  RefreshCw, Download, Upload, Settings, Info,
  UserCheck, Smartphone, Mail, Wifi
} from 'lucide-react';
import './SecuritySettings.css';

const SecuritySettings = ({ onChange, isSaving }) => {
  const [activeTab, setActiveTab] = useState('authentication');
  const [securityConfig, setSecurityConfig] = useState({
    // Authentication Settings
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    passwordExpiryDays: 90,
    maxLoginAttempts: 5,
    lockoutDuration: 30, // minutes
    
    // Two-Factor Authentication
    twoFactorEnabled: true,
    twoFactorRequired: false,
    smsVerification: true,
    emailVerification: true,
    authenticatorApp: true,
    
    // Session Settings
    sessionTimeout: 60, // minutes
    maxConcurrentSessions: 3,
    rememberMeEnabled: true,
    rememberMeDuration: 30, // days
    
    // API Security
    apiRateLimit: 1000, // requests per hour
    apiKeyRequired: true,
    corsEnabled: true,
    allowedOrigins: 'https://evea.com,https://www.evea.com',
    
    // Data Protection
    dataEncryption: true,
    backupEncryption: true,
    logRetentionDays: 90,
    gdprCompliance: true,
    dataAnonymization: true,
    
    // Monitoring & Alerts
    securityLogging: true,
    failedLoginAlerts: true,
    suspiciousActivityAlerts: true,
    emailSecurityReports: true,
    adminNotifications: true
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('evea_sk_1234567890abcdef...');
  const [securityLogs, setSecurityLogs] = useState([]);

  const tabs = [
    { id: 'authentication', name: 'Authentication', icon: <Lock size={16} /> },
    { id: 'sessions', name: 'Sessions', icon: <Users size={16} /> },
    { id: 'api', name: 'API Security', icon: <Globe size={16} /> },
    { id: 'monitoring', name: 'Monitoring', icon: <Eye size={16} /> }
  ];

  useEffect(() => {
    // Load security configuration and logs
    loadSecurityLogs();
  }, []);

  const loadSecurityLogs = () => {
    // Mock security logs
    const mockLogs = [
      {
        id: 1,
        type: 'login_failure',
        message: 'Failed login attempt from IP 192.168.1.100',
        severity: 'warning',
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        user: 'admin@evea.com'
      },
      {
        id: 2,
        type: 'password_change',
        message: 'Password changed successfully',
        severity: 'info',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        user: 'vendor@example.com'
      },
      {
        id: 3,
        type: 'api_limit',
        message: 'API rate limit exceeded for key: ***...def',
        severity: 'warning',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        user: 'api_client'
      },
      {
        id: 4,
        type: 'admin_login',
        message: 'Admin user logged in successfully',
        severity: 'info',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        user: 'admin@evea.com'
      },
      {
        id: 5,
        type: 'suspicious_activity',
        message: 'Multiple failed login attempts detected',
        severity: 'critical',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        user: 'unknown'
      }
    ];
    setSecurityLogs(mockLogs);
  };

  const handleConfigChange = (field, value) => {
    setSecurityConfig(prev => ({
      ...prev,
      [field]: value
    }));
    onChange && onChange();
  };

  const generateNewApiKey = () => {
    const newKey = 'evea_sk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    onChange && onChange();
  };

  const downloadSecurityReport = () => {
    // Generate and download security report
    console.log('Downloading security report...');
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'login_failure':
      case 'api_limit':
        return <AlertTriangle size={16} />;
      case 'suspicious_activity':
        return <Shield size={16} />;
      case 'password_change':
      case 'admin_login':
        return <CheckCircle size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'critical':
        return 'severity-critical';
      case 'warning':
        return 'severity-warning';
      case 'info':
        return 'severity-info';
      default:
        return 'severity-info';
    }
  };

  const renderAuthenticationTab = () => (
    <div className="security-section">
      <div className="section-header">
        <h3>Authentication & Password Policy</h3>
        <p>Configure user authentication and password requirements</p>
      </div>
      
      <div className="config-groups">
        <div className="config-group">
          <h4>Password Requirements</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Minimum Password Length</label>
              <input
                type="number"
                min="6"
                max="32"
                value={securityConfig.passwordMinLength}
                onChange={(e) => handleConfigChange('passwordMinLength', parseInt(e.target.value))}
              />
            </div>
            
            <div className="form-group">
              <label>Password Expiry (Days)</label>
              <input
                type="number"
                min="0"
                max="365"
                value={securityConfig.passwordExpiryDays}
                onChange={(e) => handleConfigChange('passwordExpiryDays', parseInt(e.target.value))}
              />
              <span className="form-hint">Set to 0 to disable password expiry</span>
            </div>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={securityConfig.passwordRequireUppercase}
                  onChange={(e) => handleConfigChange('passwordRequireUppercase', e.target.checked)}
                />
                <span>Require uppercase letters</span>
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={securityConfig.passwordRequireLowercase}
                  onChange={(e) => handleConfigChange('passwordRequireLowercase', e.target.checked)}
                />
                <span>Require lowercase letters</span>
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={securityConfig.passwordRequireNumbers}
                  onChange={(e) => handleConfigChange('passwordRequireNumbers', e.target.checked)}
                />
                <span>Require numbers</span>
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={securityConfig.passwordRequireSpecialChars}
                  onChange={(e) => handleConfigChange('passwordRequireSpecialChars', e.target.checked)}
                />
                <span>Require special characters</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="config-group">
          <h4>Account Security</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Max Login Attempts</label>
              <input
                type="number"
                min="3"
                max="10"
                value={securityConfig.maxLoginAttempts}
                onChange={(e) => handleConfigChange('maxLoginAttempts', parseInt(e.target.value))}
              />
            </div>
            
            <div className="form-group">
              <label>Lockout Duration (Minutes)</label>
              <input
                type="number"
                min="5"
                max="1440"
                value={securityConfig.lockoutDuration}
                onChange={(e) => handleConfigChange('lockoutDuration', parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
        
        <div className="config-group">
          <h4>Two-Factor Authentication</h4>
          <div className="tfa-settings">
            <div className="tfa-toggle">
              <div className="tfa-info">
                <h5>Enable Two-Factor Authentication</h5>
                <p>Add an extra layer of security to user accounts</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={securityConfig.twoFactorEnabled}
                  onChange={(e) => handleConfigChange('twoFactorEnabled', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            {securityConfig.twoFactorEnabled && (
              <div className="tfa-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={securityConfig.twoFactorRequired}
                    onChange={(e) => handleConfigChange('twoFactorRequired', e.target.checked)}
                  />
                  <span>Require 2FA for all users</span>
                </label>
                
                <div className="tfa-methods">
                  <h5>Available Methods</h5>
                  <div className="methods-grid">
                    <label className="method-option">
                      <input
                        type="checkbox"
                        checked={securityConfig.smsVerification}
                        onChange={(e) => handleConfigChange('smsVerification', e.target.checked)}
                      />
                      <Smartphone size={16} />
                      <span>SMS Verification</span>
                    </label>
                    
                    <label className="method-option">
                      <input
                        type="checkbox"
                        checked={securityConfig.emailVerification}
                        onChange={(e) => handleConfigChange('emailVerification', e.target.checked)}
                      />
                      <Mail size={16} />
                      <span>Email Verification</span>
                    </label>
                    
                    <label className="method-option">
                      <input
                        type="checkbox"
                        checked={securityConfig.authenticatorApp}
                        onChange={(e) => handleConfigChange('authenticatorApp', e.target.checked)}
                      />
                      <Shield size={16} />
                      <span>Authenticator App</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSessionsTab = () => (
    <div className="security-section">
      <div className="section-header">
        <h3>Session Management</h3>
        <p>Configure user session settings and limitations</p>
      </div>
      
      <div className="config-groups">
        <div className="config-group">
          <h4>Session Configuration</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Session Timeout (Minutes)</label>
              <input
                type="number"
                min="5"
                max="1440"
                value={securityConfig.sessionTimeout}
                onChange={(e) => handleConfigChange('sessionTimeout', parseInt(e.target.value))}
              />
              <span className="form-hint">Automatic logout after inactivity</span>
            </div>
            
            <div className="form-group">
              <label>Max Concurrent Sessions</label>
              <input
                type="number"
                min="1"
                max="10"
                value={securityConfig.maxConcurrentSessions}
                onChange={(e) => handleConfigChange('maxConcurrentSessions', parseInt(e.target.value))}
              />
              <span className="form-hint">Maximum active sessions per user</span>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={securityConfig.rememberMeEnabled}
                  onChange={(e) => handleConfigChange('rememberMeEnabled', e.target.checked)}
                />
                <span>Enable "Remember Me" option</span>
              </label>
            </div>
            
            {securityConfig.rememberMeEnabled && (
              <div className="form-group">
                <label>Remember Me Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={securityConfig.rememberMeDuration}
                  onChange={(e) => handleConfigChange('rememberMeDuration', parseInt(e.target.value))}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="config-group">
          <h4>Active Sessions</h4>
          <div className="sessions-table">
            <div className="table-header">
              <span>User</span>
              <span>IP Address</span>
              <span>Device</span>
              <span>Last Activity</span>
              <span>Actions</span>
            </div>
            
            <div className="session-row">
              <span>admin@evea.com</span>
              <span>192.168.1.100</span>
              <span>Chrome on Windows</span>
              <span>2 minutes ago</span>
              <button className="revoke-btn">Revoke</button>
            </div>
            
            <div className="session-row">
              <span>vendor@example.com</span>
              <span>203.0.113.45</span>
              <span>Safari on iOS</span>
              <span>15 minutes ago</span>
              <button className="revoke-btn">Revoke</button>
            </div>
            
            <div className="session-row">
              <span>customer@test.com</span>
              <span>198.51.100.23</span>
              <span>Firefox on macOS</span>
              <span>1 hour ago</span>
              <button className="revoke-btn">Revoke</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAPITab = () => (
    <div className="security-section">
      <div className="section-header">
        <h3>API Security</h3>
        <p>Configure API access controls and security measures</p>
      </div>
      
      <div className="config-groups">
        <div className="config-group">
          <h4>API Configuration</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Rate Limit (Requests/Hour)</label>
              <input
                type="number"
                min="100"
                max="10000"
                value={securityConfig.apiRateLimit}
                onChange={(e) => handleConfigChange('apiRateLimit', parseInt(e.target.value))}
              />
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={securityConfig.apiKeyRequired}
                  onChange={(e) => handleConfigChange('apiKeyRequired', e.target.checked)}
                />
                <span>Require API Key for access</span>
              </label>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={securityConfig.corsEnabled}
                  onChange={(e) => handleConfigChange('corsEnabled', e.target.checked)}
                />
                <span>Enable CORS</span>
              </label>
            </div>
            
            {securityConfig.corsEnabled && (
              <div className="form-group full-width">
                <label>Allowed Origins</label>
                <textarea
                  value={securityConfig.allowedOrigins}
                  onChange={(e) => handleConfigChange('allowedOrigins', e.target.value)}
                  placeholder="https://example.com,https://app.example.com"
                  rows={3}
                />
                <span className="form-hint">Comma-separated list of allowed origins</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="config-group">
          <h4>API Key Management</h4>
          <div className="api-key-section">
            <div className="api-key-display">
              <label>Current API Key</label>
              <div className="api-key-input">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  readOnly
                />
                <button 
                  className="toggle-visibility"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div className="api-key-actions">
              <button className="generate-key-btn" onClick={generateNewApiKey}>
                <RefreshCw size={16} />
                Generate New Key
              </button>
              <span className="key-warning">
                <AlertTriangle size={14} />
                Generating a new key will invalidate the current one
              </span>
            </div>
          </div>
        </div>
        
        <div className="config-group">
          <h4>Data Protection</h4>
          <div className="protection-toggles">
            <div className="protection-item">
              <div className="protection-info">
                <h5>Data Encryption</h5>
                <p>Encrypt sensitive data at rest and in transit</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={securityConfig.dataEncryption}
                  onChange={(e) => handleConfigChange('dataEncryption', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="protection-item">
              <div className="protection-info">
                <h5>Backup Encryption</h5>
                <p>Encrypt database backups and file uploads</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={securityConfig.backupEncryption}
                  onChange={(e) => handleConfigChange('backupEncryption', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="protection-item">
              <div className="protection-info">
                <h5>GDPR Compliance</h5>
                <p>Enable GDPR compliance features and data anonymization</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={securityConfig.gdprCompliance}
                  onChange={(e) => handleConfigChange('gdprCompliance', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMonitoringTab = () => (
    <div className="security-section">
      <div className="section-header">
        <h3>Security Monitoring & Alerts</h3>
        <p>Monitor security events and configure alert preferences</p>
      </div>
      
      <div className="config-groups">
        <div className="config-group">
          <h4>Monitoring Settings</h4>
          <div className="monitoring-toggles">
            <div className="monitoring-item">
              <div className="monitoring-info">
                <h5>Security Logging</h5>
                <p>Log all security-related events and activities</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={securityConfig.securityLogging}
                  onChange={(e) => handleConfigChange('securityLogging', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="monitoring-item">
              <div className="monitoring-info">
                <h5>Failed Login Alerts</h5>
                <p>Alert administrators about failed login attempts</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={securityConfig.failedLoginAlerts}
                  onChange={(e) => handleConfigChange('failedLoginAlerts', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="monitoring-item">
              <div className="monitoring-info">
                <h5>Suspicious Activity Alerts</h5>
                <p>Detect and alert about suspicious user behavior</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={securityConfig.suspiciousActivityAlerts}
                  onChange={(e) => handleConfigChange('suspiciousActivityAlerts', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="monitoring-item">
              <div className="monitoring-info">
                <h5>Email Security Reports</h5>
                <p>Send weekly security reports via email</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={securityConfig.emailSecurityReports}
                  onChange={(e) => handleConfigChange('emailSecurityReports', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="config-group">
          <h4>Security Logs</h4>
          <div className="logs-header">
            <div className="logs-controls">
              <button className="refresh-logs-btn" onClick={loadSecurityLogs}>
                <RefreshCw size={16} />
                Refresh
              </button>
              <button className="download-logs-btn" onClick={downloadSecurityReport}>
                <Download size={16} />
                Download Report
              </button>
            </div>
          </div>
          
          <div className="security-logs">
            {securityLogs.map((log) => (
              <div key={log.id} className={`log-entry ${getSeverityClass(log.severity)}`}>
                <div className="log-icon">
                  {getLogIcon(log.type)}
                </div>
                <div className="log-content">
                  <div className="log-message">{log.message}</div>
                  <div className="log-meta">
                    <span className="log-user">{log.user}</span>
                    <span className="log-time">
                      {log.timestamp.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className={`log-severity ${log.severity}`}>
                  {log.severity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="security-settings">
      <div className="security-header">
        <h2>Security Settings</h2>
        <p>Configure security policies, authentication, and monitoring</p>
      </div>

      {/* Security Tabs */}
      <div className="security-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`security-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="security-content">
        {activeTab === 'authentication' && renderAuthenticationTab()}
        {activeTab === 'sessions' && renderSessionsTab()}
        {activeTab === 'api' && renderAPITab()}
        {activeTab === 'monitoring' && renderMonitoringTab()}
      </div>
    </div>
  );
};

export default SecuritySettings;