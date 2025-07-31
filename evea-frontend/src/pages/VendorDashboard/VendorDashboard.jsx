import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  LayoutDashboard, Package, RefreshCw, Bell, User, Settings,
  TrendingUp, ShoppingBag, IndianRupee, Star, MessageSquare, 
  LogOut, Menu, X, Home, Eye, Clock, CheckCircle, Box
} from 'lucide-react';

// Import services
import { getVendorProfile, getDashboardStats, logoutVendor } from '../../services/vendorAPI';
import { toast } from 'react-toastify';

// Import existing pages from correct paths
import OrdersPage from '../OrdersPage/OrdersPage';
import RefundRequestsPage from '../RefundRequestsPage/RefundRequestsPage';
import InventoryPage from '../InventoryPage/InventoryPage';
import NotificationsPage from '../NotificationsPage/NotificationsPage';
import BusinessProfilePage from '../BusinessProfilePage/BusinessProfilePage';

// Import dashboard-specific components
import DashboardOverview from '../../components/VendorDashboard/DashboardOverview';
import RegistrationStatus from '../../components/VendorDashboard/RegistrationStatus';

import './VendorDashboard.css';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [vendor, setVendor] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications] = useState(3);

  // Navigation items with correct component mappings
  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard Overview',
      icon: <LayoutDashboard size={20} />,
      component: DashboardOverview,
      badge: null
    },
    {
      id: 'status',
      name: 'Registration Status',
      icon: <Clock size={20} />,
      component: RegistrationStatus,
      badge: vendor?.registrationStatus === 'pending_review' ? 'pending' : null,
      showOnlyIf: () => vendor?.registrationStatus !== 'approved'
    },
    {
      id: 'orders',
      name: 'Orders',
      icon: <ShoppingBag size={20} />,
      component: OrdersPage,
      badge: 12
    },
    {
      id: 'refunds',
      name: 'Refund Requests',
      icon: <RefreshCw size={20} />,
      component: RefundRequestsPage,
      badge: 3
    },
    {
      id: 'inventory',
      name: 'Inventory',
      icon: <Box size={20} />,
      component: InventoryPage,
      badge: null
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: <Bell size={20} />,
      component: NotificationsPage,
      badge: notifications
    },
    {
      id: 'profile',
      name: 'Business Profile',
      icon: <User size={20} />,
      component: BusinessProfilePage,
      badge: null
    }
  ];

  // Load vendor data on mount
  useEffect(() => {
    const token = localStorage.getItem('vendorToken');
    if (!token) {
      navigate('/vendor-login');
      return;
    }

    loadVendorData();
  }, [navigate]);

  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && navigationItems.find(item => item.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams, navigationItems]);

  const loadVendorData = async () => {
    try {
      setIsLoading(true);
      
      // Load vendor profile and dashboard stats in parallel
      const [profileResponse, statsResponse] = await Promise.all([
        getVendorProfile(),
        getDashboardStats()
      ]);

      setVendor(profileResponse.data.vendor);
      setDashboardStats(statsResponse.data.stats);
      
    } catch (error) {
      console.error('Failed to load vendor data:', error);
      if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
        localStorage.removeItem('vendorToken');
        localStorage.removeItem('vendorData');
        navigate('/vendor-login');
      } else {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const handleLogout = async () => {
    try {
      await logoutVendor();
      localStorage.removeItem('vendorToken');
      localStorage.removeItem('vendorData');
      toast.success('Logged out successfully');
      navigate('/vendor-login');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage even if API call fails
      localStorage.removeItem('vendorToken');
      localStorage.removeItem('vendorData');
      navigate('/vendor-login');
    }
  };

  const getStatusBadge = () => {
    if (!vendor) return null;
    
    const statusConfig = {
      'pending_documents': { text: 'Pending Documents', class: 'warning' },
      'pending_review': { text: 'Under Review', class: 'info' },
      'approved': { text: 'Approved', class: 'success' },
      'rejected': { text: 'Action Required', class: 'error' },
      'suspended': { text: 'Suspended', class: 'error' }
    };

    const config = statusConfig[vendor.registrationStatus];
    if (!config) return null;

    return (
      <div className={`status-badge ${config.class}`}>
        {config.text}
      </div>
    );
  };

  const renderCurrentTab = () => {
    const currentItem = navigationItems.find(item => item.id === activeTab);
    if (!currentItem?.component) {
      return (
        <div className="tab-not-found">
          <h2>Tab not found</h2>
          <p>The requested tab could not be found.</p>
        </div>
      );
    }

    const Component = currentItem.component;
    return (
      <Component 
        vendor={vendor}
        dashboardStats={dashboardStats}
        onDataUpdate={loadVendorData}
      />
    );
  };

  // Filter navigation items based on conditions
  const visibleNavigationItems = navigationItems.filter(item => {
    if (item.showOnlyIf) {
      return item.showOnlyIf();
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="vendor-dashboard loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-dashboard">
      {/* Sidebar */}
      <div className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="vendor-profile">
            <div className="vendor-avatar">
              <img 
                src={vendor?.businessInfo?.profileImage || '/default-avatar.png'} 
                alt="Vendor" 
              />
              <div className="status-indicator"></div>
            </div>
            {!sidebarCollapsed && (
              <div className="vendor-info">
                <h3 className="vendor-name">
                  {vendor?.businessInfo?.businessName || 'Vendor'}
                </h3>
                <span className="vendor-category">
                  {vendor?.primaryCategories?.[0] || 'Event Services'}
                </span>
                {getStatusBadge()}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Stats */}
        {!sidebarCollapsed && dashboardStats && (
          <div className="sidebar-stats">
            <div className="quick-stat">
              <div className="stat-icon revenue">
                <IndianRupee size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-value">₹{dashboardStats.totalRevenue?.toLocaleString() || '0'}</span>
                <span className="stat-label">Total Revenue</span>
              </div>
            </div>

            <div className="quick-stat">
              <div className="stat-icon rating">
                <Star size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{dashboardStats.averageRating?.toFixed(1) || '0.0'}</span>
                <span className="stat-label">Avg Rating</span>
              </div>
            </div>

            <div className="quick-stat">
              <div className="stat-icon orders">
                <ShoppingBag size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{dashboardStats.totalBookings || '0'}</span>
                <span className="stat-label">Total Orders</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          {visibleNavigationItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleTabChange(item.id)}
            >
              <div className="nav-icon">{item.icon}</div>
              {!sidebarCollapsed && (
                <>
                  <span className="nav-label">{item.name}</span>
                  {item.badge && (
                    <div className={`nav-badge ${typeof item.badge === 'string' ? item.badge : ''}`}>
                      {typeof item.badge === 'number' ? item.badge : ''}
                    </div>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => navigate('/')}>
            <div className="nav-icon"><Home size={20} /></div>
            {!sidebarCollapsed && <span className="nav-label">Visit Site</span>}
          </button>
          
          <button className="nav-item" onClick={handleLogout}>
            <div className="nav-icon"><LogOut size={20} /></div>
            {!sidebarCollapsed && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Top Bar */}
        <div className="dashboard-topbar">
          <div className="topbar-left">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
            <h1 className="page-title">
              {visibleNavigationItems.find(item => item.id === activeTab)?.name || 'Dashboard'}
            </h1>
          </div>

          <div className="topbar-right">
            <button className="topbar-btn" onClick={() => handleTabChange('notifications')}>
              <Bell size={20} />
              {notifications > 0 && <span className="notification-dot">{notifications}</span>}
            </button>
            
            <div className="vendor-menu">
              <button 
                className="vendor-menu-btn"
                onClick={() => handleTabChange('profile')}
              >
                <img 
                  src={vendor?.businessInfo?.profileImage || '/default-avatar.png'} 
                  alt="Profile" 
                  className="vendor-avatar-sm"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="dashboard-content">
          {renderCurrentTab()}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;