-- Add youtube_url column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS youtube_url TEXT;
