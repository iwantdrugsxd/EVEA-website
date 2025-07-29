// src/components/vendor-page/VendorCategories/VendorCategories.jsx
import React from 'react';
import { Camera, Utensils, Music, Palette, Car, Building, Heart } from 'lucide-react';
import './VendorCategories.css';

const VendorCategories = () => {
  const categories = [
    {
      name: "Wedding Services",
      icon: <Heart size={32} />,
      avgBookingValue: "₹75,000",
      description: "The most popular category with highest revenue potential"
    },
    {
      name: "Corporate Events",
      icon: <Building size={32} />,
      avgBookingValue: "₹45,000",
      description: "Growing segment with repeat business opportunities"
    },
    {
      name: "Photography & Videography",
      icon: <Camera size={32} />,
      avgBookingValue: "₹35,000",
      description: "Essential service for all types of events"
    }
  ];

  return (
    <section className="vendor-categories-section section">
      <div className="container">
        <div className="vendor-categories-header" data-aos="fade-up">
          <h2 className="section-title">What Type of Vendor Are You?</h2>
          <p className="section-subtitle">
            Discover your perfect category and understand the market opportunities.
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="category-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="category-header">
                <div className="category-icon-wrapper">
                  <div className="category-icon">
                    {category.icon}
                  </div>
                </div>
              </div>

              <div className="category-content">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>
                <div className="category-stats">
                  <span className="stat-value">{category.avgBookingValue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VendorCategories;
