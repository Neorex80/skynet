-- Database Schema

-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enable RLS (Row Level Security)
ALTER DATABASE current_database() SET "app.jwt_secret" TO 'your_jwt_secret_key';
ALTER DATABASE current_database() SET "app.jwt_exp" TO '3600';

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'manager')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ,
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  department TEXT,
  preferences JSONB DEFAULT '{
    "theme": "system",
    "notifications": true,
    "twoFactorEnabled": false,
    "emailDigestFrequency": "weekly",
    "language": "en"
  }'::jsonb NOT NULL
);

-- Enable Row Level Security on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY users_read_own ON users 
  FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY users_update_own ON users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Allow admins to read all user data
CREATE POLICY admin_read_all_users ON users 
  FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Allow admins to update all user data
CREATE POLICY admin_update_all_users ON users 
  FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category TEXT,
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  rating DECIMAL(3, 1),
  reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  featured BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued'))
);

-- Enable Row Level Security on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Anyone can read active products
CREATE POLICY products_read_active ON products 
  FOR SELECT 
  USING (status = 'active');

-- Admins can read all products
CREATE POLICY admin_read_all_products ON products 
  FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Admins can update all products
CREATE POLICY admin_update_all_products ON products 
  FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  payment_method TEXT,
  tracking_number TEXT,
  notes TEXT
);

-- Enable Row Level Security on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can read their own orders
CREATE POLICY orders_read_own ON orders 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own orders
CREATE POLICY orders_insert_own ON orders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Admins can read all orders
CREATE POLICY admin_read_all_orders ON orders 
  FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Admins can update all orders
CREATE POLICY admin_update_all_orders ON orders 
  FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security on order_items table
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can read their own order items
CREATE POLICY order_items_read_own ON order_items 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

-- Admins can read all order items
CREATE POLICY admin_read_all_order_items ON order_items 
  FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the updated_at trigger to tables
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER order_items_updated_at
  BEFORE UPDATE ON order_items
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at();