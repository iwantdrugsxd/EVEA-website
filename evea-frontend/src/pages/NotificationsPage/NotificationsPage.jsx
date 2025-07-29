// src/pages/VendorDashboard/pages/NotificationsPage.jsx
import React, { useState } from 'react';
import { 
  Bell, Settings, CheckCircle, X, MoreVertical, Filter,
  ShoppingBag, IndianRupee, Star, AlertTriangle, Info,
  Calendar, User, MessageSquare, TrendingUp, Zap,
  Clock, Check, Trash2, Undo2
} from 'lucide-react';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  // Sample notifications data
  const notifications = [
    {
      id: 'NOT-001',
      type: 'order',
      title: 'New Booking Request',
      message: 'Priya Sharma has requested your Wedding Photography service for March 15, 2024',
      timestamp: '2024-02-01T10:30:00',
      read: false,
      priority: 'high',
      icon: <ShoppingBag size={20} />,
      actionUrl: '/orders/ORD-2024-001',
      metadata: {
        orderId: 'ORD-2024-001',
        customerName: 'Priya Sharma',
        amount: 80000,
        eventDate: '2024-03-15'
      }
    },
    {
      id: 'NOT-002',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of ₹60,000 received for Corporate Event Photography booking',
      timestamp: '2024-01-31T14:20:00',
      read: false,
      priority: 'medium',
      icon: <IndianRupee size={20} />,
      actionUrl: '/orders/ORD-2024-002',
      metadata: {
        orderId: 'ORD-2024-002',
        amount: 60000,
        paymentMethod: 'UPI'
      }
    },
    {
      id: 'NOT-003',
      type: 'review',
      title: 'New Customer Review',
      message: 'Ananya Patel left a 5-star review for your Birthday Party Photography service',
      timestamp: '2024-01-30T16:45:00',
      read: true,
      priority: 'low',
      icon: <Star size={20} />,
      actionUrl: '/reviews/REV-001',
      metadata: {
        customerName: 'Ananya Patel',
        rating: 5,
        serviceName: 'Birthday Party Photography'
      }
    },
    {
      id: 'NOT-004',
      type: 'system',
      title: 'Profile Verification Complete',
      message: 'Your business profile has been verified successfully. You can now receive bookings.',
      timestamp: '2024-01-29T09:15:00',
      read: true,
      priority: 'high',
      icon: <CheckCircle size={20} />,
      actionUrl: '/profile',
      metadata: {
        verificationStatus: 'verified'
      }
    },
    {
      id: 'NOT-005',
      type: 'marketing',
      title: 'Boost Your Visibility',
      message: 'Upgrade to Premium to get 3x more bookings. Limited time offer - 50% off!',
      timestamp: '2024-01-28T11:30:00',
      read: true,
      priority: 'medium',
      icon: <TrendingUp size={20} />,
      actionUrl: '/upgrade',
      metadata: {
        offerType: 'premium_upgrade',
        discount: 50
      }
    },
    {
      id: 'NOT-006',
      type: 'alert',
      title: 'Document Expiry Alert',
      message: 'Your business license will expire in 30 days. Please renew to avoid service interruption.',
      timestamp: '2024-01-27T08:00:00',
      read: false,
      priority: 'high',
      icon: <AlertTriangle size={20} />,
      actionUrl: '/profile/documents',
      metadata: {
        documentType: 'business_license',
        expiryDate: '2024-02-27'
      }
    },
    {
      id: 'NOT-007',
      type: 'message',
      title: 'New Message from Customer',
      message: 'Rajesh Kumar sent you a message about the upcoming corporate event booking',
      timestamp: '2024-01-26T15:20:00',
      read: true,
      priority: 'medium',
      icon: <MessageSquare size={20} />,
      actionUrl: '/messages/MSG-001',
      metadata: {
        customerName: 'Rajesh Kumar',
        orderId: 'ORD-2024-002'
      }
    }
  ];

  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All Notifications', count: notifications.length },
    { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'order', label: 'Orders', count: notifications.filter(n => n.type === 'order').length },
    { id: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
    { id: 'review', label: 'Reviews', count: notifications.filter(n => n.type === 'review').length },
    { id: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length },
    { id: 'alert', label: 'Alerts', count: notifications.filter(n => n.type === 'alert').length }
  ];

  // Notification settings
  const notificationSettings = {
    email: {
      orders: true,
      payments: true,
      reviews: true,
      marketing: false,
      system: true
    },
    push: {
      orders: true,
      payments: true,
      reviews: false,
      marketing: false,
      system: true
    },
    sms: {
      orders: true,
      payments: false,
      reviews: false,
      marketing: false,
      system: false
    }
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      order: <ShoppingBag size={20} />,
      payment: <IndianRupee size={20} />,
      review: <Star size={20} />,
      system: <Info size={20} />,
      marketing: <TrendingUp size={20} />,
      alert: <AlertTriangle size={20} />,
      message: <MessageSquare size={20} />
    };
    return iconMap[type] || <Bell size={20} />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'priority-high',
      medium: 'priority-medium',
      low: 'priority-low'
    };
    return colors[priority] || 'priority-medium';
  };

  const getTypeColor = (type) => {
    const colors = {
      order: 'type-order',
      payment: 'type-payment',
      review: 'type-review',
      system: 'type-system',
      marketing: 'type-marketing',
      alert: 'type-alert',
      message: 'type-message'
    };
    return colors[type] || 'type-default';
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.read;
    return notification.type === selectedFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-page">
      {/* Notifications Header */}
      <div className="notifications-header">
        <div className="header-main">
          <div className="header-title">
            <h2>Notifications Center</h2>
            <div className="notification-summary">
              <span className="total-count">{filteredNotifications.length} notifications</span>
              {unreadCount > 0 && (
                <span className="unread-badge">{unreadCount} unread</span>
              )}
            </div>
          </div>
          
          <div className="header-actions">
            <button className="btn-secondary">
              <Check size={16} />
              Mark All Read
            </button>
            <button className="btn-secondary">
              <Trash2 size={16} />
              Clear All
            </button>
            <button 
              className="btn-primary"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={16} />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings Panel */}
      {showSettings && (
        <div className="notification-settings-panel">
          <div className="settings-header">
            <h3>Notification Preferences</h3>
            <button 
              className="close-settings"
              onClick={() => setShowSettings(false)}
            >
              <X size={16} />
            </button>
          </div>

          <div className="settings-grid">
            <div className="setting-section">
              <h4>Email Notifications</h4>
              {Object.entries(notificationSettings.email).map(([key, value]) => (
                <div key={key} className="setting-item">
                  <label className="setting-label">
                    <input type="checkbox" checked={value} />
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  </label>
                </div>
              ))}
            </div>

            <div className="setting-section">
              <h4>Push Notifications</h4>
              {Object.entries(notificationSettings.push).map(([key, value]) => (
                <div key={key} className="setting-item">
                  <label className="setting-label">
                    <input type="checkbox" checked={value} />
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  </label>
                </div>
              ))}
            </div>

            <div className="setting-section">
              <h4>SMS Notifications</h4>
              {Object.entries(notificationSettings.sms).map(([key, value]) => (
                <div key={key} className="setting-item">
                  <label className="setting-label">
                    <input type="checkbox" checked={value} />
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="settings-footer">
            <button className="btn-secondary">Cancel</button>
            <button className="btn-primary">Save Preferences</button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {filterOptions.map((filter) => (
          <button
            key={filter.id}
            className={`filter-tab ${selectedFilter === filter.id ? 'active' : ''}`}
            onClick={() => setSelectedFilter(filter.id)}
          >
            <span>{filter.label}</span>
            {filter.count > 0 && (
              <span className="filter-count">{filter.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={48} />
            <h3>No notifications found</h3>
            <p>You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-card ${!notification.read ? 'unread' : ''}`}
            >
              {/* Notification Header */}
              <div className="notification-header">
                <div className="notification-icon-container">
                  <div className={`notification-icon ${getTypeColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  {!notification.read && <div className="unread-indicator"></div>}
                </div>

                <div className="notification-meta">
                  <div className="notification-time">
                    <Clock size={12} />
                    <span>{new Date(notification.timestamp).toLocaleString()}</span>
                  </div>
                  <div className={`notification-priority ${getPriorityColor(notification.priority)}`}>
                    {notification.priority.toUpperCase()}
                  </div>
                </div>

                <div className="notification-actions">
                  <button className="action-btn">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Notification Content */}
              <div className="notification-content">
                <h4 className="notification-title">{notification.title}</h4>
                <p className="notification-message">{notification.message}</p>

                {/* Notification Metadata */}
                {notification.metadata && (
                  <div className="notification-metadata">
                    {notification.type === 'order' && (
                      <div className="metadata-items">
                        <div className="metadata-item">
                          <User size={14} />
                          <span>Customer: {notification.metadata.customerName}</span>
                        </div>
                        <div className="metadata-item">
                          <IndianRupee size={14} />
                          <span>Amount: ₹{notification.metadata.amount?.toLocaleString()}</span>
                        </div>
                        <div className="metadata-item">
                          <Calendar size={14} />
                          <span>Event: {new Date(notification.metadata.eventDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}

                    {notification.type === 'payment' && (
                      <div className="metadata-items">
                        <div className="metadata-item">
                          <IndianRupee size={14} />
                          <span>₹{notification.metadata.amount?.toLocaleString()}</span>
                        </div>
                        <div className="metadata-item">
                          <span>via {notification.metadata.paymentMethod}</span>
                        </div>
                      </div>
                    )}

                    {notification.type === 'review' && (
                      <div className="metadata-items">
                        <div className="metadata-item">
                          <Star size={14} />
                          <span>{notification.metadata.rating} stars</span>
                        </div>
                        <div className="metadata-item">
                          <span>Service: {notification.metadata.serviceName}</span>
                        </div>
                      </div>
                    )}

                    {notification.type === 'alert' && (
                      <div className="metadata-items">
                        <div className="metadata-item">
                          <AlertTriangle size={14} />
                          <span>Document: {notification.metadata.documentType?.replace('_', ' ')}</span>
                        </div>
                        <div className="metadata-item">
                          <Calendar size={14} />
                          <span>Expires: {new Date(notification.metadata.expiryDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Notification Footer */}
              <div className="notification-footer">
                <div className="notification-footer-actions">
                  {!notification.read && (
                    <button className="action-link">
                      <Check size={14} />
                      Mark as Read
                    </button>
                  )}
                  
                  {notification.read && (
                    <button className="action-link">
                      <Undo2 size={14} />
                      Mark as Unread
                    </button>
                  )}

                  <button className="action-link delete">
                    <Trash2 size={14} />
                    Delete
                  </button>

                  {notification.actionUrl && (
                    <button className="btn-primary-small">
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notifications Footer */}
      <div className="notifications-footer">
        <div className="footer-info">
          <p>Notifications are automatically deleted after 30 days</p>
        </div>
        
        <div className="footer-actions">
          <button className="btn-secondary">
            Load More Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;