-- Make the payment-screenshots bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'payment-screenshots';

-- Drop any existing storage policies for this bucket to avoid conflicts
DROP POLICY IF EXISTS "Admins can view payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view payment screenshots" ON storage.objects;

-- Only admins can read payment screenshots
CREATE POLICY "Admins can view payment screenshots"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'payment-screenshots' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Users can only upload to their own folder
CREATE POLICY "Users can upload their own screenshots"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'payment-screenshots'
  AND (storage.foldername(name))[1] = auth.uid()::text
);