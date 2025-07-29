import React from 'react';
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import './CTASection.css';

const CTASection = () => {
  const benefits = [
    "Connect with 1000+ verified vendors",
    "Plan your event in under 30 minutes", 
    "Save up to 40% on vendor services",
    "Get 24/7 expert support",
    "Secure payment protection",
    "Money-back guarantee"
  ];

  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content" data-aos="fade-up">
          <div className="cta-text">
            <div className="cta-badge">
              <Sparkles size={16} />
              <span>Ready to Get Started?</span>
            </div>
            
            <h2 className="cta-title">
              Start Planning Your
              <span className="cta-highlight"> Perfect Event </span>
              Today
            </h2>
            
            <p className="cta-description">
              Join thousands of satisfied customers who've created unforgettable 
              moments with Evea. From intimate gatherings to grand celebrations, 
              we make event planning effortless and affordable.
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
                Start Planning Now
                <ArrowRight size={18} />
              </button>
              <button className="cta-secondary-btn">
                Browse Vendors
              </button>
            </div>

            <div className="cta-trust">
              <span>✅ Free to get started</span>
              <span>✅ No hidden fees</span>
              <span>✅ Cancel anytime</span>
            </div>
          </div>

          <div className="cta-visual" data-aos="fade-left" data-aos-delay="200">
            <div className="cta-image-container">
              <img 
                src="https://images.unsplash.com/photo-1519167758481-83f29c8c2434?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Happy couple at their event"
                className="cta-image"
              />
              <div className="floating-element element-1">
                <Sparkles size={20} />
                <span>Perfect Event</span>
              </div>
              <div className="floating-element element-2">
                <CheckCircle size={20} />
                <span>Verified Vendors</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;