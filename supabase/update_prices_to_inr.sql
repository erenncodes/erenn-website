-- ==============================================================================
-- CONVERT ALL PRODUCTS IN DATABASE FROM PKR TO EXACT INR VALUES
-- 1 PKR = 0.30 INR
-- ==============================================================================

UPDATE public.products 
SET price = ROUND(price * 0.30), 
    currency = 'INR';
