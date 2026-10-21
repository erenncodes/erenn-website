-- ====================================================================
-- Country-Based Dynamic Pricing Schema & Regional Pricing Migration
-- ====================================================================

-- 1. Add country_prices JSONB column to products for country overrides
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS country_prices JSONB DEFAULT '{}'::jsonb;

-- 2. Create country_pricing_rules table for persistent regional configuration
CREATE TABLE IF NOT EXISTS public.country_pricing_rules (
    id TEXT PRIMARY KEY,
    country_code TEXT NOT NULL UNIQUE,
    country_name TEXT NOT NULL,
    flag TEXT DEFAULT '🌍',
    currency TEXT NOT NULL,
    currency_symbol TEXT NOT NULL,
    min_price NUMERIC(10, 2) DEFAULT 0.00,
    fixed_rate_from_inr NUMERIC(10, 4) DEFAULT 1.0000,
    is_international BOOLEAN DEFAULT true,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on country_pricing_rules
ALTER TABLE public.country_pricing_rules ENABLE ROW LEVEL SECURITY;

-- Allow public read access to country pricing rules
CREATE POLICY "Allow public read access to country pricing rules" 
ON public.country_pricing_rules FOR SELECT USING (true);

-- Allow authenticated admins to insert/update/delete pricing rules
CREATE POLICY "Allow admins to manage country pricing rules" 
ON public.country_pricing_rules FOR ALL 
USING (auth.jwt() ->> 'email' = 'erenncodes@gmail.com');

-- 3. Insert default regional and country rules
INSERT INTO public.country_pricing_rules 
(id, country_code, country_name, flag, currency, currency_symbol, min_price, fixed_rate_from_inr, is_international, is_enabled)
VALUES
('rule-in', 'IN', 'India', '🇮🇳', 'INR', '₹', 0.00, 1.0000, false, true),
('rule-us', 'US', 'United States', '🇺🇸', 'USD', '$', 5.00, 0.0450, true, true),
('rule-gb', 'GB', 'United Kingdom', '🇬🇧', 'GBP', '£', 4.00, 0.0380, true, true),
('rule-eu', 'EU', 'Eurozone / Europe', '🇪🇺', 'EUR', '€', 4.50, 0.0420, true, true),
('rule-pk', 'PK', 'Pakistan', '🇵🇰', 'PKR', 'Rs.', 500.00, 3.3300, true, true),
('rule-me', 'AE', 'UAE & Middle East', '🇦🇪', 'AED', 'AED', 18.00, 0.1650, true, true),
('rule-ca', 'CA', 'Canada', '🇨🇦', 'CAD', 'CA$', 7.00, 0.0620, true, true),
('rule-au', 'AU', 'Australia', '🇦🇺', 'AUD', 'A$', 8.00, 0.0680, true, true),
('rule-default-intl', 'DEFAULT_INTL', 'Rest of the World (International)', '🌍', 'USD', '$', 5.00, 0.0450, true, true)
ON CONFLICT (country_code) DO NOTHING;
