-- Update storage policy to allow guest uploads (no auth required)
-- First, check existing policies and update

-- Drop existing restrictive policies for payment-screenshots
DROP POLICY IF EXISTS "Users can upload their own screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own screenshots" ON storage.objects;

-- Allow anyone to upload to payment-screenshots bucket
CREATE POLICY "Anyone can upload payment screenshots"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'payment-screenshots');

-- Allow admins to view all screenshots
CREATE POLICY "Admins can view all payment screenshots"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'payment-screenshots' 
  AND has_role(auth.uid(), 'admin'::app_role)
);