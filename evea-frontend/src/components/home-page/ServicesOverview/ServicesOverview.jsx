// src/components/home-page/ServicesOverview/ServicesOverview.jsx
import React from 'react';
import { Camera, Utensils, Music, Palette, Car, Sparkles, ArrowRight } from 'lucide-react';
import './ServicesOverview.css';

const ServicesOverview = () => {
  const services = [
    {
      icon: <Camera size={32} />,
      title: 'Photography & Videography',
      description: 'Capture every precious moment with professional photographers and videographers.',
      price: 'Starting from ₹15,000',
      popular: true,
      color: 'blue'
    },
    {
      icon: <Utensils size={32} />,
      title: 'Catering Services',
      description: 'Delicious cuisine for all tastes, from traditional to international.',
      price: 'Starting from ₹500/plate',
      popular: false,
      color: 'green'
    },
    {
      icon: <Music size={32} />,
      title: 'Entertainment',
      description: 'DJs, live bands, dancers, and performers to keep your guests engaged.',
      price: 'Starting from ₹8,000',
      popular: true,
      color: 'purple'
    },
    {
      icon: <Palette size={32} />,
      title: 'Decoration & Design',
      description: 'Transform your venue with stunning decorations and theme setups.',
      price: 'Starting from ₹12,000',
      popular: false,
      color: 'pink'
    },
    {
      icon: <Car size={32} />,
      title: 'Transportation',
      description: 'Luxury cars, buses, and special vehicle arrangements for your event.',
      price: 'Starting from ₹5,000',
      popular: false,
      color: 'orange'
    },
    {
      icon: <Sparkles size={32} />,
      title: 'Event Planning',
      description: 'Full-service event planning and coordination from start to finish.',
      price: 'Starting from ₹25,000',
      popular: true,
      color: 'red'
    }
  ];

  return (
    <section className="services-overview-section section">
      <div className="container">
        <div className="services-overview-header" data-aos="fade-up">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Comprehensive event services to make your celebration perfect. 
            From intimate gatherings to grand celebrations, we have everything you need.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`service-card service-${service.color} ${service.popular ? 'popular' : ''}`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {service.popular && (
                <div className="popular-badge">
                  <Sparkles size={14} />
                  <span>Popular</span>
                </div>
              )}

              <div className="service-icon-wrapper">
                <div className="service-icon">
                  {service.icon}
                </div>
              </div>

              <div className="service-content">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <div className="service-price">{service.price}</div>
              </div>

              <div className="service-actions">
                <button className="service-btn-primary">
                  View Vendors
                  <ArrowRight size={16} />
                </button>
                <button className="service-btn-secondary">
                  Learn More
                </button>
              </div>

              <div className="service-hover-effect"></div>
            </div>
          ))}
        </div>

        <div className="services-overview-cta" data-aos="fade-up" data-aos-delay="600">
          <div className="cta-card">
            <div className="cta-content">
              <h3 className="cta-title">Need Something Custom?</h3>
              <p className="cta-description">
                Can't find exactly what you're looking for? Our team can help you find 
                specialized vendors for unique requirements.
              </p>
            </div>
            <div className="cta-actions">
              <button className="cta-button">
                Contact Our Experts
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;