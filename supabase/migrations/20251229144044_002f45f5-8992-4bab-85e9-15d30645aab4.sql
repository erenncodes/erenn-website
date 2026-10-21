-- Make the payment-screenshots bucket public so URLs work correctly
UPDATE storage.buckets 
SET public = true 
WHERE id = 'payment-screenshots';