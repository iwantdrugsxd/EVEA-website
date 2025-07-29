// src/pages/VendorDashboard/VendorDashboard.jsx
import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, RefreshCw, Bell, User, Settings,
  TrendingUp, ShoppingBag, IndianRupee, Star, MessageSquare, HelpCircle
} from 'lucide-react';

// Import page components
import OrdersPage from '../OrdersPage/OrdersPage';
import RefundRequestsPage from '../RefundRequestsPage/RefundRequestsPage';
import InventoryPage from '../InventoryPage/InventoryPage';
import NotificationsPage from '../NotificationsPage/NotificationsPage';
import BusinessProfilePage from '../BusinessProfilePage/BusinessProfilePage';

import './VendorDashboard.css';

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications] = useState(3);

  // Sidebar navigation items
  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard Overview',
      icon: <LayoutDashboard size={20} />,
      badge: null,
      component: null
    },
    {
      id: 'orders',
      name: 'Orders',
      icon: <ShoppingBag size={20} />,
      badge: 12,
      component: OrdersPage
    },
    {
      id: 'refunds',
      name: 'Refund Requests',
      icon: <RefreshCw size={20} />,
      badge: 3,
      component: RefundRequestsPage
    },
    {
      id: 'inventory',
      name: 'Inventory',
      icon: <Package size={20} />,
      badge: null,
      component: InventoryPage
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: <Bell size={20} />,
      badge: notifications,
      component: NotificationsPage
    },
    {
      id: 'profile',
      name: 'Business Profile',
      icon: <User size={20} />,
      badge: null,
      component: BusinessProfilePage
    }
  ];

 
  // Dashboard Overview Component
  const DashboardOverview = () => (
    <div className="dashboard-overview-page">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome back, Rajesh!</h1>
          <p className="welcome-subtitle">Here's what's happening with your business today</p>
        </div>
        <div className="welcome-actions">
          <button className="btn-primary">
            <Package size={18} />
            Add New Service
          </button>
          <button className="btn-secondary">
            <TrendingUp size={18} />
            View Analytics
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon">
            <IndianRupee size={32} />
          </div>
          <div className="metric-content">
            <h3 className="metric-title">Total Revenue</h3>
            <div className="metric-value">₹12,45,000</div>
            <div className="metric-change positive">
              <TrendingUp size={14} />
              +23.5% from last month
            </div>
          </div>
          <div className="metric-chart">
            <div className="chart-bar" style={{height: '60%'}}></div>
            <div className="chart-bar" style={{height: '80%'}}></div>
            <div className="chart-bar" style={{height: '70%'}}></div>
            <div className="chart-bar" style={{height: '90%'}}></div>
            <div className="chart-bar" style={{height: '100%'}}></div>
          </div>
        </div>

        <div className="metric-card orders">
          <div className="metric-icon">
            <ShoppingBag size={32} />
          </div>
          <div className="metric-content">
            <h3 className="metric-title">Total Orders</h3>
            <div className="metric-value">124</div>
            <div className="metric-change positive">
              <TrendingUp size={14} />
              +18 new orders
            </div>
          </div>
          <div className="metric-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{width: '75%'}}></div>
            </div>
            <span className="progress-text">75% of monthly goal</span>
          </div>
        </div>

        <div className="metric-card rating">
          <div className="metric-icon">
            <Star size={32} />
          </div>
          <div className="metric-content">
            <h3 className="metric-title">Customer Rating</h3>
            <div className="metric-value">4.9</div>
            <div className="metric-change positive">
              <Star size={14} />
              98% positive reviews
            </div>
          </div>
          <div className="rating-stars">
            {[1,2,3,4,5].map(star => (
              <Star key={star} size={16} className="star-filled" />
            ))}
          </div>
        </div>

        <div className="metric-card bookings">
          <div className="metric-icon">
            <Package size={32} />
          </div>
          <div className="metric-content">
            <h3 className="metric-title">Active Services</h3>
            <div className="metric-value">8</div>
            <div className="metric-change neutral">
              <Package size={14} />
              3 services available
            </div>
          </div>
          <div className="services-preview">
            <div className="service-dot active"></div>
            <div className="service-dot active"></div>
            <div className="service-dot active"></div>
            <div className="service-dot"></div>
            <div className="service-dot"></div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <div className="section-header">
          <h2 className="section-title">Recent Activity</h2>
          <button className="view-all-btn">View All</button>
        </div>
        
        <div className="activity-grid">
          <div className="activity-card">
            <div className="activity-icon new-order">
              <ShoppingBag size={20} />
            </div>
            <div className="activity-content">
              <h4 className="activity-title">New Wedding Photography Booking</h4>
              <p className="activity-description">Priya Sharma booked your premium package for March 15th</p>
              <div className="activity-meta">
                <span className="activity-amount">₹80,000</span>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            <div className="activity-status new">New</div>
          </div>

          <div className="activity-card">
            <div className="activity-icon payment">
              <IndianRupee size={20} />
            </div>
            <div className="activity-content">
              <h4 className="activity-title">Payment Received</h4>
              <p className="activity-description">Corporate event photography payment completed</p>
              <div className="activity-meta">
                <span className="activity-amount">₹1,20,000</span>
                <span className="activity-time">5 hours ago</span>
              </div>
            </div>
            <div className="activity-status completed">Paid</div>
          </div>

          <div className="activity-card">
            <div className="activity-icon review">
              <Star size={20} />
            </div>
            <div className="activity-content">
              <h4 className="activity-title">5-Star Review Received</h4>
              <p className="activity-description">"Amazing photography service! Highly recommended"</p>
              <div className="activity-meta">
                <span className="activity-rating">⭐⭐⭐⭐⭐</span>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
            <div className="activity-status review">Review</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <button className="quick-action-card" onClick={() => setActiveTab('inventory')}>
            <div className="quick-action-icon">
              <Package size={24} />
            </div>
            <h3>Manage Services</h3>
            <p>Add, edit, or remove your services</p>
          </button>

          <button className="quick-action-card" onClick={() => setActiveTab('orders')}>
            <div className="quick-action-icon">
              <ShoppingBag size={24} />
            </div>
            <h3>View Orders</h3>
            <p>Check new bookings and manage orders</p>
          </button>

          <button className="quick-action-card" onClick={() => setActiveTab('profile')}>
            <div className="quick-action-icon">
              <User size={24} />
            </div>
            <h3>Update Profile</h3>
            <p>Edit your business information</p>
          </button>

          <button className="quick-action-card" onClick={() => setActiveTab('notifications')}>
            <div className="quick-action-icon">
              <Bell size={24} />
            </div>
            <h3>Notifications</h3>
            <p>Check alerts and messages</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    const activeItem = navigationItems.find(item => item.id === activeTab);
    if (activeItem && activeItem.component) {
      const Component = activeItem.component;
      return <Component />;
    }
    return <DashboardOverview />;
  };

  return (
    <div className="vendor-dashboard">
      {/* Fixed Sidebar */}
      <aside className="dashboard-sidebar fixed-sidebar">
        {/* Sidebar Header */}
        
        

       

        {/* Navigation Menu */}
        <nav className="sidebar-navigation">
          <ul className="nav-list">
            {navigationItems.map((item) => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <div className="nav-icon">
                    {item.icon}
                  </div>
                  <span className="nav-text">{item.name}</span>
                  {item.badge && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Support Section */}
        <div className="sidebar-support">
          <button className="support-button">
            <HelpCircle size={16} />
            <span>Help & Support</span>
          </button>
          <button className="chat-button">
            <MessageSquare size={16} />
            <span>Live Chat</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area - No Top Header */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          {renderCurrentPage()}
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;