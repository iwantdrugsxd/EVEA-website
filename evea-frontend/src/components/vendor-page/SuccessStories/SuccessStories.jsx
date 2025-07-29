import React from 'react';
import { TrendingUp, Quote, Star, MapPin } from 'lucide-react';
import './SuccessStories.css';

const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      vendorName: "Rajesh Photography",
      businessType: "Wedding Photography",
      location: "Mumbai",
      beforeRevenue: "₹50,000/month",
      afterRevenue: "₹2,50,000/month",
      growthPercentage: "400%",
      testimonial: "Evea transformed my photography business completely!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5
    },
    {
      id: 2,
      vendorName: "Elegant Events Co.",
      businessType: "Event Planning",
      location: "Delhi",
      beforeRevenue: "₹1,00,000/month",
      afterRevenue: "₹5,00,000/month",
      growthPercentage: "400%",
      testimonial: "The platform's tools helped me streamline operations.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5
    }
  ];

  return (
    <section className="success-stories-section section">
      <div className="container">
        <div className="success-stories-header" data-aos="fade-up">
          <h2 className="section-title">Vendor Success Stories</h2>
          <p className="section-subtitle">
            Real stories from vendors who've transformed their businesses with Evea.
          </p>
        </div>

        <div className="stories-grid">
          {stories.map((story, index) => (
            <div 
              key={story.id}
              className="story-card"
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              <div className="story-header">
                <Quote className="quote-icon" size={32} />
                <div className="story-rating">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} size={16} className="star-filled" />
                  ))}
                </div>
              </div>

              <div className="story-content">
                <p className="story-testimonial">"{story.testimonial}"</p>
              </div>

              <div className="story-vendor-info">
                <div className="vendor-details">
                  <img 
                    src={story.image} 
                    alt={story.vendorName}
                    className="vendor-avatar"
                  />
                  <div className="vendor-meta">
                    <h4 className="vendor-name">{story.vendorName}</h4>
                    <p className="vendor-business">{story.businessType}</p>
                    <div className="vendor-location">
                      <MapPin size={14} />
                      <span>{story.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;