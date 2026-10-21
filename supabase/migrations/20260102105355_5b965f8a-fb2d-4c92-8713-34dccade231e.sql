-- Fix 1: Update storage policy to validate folder structure for payment screenshots

-- Drop existing policy
DROP POLICY IF EXISTS "Anyone can upload payment screenshots" ON storage.objects;

-- Authenticated users upload to their own folder
CREATE POLICY "Users can upload to own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'payment-screenshots'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Guest users upload to a 'guest' folder
CREATE POLICY "Guests can upload to guest folder"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'payment-screenshots'
  AND (storage.foldername(name))[1] = 'guest'
);

-- Fix 2: Add database trigger to validate order amount against product price
CREATE OR REPLACE FUNCTION public.validate_order_amount()
RETURNS TRIGGER AS $$
DECLARE
  product_price DECIMAL(10,2);
BEGIN
  -- Get the product price
  SELECT price INTO product_price
  FROM products
  WHERE id = NEW.product_id AND is_active = true;
  
  -- If product not found, reject
  IF product_price IS NULL THEN
    RAISE EXCEPTION 'Invalid product or product is not active';
  END IF;
  
  -- Validate amount matches product price
  IF NEW.amount != product_price THEN
    RAISE EXCEPTION 'Order amount does not match product price';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for order amount validation
DROP TRIGGER IF EXISTS check_order_amount ON orders;
CREATE TRIGGER check_order_amount
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_order_amount();