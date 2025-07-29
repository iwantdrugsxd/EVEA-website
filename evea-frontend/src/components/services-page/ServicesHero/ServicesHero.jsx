// src/components/services-page/ServicesHero/ServicesHero.jsx
import React from 'react';
import { Star, Users, Calendar, Play, Shield } from 'lucide-react';
import './ServicesHero.css';

const ServicesHero = () => {
  return (
    <section className="services-hero">
      <div className="services-hero-background">
        <div className="services-hero-gradient"></div>
        <div className="services-floating-shapes">
          <div className="services-shape services-shape-1"></div>
          <div className="services-shape services-shape-2"></div>
          <div className="services-shape services-shape-3"></div>
        </div>
      </div>

      <div className="container">
        <div className="services-hero-content">
          <div className="services-hero-text">
            <div className="services-hero-badge" data-aos="fade-up">
              <Star size={16} />
              <span>1000+ Verified Service Providers</span>
            </div>
            
            <h1 className="services-hero-title" data-aos="fade-up" data-aos-delay="100">
              Find Perfect
              <span className="services-title-highlight"> Services for Your Event</span>
            </h1>
            
            <p className="services-hero-subtitle" data-aos="fade-up" data-aos-delay="200">
              Discover and book from thousands of verified vendors across all event 
              categories. Compare prices, read reviews, and book instantly.
            </p>

            <div className="services-hero-features" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-item">
                <Shield size={16} />
                <span>1000+ verified vendors</span>
              </div>
              <div className="feature-item">
                <Calendar size={16} />
                <span>Instant booking available</span>
              </div>
              <div className="feature-item">
                <Star size={16} />
                <span>Real customer reviews</span>
              </div>
            </div>

            <div className="hero-buttons" data-aos="fade-up" data-aos-delay="400">
              <button className="btn-primary-large">
                <Calendar size={18} />
                Start Planning
              </button>
              <button className="btn-secondary-large">
                <Play size={18} />
                Watch Demo
              </button>
            </div>

            <div className="hero-trust" data-aos="fade-up" data-aos-delay="500">
              <div className="trust-badges">
                <span>✅ Free to get started</span>
                <span>✅ No hidden fees</span>
                <span>✅ Cancel anytime</span>
              </div>
            </div>
          </div>

          <div className="services-hero-visual" data-aos="fade-left" data-aos-delay="300">
            <div className="services-image-container">
              <img 
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Event services and vendors" 
                className="services-main-image"
              />
              
              {/* Service Showcase Cards */}
              <div className="service-showcase">
                <div className="showcase-card showcase-card-1">
                  <div className="showcase-image">
                    <img 
                      src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                      alt="Wedding venue"
                    />
                  </div>
                  <div className="showcase-content">
                    <div className="showcase-title">Premium Venues</div>
                    <div className="showcase-rating">
                      <Star size={12} className="star-filled" />
                      <span>4.9</span>
                    </div>
                  </div>
                </div>

                <div className="showcase-card showcase-card-2">
                  <div className="showcase-image">
                    <img 
                      src="https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                      alt="Professional photography"
                    />
                  </div>
                  <div className="showcase-content">
                    <div className="showcase-title">Photography</div>
                    <div className="showcase-rating">
                      <Star size={12} className="star-filled" />
                      <span>4.8</span>
                    </div>
                  </div>
                </div>

                <div className="showcase-card showcase-card-3">
                  <div className="showcase-image">
                    <img 
                      src="https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                      alt="Catering services"
                    />
                  </div>
                  <div className="showcase-content">
                    <div className="showcase-title">Catering</div>
                    <div className="showcase-rating">
                      <Star size={12} className="star-filled" />
                      <span>4.7</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="floating-stats">
                <div className="stat-bubble stat-bubble-1">
                  <div className="stat-number">1000+</div>
                  <div className="stat-label">Vendors</div>
                </div>

                <div className="stat-bubble stat-bubble-2">
                  <div className="stat-number">5★</div>
                  <div className="stat-label">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="services-trust-section" data-aos="fade-up" data-aos-delay="600">
          <div className="trust-stats">
            <div className="trust-stat">
              <div className="trust-icon">
                <Users size={24} />
              </div>
              <div className="trust-content">
                <div className="trust-number">50,000+</div>
                <div className="trust-label">Happy Customers</div>
              </div>
            </div>

            <div className="trust-stat">
              <div className="trust-icon">
                <Star size={24} />
              </div>
              <div className="trust-content">
                <div className="trust-number">4.9★</div>
                <div className="trust-label">Average Rating</div>
              </div>
            </div>

            <div className="trust-stat">
              <div className="trust-icon">
                <Calendar size={24} />
              </div>
              <div className="trust-content">
                <div className="trust-number">10,000+</div>
                <div className="trust-label">Events Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHero;