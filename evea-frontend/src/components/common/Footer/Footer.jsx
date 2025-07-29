// src/components/common/Footer/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'How It Works', path: '/how-it-works' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press & Media', path: '/press' }
    ],
    services: [
      { name: 'Wedding Planning', path: '/services/wedding' },
      { name: 'Corporate Events', path: '/services/corporate' },
      { name: 'Birthday Parties', path: '/services/birthday' },
      { name: 'Special Occasions', path: '/services/special' }
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' }
    ],
    vendors: [
      { name: 'Become a Vendor', path: '/vendors' },
      { name: 'Vendor Login', path: '/vendor/login' },
      { name: 'Vendor Support', path: '/vendor/support' },
      { name: 'Success Stories', path: '/vendor/stories' }
    ]
  };

  const socialLinks = [
    { icon: <Facebook size={20} />, url: '#', name: 'Facebook' },
    { icon: <Twitter size={20} />, url: '#', name: 'Twitter' },
    { icon: <Instagram size={20} />, url: '#', name: 'Instagram' },
    { icon: <Linkedin size={20} />, url: '#', name: 'LinkedIn' }
  ];

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            {/* Brand Section */}
            <div className="footer-brand" data-aos="fade-up">
              <Link to="/" className="footer-logo">
                <div className="footer-logo-icon">
                  <Heart className="footer-heart-icon" />
                </div>
                <span className="footer-logo-text">Evea</span>
              </Link>
              
              <p className="footer-description">
                Transforming event planning with innovative technology, connecting you 
                with the best vendors to create unforgettable experiences.
              </p>

              <div className="footer-contact">
                <div className="contact-item">
                  <Mail size={16} />
                  <span>hello@evea.com</span>
                </div>
                <div className="contact-item">
                  <Phone size={16} />
                  <span>+91 98765 43210</span>
                </div>
                <div className="contact-item">
                  <MapPin size={16} />
                  <span>Mumbai, Maharashtra, India</span>
                </div>
              </div>

              <div className="footer-social">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="social-link"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            <div className="footer-links">
              <div className="footer-column" data-aos="fade-up" data-aos-delay="100">
                <h3 className="footer-column-title">Company</h3>
                <ul className="footer-link-list">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <Link to={link.path} className="footer-link">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-column" data-aos="fade-up" data-aos-delay="200">
                <h3 className="footer-column-title">Services</h3>
                <ul className="footer-link-list">
                  {footerLinks.services.map((link, index) => (
                    <li key={index}>
                      <Link to={link.path} className="footer-link">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-column" data-aos="fade-up" data-aos-delay="300">
                <h3 className="footer-column-title">Support</h3>
                <ul className="footer-link-list">
                  {footerLinks.support.map((link, index) => (
                    <li key={index}>
                      <Link to={link.path} className="footer-link">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-column" data-aos="fade-up" data-aos-delay="400">
                <h3 className="footer-column-title">For Vendors</h3>
                <ul className="footer-link-list">
                  {footerLinks.vendors.map((link, index) => (
                    <li key={index}>
                      <Link to={link.path} className="footer-link">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="footer-newsletter" data-aos="fade-up" data-aos-delay="500">
              <h3 className="footer-column-title">Stay Updated</h3>
              <p className="newsletter-description">
                Get the latest updates on new features, vendor spotlights, and event planning tips.
              </p>
              
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                />
                <button className="newsletter-btn">
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="newsletter-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">📧</span>
                  <span>Weekly event planning tips</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🎯</span>
                  <span>Exclusive vendor deals</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🎉</span>
                  <span>Event inspiration gallery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>&copy; 2024 Evea. All rights reserved.</p>
            </div>
            
            <div className="footer-legal">
              <Link to="/privacy" className="legal-link">Privacy Policy</Link>
              <Link to="/terms" className="legal-link">Terms of Service</Link>
              <Link to="/cookies" className="legal-link">Cookie Policy</Link>
            </div>

            <div className="footer-badges">
              <div className="security-badge">
                <span className="badge-icon">🔒</span>
                <span>SSL Secured</span>
              </div>
              <div className="security-badge">
                <span className="badge-icon">✅</span>
                <span>Verified Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;