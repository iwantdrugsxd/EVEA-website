// src/data/vendorData.js
export const generateVendorData = () => {
  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'];
  const experiences = ['2+ years', '5+ years', '8+ years', '10+ years', '15+ years'];
  
  const vendorsByCategory = {
    photography: [
      {
        names: ['Pixel Perfect Photography', 'Candid Moments Studio', 'Royal Frame Photography', 'Artisan Lens', 'Dream Shot Photography', 'Visual Stories', 'Capture Magic Studios', 'Elite Photography', 'Golden Hour Photos', 'Timeless Memories'],
        images: [
          'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ],
        packageDeals: [
          { name: 'Complete Wedding Package', description: 'Full day coverage with edited photos and highlight reel', basePrice: 45000 },
          { name: 'Premium Photo Session', description: 'Professional photoshoot with premium editing', basePrice: 35000 },
          { name: 'Event Photography Bundle', description: 'Complete event coverage with quick delivery', basePrice: 28000 }
        ],
        services: [
          { name: 'Wedding Photography', description: '8-hour coverage with 500+ edited photos', basePrice: 25000 },
          { name: 'Pre-wedding Shoot', description: '4-hour session with 100+ edited photos', basePrice: 15000 },
          { name: 'Candid Photography', description: 'Unposed, natural moment captures', basePrice: 20000 },
          { name: 'Drone Photography', description: 'Aerial shots and videography', basePrice: 10000 },
          { name: 'Photo Album', description: 'Premium leather-bound photo album', basePrice: 8000 },
          { name: 'Engagement Shoot', description: 'Romantic couple photography session', basePrice: 12000 },
          { name: 'Family Portraits', description: 'Professional family photography', basePrice: 8000 },
          { name: 'Maternity Shoot', description: 'Beautiful pregnancy photography', basePrice: 10000 }
        ],
        category: 'photography'
      }
    ],
    catering: [
      {
        names: ['Royal Feast Catering', 'Spice Garden Caterers', 'Gourmet Delights', 'Taste of India', 'Premium Catering Co', 'Flavors United', 'Culinary Masters', 'Feast & Feast', 'Divine Delicacies', 'Savory Sensations'],
        images: [
          'https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ],
        packageDeals: [
          { name: 'Grand Wedding Menu', description: 'Multi-cuisine buffet for 200 guests with live counters', basePrice: 120000 },
          { name: 'Corporate Event Package', description: 'Professional catering for business events', basePrice: 85000 },
          { name: 'Birthday Party Special', description: 'Fun menu perfect for birthday celebrations', basePrice: 45000 }
        ],
        services: [
          { name: 'Wedding Buffet', description: 'Multi-cuisine buffet per person', basePrice: 600 },
          { name: 'Live Cooking Stations', description: 'Chef-prepared live counters', basePrice: 400 },
          { name: 'Welcome Drinks', description: 'Mocktails and beverages', basePrice: 150 },
          { name: 'Dessert Counter', description: 'Assorted sweets and desserts', basePrice: 200 },
          { name: 'Service Staff', description: 'Professional waiters and helpers', basePrice: 300 },
          { name: 'Corporate Lunch', description: 'Executive lunch catering', basePrice: 350 },
          { name: 'High Tea Service', description: 'Elegant tea time catering', basePrice: 250 },
          { name: 'BBQ Counter', description: 'Live barbecue and grills', basePrice: 500 }
        ],
        category: 'catering'
      }
    ],
    decoration: [
      {
        names: ['Elegant Decorations', 'Floral Fantasy', 'Theme Creators', 'Decor Dreams', 'Artistic Arrangements', 'Celebration Styles', 'Magical Moments Decor', 'Designer Touch', 'Creative Decorations', 'Bloom & Beauty'],
        images: [
          'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1478146896981-b80fe463b330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ],
        packageDeals: [
          { name: 'Royal Wedding Decor', description: 'Complete venue transformation with floral arrangements', basePrice: 85000 },
          { name: 'Birthday Theme Package', description: 'Complete themed decoration setup', basePrice: 35000 },
          { name: 'Corporate Event Styling', description: 'Professional corporate event decoration', basePrice: 55000 }
        ],
        services: [
          { name: 'Stage Decoration', description: 'Grand mandap with floral setup', basePrice: 35000 },
          { name: 'Hall Decoration', description: 'Ceiling and wall decorations', basePrice: 25000 },
          { name: 'Entrance Decor', description: 'Welcome gate with flowers', basePrice: 15000 },
          { name: 'Table Centerpieces', description: 'Elegant table arrangements', basePrice: 8000 },
          { name: 'Lighting Setup', description: 'Ambient and decorative lighting', basePrice: 12000 },
          { name: 'Balloon Decoration', description: 'Creative balloon arrangements', basePrice: 6000 },
          { name: 'Backdrop Design', description: 'Custom photo backdrop', basePrice: 10000 },
          { name: 'Car Decoration', description: 'Wedding car decoration', basePrice: 5000 }
        ],
        category: 'decoration'
      }
    ],
    entertainment: [
      {
        names: ['Beat Drop Entertainment', 'Rhythm Masters', 'Party Vibes', 'Musical Moments', 'Sound & Soul', 'Entertainment Express', 'Live Wire Productions', 'Melody Makers', 'Party Planet', 'Groove Galaxy'],
        images: [
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ],
        packageDeals: [
          { name: 'Ultimate Party Package', description: 'DJ + Live band + Professional sound system for 8 hours', basePrice: 55000 },
          { name: 'Wedding Entertainment', description: 'Complete entertainment for wedding celebration', basePrice: 45000 },
          { name: 'Corporate Event Package', description: 'Professional entertainment for corporate events', basePrice: 35000 }
        ],
        services: [
          { name: 'Professional DJ', description: '8-hour DJ service with playlist', basePrice: 25000 },
          { name: 'Live Band', description: '4-piece band for 4 hours', basePrice: 30000 },
          { name: 'Sound System', description: 'Professional audio equipment', basePrice: 15000 },
          { name: 'Lighting Effects', description: 'Dynamic stage lighting', basePrice: 12000 },
          { name: 'MC Services', description: 'Professional master of ceremonies', basePrice: 8000 },
          { name: 'Karaoke Setup', description: 'Interactive karaoke system', basePrice: 10000 },
          { name: 'Dance Performers', description: 'Professional dance troupe', basePrice: 20000 },
          { name: 'Magic Show', description: 'Professional magician performance', basePrice: 15000 }
        ],
        category: 'entertainment'
      }
    ],
    venues: [
      {
        names: ['Grand Palace Venues', 'Royal Banquets', 'Elite Event Spaces', 'Majestic Halls', 'Premium Venues', 'Garden Paradise', 'Heritage Halls', 'Modern Event Centers', 'Luxury Locations', 'Dream Destinations'],
        images: [
          'https://images.unsplash.com/photo-1519167758481-83f29c55eaaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1582192730841-2a93d5d9d95b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ],
        packageDeals: [
          { name: 'Premium Hall Booking', description: 'Fully decorated hall with basic amenities for 6 hours', basePrice: 75000 },
          { name: 'Garden Wedding Package', description: 'Outdoor garden venue with complete setup', basePrice: 95000 },
          { name: 'Corporate Conference Hall', description: 'Professional conference venue with AV equipment', basePrice: 45000 }
        ],
        services: [
          { name: 'Main Hall Rental', description: 'Capacity for 300 guests', basePrice: 50000 },
          { name: 'Garden Area', description: 'Outdoor space for ceremonies', basePrice: 25000 },
          { name: 'Bridal Suite', description: 'Private room for preparations', basePrice: 8000 },
          { name: 'Parking Space', description: 'Valet parking for 100 cars', basePrice: 5000 },
          { name: 'Basic Decoration', description: 'Simple floral arrangements', basePrice: 15000 },
          { name: 'Air Conditioning', description: 'Climate controlled environment', basePrice: 10000 },
          { name: 'AV Equipment', description: 'Sound and projection systems', basePrice: 12000 },
          { name: 'Security Service', description: 'Professional security personnel', basePrice: 8000 }
        ],
        category: 'venues'
      }
    ],
    transportation: [
      {
        names: ['Luxury Ride Services', 'Royal Transport', 'Elite Car Rentals', 'Premium Wheels', 'Vintage Car Hire', 'Wedding Rides', 'Comfort Transport', 'Luxury Fleet', 'Dream Cars', 'Elegant Journeys'],
        images: [
          'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ],
        packageDeals: [
          { name: 'Wedding Transport Package', description: 'Luxury car for couple + bus for 50 guests', basePrice: 25000 },
          { name: 'Corporate Transport', description: 'Professional transportation for executives', basePrice: 18000 },
          { name: 'Airport Transfer Package', description: 'Convenient airport pickup and drop services', basePrice: 12000 }
        ],
        services: [
          { name: 'Luxury Wedding Car', description: 'Decorated car for couple', basePrice: 12000 },
          { name: 'Guest Bus Service', description: 'AC bus for 50 passengers', basePrice: 15000 },
          { name: 'Airport Pickup', description: 'Luxury car airport transfers', basePrice: 5000 },
          { name: 'Vintage Car Rental', description: 'Classic car for photos', basePrice: 8000 },
          { name: 'Driver Service', description: 'Professional chauffeur', basePrice: 3000 },
          { name: 'Tempo Traveller', description: 'Group transport for 12-15 people', basePrice: 8000 },
          { name: 'Luxury SUV', description: 'Premium SUV for special occasions', basePrice: 10000 },
          { name: 'Bike Rental', description: 'Royal Enfield for groom entry', basePrice: 3000 }
        ],
        category: 'transportation'
      }
    ]
  };

  const features = [
    ['instant-booking', 'verified-vendor'],
    ['free-cancellation', '24-7-support'],
    ['verified-vendor', 'instant-booking', '24-7-support'],
    ['free-cancellation', 'verified-vendor'],
    ['instant-booking', 'free-cancellation'],
    ['24-7-support', 'verified-vendor'],
    ['instant-booking'],
    ['verified-vendor'],
    ['free-cancellation'],
    ['24-7-support']
  ];

  let vendorId = 1;
  const allVendors = [];

  Object.entries(vendorsByCategory).forEach(([category, categoryData]) => {
    const data = categoryData[0];
    
    for (let i = 0; i < data.names.length; i++) {
      const baseRating = 3.5 + Math.random() * 1.5; // 3.5 to 5.0
      const reviewCount = Math.floor(Math.random() * 300) + 20;
      const location = locations[Math.floor(Math.random() * locations.length)];
      const experience = experiences[Math.floor(Math.random() * experiences.length)];
      const isVerified = Math.random() > 0.3; // 70% verified
      const isTopRated = baseRating >= 4.5 && Math.random() > 0.6; // Top rated if high rating
      const packageDeal = data.packageDeals[Math.floor(Math.random() * data.packageDeals.length)];
      const vendorFeatures = features[Math.floor(Math.random() * features.length)];
      
      // Generate random services (3-6 services per vendor)
      const numServices = Math.floor(Math.random() * 4) + 3;
      const shuffledServices = [...data.services].sort(() => 0.5 - Math.random()).slice(0, numServices);
      const services = shuffledServices.map((service, idx) => ({
        id: idx + 1,
        name: service.name,
        description: service.description,
        price: Math.floor(service.basePrice * (0.8 + Math.random() * 0.4)) // ±20% price variation
      }));

      // Generate primary services (2-3 main services)
      const primaryServices = services.slice(0, Math.min(3, services.length)).map(service => ({
        name: service.name,
        category: category
      }));

      const vendor = {
        id: vendorId++,
        name: data.names[i],
        image: data.images[i % data.images.length],
        rating: Math.round(baseRating * 10) / 10,
        reviewCount,
        location,
        experience,
        isVerified,
        isTopRated,
        isFavorite: Math.random() > 0.8, // 20% favorited
        primaryServices,
        packageDeal: {
          name: packageDeal.name,
          description: packageDeal.description,
          price: Math.floor(packageDeal.basePrice * (0.9 + Math.random() * 0.2))
        },
        services,
        startingPrice: Math.min(...services.map(s => s.price)),
        features: vendorFeatures
      };

      allVendors.push(vendor);
    }
  });

  // Sort vendors by rating (highest first) and then by review count
  return allVendors.sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return b.reviewCount - a.reviewCount;
  });
};

export default generateVendorData;