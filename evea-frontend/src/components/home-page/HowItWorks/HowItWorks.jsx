// src/components/home-page/HowItWorks/HowItWorks.jsx
import React from 'react';
import { Search, MousePointer, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      icon: <Search size={32} />,
      title: 'Search & Discover',
      description: 'Browse through our curated marketplace of verified vendors. Filter by location, budget, and event type to find perfect matches.',
      features: ['Advanced search filters', 'Real-time availability', 'Verified vendor profiles', 'Customer reviews & ratings']
    },
    {
      step: '02',
      icon: <MousePointer size={32} />,
      title: 'Plan & Customize',
      description: 'Use our drag-and-drop event planner to visualize your event. Customize packages, compare quotes, and manage your timeline.',
      features: ['Drag & drop interface', 'Real-time cost calculator', 'Custom package builder', 'Timeline management']
    },
    {
      step: '03',
      icon: <Calendar size={32} />,
      title: 'Book & Coordinate',
      description: 'Secure your vendors with our escrow payment system. Track progress, communicate with vendors, and manage all details.',
      features: ['Secure payment processing', 'Vendor communication hub', 'Progress tracking', 'Event coordination tools']
    },
    {
      step: '04',
      icon: <CheckCircle size={32} />,
      title: 'Celebrate & Enjoy',
      description: 'Sit back and enjoy your perfectly planned event. Our support team ensures everything runs smoothly on your special day.',
      features: ['Day-of coordination', '24/7 support hotline', 'Quality assurance', 'Post-event follow-up']
    }
  ];

  return (
    <section className="how-it-works-section section">
      <div className="container">
        <div className="how-it-works-header" data-aos="fade-up">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Four simple steps to create your perfect event. Our streamlined process 
            makes event planning effortless and enjoyable.
          </p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-wrapper">
              <div 
                className="step-card"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="step-header">
                  <div className="step-number">
                    <span>{step.step}</span>
                  </div>
                  <div className="step-icon">
                    {step.icon}
                  </div>
                </div>

                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                  
                  <ul className="step-features">
                    {step.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="step-feature">
                        <CheckCircle size={16} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="step-visual">
                  <div className="step-image-placeholder">
                    <div className="placeholder-content">
                      {step.icon}
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="step-connector" data-aos="fade-in" data-aos-delay={index * 150 + 75}>
                  <ArrowRight size={24} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="how-it-works-cta" data-aos="fade-up" data-aos-delay="600">
          <div className="cta-content">
            <h3 className="cta-title">Ready to Start Planning?</h3>
            <p className="cta-description">
              Join thousands of satisfied customers who've created amazing events with Evea.
            </p>
            <button className="cta-button">
              Get Started Now
              <ArrowRight size={20} />
            </button>
          </div>
          
          <div className="cta-stats">
            <div className="cta-stat">
              <div className="cta-stat-number">5K+</div>
              <div className="cta-stat-label">Events Planned</div>
            </div>
            <div className="cta-stat">
              <div className="cta-stat-number">4.9★</div>
              <div className="cta-stat-label">Average Rating</div>
            </div>
            <div className="cta-stat">
              <div className="cta-stat-number">98%</div>
              <div className="cta-stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;