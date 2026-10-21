-- Allow guest orders (user_id can be null)
-- Update the RLS policy to allow guest insertions

-- Drop the existing restrictive insert policy
DROP POLICY IF EXISTS "Authenticated users can create their own orders" ON public.orders;

-- Create new policy that allows anyone to create orders (guest checkout)
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Add a unique constraint to prevent same user ordering same product twice
-- But allow different users or guests to order the same product
CREATE UNIQUE INDEX IF NOT EXISTS orders_user_product_unique 
ON public.orders (user_id, product_id) 
WHERE user_id IS NOT NULL AND status != 'cancelled';

-- For guest orders, we check by email + product combination
CREATE UNIQUE INDEX IF NOT EXISTS orders_email_product_unique 
ON public.orders (customer_email, product_id) 
WHERE user_id IS NULL AND status != 'cancelled';