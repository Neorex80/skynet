/**
 * Global test setup file for Jest
 * This file runs before all tests and sets up the testing environment
 */

import '@testing-library/jest-dom';
import { server } from './mocks/server';
import { afterAll, afterEach, beforeAll, vitest } from 'vitest';

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => {
  // Reset mocks between tests
  vitest.resetAllMocks();
  
  // Reset request handlers
  server.resetHandlers();
  
  // Reset localStorage
  localStorage.clear();
  sessionStorage.clear();
  
  // Clean up any global DOM changes
  document.body.innerHTML = '';
  
  // Clear any mocked timers
  vitest.clearAllTimers();
});

// Clean up after the tests are finished
afterAll(() => server.close());

// Mock console to capture errors
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Silence specific expected warnings from test output but still keep them for debugging
console.warn = (...args: any[]) => {
  // Don't print React specific warnings in tests unless explicitly enabled
  const suppressPatterns = [
    'Warning: ReactDOM.render is no longer supported',
    'Warning: An update to Component inside a test was not wrapped in act',
    'Warning: The current testing environment is not configured to support act',
  ];
  
  if (!suppressPatterns.some(pattern => args[0] && args[0].toString().includes(pattern))) {
    originalConsoleWarn.apply(console, args);
  }
};

console.error = (...args: any[]) => {
  // Don't print specific errors to keep test output clean 
  const suppressPatterns = [
    'Error: Not implemented: navigation',
    'Error: Not implemented: window.scrollTo',
  ];
  
  if (!suppressPatterns.some(pattern => args[0] && args[0].toString().includes(pattern))) {
    originalConsoleError.apply(console, args);
  }
};

// Mock fetch API
global.fetch = vitest.fn();

// Mock IntersectionObserver
class MockIntersectionObserver {
  readonly root: Element | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;
  
  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {
    this.root = options?.root || null;
    this.rootMargin = options?.rootMargin || '0px';
    this.thresholds = Array.isArray(options?.threshold) 
      ? options.threshold 
      : [options?.threshold || 0];
  }
  
  disconnect() {
    // Do nothing
  }
  
  observe() {
    // Do nothing
  }
  
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  
  unobserve() {
    // Do nothing
  }
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vitest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vitest.fn(), // deprecated
    removeListener: vitest.fn(), // deprecated
    addEventListener: vitest.fn(),
    removeEventListener: vitest.fn(),
    dispatchEvent: vitest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vitest.fn().mockImplementation(() => ({
  observe: vitest.fn(),
  unobserve: vitest.fn(),
  disconnect: vitest.fn(),
}));