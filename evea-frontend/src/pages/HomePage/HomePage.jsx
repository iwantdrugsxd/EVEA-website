import React from 'react';
import HeroSection from '../../components/home-page/HeroSection/HeroSection';
import FeaturesSection from '../../components/home-page/FeaturesSection/FeaturesSection';
import HowItWorks from '../../components/home-page/HowItWorks/HowItWorks';
import ServicesOverview from '../../components/home-page/ServicesOverview/ServicesOverview';
import FeaturedVendors from '../../components/home-page/FeaturedVendors/FeaturedVendors';
import Testimonials from '../../components/home-page/Testimonials/Testimonials';
import CTASection from '../../components/home-page/CTASection/CTASection';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <ServicesOverview />
      <FeaturedVendors />
      <Testimonials />
      <CTASection />
    </div>
  );
};

export default HomePage;