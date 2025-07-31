// evea-frontend/src/components/VendorRegistration/RegistrationComplete.jsx
import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Mail, 
  ArrowRight, 
  Star,
  Award,
  Users,
  TrendingUp,
  Phone,
  MessageCircle
} from 'lucide-react';
import './RegistrationComplete.css';

const RegistrationComplete = ({ onComplete }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const nextSteps = [
    {
      icon: <Clock size={20} />,
      title: 'Application Review',
      description: 'Our team will review your application within 2-3 business days',
      status: 'pending'
    },
    {
      icon: <Mail size={20} />,
      title: 'Email Notification',
      description: 'You\'ll receive an email once your application is approved',
      status: 'pending'
    },
    {
      icon: <Award size={20} />,
      title: 'Dashboard Access',
      description: 'Start managing your services and receive bookings',
      status: 'pending'
    }
  ];

  const benefits = [
    {
      icon: <Users size={24} />,
      title: 'Connect with Customers',
      description: 'Reach thousands of potential customers planning their events'
    },
    {
      icon: <TrendingUp size={24} />,
      title: 'Grow Your Business',
      description: 'Increase bookings and revenue with our marketing tools'
    },
    {
      icon: <Star size={24} />,
      title: 'Build Your Reputation',
      description: 'Collect reviews and showcase your best work'
    }
  ];

  return (
    <div className="registration-complete">
      {showConfetti && <div className="confetti-container"></div>}
      
      <div className="completion-container">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">
            <CheckCircle size={64} />
          </div>
          <h1>Registration Submitted Successfully!</h1>
          <p className="success-message">
            Thank you for joining EVEA! Your vendor application has been submitted 
            and is now being reviewed by our team.
          </p>
        </div>

        {/* Application Status */}
        <div className="application-status">
          <div className="status-card">
            <div className="status-header">
              <Clock size={24} />
              <div>
                <h3>Application Status</h3>
                <p>Under Review</p>
              </div>
            </div>
            <div className="status-badge pending">
              <span>Pending Approval</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps-section">
          <h2>What Happens Next?</h2>
          <div className="steps-timeline">
            {nextSteps.map((step, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  {step.icon}
                </div>
                <div className="timeline-content">
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Preview */}
        <div className="benefits-section">
          <h2>What You'll Get as an EVEA Vendor</h2>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">
                  {benefit.icon}
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Important Information */}
        <div className="info-section">
          <div className="info-card">
            <h3>📧 Check Your Email</h3>
            <p>
              We've sent a confirmation email with your application details. 
              Please keep this for your records.
            </p>
          </div>
          
          <div className="info-card">
            <h3>⏱️ Review Timeline</h3>
            <p>
              Applications are typically reviewed within 2-3 business days. 
              Complex applications may take up to 5 business days.
            </p>
          </div>
          
          <div className="info-card">
            <h3>📞 Need Help?</h3>
            <p>
              Contact our vendor support team if you have any questions about 
              your application or the review process.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="contact-section">
          <h3>Get in Touch</h3>
          <div className="contact-options">
            <a href="mailto:vendor-support@evea.com" className="contact-option">
              <Mail size={20} />
              <span>vendor-support@evea.com</span>
            </a>
            <a href="tel:+911234567890" className="contact-option">
              <Phone size={20} />
              <span>+91 12345 67890</span>
            </a>
            <a href="#" className="contact-option">
              <MessageCircle size={20} />
              <span>Live Chat Support</span>
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="completion-actions">
          <button 
            className="dashboard-btn"
            onClick={onComplete}
          >
            <span>Go to Vendor Dashboard</span>
            <ArrowRight size={20} />
          </button>
          
          <button 
            className="secondary-btn"
            onClick={() => window.open('/vendor/guide', '_blank')}
          >
            <span>Vendor Success Guide</span>
          </button>
        </div>

        {/* Footer */}
        <div className="completion-footer">
          <p>
            By completing your registration, you agree to our{' '}
            <a href="/vendor-terms" target="_blank">Vendor Terms of Service</a> and{' '}
            <a href="/privacy-policy" target="_blank">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationComplete;