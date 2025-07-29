// src/pages/EventPlanningPage/components/LandingStep/LandingStep.jsx
import React, { useEffect } from 'react';
import { ArrowRight, Gift, Target, Zap, Shield } from 'lucide-react';
import './LandingStep.css';

const LandingStep = ({ nextStep, showIntro = false }) => {
  useEffect(() => {
    // Add animation classes after component mounts
    const elements = document.querySelectorAll('.animate-on-load');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate-fade-in-up');
      }, index * 100);
    });
  }, []);

  if (showIntro) {
    return (
      <div className="landing-step intro-variant">
        <div className="intro-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        <div className="intro-container">
          <div className="intro-content">
            <div className="intro-icon animate-on-load">
              <Gift className="w-16 h-16 text-purple-600" />
            </div>
            
            <h1 className="intro-title animate-on-load">
              Let's Create Something
              <span className="gradient-text"> Amazing</span>
            </h1>
            
            <p className="intro-subtitle animate-on-load">
              We'll guide you through every step to create the perfect event that matches your vision and budget
            </p>

            <div className="intro-features animate-on-load">
              <div className="feature-card">
                <div className="feature-icon">
                  <Target className="w-8 h-8" />
                </div>
                <h3>Personalized Planning</h3>
                <p>Our AI-powered system learns your preferences to suggest the perfect vendors and packages</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <Zap className="w-8 h-8" />
                </div>
                <h3>Smart Optimization</h3>
                <p>Intelligent recommendations to maximize value while staying within your budget constraints</p>
              </div>
            </div>

            <button 
              onClick={nextStep}
              className="intro-cta-button animate-on-load"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-step">
      <div className="landing-background">
        <div className="gradient-overlay"></div>
        <div className="floating-elements">
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
          <div className="floating-element element-4"></div>
        </div>
      </div>

      <div className="landing-container">
        <div className="landing-content">
          <div className="landing-header">
            <h1 className="landing-title animate-on-load">
              <span className="title-main">EVEA</span>
              <span className="title-tagline">Event Excellence Awaits</span>
            </h1>
            
            <p className="landing-subtitle animate-on-load">
              Transform your vision into unforgettable events with India's most trusted event planning platform
            </p>
          </div>
          
          <div className="landing-actions animate-on-load">
            <button 
              onClick={nextStep}
              className="primary-cta-button"
            >
              <span>Start Planning</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button className="secondary-cta-button">
              Browse Vendors
            </button>
          </div>

          <div className="landing-features animate-on-load">
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <Target className="w-6 h-6" />
              </div>
              <div className="feature-content">
                <h3>Expert Curation</h3>
                <p>Hand-picked vendors verified for quality and reliability</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <Zap className="w-6 h-6" />
              </div>
              <div className="feature-content">
                <h3>Instant Booking</h3>
                <p>Real-time availability and immediate confirmations</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <Shield className="w-6 h-6" />
              </div>
              <div className="feature-content">
                <h3>Secure Payments</h3>
                <p>Protected transactions with money-back guarantee</p>
              </div>
            </div>
          </div>

          <div className="landing-stats animate-on-load">
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Events Planned</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2K+</div>
              <div className="stat-label">Verified Vendors</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">25+</div>
              <div className="stat-label">Cities Covered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingStep;