// src/pages/admin/system-settings.jsx
import React, { useState } from 'react';
import { 
  Settings, Server, Mail, Shield, Save, 
  RefreshCw, AlertTriangle, CheckCircle, 
  Database, Globe, Bell, Lock
} from 'lucide-react';
import AdminLayout from '../../components/admin/layout/admin-layout/AdminLayout';
import PlatformConfig from '../../components/admin/settings/platform-config/PlatformConfig';
import EmailSettings from '../../components/admin/settings/email-settings/EmailSettings';
import SecuritySettings from '../../components/admin/settings/security-settings/SecuritySettings';
import './system-settings.css';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('platform');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());

  const tabs = [
    { 
      id: 'platform', 
      name: 'Platform Config', 
      icon: <Server size={16} />,
      description: 'General platform settings and configurations'
    },
    { 
      id: 'email', 
      name: 'Email Settings', 
      icon: <Mail size={16} />,
      description: 'Email templates and notification preferences'
    },
    { 
      id: 'security', 
      name: 'Security', 
      icon: <Shield size={16} />,
      description: 'Authentication and security configurations'
    }
  ];

  const systemStatus = {
    database: { status: 'healthy', lastCheck: '2 minutes ago' },
    email: { status: 'healthy', lastCheck: '5 minutes ago' },
    storage: { status: 'warning', lastCheck: '1 hour ago' },
    api: { status: 'healthy', lastCheck: '30 seconds ago' }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingsChange = () => {
    setHasUnsavedChanges(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle size={16} className="status-healthy" />;
      case 'warning':
        return <AlertTriangle size={16} className="status-warning" />;
      case 'error':
        return <AlertTriangle size={16} className="status-error" />;
      default:
        return <AlertTriangle size={16} className="status-unknown" />;
    }
  };

  return (
    <AdminLayout>
      <div className="system-settings">
        {/* Page Header */}
        <div className="settings-header">
          <div className="header-content">
            <div className="header-title">
              <Settings size={24} />
              <div>
                <h1>System Settings</h1>
                <p>Manage platform configuration and system preferences</p>
              </div>
            </div>
            
            <div className="header-actions">
              <div className="save-status">
                {hasUnsavedChanges && (
                  <span className="unsaved-indicator">
                    <AlertTriangle size={14} />
                    Unsaved changes
                  </span>
                )}
                <span className="last-saved">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              </div>
              
              <button 
                className={`save-all-btn ${hasUnsavedChanges ? 'has-changes' : ''}`}
                onClick={handleSaveAll}
                disabled={isSaving || !hasUnsavedChanges}
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={16} className="spinning" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save All Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="system-status">
          <h2>System Status</h2>
          <div className="status-grid">
            <div className="status-item">
              <div className="status-header">
                <Database size={20} />
                <span>Database</span>
              </div>
              <div className="status-info">
                {getStatusIcon(systemStatus.database.status)}
                <span className="status-text">{systemStatus.database.status}</span>
                <span className="status-time">Checked {systemStatus.database.lastCheck}</span>
              </div>
            </div>
            
            <div className="status-item">
              <div className="status-header">
                <Mail size={20} />
                <span>Email Service</span>
              </div>
              <div className="status-info">
                {getStatusIcon(systemStatus.email.status)}
                <span className="status-text">{systemStatus.email.status}</span>
                <span className="status-time">Checked {systemStatus.email.lastCheck}</span>
              </div>
            </div>
            
            <div className="status-item">
              <div className="status-header">
                <Server size={20} />
                <span>Storage</span>
              </div>
              <div className="status-info">
                {getStatusIcon(systemStatus.storage.status)}
                <span className="status-text">{systemStatus.storage.status}</span>
                <span className="status-time">Checked {systemStatus.storage.lastCheck}</span>
              </div>
            </div>
            
            <div className="status-item">
              <div className="status-header">
                <Globe size={20} />
                <span>API Gateway</span>
              </div>
              <div className="status-info">
                {getStatusIcon(systemStatus.api.status)}
                <span className="status-text">{systemStatus.api.status}</span>
                <span className="status-time">Checked {systemStatus.api.lastCheck}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Navigation */}
        <div className="settings-navigation">
          <div className="nav-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="tab-icon">
                  {tab.icon}
                </div>
                <div className="tab-content">
                  <span className="tab-name">{tab.name}</span>
                  <span className="tab-description">{tab.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {activeTab === 'platform' && (
            <PlatformConfig 
              onChange={handleSettingsChange}
              isSaving={isSaving}
            />
          )}
          
          {activeTab === 'email' && (
            <EmailSettings 
              onChange={handleSettingsChange}
              isSaving={isSaving}
            />
          )}
          
          {activeTab === 'security' && (
            <SecuritySettings 
              onChange={handleSettingsChange}
              isSaving={isSaving}
            />
          )}
        </div>

        {/* Settings Footer */}
        <div className="settings-footer">
          <div className="footer-info">
            <div className="info-item">
              <span className="info-label">Platform Version:</span>
              <span className="info-value">v2.1.4</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last System Update:</span>
              <span className="info-value">January 15, 2024</span>
            </div>
            <div className="info-item">
              <span className="info-label">Environment:</span>
              <span className="info-value">Production</span>
            </div>
          </div>
          
          <div className="footer-actions">
            <button className="secondary-btn">
              <RefreshCw size={16} />
              Check for Updates
            </button>
            <button className="secondary-btn">
              <Database size={16} />
              Backup System
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SystemSettings;