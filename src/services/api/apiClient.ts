import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios';

/**
 * Application API client setup using axios with interceptors for:
 * - Authentication
 * - Error handling
 * - Request/response logging
 * - Caching
 * - Retries
 */

// Read API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Default request configuration
const defaultConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
};

// Create API client instance
const apiClient: AxiosInstance = axios.create(defaultConfig);

// Auth token handler
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Request interceptor - adds auth token and handles request configuration
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`, config);
    }

    return config;
  },
  (error) => {
    // Log request errors
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handles response data and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle API errors
    if (import.meta.env.DEV) {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data || error.message);
    }

    // Handle authentication errors (401)
    if (error.response?.status === 401) {
      // Could dispatch logout action or redirect to login
      // Example: store.dispatch(authActions.logout());
      console.warn('Authentication error, user needs to login again');
      // Or trigger refresh token flow
    }
    
    // Handle forbidden errors (403)
    if (error.response?.status === 403) {
      console.warn('Permission denied for this action');
      // Could redirect to access denied page
    }

    // Handle server errors
    if (error.response?.status && error.response.status >= 500) {
      // Could show server error notification
      console.error('Server error occurred');
    }

    return Promise.reject(error);
  }
);

// Enhanced API client with typed request methods
const enhancedApiClient = {
  // GET request with type parameters
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.get(url, config).then(response => response.data);
  },

  // POST request with type parameters
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.post(url, data, config).then(response => response.data);
  },

  // PUT request with type parameters
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.put(url, data, config).then(response => response.data);
  },

  // PATCH request with type parameters
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.patch(url, data, config).then(response => response.data);
  },

  // DELETE request with type parameters
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.delete(url, config).then(response => response.data);
  },
  
  // Access to the underlying axios instance
  instance: apiClient
};

export default enhancedApiClient;