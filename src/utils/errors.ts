/**
 * Error handling utilities and error classes
 * 
 * This module provides error handling infrastructure including:
 * - Custom error classes
 * - Error reporting utilities
 * - Error boundary helpers
 */

// Base application error class
export class AppError extends Error {
  code: string;
  statusCode?: number;
  metadata?: Record<string, any>;
  
  constructor(message: string, code = 'INTERNAL_ERROR', statusCode?: number) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    
    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }
  
  /**
   * Add metadata to the error
   * @param metadata Key-value pairs to attach to the error
   */
  addMetadata(metadata: Record<string, any>): AppError {
    this.metadata = { ...this.metadata, ...metadata };
    return this;
  }
  
  /**
   * Converts the error to a plain object for logging
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      metadata: this.metadata,
      stack: this.stack
    };
  }
}

// API error class for handling API-related errors
export class ApiError extends AppError {
  endpoint: string;
  requestData?: any;
  responseData?: any;
  
  constructor(
    message: string, 
    endpoint: string, 
    statusCode = 500, 
    code = 'API_ERROR',
    requestData?: any,
    responseData?: any
  ) {
    super(message, code, statusCode);
    this.endpoint = endpoint;
    this.requestData = requestData;
    this.responseData = responseData;
    
    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }
  
  /**
   * Converts the error to a plain object for logging
   */
  override toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      endpoint: this.endpoint,
      requestData: this.requestData,
      responseData: this.responseData
    };
  }
}

// Authentication error class
export class AuthError extends AppError {
  constructor(message: string, code = 'AUTH_ERROR', statusCode = 401) {
    super(message, code, statusCode);
    
    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

// Validation error class
export class ValidationError extends AppError {
  errors: Record<string, string>;
  
  constructor(message: string, errors: Record<string, string> = {}) {
    super(message, 'VALIDATION_ERROR', 400);
    this.errors = errors;
    
    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
  
  /**
   * Add a validation error for a specific field
   * @param field Field name
   * @param message Error message
   */
  addFieldError(field: string, message: string): ValidationError {
    this.errors[field] = message;
    return this;
  }
  
  /**
   * Converts the error to a plain object for logging
   */
  override toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      errors: this.errors
    };
  }
}

// Database error class
export class DatabaseError extends AppError {
  query?: string;
  params?: any[];
  
  constructor(message: string, code = 'DATABASE_ERROR', query?: string, params?: any[]) {
    super(message, code, 500);
    this.query = query;
    this.params = params;
    
    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
  
  /**
   * Converts the error to a plain object for logging
   */
  override toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      query: this.query,
      params: this.params
    };
  }
}

/**
 * Error handling utilities
 */
export const errorUtils = {
  /**
   * Log an error with standardized format
   * @param error Error to log
   * @param context Additional context information
   */
  logError(error: Error | AppError, context?: Record<string, any>): void {
    const errorObject = error instanceof AppError 
      ? error.toJSON() 
      : { 
          name: error.name,
          message: error.message,
          stack: error.stack
        };
    
    if (context) {
      errorObject.context = context;
    }
    
    console.error('Application Error:', errorObject);
    
    // In a real application, you might send this to an error tracking service
    // like Sentry, LogRocket, etc.
    // errorTrackingService.captureException(error, { extra: context });
  },
  
  /**
   * Create an user-friendly message from any error
   * @param error Error to format
   */
  getErrorMessage(error: unknown): string {
    if (error instanceof ValidationError) {
      return Object.values(error.errors).join(', ');
    } else if (error instanceof AppError) {
      return error.message;
    } else if (error instanceof Error) {
      return error.message;
    } else if (typeof error === 'string') {
      return error;
    } else {
      return 'An unexpected error occurred';
    }
  },
  
  /**
   * Handle API error responses and convert to appropriate AppError subclass
   * @param error Error from API request
   * @param endpoint API endpoint
   */
  handleApiError(error: any, endpoint: string): AppError {
    // If it's already an AppError, just return it
    if (error instanceof AppError) {
      return error;
    }
    
    // Extract information from Axios or Fetch errors
    const statusCode = error.response?.status || error.status || 500;
    const responseData = error.response?.data || error.data;
    const requestData = error.config?.data;
    const message = responseData?.message || error.message || 'API request failed';
    
    // Determine the appropriate error type based on status code
    if (statusCode === 401 || statusCode === 403) {
      return new AuthError(message, statusCode === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN');
    } else if (statusCode === 400 && responseData?.validationErrors) {
      return new ValidationError(message, responseData.validationErrors);
    } else if (statusCode >= 500) {
      return new ApiError(message, endpoint, statusCode, 'SERVER_ERROR', requestData, responseData);
    } else {
      return new ApiError(message, endpoint, statusCode, 'API_ERROR', requestData, responseData);
    }
  }
};