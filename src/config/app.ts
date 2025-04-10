/**
 * Application Configuration
 * 
 * Central configuration for application-wide settings.
 * Values are loaded from environment variables with sensible defaults.
 */

// App metadata
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'My Application';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';
export const APP_ENVIRONMENT = import.meta.env.MODE || 'development';
export const IS_DEVELOPMENT = APP_ENVIRONMENT === 'development';
export const IS_PRODUCTION = APP_ENVIRONMENT === 'production';
export const IS_TEST = APP_ENVIRONMENT === 'test';

// Feature flags
export const FEATURES = {
  enableAuth: import.meta.env.VITE_ENABLE_AUTH !== 'false', // Default to true
  enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableDarkMode: import.meta.env.VITE_ENABLE_DARK_MODE !== 'false', // Default to true
  betaFeatures: import.meta.env.VITE_ENABLE_BETA_FEATURES === 'true',
};

// Application defaults
export const DEFAULTS = {
  language: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
  theme: import.meta.env.VITE_DEFAULT_THEME || 'dark',
  pageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || '10', 10),
  dateFormat: import.meta.env.VITE_DEFAULT_DATE_FORMAT || 'yyyy-MM-dd',
  timeFormat: import.meta.env.VITE_DEFAULT_TIME_FORMAT || 'HH:mm:ss',
};

// Timeouts
export const TIMEOUTS = {
  apiRequest: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10), // 30 seconds
  sessionExpiration: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '3600000', 10), // 1 hour
  tokenRefresh: parseInt(import.meta.env.VITE_TOKEN_REFRESH_INTERVAL || '300000', 10), // 5 minutes
};

// Resource URLs
export const URLS = {
  apiBase: import.meta.env.VITE_API_BASE_URL || '/api',
  authService: import.meta.env.VITE_AUTH_SERVICE_URL || '/auth',
  cdnBase: import.meta.env.VITE_CDN_BASE_URL || '',
  docsBase: import.meta.env.VITE_DOCS_BASE_URL || '/docs',
};

// Security settings
export const SECURITY = {
  csrfEnabled: import.meta.env.VITE_CSRF_ENABLED !== 'false', // Default to true
  passwordMinLength: parseInt(import.meta.env.VITE_PASSWORD_MIN_LENGTH || '8', 10),
  passwordRequiresLowercase: import.meta.env.VITE_PASSWORD_REQUIRES_LOWERCASE !== 'false', // Default to true
  passwordRequiresUppercase: import.meta.env.VITE_PASSWORD_REQUIRES_UPPERCASE !== 'false', // Default to true
  passwordRequiresNumbers: import.meta.env.VITE_PASSWORD_REQUIRES_NUMBERS !== 'false', // Default to true
  passwordRequiresSymbols: import.meta.env.VITE_PASSWORD_REQUIRES_SYMBOLS !== 'false', // Default to true
};

// Logging configuration
export const LOGGING = {
  level: import.meta.env.VITE_LOG_LEVEL || (IS_PRODUCTION ? 'error' : 'debug'),
  apiErrors: import.meta.env.VITE_LOG_API_ERRORS !== 'false', // Default to true
  consoleOutput: import.meta.env.VITE_LOG_CONSOLE_OUTPUT !== 'false', // Default to true
};

// Export default configuration object
export default {
  app: {
    name: APP_NAME,
    version: APP_VERSION,
    environment: APP_ENVIRONMENT,
    isDevelopment: IS_DEVELOPMENT,
    isProduction: IS_PRODUCTION,
    isTest: IS_TEST,
  },
  features: FEATURES,
  defaults: DEFAULTS,
  timeouts: TIMEOUTS,
  urls: URLS,
  security: SECURITY,
  logging: LOGGING,
};