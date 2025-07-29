import React from 'react';
import { Star, Quote } from 'lucide-react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Bride",
      location: "Mumbai",
      rating: 5,
      content: "Evea made my dream wedding come true! The platform connected me with amazing vendors and the planning process was seamless. Our photographer captured every precious moment perfectly, and the catering was absolutely delicious. I couldn't have asked for a better experience!",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      eventType: "Wedding",
      eventDate: "December 2023"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "Corporate Event Manager",
      location: "Delhi",
      rating: 5,
      content: "As someone who organizes multiple corporate events, I can say Evea is the best platform I've used. The vendor quality is consistently high, pricing is transparent, and the support team is incredibly responsive. It has streamlined our entire event planning process.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      eventType: "Corporate Event",
      eventDate: "November 2023"
    },
    {
      id: 3,
      name: "Anita Patel",
      role: "Party Planner",
      location: "Bangalore",
      rating: 5,
      content: "From my daughter's sweet sixteen to my parents' anniversary celebration, Evea has been our go-to platform. The drag-and-drop planner is incredible, and we love how we can see real-time costs. The vendors are professional and deliver exactly what they promise.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      eventType: "Birthday Party",
      eventDate: "October 2023"
    }
  ];

  return (
    <section className="testimonials-section section">
      <div className="container">
        <div className="testimonials-header" data-aos="fade-up">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">
            Real stories from real people who created magical moments with Evea. 
            Join thousands of satisfied customers who trust us with their special occasions.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="testimonial-card"
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              <div className="testimonial-header">
                <Quote className="quote-icon" size={32} />
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="star-filled" />
                  ))}
                </div>
              </div>

              <div className="testimonial-content">
                <p className="testimonial-text">"{testimonial.content}"</p>
              </div>

              <div className="testimonial-footer">
                <div className="customer-info">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="customer-avatar"
                  />
                  <div className="customer-details">
                    <h4 className="customer-name">{testimonial.name}</h4>
                    <p className="customer-role">{testimonial.role} • {testimonial.location}</p>
                  </div>
                </div>
                <div className="event-info">
                  <span className="event-type">{testimonial.eventType}</span>
                  <span className="event-date">{testimonial.eventDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonials-stats" data-aos="fade-up" data-aos-delay="450">
          <div className="stat-item">
            <div className="stat-number">4.9/5</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">99%</div>
            <div className="stat-label">Would Recommend</div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Testimonials;
