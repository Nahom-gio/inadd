// Configuration utility for environment variables
// Provides centralized access to all configuration values with fallbacks

const config = {
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'https://api.inadpromotion.com',
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000,
  },

  // Analytics and Tracking
  analytics: {
    googleAnalytics: {
      measurementId: process.env.REACT_APP_GA_MEASUREMENT_ID || null,
      enabled: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    },
    facebook: {
      pixelId: process.env.REACT_APP_FACEBOOK_PIXEL_ID || null,
      enabled: process.env.REACT_APP_ENABLE_SOCIAL_TRACKING === 'true',
    },
    linkedin: {
      pixelId: process.env.REACT_APP_LINKEDIN_PIXEL_ID || null,
      enabled: process.env.REACT_APP_ENABLE_SOCIAL_TRACKING === 'true',
    },
    hotjar: {
      id: process.env.REACT_APP_HOTJAR_ID || null,
      enabled: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    },
    clarity: {
      id: process.env.REACT_APP_CLARITY_ID || null,
      enabled: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    },
  },

  // Social Media URLs
  social: {
    facebook:
      process.env.REACT_APP_FACEBOOK_URL ||
      'https://www.facebook.com/inadpromotion',
    twitter:
      process.env.REACT_APP_TWITTER_URL ||
      'https://www.twitter.com/inadpromotion',
    linkedin:
      process.env.REACT_APP_LINKEDIN_URL ||
      'https://www.linkedin.com/company/inadpromotion',
    instagram:
      process.env.REACT_APP_INSTAGRAM_URL ||
      'https://www.instagram.com/inadpromotion',
    youtube:
      process.env.REACT_APP_YOUTUBE_URL ||
      'https://www.youtube.com/channel/inadpromotion',
  },

  // Business Information
  business: {
    name: process.env.REACT_APP_COMPANY_NAME || 'INAD PROMOTION',
    email: process.env.REACT_APP_COMPANY_EMAIL || 'hello@inadpromotion.com',
    phone: process.env.REACT_APP_COMPANY_PHONE || '+1 (555) 123-4567',
    address:
      process.env.REACT_APP_COMPANY_ADDRESS ||
      '123 Business St, City, State 12345',
  },

  // Feature Flags
  features: {
    analytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    socialTracking: process.env.REACT_APP_ENABLE_SOCIAL_TRACKING === 'true',
    performanceMonitoring:
      process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING === 'true',
    errorTracking: process.env.REACT_APP_ENABLE_ERROR_TRACKING === 'true',
    mockApi: process.env.REACT_APP_ENABLE_MOCK_API === 'true',
    debugMode: process.env.REACT_APP_ENABLE_DEBUG_MODE === 'true',
    lazyLoading: process.env.REACT_APP_ENABLE_LAZY_LOADING === 'true',
    imageOptimization:
      process.env.REACT_APP_ENABLE_IMAGE_OPTIMIZATION === 'true',
    videoOptimization:
      process.env.REACT_APP_ENABLE_VIDEO_OPTIMIZATION === 'true',
  },

  // Development Settings
  development: {
    logLevel: process.env.REACT_APP_LOG_LEVEL || 'info',
    enableMockApi: process.env.REACT_APP_ENABLE_MOCK_API === 'true',
    enableDebugMode: process.env.REACT_APP_ENABLE_DEBUG_MODE === 'true',
  },

  // Security
  security: {
    csrfProtection: process.env.REACT_APP_ENABLE_CSRF_PROTECTION === 'true',
    rateLimiting: process.env.REACT_APP_ENABLE_RATE_LIMITING === 'true',
    spamDetection: process.env.REACT_APP_ENABLE_SPAM_DETECTION === 'true',
  },

  // Performance
  performance: {
    lazyLoading: process.env.REACT_APP_ENABLE_LAZY_LOADING === 'true',
    imageOptimization:
      process.env.REACT_APP_ENABLE_IMAGE_OPTIMIZATION === 'true',
    videoOptimization:
      process.env.REACT_APP_ENABLE_VIDEO_OPTIMIZATION === 'true',
  },

  // Environment
  env: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
  },

  // App Information
  app: {
    name: 'INAD PROMOTION',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    description: 'Experiential Marketing Agency Website',
  },
};

// Helper functions
export const isFeatureEnabled = featureName => {
  return config.features[featureName] === true;
};

export const isDevelopment = () => config.env.isDevelopment;
export const isProduction = () => config.env.isProduction;
export const isTest = () => config.env.isTest;

export const getApiUrl = (endpoint = '') => {
  return `${config.api.baseUrl}${endpoint}`;
};

export const getSocialUrl = platform => {
  return config.social[platform] || null;
};

export const getBusinessInfo = field => {
  return config.business[field] || null;
};

// Export the entire config object
export default config;
