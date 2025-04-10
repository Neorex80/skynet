-- Development seed data

-- Insert admin user
INSERT INTO users (id, email, name, role, status, department, preferences)
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  'Admin User',
  'admin',
  'active',
  'Administration',
  jsonb_build_object(
    'theme', 'dark',
    'notifications', true,
    'twoFactorEnabled', true,
    'emailDigestFrequency', 'daily',
    'language', 'en'
  )
);

-- Insert regular users
INSERT INTO users (id, email, name, role, status, department, preferences)
VALUES 
  (
    gen_random_uuid(),
    'john.doe@example.com',
    'John Doe',
    'user',
    'active',
    'Engineering',
    jsonb_build_object(
      'theme', 'system',
      'notifications', true,
      'twoFactorEnabled', false,
      'emailDigestFrequency', 'weekly',
      'language', 'en'
    )
  ),
  (
    gen_random_uuid(),
    'jane.smith@example.com',
    'Jane Smith',
    'manager',
    'active',
    'Marketing',
    jsonb_build_object(
      'theme', 'light',
      'notifications', true,
      'twoFactorEnabled', false,
      'emailDigestFrequency', 'weekly',
      'language', 'en'
    )
  );

-- Insert product categories
INSERT INTO products (name, description, price, category, stock, featured, status)
VALUES
  (
    'Premium Ergonomic Chair',
    'High-quality ergonomic office chair with adjustable lumbar support and height.',
    249.99,
    'Furniture',
    25,
    true,
    'active'
  ),
  (
    'Wireless Mechanical Keyboard',
    'Mechanical keyboard with RGB lighting and wireless connectivity.',
    129.99,
    'Electronics',
    50,
    true,
    'active'
  ),
  (
    '4K Monitor 32"',
    'Ultra HD 4K monitor with HDR support and adjustable stand.',
    399.99,
    'Electronics',
    15,
    true,
    'active'
  ),
  (
    'Wireless Mouse',
    'Ergonomic wireless mouse with long battery life and adjustable DPI.',
    49.99,
    'Electronics',
    100,
    false,
    'active'
  ),
  (
    'Desk Lamp with Wireless Charger',
    'LED desk lamp with integrated wireless phone charger and adjustable brightness.',
    79.99,
    'Lighting',
    35,
    false,
    'active'
  ),
  (
    'Cable Management System',
    'Complete cable management solution for keeping your workspace tidy.',
    24.99,
    'Accessories',
    75,
    false,
    'active'
  ),
  (
    'Adjustable Standing Desk',
    'Electric standing desk with programmable height presets and sturdy construction.',
    499.99,
    'Furniture',
    10,
    true,
    'active'
  ),
  (
    'Noise-Cancelling Headphones',
    'Over-ear noise-cancelling headphones with 30-hour battery life.',
    199.99,
    'Audio',
    40,
    true,
    'active'
  );

-- Create sample order for John Doe
WITH user_john AS (
  SELECT id FROM users WHERE email = 'john.doe@example.com' LIMIT 1
),
product_chair AS (
  SELECT id, price FROM products WHERE name = 'Premium Ergonomic Chair' LIMIT 1
),
product_keyboard AS (
  SELECT id, price FROM products WHERE name = 'Wireless Mechanical Keyboard' LIMIT 1
),
inserted_order AS (
  INSERT INTO orders (
    user_id, 
    status, 
    total, 
    shipping_address, 
    billing_address,
    payment_status
  )
  SELECT 
    user_john.id, 
    'delivered', 
    (product_chair.price + product_keyboard.price), 
    '{"street": "123 Main St", "city": "Springfield", "state": "IL", "zip": "62701", "country": "USA"}'::jsonb,
    '{"street": "123 Main St", "city": "Springfield", "state": "IL", "zip": "62701", "country": "USA"}'::jsonb,
    'paid'
  FROM user_john, product_chair, product_keyboard
  RETURNING id
)
INSERT INTO order_items (order_id, product_id, quantity, price)
SELECT 
  inserted_order.id,
  product_chair.id,
  1,
  product_chair.price
FROM inserted_order, product_chair
UNION ALL
SELECT 
  inserted_order.id,
  product_keyboard.id,
  1,
  product_keyboard.price
FROM inserted_order, product_keyboard;