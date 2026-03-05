-- Run in Supabase SQL Editor.

ALTER TABLE products ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS background_image_url TEXT;
