import React from 'react';
import VendorHero from '../../components/vendor-page/VendorHero/VendorHero';
import VendorBenefits from '../../components/vendor-page/VendorBenefits/VendorBenefits';
import VendorCategories from '../../components/vendor-page/VendorCategories/VendorCategories';
import SuccessStories from '../../components/vendor-page/SuccessStories/SuccessStories';
import PricingStructure from '../../components/vendor-page/PricingStructure/PricingStructure';
import VendorCTA from '../../components/vendor-page/VendorCTA/VendorCTA';
import './VendorPage.css';

const VendorPage = () => {
  return (
    <div className="vendor-page">
      <VendorHero />
      <VendorBenefits />
      <VendorCategories />
      <SuccessStories />
      <PricingStructure />
      <VendorCTA />
    </div>
  );
};

export default VendorPage;