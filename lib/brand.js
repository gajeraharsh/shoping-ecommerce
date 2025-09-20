// Brand constants and configuration
export const BRAND = {
  name: 'Faxio',
  tagline: 'Premium Fashion',
  description: 'Curating exceptional fashion experiences for the modern individual. Every piece embodies elegance, uncompromising quality, and timeless sophistication.',

  // Contact information
  contact: {
    email: 'storemanager.faxio@gmail.com',
    phone: '+91 7801959924',
    whatsapp: '+91 7801959924',
    address: {
      line1: 'A/10 Harikrishan Society, Thakkarnagar',
      line2: 'Ahmedabad, Gujarat, India',
      full: 'A/10 Harikrishan Society, Thakkarnagar\nAhmedabad, Gujarat, India'
    }
  },

  // Social media handles
  social: {
    instagram: '@faxio_india',
    // Accepts either a page handle (e.g., 'Faxio') or a full URL
    facebook: 'https://www.facebook.com/share/17WyC3k4aB/',
    youtube: 'FaxioOfficial'
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
    facebook: BRAND.social.facebook.startsWith('http')
      ? BRAND.social.facebook
      : `https://facebook.com/${BRAND.social.facebook}`,
    youtube: `https://youtube.com/@${BRAND.social.youtube}`,
    whatsapp: `https://wa.me/91${BRAND.contact.whatsapp.replace(/[^0-9]/g, '').replace(/^91/, '')}`
  };
};

export const getTrustIndicators = () => {
  return BRAND.trust;
};

export const getFeatures = () => {
  return BRAND.features;
};
