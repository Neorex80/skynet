/**
 * Mock product data for testing
 */

export interface MockProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  rating: number;
  reviews: number;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  status: 'active' | 'inactive' | 'discontinued';
}

export const mockProducts: MockProduct[] = [
  {
    id: '1',
    name: 'Ergonomic Office Chair',
    description: 'Comfortable ergonomic chair with lumbar support and adjustable height.',
    price: 249.99,
    category: 'Furniture',
    imageUrl: 'https://example.com/images/products/chair1.jpg',
    stock: 45,
    rating: 4.7,
    reviews: 128,
    createdAt: '2023-01-10T14:30:00Z',
    updatedAt: '2023-04-15T09:25:12Z',
    featured: true,
    status: 'active'
  },
  {
    id: '2',
    name: 'Professional Wireless Keyboard',
    description: 'Bluetooth keyboard with mechanical keys and multi-device support.',
    price: 89.95,
    category: 'Electronics',
    imageUrl: 'https://example.com/images/products/keyboard1.jpg',
    stock: 78,
    rating: 4.5,
    reviews: 94,
    createdAt: '2023-02-05T11:45:30Z',
    updatedAt: '2023-04-20T16:15:40Z',
    featured: false,
    status: 'active'
  },
  {
    id: '3',
    name: 'Ultrawide Monitor 34"',
    description: 'Curved ultrawide monitor with 4K resolution and HDR support.',
    price: 499.99,
    category: 'Electronics',
    imageUrl: 'https://example.com/images/products/monitor1.jpg',
    stock: 12,
    rating: 4.8,
    reviews: 56,
    createdAt: '2023-02-15T09:20:15Z',
    updatedAt: '2023-04-22T14:10:30Z',
    featured: true,
    status: 'active'
  },
  {
    id: '4',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with adjustable DPI and long battery life.',
    price: 39.99,
    category: 'Electronics',
    imageUrl: 'https://example.com/images/products/mouse1.jpg',
    stock: 120,
    rating: 4.3,
    reviews: 215,
    createdAt: '2023-03-01T13:10:05Z',
    updatedAt: '2023-04-25T11:30:20Z',
    featured: false,
    status: 'active'
  },
  {
    id: '5',
    name: 'Standing Desk',
    description: 'Adjustable height standing desk with electric motor and memory settings.',
    price: 349.95,
    category: 'Furniture',
    imageUrl: 'https://example.com/images/products/desk1.jpg',
    stock: 25,
    rating: 4.6,
    reviews: 72,
    createdAt: '2023-03-12T10:45:30Z',
    updatedAt: '2023-05-01T09:15:10Z',
    featured: true,
    status: 'active'
  },
  {
    id: '6',
    name: 'Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation and Bluetooth 5.0.',
    price: 199.99,
    category: 'Audio',
    imageUrl: 'https://example.com/images/products/headphones1.jpg',
    stock: 60,
    rating: 4.9,
    reviews: 183,
    createdAt: '2023-03-20T15:30:00Z',
    updatedAt: '2023-05-05T13:45:30Z',
    featured: true,
    status: 'active'
  },
  {
    id: '7',
    name: 'LED Desk Lamp',
    description: 'Adjustable LED desk lamp with multiple brightness levels and color temperatures.',
    price: 49.95,
    category: 'Lighting',
    imageUrl: 'https://example.com/images/products/lamp1.jpg',
    stock: 85,
    rating: 4.4,
    reviews: 106,
    createdAt: '2023-03-25T09:20:15Z',
    updatedAt: '2023-05-10T14:30:45Z',
    featured: false,
    status: 'active'
  },
  {
    id: '8',
    name: 'External SSD 1TB',
    description: 'Portable SSD with 1TB capacity and USB 3.2 interface for fast data transfer.',
    price: 159.99,
    category: 'Storage',
    imageUrl: 'https://example.com/images/products/ssd1.jpg',
    stock: 32,
    rating: 4.7,
    reviews: 89,
    createdAt: '2023-04-05T11:15:30Z',
    updatedAt: '2023-05-12T10:20:15Z',
    featured: false,
    status: 'active'
  },
  {
    id: '9',
    name: 'Webcam HD 1080p',
    description: 'High-definition webcam with built-in microphone and auto-focus.',
    price: 79.99,
    category: 'Electronics',
    imageUrl: 'https://example.com/images/products/webcam1.jpg',
    stock: 0,
    rating: 4.2,
    reviews: 67,
    createdAt: '2023-04-10T14:45:00Z',
    updatedAt: '2023-05-15T16:10:30Z',
    featured: false,
    status: 'inactive'
  },
  {
    id: '10',
    name: 'Laptop Stand',
    description: 'Adjustable height laptop stand with cooling ventilation.',
    price: 29.95,
    category: 'Accessories',
    imageUrl: 'https://example.com/images/products/laptopstand1.jpg',
    stock: 110,
    rating: 4.5,
    reviews: 152,
    createdAt: '2023-04-15T10:30:45Z',
    updatedAt: '2023-05-18T09:15:00Z',
    featured: true,
    status: 'active'
  }
];

export default mockProducts;