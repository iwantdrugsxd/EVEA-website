// src/components/vendor-page/VendorHero/VendorHero.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, ArrowRight, CheckCircle, Users, 
  Calendar, DollarSign, Star, Award 
} from 'lucide-react';
import './VendorHero.css';

const VendorHero = () => {
  const navigate = useNavigate();

  const benefits = [
    { icon: <CheckCircle size={16} />, text: "Zero listing fees" },
    { icon: <CheckCircle size={16} />, text: "Instant customer access" },
    { icon: <CheckCircle size={16} />, text: "Professional tools included" },
    { icon: <CheckCircle size={16} />, text: "24/7 support team" }
  ];

  const stats = [
    { 
      icon: <Users size={24} />, 
      value: "50,000+", 
      label: "Active Customers",
      color: "blue"
    },
    { 
      icon: <Calendar size={24} />, 
      value: "1M+", 
      label: "Events Completed",
      color: "green"
    },
    { 
      icon: <DollarSign size={24} />, 
      value: "₹250Cr+", 
      label: "Revenue Generated",
      color: "purple"
    },
    { 
      icon: <Star size={24} />, 
      value: "4.8/5", 
      label: "Vendor Rating",
      color: "yellow"
    }
  ];

  const handleStartSelling = () => {
    // Navigate to vendor registration page
    navigate('/vendor-registration');
  };

  const handleLearnMore = () => {
    // Scroll to benefits section or navigate to vendor info page
    const benefitsSection = document.querySelector('.vendor-benefits-section');
    if (benefitsSection) {
      benefitsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="vendor-hero">
      <div className="vendor-hero-background">
        <div className="vendor-shape vendor-shape-1"></div>
        <div className="vendor-shape vendor-shape-2"></div>
        <div className="vendor-shape vendor-shape-3"></div>
      </div>

      <div className="container">
        <div className="vendor-hero-content">
          <div className="vendor-hero-text">
            <div className="vendor-hero-badge" data-aos="fade-up">
              <Award size={16} />
              <span>India's #1 Event Marketplace</span>
            </div>
            
            <h1 className="vendor-hero-title" data-aos="fade-up" data-aos-delay="100">
              Grow Your Event Business with
              <span className="vendor-title-highlight"> Unlimited Opportunities</span>
            </h1>
            
            <p className="vendor-hero-subtitle" data-aos="fade-up" data-aos-delay="200">
              Join India's fastest-growing event marketplace and connect with thousands of customers. 
              From intimate gatherings to grand celebrations, we make event planning effortless and affordable.
            </p>

            <div className="vendor-hero-benefits" data-aos="fade-up" data-aos-delay="300">
              {benefits.map((benefit, index) => (
                <div key={index} className="vendor-benefit-item">
                  <div className="benefit-icon">{benefit.icon}</div>
                  <span>{benefit.text}</span>
                </div>
              ))}
            </div>

            <div className="vendor-hero-buttons" data-aos="fade-up" data-aos-delay="400">
              <button className="vendor-btn-primary" onClick={handleStartSelling}>
                <TrendingUp size={18} />
                Start Selling Today
                <ArrowRight size={16} />
              </button>
              <button className="vendor-btn-secondary" onClick={handleLearnMore}>
                Learn More
              </button>
            </div>

            <div className="vendor-trust-indicators" data-aos="fade-up" data-aos-delay="500">
              <div className="trust-badges">
                <span>✅ Free to join</span>
                <span>✅ No setup fees</span>
                <span>✅ Quick approval</span>
              </div>
            </div>
          </div>

          <div className="vendor-hero-visual" data-aos="fade-left" data-aos-delay="300">
            <div className="vendor-image-container">
              <img 
                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Successful event vendor business" 
                className="vendor-main-image"
              />
              
              {/* Dashboard Preview Overlay */}
              <div className="vendor-dashboard-preview">
                <div className="dashboard-header">
                  <div className="dashboard-title">Vendor Dashboard</div>
                  <div className="dashboard-status">
                    <div className="status-dot"></div>
                    <span>Live</span>
                  </div>
                </div>
                
                <div className="dashboard-content">
                  <div className="dashboard-stats">
                    <div className="dashboard-stat">
                      <div className="stat-value">₹2,45,000</div>
                      <div className="stat-label">Monthly Revenue</div>
                    </div>
                    <div className="dashboard-stat">
                      <div className="stat-value">127</div>
                      <div className="stat-label">New Bookings</div>
                    </div>
                  </div>
                  
                  <div className="dashboard-chart">
                    <div className="chart-bars">
                      <div className="chart-bar" style={{height: '40%'}}></div>
                      <div className="chart-bar" style={{height: '65%'}}></div>
                      <div className="chart-bar" style={{height: '80%'}}></div>
                      <div className="chart-bar" style={{height: '45%'}}></div>
                      <div className="chart-bar" style={{height: '90%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Notification */}
              <div className="floating-notification">
                <div className="notification-icon">
                  <CheckCircle size={16} />
                </div>
                <div className="notification-content">
                  <div className="notification-title">New Booking!</div>
                  <div className="notification-text">Wedding photography - ₹45,000</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="vendor-hero-stats" data-aos="fade-up" data-aos-delay="600">
          {stats.map((stat, index) => (
            <div key={index} className={`vendor-stat-item stat-${stat.color}`}>
              <div className="vendor-stat-icon">
                {stat.icon}
              </div>
              <div className="vendor-stat-content">
                <div className="vendor-stat-value">{stat.value}</div>
                <div className="vendor-stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VendorHero;