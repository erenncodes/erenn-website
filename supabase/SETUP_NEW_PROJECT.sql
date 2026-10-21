-- ==============================================================================
-- MASTER DATABASE SETUP SCRIPT FOR ERENN CODES (SUPABASE)
-- Run this in your Supabase SQL Editor to set up your entire database in 1 click.
-- ==============================================================================

-- 1. Create Enums and Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'user');
    END IF;
END
$$;

-- 2. Create Tables

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User Roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'PKR',
    category TEXT,
    image_url TEXT,
    demo_url TEXT,
    youtube_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    payment_method TEXT NOT NULL,
    payment_reference TEXT,
    payment_screenshot_url TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'PKR',
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Contact Messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    review_text TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rate Limits table
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL,
    scope TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Security Helper Function (private.has_role)
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated, PUBLIC;
GRANT USAGE ON SCHEMA private TO postgres, service_role, anon, authenticated;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon, authenticated, service_role;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

-- User Roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- Products (public can view active, admins can manage)
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- Orders
DROP POLICY IF EXISTS "Users and admins can view orders" ON public.orders;
CREATE POLICY "Users and admins can view orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

-- Contact Messages
DROP POLICY IF EXISTS "Anyone can create contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can create contact messages" ON public.contact_messages FOR INSERT WITH CHECK (
  name IS NOT NULL AND length(TRIM(BOTH FROM name)) >= 2 AND length(TRIM(BOTH FROM name)) <= 100 AND
  email IS NOT NULL AND length(email) >= 5 AND length(email) <= 255 AND
  message IS NOT NULL AND length(TRIM(BOTH FROM message)) >= 10 AND length(TRIM(BOTH FROM message)) <= 2000
);

DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
CREATE POLICY "Admins can update contact messages" ON public.contact_messages FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

-- Reviews
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;
CREATE POLICY "Anyone can view approved reviews" ON public.reviews FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Anyone can submit reviews" ON public.reviews;
CREATE POLICY "Anyone can submit reviews" ON public.reviews FOR INSERT WITH CHECK (
  name IS NOT NULL AND length(trim(name)) >= 2 AND length(trim(name)) <= 50 AND
  review_text IS NOT NULL AND length(trim(review_text)) >= 10 AND length(trim(review_text)) <= 500 AND
  rating >= 1 AND rating <= 5
);

DROP POLICY IF EXISTS "Admins can manage reviews" ON public.reviews;
CREATE POLICY "Admins can manage reviews" ON public.reviews FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- 6. Trigger Functions

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-register user profile and role on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
    ON CONFLICT (user_id) DO NOTHING;
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-screenshots', 'payment-screenshots', false) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Admins can view payment screenshots" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'payment-screenshots' AND private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can view product-images" ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product-images" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-images' AND private.has_role(auth.uid(), 'admin'::app_role));

