/**
 * Mock Service Worker (MSW) server setup
 * This sets up a mock server to intercept API requests during tests
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup the mock service worker server with all handlers
export const server = setupServer(...handlers);