import React, { useState } from 'react';
import { 
  Bell, Search, Menu, ChevronDown, Settings, 
  LogOut, User, HelpCircle 
} from 'lucide-react';
import './AdminHeader.css';

const AdminHeader = ({ onToggleSidebar }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const notifications = [
    {
      id: 1,
      title: 'New vendor registration',
      message: 'Royal Wedding Photography submitted application',
      time: '2 mins ago',
      type: 'vendor',
      unread: true
    },
    {
      id: 2,
      title: 'Payment received',
      message: 'Payment of ₹75,000 received for booking #ORD-2024-001',
      time: '15 mins ago',
      type: 'payment',
      unread: true
    },
    {
      id: 3,
      title: 'New order placed',
      message: 'Corporate event photography booking confirmed',
      time: '1 hour ago',
      type: 'order',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search:', searchTerm);
  };

  const handleProfileAction = (action) => {
    console.log('Profile action:', action);
    setShowProfileMenu(false);
  };

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
    setShowNotifications(false);
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onToggleSidebar}>
          <Menu size={20} />
        </button>

        <div className="breadcrumb">
          <span className="breadcrumb-item">Admin</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item current">Dashboard</span>
        </div>
      </div>

      <div className="header-center">
        <div className="search-form">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search vendors, orders, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
            />
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Help Button */}
        <button className="header-icon-btn" title="Help & Support">
          <HelpCircle size={20} />
        </button>

        {/* Notifications */}
        <div className="notification-wrapper">
          <button 
            className="header-icon-btn notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <>
              <div 
                className="dropdown-overlay" 
                onClick={() => setShowNotifications(false)}
              ></div>
              <div className="notifications-dropdown">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                  <span className="notification-count">{unreadCount} new</span>
                </div>
                <div className="notifications-list">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`notification-item ${notification.unread ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="notification-content">
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-time">{notification.time}</div>
                      </div>
                      {notification.unread && <div className="unread-dot"></div>}
                    </div>
                  ))}
                </div>
                <div className="dropdown-footer">
                  <button className="view-all-btn">View all notifications</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Menu */}
        <div className="profile-wrapper">
          <button 
            className="profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-avatar">
              <span>A</span>
            </div>
            <div className="profile-info">
              <div className="profile-name">Admin User</div>
              <div className="profile-role">Administrator</div>
            </div>
            <ChevronDown size={16} className="profile-chevron" />
          </button>

          {showProfileMenu && (
            <>
              <div 
                className="dropdown-overlay" 
                onClick={() => setShowProfileMenu(false)}
              ></div>
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="profile-avatar large">A</div>
                  <div className="profile-details">
                    <div className="profile-name">Admin User</div>
                    <div className="profile-email">admin@evea.com</div>
                  </div>
                </div>
                <div className="dropdown-menu">
                  <button 
                    className="dropdown-item"
                    onClick={() => handleProfileAction('profile')}
                  >
                    <User size={16} />
                    <span>Profile Settings</span>
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => handleProfileAction('settings')}
                  >
                    <Settings size={16} />
                    <span>Account Settings</span>
                  </button>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item logout"
                    onClick={() => handleProfileAction('logout')}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;