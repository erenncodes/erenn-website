-- The rate_limits table is only accessed by backend functions using the service role key,
-- which bypasses RLS. Adding a policy that denies all public access is not necessary
-- since there are no permissive policies. This is secure by default-deny.
-- Adding a comment to document this decision.
comment on table public.rate_limits is 'Used by backend functions for rate limiting. No public access needed - service role only.';

-- Add RLS policy that explicitly denies all access (for documentation clarity)
-- Actually, since RLS is default-deny with no policies, this is already secure.
-- We'll add an admin-only policy for debugging purposes.
create policy "Only admins can view rate limits"
on public.rate_limits
for select
using (has_role(auth.uid(), 'admin'::app_role));