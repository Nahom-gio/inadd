// Real API service for production use
// Replace mock API calls with actual HTTP requests
import config from './config';

const API_BASE_URL = config.api.baseUrl;
const API_TIMEOUT = config.api.timeout;

// Server-side validation functions
export const serverValidation = {
  // Validate email format and check for disposable domains
  validateEmail: email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }

    // Check for disposable email domains (this should ideally be done server-side)
    const disposableDomains = [
      'tempmail.com',
      'throwaway.com',
      '10minutemail.com',
      'guerrillamail.com',
      'mailinator.com',
      'yopmail.com',
      'sharklasers.com',
      'grr.la',
    ];

    const domain = email.split('@')[1];
    if (disposableDomains.includes(domain)) {
      return {
        isValid: false,
        error: 'Disposable email addresses are not allowed',
      };
    }

    return { isValid: true, error: null };
  },

  // Validate name format and length
  validateName: name => {
    if (!name || name.trim().length < 2) {
      return {
        isValid: false,
        error: 'Name must be at least 2 characters long',
      };
    }

    if (name.length > 50) {
      return { isValid: false, error: 'Name must be less than 50 characters' };
    }

    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!nameRegex.test(name)) {
      return { isValid: false, error: 'Name contains invalid characters' };
    }

    return { isValid: true, error: null };
  },

  // Validate message content and length
  validateMessage: message => {
    if (!message || message.trim().length < 10) {
      return {
        isValid: false,
        error: 'Message must be at least 10 characters long',
      };
    }

    if (message.length > 1000) {
      return {
        isValid: false,
        error: 'Message must be less than 1000 characters',
      };
    }

    // Check for suspicious content patterns
    const suspiciousPatterns = [
      /spam/i,
      /viagra/i,
      /casino/i,
      /loan/i,
      /free.*money/i,
      /click.*here/i,
      /buy.*now/i,
      /urgent/i,
      /limited.*time/i,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(message)) {
        return { isValid: false, error: 'Message contains suspicious content' };
      }
    }

    return { isValid: true, error: null };
  },

  // Validate company name
  validateCompany: company => {
    if (company && company.length > 100) {
      return {
        isValid: false,
        error: 'Company name must be less than 100 characters',
      };
    }

    if (company) {
      const companyRegex = /^[a-zA-Z0-9\s&.,'-]+$/;
      if (!companyRegex.test(company)) {
        return {
          isValid: false,
          error: 'Company name contains invalid characters',
        };
      }
    }

    return { isValid: true, error: null };
  },

  // Validate service selection
  validateService: service => {
    const validServices = [
      'event-planning',
      'roadshow',
      'brand-activation',
      'promotional',
      'other',
    ];

    if (!service || !validServices.includes(service)) {
      return { isValid: false, error: 'Please select a valid service' };
    }

    return { isValid: true, error: null };
  },
};

// Helper function to create request options
const createRequestOptions = (method, data = null, headers = {}) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    timeout: API_TIMEOUT,
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  return options;
};

// Helper function to handle API responses
const handleResponse = async response => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    // Handle different HTTP status codes
    switch (response.status) {
      case 400:
        throw new Error(
          errorData.message || 'Bad request - please check your input'
        );
      case 401:
        throw new Error('Unauthorized - please log in again');
      case 403:
        throw new Error(
          'Forbidden - you do not have permission to perform this action'
        );
      case 404:
        throw new Error('Resource not found');
      case 429:
        throw new Error('Too many requests - please try again later');
      case 500:
        throw new Error('Server error - please try again later');
      default:
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
    }
  }

  return response.json();
};

// Helper function to handle network errors
const handleNetworkError = error => {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    throw new Error(
      'Network error. Please check your connection and try again.'
    );
  }
  if (error.name === 'AbortError') {
    throw new Error('Request was cancelled due to timeout.');
  }
  throw error;
};

