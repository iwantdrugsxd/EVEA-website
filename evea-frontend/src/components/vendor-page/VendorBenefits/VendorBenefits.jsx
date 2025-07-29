import React from 'react';
import { TrendingUp, Users, Shield, Headphones, GraduationCap, Zap } from 'lucide-react';
import './VendorBenefits.css';

const VendorBenefits = () => {
  const benefits = [
    {
      icon: <TrendingUp size={32} />,
      title: 'Increase Your Revenue',
      description: 'Average vendors see 300% revenue growth within 6 months.',
      stats: '₹2.5L avg monthly earnings'
    },
    {
      icon: <Users size={32} />,
      title: 'Access Massive Customer Base',
      description: 'Reach 50,000+ verified customers actively planning events.',
      stats: '500+ daily active users'
    },
    {
      icon: <Shield size={32} />,
      title: 'Secure & Reliable Payments',
      description: 'Guaranteed payments with our escrow system.',
      stats: '99.9% payment success rate'
    }
  ];

  return (
    <section className="vendor-benefits-section section">
      <div className="container">
        <div className="vendor-benefits-header" data-aos="fade-up">
          <h2 className="section-title">Why Choose Evea for Your Business?</h2>
          <p className="section-subtitle">
            Join thousands of successful vendors who've transformed their businesses.
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="benefit-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="benefit-icon-wrapper">
                <div className="benefit-icon">
                  {benefit.icon}
                </div>
              </div>

              <div className="benefit-content">
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
                <div className="benefit-stats">{benefit.stats}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VendorBenefits;