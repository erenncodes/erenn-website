-- Add payment_screenshot_url column to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_screenshot_url text;