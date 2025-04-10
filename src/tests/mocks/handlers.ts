/**
 * Mock request handlers for testing
 * These handlers intercept API requests during tests and return mock responses
 */

import { http, HttpResponse } from 'msw';
import { mockUsers } from '../fixtures/users';
import { mockProducts } from '../fixtures/products';

// API base URL from environment or default
const apiUrl = import.meta.env.VITE_API_URL || '/api';

// Mock API endpoints
export const handlers = [
  // Auth endpoints
  http.post(`${apiUrl}/auth/login`, async ({ request }) => {
    const { email, password } = await request.json();
    
    if (email === 'test@example.com' && password === 'password') {
      return HttpResponse.json({
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user'
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token'
      });
    }
    
    return new HttpResponse(
      JSON.stringify({ message: 'Invalid email or password' }), 
      { status: 401 }
    );
  }),
  
  http.post(`${apiUrl}/auth/register`, async ({ request }) => {
    const data = await request.json();
    
    if (!data.email || !data.password) {
      return new HttpResponse(
        JSON.stringify({ message: 'Email and password are required' }), 
        { status: 400 }
      );
    }
    
    return HttpResponse.json({
      user: {
        id: '2',
        email: data.email,
        name: data.name || '',
        role: 'user'
      },
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token'
    });
  }),
  
  http.post(`${apiUrl}/auth/refresh`, () => {
    return HttpResponse.json({
      token: 'new-mock-jwt-token',
      refreshToken: 'new-mock-refresh-token'
    });
  }),
  
  // Users endpoints
  http.get(`${apiUrl}/users`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedUsers = mockUsers.slice(start, end);
    const totalUsers = mockUsers.length;
    
    return HttpResponse.json({
      data: paginatedUsers,
      pagination: {
        total: totalUsers,
        page,
        limit,
        pages: Math.ceil(totalUsers / limit)
      }
    });
  }),
  
  http.get(`${apiUrl}/users/:id`, ({ params }) => {
    const { id } = params;
    const user = mockUsers.find(user => user.id === id);
    
    if (!user) {
      return new HttpResponse(
        JSON.stringify({ message: 'User not found' }), 
        { status: 404 }
      );
    }
    
    return HttpResponse.json({ data: user });
  }),
  
  http.post(`${apiUrl}/users`, async ({ request }) => {
    const newUser = await request.json();
    
    // Validate required fields
    if (!newUser.email) {
      return new HttpResponse(
        JSON.stringify({ 
          message: 'Validation error', 
          errors: { email: 'Email is required' } 
        }), 
        { status: 400 }
      );
    }
    
    return HttpResponse.json({
      data: {
        id: 'new-user-id',
        ...newUser,
        createdAt: new Date().toISOString()
      }
    });
  }),
  
  // Products endpoints (example of another resource)
  http.get(`${apiUrl}/products`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedProducts = mockProducts.slice(start, end);
    const totalProducts = mockProducts.length;
    
    return HttpResponse.json({
      data: paginatedProducts,
      pagination: {
        total: totalProducts,
        page,
        limit,
        pages: Math.ceil(totalProducts / limit)
      }
    });
  }),
  
  // Fallback for unhandled requests
  http.all('*', ({ request }) => {
    console.warn(`Unhandled ${request.method} request to ${request.url}`);
    return new HttpResponse(
      JSON.stringify({ message: 'Not found' }), 
      { status: 404 }
    );
  })
];