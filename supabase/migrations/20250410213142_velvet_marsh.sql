-- Add Row Level Security to database tables

-- Enable RLS for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY users_read_own ON users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY users_update_own ON users 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY admin_read_all_users ON users 
  FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_update_all_users ON users 
  FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Enable RLS for products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY products_read_active ON products 
  FOR SELECT 
  USING (status = 'active');

CREATE POLICY admin_read_all_products ON products 
  FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_update_all_products ON products 
  FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_insert_products ON products 
  FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Enable RLS for orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY orders_read_own ON orders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY orders_insert_own ON orders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY admin_read_all_orders ON orders 
  FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_update_all_orders ON orders 
  FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Enable RLS for order_items table
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Order items policies
CREATE POLICY order_items_read_own ON order_items 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

CREATE POLICY admin_read_all_order_items ON order_items 
  FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY order_items_insert_own ON order_items 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));