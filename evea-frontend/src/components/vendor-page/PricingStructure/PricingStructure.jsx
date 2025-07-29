import React from 'react';
import { CheckCircle, X, Zap } from 'lucide-react';
import './PricingStructure.css';

const PricingStructure = () => {
  return (
    <section className="pricing-structure-section section">
      <div className="container">
        <div className="pricing-header" data-aos="fade-up">
          <h2 className="section-title">Transparent Pricing</h2>
          <p className="section-subtitle">
            Simple, fair pricing with no hidden fees.
          </p>
        </div>

        <div className="pricing-comparison" data-aos="fade-up" data-aos-delay="200">
          <div className="comparison-table">
            <div className="table-header">
              <div className="header-item"></div>
              <div className="header-item featured">
                <Zap size={20} />
                <span>Evea</span>
                <div className="featured-badge">Recommended</div>
              </div>
              <div className="header-item">Competitor A</div>
              <div className="header-item">Competitor B</div>
            </div>

            <div className="table-row">
              <div className="row-label">Platform Fee</div>
              <div className="row-value featured">5%</div>
              <div className="row-value">8%</div>
              <div className="row-value">10%</div>
            </div>

            <div className="table-row">
              <div className="row-label">Setup Fee</div>
              <div className="row-value featured">
                <CheckCircle size={16} className="check-icon" />
                ₹0
              </div>
              <div className="row-value">
                <X size={16} className="x-icon" />
                ₹2,500
              </div>
              <div className="row-value">
                <X size={16} className="x-icon" />
                ₹5,000
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingStructure;