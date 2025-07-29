// src/pages/FeaturesPage/Features.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, Star, Shield, TrendingUp, CheckCircle, ArrowRight, 
  Sparkles, Zap, Target, Globe, BarChart3, Clock, Award, Search,
  PieChart, MapPin, MessageSquare, Smartphone, Laptop, Database,
  Lock, PlayCircle, ChevronRight, Eye, Layers, Settings
} from 'lucide-react';
import './Features.css';

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);

  // Enhanced hero features with professional icons
  const heroFeatures = [
    {
      icon: <Shield size={24} />,
      title: "Enterprise Security",
      text: "Bank-level encryption & data protection"
    },
    {
      icon: <Zap size={24} />,
      title: "Lightning Fast",
      text: "Events planned in under 30 minutes"
    },
    {
      icon: <Target size={24} />,
      title: "AI-Powered Matching",
      text: "Smart vendor recommendations"
    },
    {
      icon: <Globe size={24} />,
      title: "Global Reach",
      text: "25+ cities across India"
    }
  ];

  // Enhanced main features with rich visual content
  const mainFeatures = [
    {
      title: "Smart Event Planning",
      description: "AI-powered planning assistant that learns from your preferences and suggests optimal event configurations",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: <BarChart3 size={32} />,
      features: [
        "Intelligent timeline generation",
        "Budget optimization algorithms", 
        "Automated vendor matching",
        "Real-time collaboration tools"
      ],
      color: "purple",
      stats: { value: "40%", label: "Time Saved" }
    },
    {
      title: "Vendor Marketplace",
      description: "Curated network of 10,000+ verified vendors with transparent pricing and instant booking capabilities",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: <Users size={32} />,
      features: [
        "Verified vendor profiles",
        "Real-time availability",
        "Transparent pricing",
        "Instant booking system"
      ],
      color: "blue",
      stats: { value: "10K+", label: "Vendors" }
    },
    {
      title: "Budget Management",
      description: "Comprehensive financial tracking with smart spending insights and cost optimization recommendations",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: <PieChart size={32} />,
      features: [
        "Real-time expense tracking",
        "Budget allocation insights",
        "Cost prediction models",
        "Payment gateway integration"
      ],
      color: "green",
      stats: { value: "30%", label: "Cost Reduction" }
    },
    {
      title: "Guest Experience",
      description: "End-to-end guest management with personalized experiences and seamless communication tools",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: <MessageSquare size={32} />,
      features: [
        "Digital invitations",
        "RSVP tracking",
        "Guest communication hub",
        "Personalized experiences"
      ],
      color: "pink",
      stats: { value: "99%", label: "Satisfaction" }
    },
    {
      title: "Analytics & Insights",
      description: "Powerful analytics dashboard providing actionable insights for better event outcomes and ROI",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: <TrendingUp size={32} />,
      features: [
        "Performance analytics",
        "Attendee behavior insights",
        "ROI measurement",
        "Predictive modeling"
      ],
      color: "orange",
      stats: { value: "5x", label: "ROI Increase" }
    },
    {
      title: "Mobile-First Platform",
      description: "Native mobile experience with offline capabilities and cross-platform synchronization",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: <Smartphone size={32} />,
      features: [
        "Native mobile apps",
        "Offline functionality", 
        "Cross-device sync",
        "Push notifications"
      ],
      color: "red",
      stats: { value: "24/7", label: "Access" }
    }
  ];

  // Interactive feature demonstrations
  const interactiveFeatures = [
    {
      id: 1,
      title: "Smart Vendor Matching",
      description: "AI-powered algorithm finds perfect vendors based on your requirements",
      icon: <Search size={24} />,
      demo: "vendor-matching",
      highlights: [
        "Machine learning recommendations",
        "Real-time availability check", 
        "Price comparison analysis",
        "Quality score evaluation"
      ]
    },
    {
      id: 2,
      title: "Real-time Collaboration", 
      description: "Team-based planning with live updates and instant communication",
      icon: <Users size={24} />,
      demo: "collaboration",
      highlights: [
        "Multi-user editing",
        "Comment and feedback system",
        "Task assignment",
        "Version control"
      ]
    },
    {
      id: 3,
      title: "Budget Optimization",
      description: "Smart spending insights with automated cost-saving recommendations",
      icon: <PieChart size={24} />,
      demo: "budget",
      highlights: [
        "Dynamic budget allocation",
        "Cost prediction models",
        "Savings opportunities",
        "Financial reporting"
      ]
    }
  ];

  // Enhanced statistics
  const stats = [
    {
      icon: <Calendar size={32} />,
      number: "50,000+",
      label: "Events Planned",
      description: "Successfully managed events worldwide",
      color: "blue"
    },
    {
      icon: <Users size={32} />,
      number: "10,000+", 
      label: "Verified Vendors",
      description: "Curated network of professionals",
      color: "green"
    },
    {
      icon: <Star size={32} />,
      number: "98%",
      label: "Customer Satisfaction",
      description: "Based on post-event surveys",
      color: "yellow"
    },
    {
      icon: <Globe size={32} />,
      number: "25+",
      label: "Cities Covered",
      description: "Expanding across India",
      color: "purple"
    },
    {
      icon: <Clock size={32} />,
      number: "30min",
      label: "Average Planning Time",
      description: "From concept to execution",
      color: "orange"
    },
    {
      icon: <Shield size={32} />,
      number: "99.9%",
      label: "Uptime Guarantee",
      description: "Enterprise-grade reliability",
      color: "red"
    }
  ];

  // Technology stack features
  const techFeatures = [
    {
      icon: <Database size={24} />,
      title: "Cloud Infrastructure",
      description: "Scalable, secure cloud architecture"
    },
    {
      icon: <Lock size={24} />,
      title: "Data Security",
      description: "GDPR compliant with end-to-end encryption"
    },
    {
      icon: <Smartphone size={24} />,
      title: "Multi-Platform",
      description: "Web, iOS, and Android applications"
    },
    {
      icon: <Layers size={24} />,
      title: "API Integration",
      description: "Connect with your existing tools"
    }
  ];

  // Testimonials with professional content
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Event Director",
      company: "Fortune 500 Company",
      quote: "EVEA transformed our corporate event planning. What used to take weeks now happens in hours.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612e673?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      stats: "200+ events managed"
    },
    {
      name: "Rajesh Kumar",
      role: "Wedding Planner",
      company: "Royal Celebrations",
      quote: "The vendor network and budget management features have increased our efficiency by 300%.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      stats: "₹10Cr+ events planned"
    },
    {
      name: "Ananya Patel",
      role: "Marketing Manager",
      company: "Tech Startup",
      quote: "EVEA's analytics helped us achieve 150% higher engagement at our product launches.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      stats: "500% ROI improvement"
    }
  ];

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target.getAttribute('data-animate');
            setIsVisible(prev => ({ ...prev, [target]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Auto-rotate interactive features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % interactiveFeatures.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [interactiveFeatures.length]);

  const renderDemo = (demo) => {
    switch (demo) {
      case 'vendor-matching':
        return (
          <div className="demo-vendor-matching">
            <div className="search-interface">
              <div className="search-bar">
                <Search size={16} />
                <span>Wedding photographer in Mumbai</span>
              </div>
              <div className="matching-results">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`result-item ${i === 1 ? 'recommended' : ''}`}>
                    <div className="vendor-avatar"></div>
                    <div className="vendor-info">
                      <div className="vendor-name">Professional Studio {i}</div>
                      <div className="match-score">{100 - i * 5}% match</div>
                    </div>
                    <div className="vendor-price">₹{25 + i * 5}k</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'collaboration':
        return (
          <div className="demo-collaboration">
            <div className="collab-interface">
              <div className="team-members">
                {['John', 'Sarah', 'Mike'].map((name, i) => (
                  <div key={name} className="member-avatar" style={{ left: `${i * 20}px` }}>
                    {name[0]}
                  </div>
                ))}
              </div>
              <div className="live-activity">
                <div className="activity-item">
                  <div className="activity-dot"></div>
                  <span>Sarah updated budget allocation</span>
                </div>
                <div className="activity-item">
                  <div className="activity-dot"></div>
                  <span>Mike added new vendor options</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'budget':
        return (
          <div className="demo-budget">
            <div className="budget-chart">
              <div className="budget-categories">
                {[
                  { name: 'Venue', percentage: 40, color: '#8B2635' },
                  { name: 'Catering', percentage: 30, color: '#6A1B9A' },
                  { name: 'Decoration', percentage: 20, color: '#E91E63' },
                  { name: 'Others', percentage: 10, color: '#FF9800' }
                ].map(category => (
                  <div key={category.name} className="budget-category">
                    <div 
                      className="category-bar"
                      style={{ 
                        width: `${category.percentage}%`,
                        backgroundColor: category.color
                      }}
                    ></div>
                    <div className="category-label">
                      {category.name}: {category.percentage}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="budget-insights">
                <div className="insight-item">
                  <TrendingUp size={16} />
                  <span>Save 15% by booking venue early</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="features-page">
      {/* Enhanced Hero Section */}
      <section className="features-hero" id="hero" data-animate="hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
            <div className="shape shape-5"></div>
          </div>
          <div className="hero-particles"></div>
        </div>

        <div className="container">
          <div className={`features-hero-content ${isVisible.hero ? 'animate-in' : ''}`}>
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Advanced Features</span>
              <div className="badge-glow"></div>
            </div>
            
            <h1 className="hero-title">
              Revolutionary Event Planning
              <span className="title-highlight"> Platform</span>
            </h1>
            
            <p className="hero-subtitle">
              Experience the next generation of event management with AI-powered insights, 
              real-time collaboration, and enterprise-grade security that scales with your needs.
            </p>

            <div className="hero-features-grid">
              {heroFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className="hero-feature-item" 
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="feature-icon">
                    {feature.icon}
                    <div className="icon-glow"></div>
                  </div>
                  <div className="feature-text">
                    <h4>{feature.title}</h4>
                    <p>{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="hero-cta">
              <button className="cta-primary">
                <PlayCircle size={20} />
                Watch Product Demo
                <ArrowRight size={20} />
              </button>
              <button className="cta-secondary">
                <Zap size={20} />
                Start Free Trial
              </button>
            </div>

            <div className="hero-trust-indicators">
              <div className="trust-item">
                <Shield size={16} />
                <span>SOC 2 Certified</span>
              </div>
              <div className="trust-item">
                <Award size={16} />
                <span>Industry Leader</span>
              </div>
              <div className="trust-item">
                <Globe size={16} />
                <span>Global Scale</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Main Features */}
      <section className="main-features-section" id="main-features" data-animate="main-features">
        <div className="container">
          <div className={`section-header ${isVisible['main-features'] ? 'animate-in' : ''}`}>
            <div className="section-badge">
              <Target size={16} />
              <span>Core Capabilities</span>
            </div>
            <h2 className="section-title">Comprehensive Event Management Suite</h2>
            <p className="section-subtitle">
              From AI-powered planning to real-time analytics, discover the tools that make 
              event management effortless and results-driven.
            </p>
          </div>

          <div className="features-grid">
            {mainFeatures.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-card feature-${feature.color} ${isVisible['main-features'] ? 'animate-in' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="feature-image-container">
                  <img src={feature.image} alt={feature.title} />
                  <div className="feature-overlay">
                    <div className="feature-icon">
                      {feature.icon}
                    </div>
                    <div className="feature-stats">
                      <div className="stat-value">{feature.stats.value}</div>
                      <div className="stat-label">{feature.stats.label}</div>
                    </div>
                  </div>
                  <div className="image-effects">
                    <div className="gradient-overlay"></div>
                    <div className="animated-border"></div>
                  </div>
                </div>
                
                <div className="feature-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  
                  <div className="feature-highlights">
                    {feature.features.map((item, i) => (
                      <div key={i} className="highlight-item">
                        <CheckCircle size={14} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="feature-cta">
                    <span>Explore Feature</span>
                    <ArrowRight size={16} />
                    <div className="cta-glow"></div>
                  </button>
                </div>

                <div className={`feature-hover-effect ${hoveredCard === index ? 'active' : ''}`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Features Demo */}
      <section className="interactive-features-section" id="interactive" data-animate="interactive">
        <div className="container">
          <div className={`section-header ${isVisible.interactive ? 'animate-in' : ''}`}>
            <div className="section-badge">
              <Eye size={16} />
              <span>Live Demonstrations</span>
            </div>
            <h2 className="section-title">See Our Platform in Action</h2>
            <p className="section-subtitle">
              Interactive demos showcasing real-world scenarios and the power of our platform
            </p>
          </div>

          <div className="interactive-container">
            <div className="features-navigation">
              {interactiveFeatures.map((feature, index) => (
                <button
                  key={feature.id}
                  className={`feature-nav-item ${activeFeature === index ? 'active' : ''}`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="nav-icon">
                    {feature.icon}
                    <div className="icon-pulse"></div>
                  </div>
                  <div className="nav-content">
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                    <div className="nav-highlights">
                      {feature.highlights.slice(0, 2).map((highlight, i) => (
                        <div key={i} className="nav-highlight">
                          <ChevronRight size={12} />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="nav-indicator">
                    <div className="indicator-dot"></div>
                  </div>
                </button>
              ))}
            </div>

            <div className="features-demo">
              <div className="demo-container">
                <div className="demo-header">
                  <div className="demo-title">
                    <div className="demo-icon">{interactiveFeatures[activeFeature]?.icon}</div>
                    <span>{interactiveFeatures[activeFeature]?.title}</span>
                  </div>
                  <div className="demo-status">
                    <div className="status-indicator">
                      <div className="status-dot"></div>
                      <span>Live Demo</span>
                    </div>
                  </div>
                </div>
                
                <div className="demo-content">
                  {renderDemo(interactiveFeatures[activeFeature]?.demo)}
                </div>

                <div className="demo-progress">
                  {interactiveFeatures.map((_, index) => (
                    <div 
                      key={index} 
                      className={`progress-dot ${index === activeFeature ? 'active' : ''}`}
                      onClick={() => setActiveFeature(index)}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="stats-section" id="stats" data-animate="stats">
        <div className="stats-background">
          <div className="stats-grid-pattern"></div>
          <div className="stats-glow"></div>
        </div>
        <div className="container">
          <div className={`section-header ${isVisible.stats ? 'animate-in' : ''}`}>
            <div className="section-badge">
              <BarChart3 size={16} />
              <span>Performance Metrics</span>
            </div>
            <h2 className="section-title">Proven Results That Matter</h2>
            <p className="section-subtitle">
              Real numbers from real events, showcasing the measurable impact of our platform
            </p>
          </div>

          <div className={`stats-grid ${isVisible.stats ? 'animate-in' : ''}`}>
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`stat-card stat-${stat.color}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="stat-icon-container">
                  <div className="stat-icon">
                    {stat.icon}
                  </div>
                  <div className="stat-glow-effect"></div>
                </div>
                <div className="stat-content">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-description">{stat.description}</div>
                </div>
                <div className="stat-decoration"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="tech-section" id="tech" data-animate="tech">
        <div className="container">
          <div className={`section-header ${isVisible.tech ? 'animate-in' : ''}`}>
            <div className="section-badge">
              <Settings size={16} />
              <span>Technology</span>
            </div>
            <h2 className="section-title">Built for Scale & Security</h2>
            <p className="section-subtitle">
              Enterprise-grade infrastructure designed for reliability, performance, and growth
            </p>
          </div>

          <div className="tech-grid">
            {techFeatures.map((tech, index) => (
              <div 
                key={index} 
                className={`tech-card ${isVisible.tech ? 'animate-in' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="tech-icon">
                  {tech.icon}
                  <div className="tech-icon-bg"></div>
                </div>
                <h4 className="tech-title">{tech.title}</h4>
                <p className="tech-description">{tech.description}</p>
                <div className="tech-shine"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="testimonials-section" id="testimonials" data-animate="testimonials">
        <div className="container">
          <div className={`section-header ${isVisible.testimonials ? 'animate-in' : ''}`}>
            <div className="section-badge">
              <MessageSquare size={16} />
              <span>Customer Success</span>
            </div>
            <h2 className="section-title">Trusted by Industry Leaders</h2>
            <p className="section-subtitle">
              Hear from event professionals who've transformed their business with EVEA
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`testimonial-card ${isVisible.testimonials ? 'animate-in' : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    <img src={testimonial.image} alt={testimonial.name} />
                    <div className="avatar-ring"></div>
                  </div>
                  <div className="testimonial-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                    <span>{testimonial.company}</span>
                  </div>
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
                
                <blockquote className="testimonial-quote">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="testimonial-stats">
                  <Award size={14} />
                  <span>{testimonial.stats}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="cta-section" id="cta" data-animate="cta">
        <div className="cta-background">
          <div className="cta-gradient"></div>
          <div className="cta-pattern"></div>
          <div className="cta-glow-effects"></div>
        </div>
        
        <div className="container">
          <div className={`cta-content ${isVisible.cta ? 'animate-in' : ''}`}>
            <div className="cta-badge">
              <Zap size={16} />
              <span>Get Started Today</span>
            </div>
            
            <h2 className="cta-title">
              Ready to Transform Your
              <span className="cta-highlight"> Event Planning?</span>
            </h2>
            
            <p className="cta-subtitle">
              Join thousands of event professionals who've already revolutionized 
              their workflow with EVEA's powerful platform.
            </p>

            <div className="cta-buttons">
              <button className="cta-primary-btn">
                <Sparkles size={20} />
                Start Free Trial
                <ArrowRight size={20} />
              </button>
              <button className="cta-secondary-btn">
                <PlayCircle size={20} />
                Schedule Demo
              </button>
            </div>

            <div className="cta-features">
              <div className="cta-feature">
                <CheckCircle size={16} />
                <span>Free 14-day trial</span>
              </div>
              <div className="cta-feature">
                <CheckCircle size={16} />
                <span>No credit card required</span>
              </div>
              <div className="cta-feature">
                <CheckCircle size={16} />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;