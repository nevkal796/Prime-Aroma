-- =============================================================================
-- Add scent / fragrance pyramid columns to products
-- Run this in Supabase Dashboard → SQL Editor
-- =============================================================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS top_notes TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS middle_notes TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS base_notes TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS key_notes TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS fragrance_family TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS scent_type TEXT;