// API service class
class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.abortController = null;
  }

  // Generic request method with timeout and abort capability
  async request(endpoint, options = {}) {
    try {
      // Abort previous request if it exists
      if (this.abortController) {
        this.abortController.abort();
      }

      // Create new abort controller for this request
      this.abortController = new AbortController();
      const timeoutId = setTimeout(() => {
        this.abortController.abort();
      }, API_TIMEOUT);

      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        signal: this.abortController.signal,
      });

      clearTimeout(timeoutId);
      return await handleResponse(response);
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      handleNetworkError(error);
    }
  }

  // Contact form submission with server-side validation
  async submitContactForm(formData) {
    // Client-side validation first
    const validations = [
      serverValidation.validateName(formData.name),
      serverValidation.validateEmail(formData.email),
      serverValidation.validateMessage(formData.message),
      serverValidation.validateService(formData.service),
      serverValidation.validateCompany(formData.company),
    ];

    const errors = {};
    let hasErrors = false;

    validations.forEach((validation, index) => {
      const fieldNames = ['name', 'email', 'message', 'service', 'company'];
      const fieldName = fieldNames[index];

      if (!validation.isValid) {
        errors[fieldName] = validation.error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      return {
        success: false,
        message: 'Validation failed',
        errors,
      };
    }

    const options = createRequestOptions('POST', formData);

    // Add CSRF token if available
    const csrfToken = sessionStorage.getItem('csrf_token');
    if (csrfToken) {
      options.headers['X-CSRF-Token'] = csrfToken;
    }

    return this.request('/api/contact', options);
  }

  // Get services list
  async getServices() {
    return this.request('/api/services');
  }

  // Get portfolio items
  async getPortfolioItems(category = null) {
    const endpoint = category
      ? `/api/portfolio?category=${category}`
      : '/api/portfolio';
    return this.request(endpoint);
  }

  // Get blog posts
  async getBlogPosts(page = 1, limit = 10) {
    return this.request(`/api/blog?page=${page}&limit=${limit}`);
  }

  // Get client testimonials
  async getClientTestimonials() {
    return this.request('/api/testimonials');
  }

  // Get company stats
  async getCompanyStats() {
    return this.request('/api/stats');
  }

  // Newsletter subscription
  async subscribeNewsletter(email) {
    // Validate email before sending
    const emailValidation = serverValidation.validateEmail(email);
    if (!emailValidation.isValid) {
      return {
        success: false,
        message: emailValidation.error,
      };
    }

    const options = createRequestOptions('POST', { email });
    return this.request('/api/newsletter/subscribe', options);
  }

  // File upload (for portfolio images)
  async uploadFile(file, type = 'image') {
    // Validate file type and size
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, WebP, and GIF files are allowed');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const options = {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData
      },
    };

    return this.request('/api/upload', options);
  }

  // Rate limiting check
  async checkRateLimit(action = 'contact_form') {
    return this.request(`/api/rate-limit/check?action=${action}`);
  }

  // Spam detection
  async detectSpam(data) {
    const options = createRequestOptions('POST', data);
    return this.request('/api/spam/detect', options);
  }

  // Analytics tracking
  async trackEvent(eventName, eventData = {}) {
    const data = {
      event: eventName,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...eventData,
    };

    const options = createRequestOptions('POST', data);
    return this.request('/api/analytics/track', options);
  }

  // Abort current request
  abortRequest() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  // Cleanup method
  cleanup() {
    this.abortRequest();
  }
}

// Create and export singleton instance
const apiService = new ApiService();

// Export individual methods for backward compatibility
export const submitContactForm = formData =>
  apiService.submitContactForm(formData);
export const getServices = () => apiService.getServices();
export const getPortfolioItems = category =>
  apiService.getPortfolioItems(category);
export const getBlogPosts = (page, limit) =>
  apiService.getBlogPosts(page, limit);
export const getClientTestimonials = () => apiService.getClientTestimonials();
export const getCompanyStats = () => apiService.getCompanyStats();
export const subscribeNewsletter = email =>
  apiService.subscribeNewsletter(email);
export const uploadFile = (file, type) => apiService.uploadFile(file, type);
export const checkRateLimit = action => apiService.checkRateLimit(action);
export const detectSpam = data => apiService.detectSpam(data);
export const trackEvent = (eventName, eventData) =>
  apiService.trackEvent(eventName, eventData);

// Export the service instance
export default apiService;
