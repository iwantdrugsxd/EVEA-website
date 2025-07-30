import React from 'react';
import { 
  LayoutDashboard, Users, ShoppingBag, IndianRupee, 
  BarChart3, Settings, LogOut, X, Menu
} from 'lucide-react';
import './AdminSidebar.css';

const AdminSidebar = ({ isOpen, onToggle }) => {
  const [activeItem, setActiveItem] = React.useState('dashboard');

  const handleNavigation = (itemId, path) => {
    setActiveItem(itemId);
    // In a real app, you would use your router here
    // For demo purposes, we'll just update the active state
    console.log(`Navigate to: ${path}`);
  };

  const navigationItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: <LayoutDashboard size={20} />, 
      path: '/admin/dashboard',
      badge: null 
    },
    { 
      id: 'vendors', 
      name: 'Vendors', 
      icon: <Users size={20} />, 
      path: '/admin/vendor-management',
      badge: 5 
    },
    { 
      id: 'orders', 
      name: 'Orders', 
      icon: <ShoppingBag size={20} />, 
      path: '/admin/order-management',
      badge: 12 
    },
    { 
      id: 'financial', 
      name: 'Financial', 
      icon: <IndianRupee size={20} />, 
      path: '/admin/financial-management',
      badge: null 
    },
    { 
      id: 'analytics', 
      name: 'Analytics', 
      icon: <BarChart3 size={20} />, 
      path: '/admin/analytics',
      badge: null 
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: <Settings size={20} />, 
      path: '/admin/system-settings',
      badge: null 
    }
  ];

  const handleLogout = () => {
    // Handle logout logic here
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onToggle}></div>
      )}
      
      <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="logo">
            <h2>EVEA Admin</h2>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={onToggle}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-navigation">
          <ul className="nav-list">
            {navigationItems.map((item) => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${activeItem === item.id ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.id, item.path)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {isOpen && (
                    <>
                      <span className="nav-text">{item.name}</span>
                      {item.badge && (
                        <span className="nav-badge">{item.badge}</span>
                      )}
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Admin Profile */}
        {isOpen && (
          <div className="admin-profile">
            <div className="profile-info">
              <div className="profile-avatar">A</div>
              <div className="profile-details">
                <div className="profile-name">Admin User</div>
                <div className="profile-email">admin@evea.com</div>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;