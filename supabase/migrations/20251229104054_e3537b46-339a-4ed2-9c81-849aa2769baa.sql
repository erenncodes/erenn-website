-- Drop the existing permissive insert policy
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;

-- Create a new policy that requires authentication and user_id to match
CREATE POLICY "Authenticated users can create their own orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);