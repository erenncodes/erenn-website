-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Anyone can create contact messages" ON public.contact_messages;

-- Create a new policy with input validation (similar to reviews and orders policies)
CREATE POLICY "Anyone can create contact messages"
ON public.contact_messages
FOR INSERT
WITH CHECK (
  -- Validate required fields
  name IS NOT NULL AND
  length(TRIM(BOTH FROM name)) >= 2 AND
  length(TRIM(BOTH FROM name)) <= 100 AND
  email IS NOT NULL AND
  length(email) >= 5 AND
  length(email) <= 255 AND
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
  message IS NOT NULL AND
  length(TRIM(BOTH FROM message)) >= 10 AND
  length(TRIM(BOTH FROM message)) <= 2000
);