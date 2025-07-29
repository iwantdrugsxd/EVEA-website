// src/components/common/Header/Header.jsx - Enhanced with functional logout
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, ChevronDown, User, LogOut, Settings, Calendar, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Auth context
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu and user menu when route changes
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Services', path: '/services' },
    { name: 'Vendors', path: '/vendors' },
    { name: 'Blog', path: '/blog' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log('🚪 Starting logout process...');
      
      // Call logout from AuthContext
      await logout();
      
      // Close user menu
      setIsUserMenuOpen(false);
      setIsMenuOpen(false);
      
      console.log('✅ Logout successful, redirecting to login...');
      
      // Redirect to login page with success message
      navigate('/login?logout=success', { replace: true });
      
    } catch (error) {
      console.error('❌ Logout failed:', error);
      
      // Even if logout fails, clear local state and redirect
      setIsUserMenuOpen(false);
      navigate('/login?error=logout_failed', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email;
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.firstName) {
      return user.firstName[0].toUpperCase();
    }
    return user.email[0].toUpperCase();
  };

  const getDashboardLink = () => {
    if (user?.role === 'vendor') {
      return '/vendor-dashboard';
    }
    return '/dashboard';
  };

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
            <div className="logo-icon">
              <Heart className="heart-icon" />
            </div>
            <span className="logo-text">EVEA</span>
            <span className="logo-tagline">Event Excellence Awaits</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA and Auth Section */}
          <div className="header-actions">
            {/* Marketplace/Shop Button */}
            <Link to="/shop" className="cta-button secondary">
              <ShoppingBag size={18} />
              <span>Marketplace</span>
            </Link>

            {/* Plan Event CTA Button */}
            <Link to="/plan-event" className="cta-button">
              <Calendar size={18} />
              <span>Plan Event</span>
            </Link>

            {/* Authentication Section */}
            {!isLoading && (
              <>
                {isAuthenticated && user ? (
                  <div className="user-menu-container">
                    <button 
                      className="user-menu-trigger"
                      onClick={toggleUserMenu}
                      aria-expanded={isUserMenuOpen}
                      disabled={isLoggingOut}
                    >
                      <div className="user-avatar">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={getUserDisplayName()} />
                        ) : (
                          <span className="user-initials">{getUserInitials()}</span>
                        )}
                      </div>
                      <div className="user-info-preview">
                        <span className="user-name-preview">{getUserDisplayName()}</span>
                        <span className="user-role-preview">{user.role}</span>
                      </div>
                      <ChevronDown 
                        size={16} 
                        className={`dropdown-icon ${isUserMenuOpen ? 'rotated' : ''}`} 
                      />
                    </button>
                    
                    {isUserMenuOpen && (
                      <div className="user-dropdown open">
                        <div className="dropdown-header">
                          <div className="user-info">
                            <div className="user-avatar-large">
                              {user.profileImage ? (
                                <img src={user.profileImage} alt={getUserDisplayName()} />
                              ) : (
                                <span className="user-initials-large">{getUserInitials()}</span>
                              )}
                            </div>
                            <div className="user-details">
                              <span className="user-name">{getUserDisplayName()}</span>
                              <span className="user-email">{user.email}</span>
                              <span className="user-role">{user.role}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="dropdown-divider"></div>
                        
                        <div className="dropdown-links">
                          <Link 
                            to={getDashboardLink()} 
                            className="dropdown-link"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Calendar size={16} />
                            <span>Dashboard</span>
                          </Link>
                          
                          <Link 
                            to="/profile" 
                            className="dropdown-link"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings size={16} />
                            <span>Profile Settings</span>
                          </Link>
                          
                          {user.role === 'customer' && (
                            <Link 
                              to="/my-orders" 
                              className="dropdown-link"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <ShoppingBag size={16} />
                              <span>My Orders</span>
                            </Link>
                          )}
                        </div>
                        
                        <div className="dropdown-divider"></div>
                        
                        <button 
                          onClick={handleLogout} 
                          className="dropdown-link logout"
                          disabled={isLoggingOut}
                        >
                          <LogOut size={16} />
                          <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
                          {isLoggingOut && <div className="logout-spinner"></div>}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="auth-buttons">
                    <Link to="/login" className="btn-secondary">
                      Login
                    </Link>
                    <Link to="/register" className="btn-primary">
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn" 
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className={`nav-mobile ${isMenuOpen ? 'nav-mobile-open' : ''}`}>
          <div className="mobile-nav-content">
            {/* Mobile Navigation Links */}
            <div className="mobile-nav-links">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`nav-link-mobile ${location.pathname === link.path ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="mobile-cta">
              <Link 
                to="/shop" 
                className="mobile-marketplace-button"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingBag size={18} />
                <span>Browse Marketplace</span>
              </Link>
              
              <Link 
                to="/plan-event" 
                className="mobile-plan-button"
                onClick={() => setIsMenuOpen(false)}
              >
                <Calendar size={18} />
                <span>Plan Your Event</span>
              </Link>
            </div>

            {/* Mobile Auth Section */}
            {!isLoading && (
              <>
                {!isAuthenticated ? (
                  <div className="mobile-auth-buttons">
                    <Link 
                      to="/login" 
                      className="mobile-btn-secondary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="mobile-btn-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="mobile-user-section">
                    <div className="mobile-user-info">
                      <div className="mobile-user-avatar">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={getUserDisplayName()} />
                        ) : (
                          <span className="user-initials">{getUserInitials()}</span>
                        )}
                      </div>
                      <div className="mobile-user-details">
                        <span className="mobile-user-name">{getUserDisplayName()}</span>
                        <span className="mobile-user-email">{user.email}</span>
                        <span className="mobile-user-role">{user.role}</span>
                      </div>
                    </div>
                    
                    <div className="mobile-user-links">
                      <Link 
                        to={getDashboardLink()} 
                        className="mobile-user-link" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Calendar size={16} />
                        <span>Dashboard</span>
                      </Link>
                      
                      <Link 
                        to="/profile" 
                        className="mobile-user-link" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings size={16} />
                        <span>Profile Settings</span>
                      </Link>
                      
                      {user.role === 'customer' && (
                        <Link 
                          to="/my-orders" 
                          className="mobile-user-link" 
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <ShoppingBag size={16} />
                          <span>My Orders</span>
                        </Link>
                      )}
                      
                      <button 
                        onClick={handleLogout} 
                        className="mobile-user-link logout"
                        disabled={isLoggingOut}
                      >
                        <LogOut size={16} />
                        <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
                        {isLoggingOut && <div className="logout-spinner"></div>}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)}></div>}
    </header>
  );
};

export default Header;