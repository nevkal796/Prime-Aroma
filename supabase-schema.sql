-- =============================================================================
-- PRIME AROMA / COLOGNE STORE — Supabase schema
-- Run this script in Supabase Dashboard → SQL Editor
-- =============================================================================

-- Products table (cologne catalog)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  size TEXT,
  brand TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders table (checkout / Stripe)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT NOT NULL UNIQUE,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  fulfilled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) on both tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products: public read (anyone can read products)
CREATE POLICY "products_public_read"
  ON products
  FOR SELECT
  USING (true);

-- Orders: service role only (insert and read via backend only; no anon access)
CREATE POLICY "orders_service_role_all"
  ON orders
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Optional: allow anon to do nothing on orders (policy above restricts to service_role)
-- No policy for anon/authenticated on orders = they cannot SELECT/INSERT/UPDATE/DELETE.
