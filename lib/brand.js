// Brand constants and configuration
export const BRAND = {
  name: 'StyleSphere',
  tagline: 'Fashion Social & Shopping',
  description: 'Connect with fashion creators, discover trending styles, and shop directly from social posts. The ultimate fashion community platform.',

  // User roles for the social platform
  userRoles: {
    guest: 'guest',
    user: 'user',
    influencer: 'influencer',
    brand: 'brand',
    admin: 'admin'
  },
  
  // Contact information
  contact: {
    email: 'hello@stylesphere.com',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    address: {
      line1: 'Tech Hub, Bangalore',
      line2: 'Karnataka 560001, India',
      full: 'Tech Hub, Bangalore\nKarnataka 560001, India'
    }
  },
  
  // Social media handles
  social: {
    instagram: '@stylesphere_official',
    facebook: 'StyleSphereOfficial',
    twitter: '@stylesphere_app',
    youtube: 'StyleSphereOfficial'
  },
  
  // Brand colors
  colors: {
    primary: {
      light: '#ffffff',
      dark: '#000000'
    },
    accent: {
      gold: '#d4af37',
      silver: '#c0c0c0',
      rose: '#e8b4b8'
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
  
  // Platform stats
  stats: {
    creators: '10K+',
    users: '100K+',
    posts: '1M+',
    brands: '500+',
    rating: '4.9'
  }
};

// Helper functions for brand consistency
export const getBrandColors = (theme = 'light') => {
  return {
    primary: theme === 'light' ? BRAND.colors.primary.dark : BRAND.colors.primary.light,
    secondary: theme === 'light' ? BRAND.colors.primary.light : BRAND.colors.primary.dark,
    accent: BRAND.colors.accent.gold
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

export const getPlatformStats = () => {
  return BRAND.stats;
};

export const getUserRoles = () => {
  return BRAND.userRoles;
};

export const getFeatures = () => {
  return BRAND.features;
};
