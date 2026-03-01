-- Run this in Supabase: Dashboard → SQL Editor → New query → Paste → Run

-- Insert test users
INSERT INTO users (username, password, role)
VALUES
  ('admin',    'admin123', 'admin'),
  ('student1', 'pass123',  'user')
ON CONFLICT DO NOTHING;

-- Insert sample menu items
INSERT INTO menu_items (name, price, category, image, stock, available)
VALUES
  ('Veg Thali',       60,  'Meals',     '', 20, true),
  ('Chicken Biryani', 90,  'Meals',     '', 15, true),
  ('Masala Chai',     10,  'Beverages', '', 50, true),
  ('Cold Coffee',     30,  'Beverages', '',  0, false),
  ('Samosa',          15,  'Snacks',    '', 30, true),
  ('Bread Omelette',  25,  'Snacks',    '', 10, true)
ON CONFLICT DO NOTHING;