-- 8. Seed 15 Products
INSERT INTO public.products (id, title, description, price, currency, category, image_url, demo_url, is_active)
VALUES
  ('5a8cd8a1-0792-4cad-bc5a-c3886be53e3a', 'Happy Womens Day', 'Celebrate Women''s Day with this beautiful romantic website featuring heartfelt messages, cute animations, and a warm design to appreciate the special woman in your life.', 545.00, 'PKR', 'Romantic', '/images/happy-womens-day-thumbnail.png', NULL, true),
  ('6d0b12d0-5ca9-4749-8573-f4383669c465', 'Happy Birthday 2.0', 'A beautifully designed Happy Birthday website with elegant calligraphy, romantic heart animations, and a heartfelt personalized message. Perfect for surprising your loved one on their special day!', 823.00, 'PKR', 'Birthday', '/images/happy-birthday-2-thumbnail.png', NULL, true),
  ('8a6b9dc7-ff59-4406-b5b1-3ded79d52b31', 'Happy Holi', 'Celebrate the festival of colors with this beautiful Happy Holi website! A vibrant, animated greeting page you can personalize and share with friends, family, and loved ones. Spread joy and color this Holi season with a stunning digital experience.', 0.00, 'PKR', 'Holi', '/images/happy-holi-thumbnail.png', NULL, true),
  ('b92a5598-f215-4005-9e22-02aa254ac241', 'Ramadan Kareem', 'Send heartfelt Ramadan wishes to everyone you care about. A beautifully animated website featuring lanterns, moonlit skies, and blessings — perfect for sharing with family, friends, and colleagues during the holy month.', 412.00, 'PKR', 'Ramadan', '/images/ramadan-kareem-thumbnail.png', NULL, true),
  ('848d6890-5e80-4e5b-9faf-8cc62c51e3e3', 'Ramadan Mubarak', 'Beautiful Ramadan Diaries website for your loved ones. Share the spirit of Ramadan with a personalized website featuring love, blessings, and memories. Perfect gift for your partner this Ramadan! ???', 412.00, 'PKR', 'Ramadan', '/images/ramadan-mubarak-thumbnail.png', NULL, true),
  ('d8958652-9c99-45e8-bbf1-3f83efc23c42', 'Happy Valentines Day 2.O', 'Make your Valentine''s Day unforgettable with this adorable interactive website! Features a cute puppy with roses, romantic proposal animation, and a heartwarming "Will you be my Valentine?" experience. Perfect for surprising your special someone! ??', 505.00, 'PKR', 'valentines', '/images/happy-valentines-2-thumbnail.png', NULL, true),
  ('bbc830a9-097b-4547-b1d0-1d5de398c37d', 'Happy Birthday Handsome', 'A stunning birthday website template designed for the special man in your life. Features beautiful animations, personalized messages, and a heartfelt design to make his birthday unforgettable.', 823.00, 'PKR', 'Birthday', '/images/happy-birthday-handsome-thumbnail.png', NULL, true),
  ('780be078-0b68-45ec-a9cb-11ca2ef39ace', 'Happy Valentines', 'Express your love with this beautiful Valentine''s Day website. A romantic and heartfelt way to ask "Will you be my Valentine?" with cute animations and interactive elements.', 505.00, 'PKR', 'valentines', '/images/happy-valentines-thumbnail.png', NULL, true),
  ('c11f5a1c-548c-4cde-98f3-ec24081182b3', 'Why I Love Him Male Version', 'A beautiful romantic website template designed specifically for expressing love to your boyfriend or husband. Features stunning animations, heartfelt messages, and a romantic color palette perfect for him.', 505.00, 'PKR', 'Romantic', '/images/why-i-love-him-thumbnail.png', NULL, true),
  ('015fff46-7275-40bd-9fad-c4c1b1b90e80', 'Sorry Website', 'Express your heartfelt apology with this beautifully designed Sorry Website template. Features cute animated characters, floating hearts, interactive slides, and emotional messaging perfect for saying sorry to your loved ones. Mobile-responsive design with dark mode support.', 505.00, 'PKR', 'Sorry', '/images/sorry-website-thumbnail.png', NULL, true),
  ('389586b5-3ba4-4673-945b-f6ab1f5fa642', 'Happy Anniversary', 'Celebrate your love with this stunning anniversary website template. Features elegant romantic design with floating hearts, beautiful animations, customizable love messages, couple photos, and heartfelt dedications. Perfect for wedding anniversaries, dating milestones, or any special romantic occasion.', 823.00, 'PKR', 'Anniversary', '/images/happy-anniversary-thumbnail.png', NULL, true),
  ('8635e456-c448-45a0-a7bb-6bb822b285ba', 'Love Proposal Website', 'A beautiful interactive proposal website with romantic animations, music controls, and heartfelt questions leading to the ultimate question - Will you be mine forever?', 505.00, 'PKR', 'Proposal', '/images/love-proposal-thumbnail.png', NULL, true),
  ('080d012f-38c0-4d7b-ab36-a62c3260a93f', 'Happy Birthday Surprise', 'A magical birthday celebration website template to surprise your loved ones. Features stunning animations, countdown timer, birthday wishes, and a festive color palette perfect for making birthdays unforgettable.', 823.00, 'PKR', 'Birthday', '/images/birthday-thumbnail.png', NULL, true),
  ('4bade3a6-6a39-4641-8843-765b18cfcd5c', 'Why I Love You', 'A beautiful romantic website template perfect for expressing love to your partner. Features stunning animations, heartfelt messages, and a romantic color palette.', 505.00, 'PKR', 'Romantic', '/images/why-i-love-you-thumbnail.png', NULL, true),
  ('256f35ec-ecd1-47e1-9851-2e7b01dc3673', 'Eid Mubarak My Love', 'A stunning Eid Mubarak website designed for couples — golden crescent moon, elegant Islamic patterns, romantic animations, and heartfelt messages. Perfect to surprise your loved one this Eid! ???', 999.00, 'PKR', 'Eid Mubarak', 'https://vcwjealhdnjuykfbntin.supabase.co/storage/v1/object/public/product-images/eid-mubarak-thumbnail.png', NULL, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  demo_url = EXCLUDED.demo_url,
  is_active = EXCLUDED.is_active;

-- ==============================================================================
-- SETUP COMPLETE!
-- Next step: Create an account on your website (/auth), then run:
-- UPDATE public.user_roles SET role = 'admin' WHERE user_id = 'YOUR_USER_ID';
-- ==============================================================================

