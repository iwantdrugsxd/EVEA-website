import React from 'react';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import './BlogPage.css';

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Tips for Planning Your Dream Wedding",
      excerpt: "Planning a wedding can be overwhelming, but with the right approach and timeline, you can create the perfect day without the stress.",
      author: "Priya Sharma",
      date: "December 15, 2023",
      category: "Wedding Planning",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      featured: true,
      readTime: "8 min read"
    },
    {
      id: 2,
      title: "Corporate Event Trends for 2024",
      excerpt: "Discover the latest trends shaping corporate events this year, from hybrid experiences to sustainable practices.",
      author: "Rajesh Kumar",
      date: "December 12, 2023",
      category: "Corporate Events",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      featured: false,
      readTime: "6 min read"
    },
    {
      id: 3,
      title: "How to Choose the Perfect Caterer for Your Event",
      excerpt: "Food is often the highlight of any event. Learn how to select a caterer that will make your celebration memorable.",
      author: "Anita Patel",
      date: "December 10, 2023",
      category: "Catering",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      featured: false,
      readTime: "5 min read"
    }
  ];

  const categories = [
    "All Posts", "Wedding Planning", "Corporate Events", "Catering", 
    "Photography", "Decoration", "Vendor Spotlights"
  ];

  return (
    <div className="blog-page">
      <div className="blog-hero">
        <div className="container">
          <div className="hero-content" data-aos="fade-up">
            <h1 className="hero-title">Event Planning Blog</h1>
            <p className="hero-subtitle">
              Expert tips, inspiring stories, and insider insights to help you 
              plan unforgettable events
            </p>
          </div>
        </div>
      </div>

      <div className="blog-content">
        <div className="container">
          <div className="blog-layout">
            <aside className="blog-sidebar" data-aos="fade-right">
              <div className="sidebar-section">
                <h3 className="sidebar-title">Categories</h3>
                <div className="category-list">
                  {categories.map((category, index) => (
                    <button key={index} className="category-link">
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sidebar-section">
                <h3 className="sidebar-title">Popular Tags</h3>
                <div className="tag-cloud">
                  <span className="tag">Wedding</span>
                  <span className="tag">Photography</span>
                  <span className="tag">Catering</span>
                  <span className="tag">Decoration</span>
                  <span className="tag">Planning Tips</span>
                  <span className="tag">Vendors</span>
                  <span className="tag">Budget</span>
                  <span className="tag">Trends</span>
                </div>
              </div>

              <div className="sidebar-section">
                <h3 className="sidebar-title">Newsletter</h3>
                <p className="newsletter-text">
                  Get weekly event planning tips and vendor spotlights
                </p>
                <div className="newsletter-form">
                  <input type="email" placeholder="Your email" />
                  <button>Subscribe</button>
                </div>
              </div>
            </aside>

            <main className="blog-main" data-aos="fade-left">
              <div className="blog-posts">
                {blogPosts.map((post, index) => (
                  <article 
                    key={post.id} 
                    className={`blog-post-card ${post.featured ? 'featured' : ''}`}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="post-image">
                      <img src={post.image} alt={post.title} />
                      {post.featured && (
                        <div className="featured-badge">Featured</div>
                      )}
                    </div>

                    <div className="post-content">
                      <div className="post-meta">
                        <span className="post-category">
                          <Tag size={14} />
                          {post.category}
                        </span>
                        <span className="post-read-time">{post.readTime}</span>
                      </div>

                      <h2 className="post-title">{post.title}</h2>
                      <p className="post-excerpt">{post.excerpt}</p>

                      <div className="post-footer">
                        <div className="post-author-date">
                          <div className="post-author">
                            <User size={16} />
                            <span>{post.author}</span>
                          </div>
                          <div className="post-date">
                            <Calendar size={16} />
                            <span>{post.date}</span>
                          </div>
                        </div>
                        
                        <button className="read-more-btn">
                          Read More
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="pagination">
                <button className="pagination-btn">Previous</button>
                <div className="pagination-numbers">
                  <button className="pagination-number active">1</button>
                  <button className="pagination-number">2</button>
                  <button className="pagination-number">3</button>
                </div>
                <button className="pagination-btn">Next</button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;