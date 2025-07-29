// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Common Components
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';

// Page Components
import HomePage from './pages/HomePage/HomePage';
import FeaturesPage from './pages/FeaturesPage/Features';
import ServicesPage from './pages/ServicesPage/ServicesPage';
import VendorPage from './pages/VendorPage/VendorPage';
import BlogPage from './pages/BlogPage/BlogPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import EventPlanningPage from './pages/EventPlanningPage/EventPlanningPage';
import VendorRegistrationPage from './pages/VendorRegistrationPage/VendorRegistrationPage';
import EcommercePage from './pages/EcommercePage/EcommercePage';
import VendorDashboard from './pages/VendorDashboard/VendorDashboard';

// Dashboard Sub-pages
import OrdersPage from './pages/OrdersPage/OrdersPage';
import RefundRequestsPage from './pages/RefundRequestsPage/RefundRequestsPage';
import InventoryPage from './pages/InventoryPage/InventoryPage';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage';
import BusinessProfilePage from './pages/BusinessProfilePage/BusinessProfilePage';

// Styles
import './App.css';

// Layout component to handle conditional header/footer
const AppLayout = ({ children }) => {
  const location = useLocation();
  
  // Define routes that should NOT have header and footer (dashboard routes)
  const dashboardRoutes = [
    '/vendor-dashboard',
    '/vendor/dashboard',
    '/vendor/orders',
    '/vendor/refunds', 
    '/vendor/inventory',
    '/vendor/notifications',
    '/vendor/profile'
  ];
  
  // Check if current route is a dashboard route
  const isDashboardRoute = dashboardRoutes.some(route => 
    location.pathname.startsWith(route)
  );
  
  if (isDashboardRoute) {
    // Dashboard layout - no header/footer, full screen
    return (
      <div className="app-dashboard">
        {children}
      </div>
    );
  }
  
  // Regular layout - with header and footer
  return (
    <div className="app-main">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <AppLayout>
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<HomePage />} />
            
            {/* Features Route */}
            <Route path="/features" element={<FeaturesPage />} />
            
            {/* E-commerce/Marketplace Routes */}
            <Route path="/shop" element={<EcommercePage />} />
            <Route path="/marketplace" element={<EcommercePage />} />
            
            {/* Services Route */}
            <Route path="/services" element={<ServicesPage />} />
            
            {/* Vendors Route */}
            <Route path="/vendors" element={<VendorPage />} />
            
            {/* Blog Route */}
            <Route path="/blog" element={<BlogPage />} />
            
            {/* Event Planning Route */}
            <Route path="/plan-event" element={<EventPlanningPage />} />
            
            {/* Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/vendor-registration" element={<VendorRegistrationPage />} />
            
            {/* Regular User Dashboard */}
            <Route path="/dashboard" element={
              <div style={{ padding: '100px 20px', textAlign: 'center' }}>
                <h2>User Dashboard</h2>
                <p>Welcome! You are now logged in.</p>
              </div>
            } />
            
            {/* VENDOR DASHBOARD ROUTES - NO HEADER/FOOTER */}
            <Route path="/vendor-dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            
            {/* Vendor Dashboard Sub-routes - NO HEADER/FOOTER */}
            <Route path="/vendor/orders" element={<OrdersPage />} />
            <Route path="/vendor/refunds" element={<RefundRequestsPage />} />
            <Route path="/vendor/inventory" element={<InventoryPage />} />
            <Route path="/vendor/notifications" element={<NotificationsPage />} />
            <Route path="/vendor/profile" element={<BusinessProfilePage />} />
            
            {/* Profile Routes */}
            <Route path="/profile" element={<BusinessProfilePage />} />
            <Route path="/profile/business" element={<BusinessProfilePage />} />
            
            {/* Static Content Routes */}
            <Route path="/how-it-works" element={
              <div className="static-page-container">
                <div className="container">
                  <div className="static-page-content">
                    <h1 className="page-title">How It Works</h1>
                    <div className="content-section">
                      <h2>Simple Steps to Perfect Events</h2>
                      <div className="steps-grid">
                        <div className="step-item">
                          <div className="step-number">1</div>
                          <h3>Tell Us Your Vision</h3>
                          <p>Share your event details, preferences, and budget with our smart planning tool.</p>
                        </div>
                        <div className="step-item">
                          <div className="step-number">2</div>
                          <h3>Get Matched with Vendors</h3>
                          <p>Our AI algorithm connects you with verified vendors that fit your requirements.</p>
                        </div>
                        <div className="step-item">
                          <div className="step-number">3</div>
                          <h3>Plan & Coordinate</h3>
                          <p>Use our planning tools to manage timelines, budgets, and vendor coordination.</p>
                        </div>
                        <div className="step-item">
                          <div className="step-number">4</div>
                          <h3>Celebrate Your Event</h3>
                          <p>Enjoy your perfectly planned event while we handle the coordination details.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            } />
            
            {/* About Us Route */}
            <Route path="/about" element={
              <div className="static-page-container">
                <div className="container">
                  <div className="static-page-content">
                    <h1 className="page-title">About EVEA</h1>
                    <div className="content-section">
                      <h2>Our Story</h2>
                      <p>EVEA was founded with a simple vision: to make event planning effortless and extraordinary. We believe that every celebration, from intimate gatherings to grand occasions, deserves the perfect execution.</p>
                      
                      <h2>Our Mission</h2>
                      <p>To revolutionize the event industry by connecting event planners with the best vendors through innovative technology, ensuring every event is memorable and stress-free.</p>
                      
                      <h2>Why Choose Us</h2>
                      <p>With over 10,000 verified vendors, cutting-edge planning tools, and 24/7 support, we're committed to making your event dreams come true.</p>
                    </div>
                  </div>
                </div>
              </div>
            } />
            
            {/* Contact Us Route */}
            <Route path="/contact" element={
              <div className="static-page-container">
                <div className="container">
                  <div className="static-page-content">
                    <h1 className="page-title">Contact Us</h1>
                    <div className="content-section">
                      <h2>Get in Touch</h2>
                      <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                      
                      <div className="contact-info">
                        <div className="contact-item">
                          <h3>Email</h3>
                          <p>hello@evea.com</p>
                        </div>
                        <div className="contact-item">
                          <h3>Phone</h3>
                          <p>+91 98765 43210</p>
                        </div>
                        <div className="contact-item">
                          <h3>Address</h3>
                          <p>123 Event Street, Mumbai, Maharashtra, India</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            } />
            
            {/* Terms and Privacy Routes */}
            <Route path="/terms" element={
              <div className="static-page-container">
                <div className="container">
                  <div className="static-page-content">
                    <h1 className="page-title">Terms of Service</h1>
                    <div className="content-section">
                      <h2>Agreement to Terms</h2>
                      <p>By accessing and using EVEA, you accept and agree to be bound by these terms and conditions.</p>
                      
                      <h2>Use License</h2>
                      <p>Permission is granted to temporarily use EVEA for personal, non-commercial transitory viewing only.</p>
                      
                      <h2>User Account</h2>
                      <p>You are responsible for safeguarding your account and all activities that occur under your account.</p>
                      
                      <h2>Service Availability</h2>
                      <p>We strive to maintain service availability but cannot guarantee uninterrupted access at all times.</p>
                      
                      <h2>Payment Terms</h2>
                      <p>All payments made through our platform are processed securely. Refund policies vary by vendor and service type.</p>
                      
                      <h2>Vendor Responsibilities</h2>
                      <p>Vendors are responsible for delivering services as described and maintaining professional standards.</p>
                    </div>
                  </div>
                </div>
              </div>
            } />
            
            <Route path="/privacy" element={
              <div className="static-page-container">
                <div className="container">
                  <div className="static-page-content">
                    <h1 className="page-title">Privacy Policy</h1>
                    <div className="content-section">
                      <h2>Information We Collect</h2>
                      <p>We collect information you provide directly to us and information automatically collected when you use our services.</p>
                      
                      <h2>How We Use Your Information</h2>
                      <p>We use your information to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
                      
                      <h2>Information Sharing</h2>
                      <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent.</p>
                      
                      <h2>Data Security</h2>
                      <p>We implement appropriate security measures to protect your personal information against unauthorized access.</p>
                      
                      <h2>Cookies and Tracking</h2>
                      <p>We use cookies and similar technologies to enhance your experience and analyze website usage.</p>
                      
                      <h2>Your Rights</h2>
                      <p>You have the right to access, update, or delete your personal information at any time through your account settings.</p>
                    </div>
                  </div>
                </div>
              </div>
            } />
            
            {/* Support Routes */}
            <Route path="/support" element={
              <div className="static-page-container">
                <div className="container">
                  <div className="static-page-content">
                    <h1 className="page-title">Support Center</h1>
                    <div className="content-section">
                      <h2>How Can We Help You?</h2>
                      <p>Find answers to common questions and get the support you need.</p>
                      
                      <h2>Frequently Asked Questions</h2>
                      <div className="faq-item">
                        <h3>How do I book a vendor?</h3>
                        <p>Browse our vendor marketplace, select your preferred vendor, and follow the booking process.</p>
                      </div>
                      
                      <div className="faq-item">
                        <h3>What payment methods do you accept?</h3>
                        <p>We accept all major credit cards, UPI, net banking, and digital wallets.</p>
                      </div>
                      
                      <div className="faq-item">
                        <h3>Can I cancel or modify my booking?</h3>
                        <p>Yes, you can cancel or modify bookings according to each vendor's cancellation policy.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            } />
            
            <Route path="/help" element={
              <div className="static-page-container">
                <div className="container">
                  <div className="static-page-content">
                    <h1 className="page-title">Help Center</h1>
                    <div className="content-section">
                      <h2>Need Assistance?</h2>
                      <p>Our support team is here to help you 24/7.</p>
                      
                      <div className="help-options">
                        <div className="help-option">
                          <h3>Live Chat</h3>
                          <p>Get instant help from our support team</p>
                          <button className="btn-primary">Start Chat</button>
                        </div>
                        
                        <div className="help-option">
                          <h3>Email Support</h3>
                          <p>Send us an email and we'll respond within 24 hours</p>
                          <button className="btn-secondary">Send Email</button>
                        </div>
                        
                        <div className="help-option">
                          <h3>Phone Support</h3>
                          <p>Call us directly for urgent assistance</p>
                          <button className="btn-secondary">Call Now</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            } />
            
            {/* 404 Not Found Route - Should be last */}
            <Route path="*" element={
              <div className="static-page-container">
                <div className="container">
                  <div className="static-page-content" style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <h1 style={{ fontSize: '4rem', color: '#8B2635', marginBottom: '1rem' }}>404</h1>
                    <h2 className="page-title">Page Not Found</h2>
                    <p style={{ marginBottom: '2rem' }}>The page you're looking for doesn't exist or has been moved.</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <a href="/" className="btn-primary">Go Home</a>
                      <a href="/support" className="btn-secondary">Get Support</a>
                    </div>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </AppLayout>
      </div>
    </Router>
  );
}

export default App;