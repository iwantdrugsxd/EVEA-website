// src/App.jsx - Updated with Authentication Integration
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';

// Common Components
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';

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

// Customer Dashboard Component (Simple)
const CustomerDashboard = () => (
  <div className="customer-dashboard">
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <p>Manage your events and bookings from here.</p>
      </div>
      
      <div className="dashboard-actions">
        <div className="action-card">
          <h3>Browse Marketplace</h3>
          <p>Discover amazing vendors and services for your events.</p>
          <a href="/shop" className="action-button">
            Explore Now
          </a>
        </div>
        
        <div className="action-card">
          <h3>Plan New Event</h3>
          <p>Start planning your next amazing event with our tools.</p>
          <a href="/plan-event" className="action-button">
            Plan Event
          </a>
        </div>
        
        <div className="action-card">
          <h3>My Orders</h3>
          <p>View and manage your current and past orders.</p>
          <a href="/my-orders" className="action-button">
            View Orders
          </a>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppLayout>
            <Routes>
              {/* ================================
                  PUBLIC ROUTES (No Auth Required)
                  ================================ */}
              
              {/* Home Route */}
              <Route path="/" element={<VendorDashboard />} />
              
              {/* Features Route */}
              <Route path="/features" element={<FeaturesPage />} />
              
              {/* E-commerce/Marketplace Routes (Public) */}
              <Route path="/shop" element={<EcommercePage />} />
              <Route path="/marketplace" element={<EcommercePage />} />
              
              {/* Services Route */}
              <Route path="/services" element={<ServicesPage />} />
              
              {/* Vendors Route */}
              <Route path="/vendors" element={<VendorPage />} />
              
              {/* Blog Route */}
              <Route path="/blog" element={<BlogPage />} />
              
              {/* Public Event Planning (anyone can view) */}
              <Route path="/plan-event" element={<EventPlanningPage />} />
              
              {/* ================================
                  AUTHENTICATION ROUTES
                  ================================ */}
              
              {/* Login Route - Redirect if already authenticated */}
              <Route 
                path="/login" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <LoginPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Register Route - Redirect if already authenticated */}
              <Route 
                path="/register" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <RegisterPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Vendor Registration Route - Redirect if already authenticated */}
              <Route 
                path="/vendor-registration" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <VendorRegistrationPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* ================================
                  CUSTOMER PROTECTED ROUTES
                  ================================ */}
              
              {/* Customer Dashboard */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['customer']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Customer Orders */}
              <Route 
                path="/my-orders" 
                element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['customer']}>
                    <div style={{ padding: '100px 20px', textAlign: 'center' }}>
                      <h2>My Orders</h2>
                      <p>Your order history will appear here.</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* ================================
                  VENDOR PROTECTED ROUTES
                  ================================ */}
              
              {/* Vendor Dashboard Routes - NO HEADER/FOOTER */}
              <Route 
                path="/vendor-dashboard" 
                element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['vendor']}>
                    <VendorDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/vendor/dashboard" 
                element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['vendor']}>
                    <VendorDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Vendor Dashboard Sub-routes - NO HEADER/FOOTER */}
              <Route 
                path="/vendor/orders" 
                element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['vendor']}>
                    <OrdersPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/vendor/refunds" 
                element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['vendor']}>
                    <RefundRequestsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/vendor/inventory" 
                element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['vendor']}>
                    <InventoryPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/vendor/notifications" 
                element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['vendor']}>
                    <NotificationsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/vendor/profile" 
                element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['vendor']}>
                    <BusinessProfilePage />
                  </ProtectedRoute>
                } 
              />
              
              {/* ================================
                  COMMON PROTECTED ROUTES
                  ================================ */}
              
              {/* Profile Routes - Available to all authenticated users */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <BusinessProfilePage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/profile/business" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <BusinessProfilePage />
                  </ProtectedRoute>
                } 
              />
              
              {/* ================================
                  STATIC CONTENT ROUTES
                  ================================ */}
              
              <Route path="/how-it-works" element={
                <div className="static-page-container">
                  <h1>How It Works</h1>
                  <p>Learn how EVEA makes event planning easy and efficient.</p>
                </div>
              } />
              
              <Route path="/terms" element={
                <div className="static-page-container">
                  <h1>Terms of Service</h1>
                  <p>Please read our terms of service carefully.</p>
                </div>
              } />
              
              <Route path="/privacy" element={
                <div className="static-page-container">
                  <h1>Privacy Policy</h1>
                  <p>Your privacy is important to us.</p>
                </div>
              } />
              
              <Route path="/contact" element={
                <div className="static-page-container">
                  <h1>Contact Support</h1>
                  <p>Get in touch with our support team.</p>
                  <div className="contact-info">
                    <p>Email: support@evea.com</p>
                    <p>Phone: +91 9876543210</p>
                  </div>
                </div>
              } />
              
              {/* ================================
                  ERROR ROUTES
                  ================================ */}
              
              {/* 404 Not Found Route */}
              <Route path="*" element={
                <div className="error-page-container">
                  <div className="error-content">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                    <div className="error-actions">
                      <a href="/" className="btn-primary">Go Home</a>
                      <a href="/shop" className="btn-secondary">Browse Marketplace</a>
                    </div>
                  </div>
                </div>
              } />
            </Routes>
          </AppLayout>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;