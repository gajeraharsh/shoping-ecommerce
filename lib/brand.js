// Brand constants and configuration
export const BRAND = {
  name: 'Modave',
  tagline: 'Premium Fashion',
  description: 'Curating exceptional fashion experiences for the modern individual. Every piece embodies elegance, uncompromising quality, and timeless sophistication.',
  
  // Contact information
  contact: {
    email: 'hello@modave.com',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    address: {
      line1: 'Fashion District, Mumbai',
      line2: 'Maharashtra 400001, India',
      full: 'Fashion District, Mumbai\nMaharashtra 400001, India'
    }
  },
  
  // Social media handles
  social: {
    instagram: '@modave_fashion',
    facebook: 'ModaveFashion',
    twitter: '@modave_fashion',
    youtube: 'ModaveFashionOfficial'
  },
  
  // Brand colors
  colors: {
    primary: {
      light: '#ffffff',
      dark: '#000000'
    },
    accent: {
      gold: '#000000',
      silver: '#ffffff',
      rose: '#ffffff'
    }
  },
  
  // Features and USPs
  features: {
    shipping: {
      free: '₹999',
      express: '₹99',
      sameDay: 'Select cities'
    },
    returns: {
      days: 30,
      policy: 'No questions asked'
    },
    quality: {
      certification: 'Premium Quality Certified',
      guarantee: '100% Quality Guarantee'
    }
  },
  
  // Trust indicators
  trust: {
    customers: '100K+',
    rating: '4.8',
    reviews: '50K+',
    cities: '500+'
  }
};

// Helper functions for brand consistency
export const getBrandColors = (theme = 'light') => {
  return {
    primary: theme === 'light' ? BRAND.colors.primary.dark : BRAND.colors.primary.light,
    secondary: theme === 'light' ? BRAND.colors.primary.light : BRAND.colors.primary.dark,
    accent: '#000000'
  };
};

export const getContactInfo = () => {
  return BRAND.contact;
};

export const getSocialLinks = () => {
  return {
    instagram: `https://instagram.com/${BRAND.social.instagram.replace('@', '')}`,
    facebook: `https://facebook.com/${BRAND.social.facebook}`,
    twitter: `https://twitter.com/${BRAND.social.twitter.replace('@', '')}`,
    youtube: `https://youtube.com/@${BRAND.social.youtube}`
  };
};

export const getTrustIndicators = () => {
  return BRAND.trust;
};

export const getFeatures = () => {
  return BRAND.features;
};
