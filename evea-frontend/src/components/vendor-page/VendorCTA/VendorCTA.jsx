import React from 'react';
import { ArrowRight, Sparkles, CheckCircle, Clock } from 'lucide-react';
import './VendorCTA.css';

const VendorCTA = () => {
  const benefits = [
    "Free registration and setup - Get started in minutes",
    "No monthly fees or hidden charges",
    "Instant access to 50,000+ potential customers",
    "Professional dashboard and business tools included",
    "24/7 dedicated vendor support team",
    "Money-back guarantee on your first booking"
  ];

  return (
    <section className="vendor-cta-section">
      <div className="container">
        <div className="vendor-cta-content" data-aos="fade-up">
          <div className="cta-text">
            <div className="cta-badge">
              <Sparkles size={16} />
              <span>Ready to Transform Your Business?</span>
            </div>
            
            <h2 className="cta-title">
              Start Growing Your
              <span className="cta-highlight"> Event Business </span>
              Today
            </h2>
            
            <p className="cta-description">
              Join thousands of successful vendors who've transformed their businesses with Evea.
            </p>

            <div className="cta-benefits">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <CheckCircle size={16} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="cta-buttons">
              <button className="cta-primary-btn">
                Get Started - It's Free
                <ArrowRight size={18} />
              </button>
              <button className="cta-secondary-btn">
                Schedule a Demo
              </button>
            </div>

            <div className="cta-trust">
              <div className="trust-item">
                <Clock size={16} />
                <span>Takes less than 10 minutes to complete registration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorCTA;