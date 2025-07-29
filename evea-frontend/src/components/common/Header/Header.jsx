// src/components/common/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, ChevronDown, User, LogOut, Settings, Calendar } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from auth context
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
    // Add logout logic here
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
            {/* Plan Event CTA Button */}
            <Link to="/plan-event" className="cta-button">
              <Calendar size={18} />
              <span>Plan Event</span>
            </Link>

            {/* Authentication Section */}
            {isLoggedIn ? (
              <div className="user-menu-container">
                <button 
                  className="user-menu-trigger"
                  onClick={toggleUserMenu}
                  aria-expanded={isUserMenuOpen}
                >
                  <div className="user-avatar">
                    <User size={18} />
                  </div>
                  <ChevronDown size={16} className={`dropdown-icon ${isUserMenuOpen ? 'rotated' : ''}`} />
                </button>
                
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <div className="user-info">
                        <span className="user-name">John Doe</span>
                        <span className="user-email">john@example.com</span>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-links">
                      <Link to="/dashboard" className="dropdown-link">
                        <Calendar size={16} />
                        <span>Dashboard</span>
                      </Link>
                      <Link to="/profile" className="dropdown-link">
                        <Settings size={16} />
                        <span>Profile Settings</span>
                      </Link>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-link logout">
                      <LogOut size={16} />
                      <span>Sign Out</span>
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
                to="/plan-event" 
                className="mobile-plan-button"
                onClick={() => setIsMenuOpen(false)}
              >
                <Calendar size={18} />
                <span>Plan Your Event</span>
              </Link>
            </div>

            {/* Mobile Auth Buttons */}
            {!isLoggedIn && (
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
            )}

            {/* Mobile User Menu */}
            {isLoggedIn && (
              <div className="mobile-user-section">
                <div className="mobile-user-info">
                  <div className="mobile-user-avatar">
                    <User size={20} />
                  </div>
                  <div className="mobile-user-details">
                    <span className="mobile-user-name">John Doe</span>
                    <span className="mobile-user-email">john@example.com</span>
                  </div>
                </div>
                <div className="mobile-user-links">
                  <Link to="/dashboard" className="mobile-user-link" onClick={() => setIsMenuOpen(false)}>
                    <Calendar size={16} />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/profile" className="mobile-user-link" onClick={() => setIsMenuOpen(false)}>
                    <Settings size={16} />
                    <span>Profile Settings</span>
                  </Link>
                  <button onClick={handleLogout} className="mobile-user-link logout">
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
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