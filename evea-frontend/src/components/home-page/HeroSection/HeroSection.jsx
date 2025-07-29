// src/components/home-page/HeroSection/HeroSection.jsx
import React from 'react';
import { Search, Users, Calendar, Star, Shield, ArrowRight, ShoppingBag, Sparkles} from 'lucide-react';
import './HeroSection.css';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate(); 
    
    const handleStartPlanning = () => {
        // Clear any existing event planning data to start fresh
        localStorage.removeItem('evea-event-planning-data');
        
        // Navigate to the event planning flow
        navigate('/plan-event');
    };

    const handleGoToShop = () => {
        // Navigate to the ecommerce shopping page
        navigate('/shop');
    };

    return (
        <section className="hero-section">
            <div className="hero-background">
                <div className="hero-gradient"></div>
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
            </div>

            <div className="container">
                <div className="hero-content">
                    <div className="hero-text">
                        <div className="hero-badge" data-aos="fade-up">
                            <Users size={16} />
                            <span>50+ Vendors in Your Area</span>
                        </div>
                        
                        <h1 className="hero-title" data-aos="fade-up" data-aos-delay="100">
                            Plan Your Perfect
                            <span className="title-highlight"> Event Today</span>
                        </h1>
                        
                        <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="200">
                            Join thousands of satisfied customers who've created unforgettable moments with Evea. 
                            From intimate gatherings to grand celebrations, we make event planning effortless and affordable.
                        </p>

                        <div className="hero-features" data-aos="fade-up" data-aos-delay="300">
                            <div className="feature-item">
                                <Shield size={16} />
                                <span>Connect with 1000+ verified vendors</span>
                            </div>
                            <div className="feature-item">
                                <Calendar size={16} />
                                <span>Plan your event in under 30 minutes</span>
                            </div>
                            <div className="feature-item">
                                <Star size={16} />
                                <span>Save up to 40% on vendor services</span>
                            </div>
                        </div>

                        <div className="hero-buttons" data-aos="fade-up" data-aos-delay="500">
                            <button 
                                onClick={handleStartPlanning}
                                className="start-planning-btn"
                            >
                                <Sparkles className="w-5 h-5" />
                                Start Planning
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={handleGoToShop}
                                className="btn-secondary-large"
                            >
                                <ShoppingBag size={18} />
                                Go to Shop
                            </button>
                        </div>

                        <div className="hero-trust" data-aos="fade-up" data-aos-delay="600">
                            <div className="trust-badges">
                                <span>✅ Free to get started</span>
                                <span>✅ No hidden fees</span>
                                <span>✅ Cancel anytime</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-visual" data-aos="fade-left" data-aos-delay="300">
                        <div className="hero-image-container">
                            <img 
                                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Beautiful event planning" 
                                className="hero-main-image"
                            />
                            
                            {/* Floating Cards */}
                            <div className="floating-card card-1" data-aos="fade-up" data-aos-delay="800">
                                <div className="card-icon">
                                    <Users size={20} />
                                </div>
                                <div className="card-content">
                                    <div className="card-title">Verified Vendors</div>
                                    <div className="card-subtitle">Perfect Event</div>
                                </div>
                            </div>

                            <div className="floating-card card-2" data-aos="fade-up" data-aos-delay="1000">
                                <div className="card-icon">
                                    <Star size={20} />
                                </div>
                                <div className="card-content">
                                    <div className="card-title">4.9★ Rating</div>
                                    <div className="card-subtitle">Happy Customers</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Stats Section with Proper Spacing */}
                <div className="hero-stats-wrapper" data-aos="fade-up" data-aos-delay="700">
                    <div className="hero-stats">
                        <div className="stat-item">
                            <div className="stat-icon">
                                <Users size={24} />
                            </div>
                            <div className="stat-content">
                                <div className="stat-value">10,000+</div>
                                <div className="stat-label">Happy Customers</div>
                            </div>
                        </div>
                        
                        <div className="stat-item">
                            <div className="stat-icon">
                                <Star size={24} />
                            </div>
                            <div className="stat-content">
                                <div className="stat-value">5,000+</div>
                                <div className="stat-label">Events Completed</div>
                            </div>
                        </div>
                        
                        <div className="stat-item">
                            <div className="stat-icon">
                                <Calendar size={24} />
                            </div>
                            <div className="stat-content">
                                <div className="stat-value">1,000+</div>
                                <div className="stat-label">Verified Vendors</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;