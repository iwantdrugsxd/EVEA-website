import React from 'react';
import { Star, MapPin, Camera, Utensils, Music, ArrowRight } from 'lucide-react';
import './FeaturedVendors.css';

const FeaturedVendors = () => {
  const vendors = [
    {
      id: 1,
      name: "Elegant Moments Photography",
      category: "Photography",
      location: "Mumbai",
      rating: 4.9,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      startingPrice: "₹15,000",
      icon: <Camera size={20} />,
      verified: true,
      specialties: ["Wedding", "Corporate", "Portrait"]
    },
    {
      id: 2,
      name: "Gourmet Delights Catering",
      category: "Catering",
      location: "Delhi",
      rating: 4.8,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      startingPrice: "₹800/plate",
      icon: <Utensils size={20} />,
      verified: true,
      specialties: ["Indian", "Continental", "Fusion"]
    },
    {
      id: 3,
      name: "Rhythm & Beats Entertainment",
      category: "Entertainment",
      location: "Bangalore",
      rating: 4.9,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      startingPrice: "₹12,000",
      icon: <Music size={20} />,
      verified: true,
      specialties: ["DJ", "Live Band", "Lighting"]
    }
  ];

  return (
    <section className="featured-vendors-section section">
      <div className="container">
        <div className="featured-vendors-header" data-aos="fade-up">
          <h2 className="section-title">Featured Vendors</h2>
          <p className="section-subtitle">
            Meet our top-rated vendors who consistently deliver exceptional experiences 
            and have earned the trust of thousands of customers.
          </p>
        </div>

        <div className="vendors-grid">
          {vendors.map((vendor, index) => (
            <div 
              key={vendor.id}
              className="vendor-card"
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              <div className="vendor-image-container">
                <img 
                  src={vendor.image} 
                  alt={vendor.name}
                  className="vendor-image"
                />
                <div className="vendor-overlay">
                  <button className="vendor-quick-view">
                    Quick View
                  </button>
                </div>
                {vendor.verified && (
                  <div className="verified-badge">
                    <span>✓ Verified</span>
                  </div>
                )}
              </div>

              <div className="vendor-content">
                <div className="vendor-header">
                  <div className="vendor-category">
                    {vendor.icon}
                    <span>{vendor.category}</span>
                  </div>
                  <div className="vendor-rating">
                    <Star size={16} className="star-filled" />
                    <span>{vendor.rating}</span>
                    <span className="review-count">({vendor.reviews})</span>
                  </div>
                </div>

                <h3 className="vendor-name">{vendor.name}</h3>
                
                <div className="vendor-location">
                  <MapPin size={14} />
                  <span>{vendor.location}</span>
                </div>

                <div className="vendor-specialties">
                  {vendor.specialties.map((specialty, idx) => (
                    <span key={idx} className="specialty-tag">
                      {specialty}
                    </span>
                  ))}
                </div>

                <div className="vendor-footer">
                  <div className="vendor-price">
                    <span className="price-label">Starting from</span>
                    <span className="price-amount">{vendor.startingPrice}</span>
                  </div>
                  <button className="vendor-contact-btn">
                    Contact
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="featured-vendors-cta" data-aos="fade-up" data-aos-delay="450">
          <button className="view-all-vendors-btn">
            View All Vendors
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};
export default FeaturedVendors;
