-- Make erenncodes@gmail.com an admin
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id IN (SELECT id FROM auth.users WHERE LOWER(email) = 'erenncodes@gmail.com');

-- Automatically make erenncodes@gmail.com an admin on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
    ON CONFLICT (user_id) DO NOTHING;
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (
        NEW.id, 
        CASE WHEN LOWER(NEW.email) = 'erenncodes@gmail.com' THEN 'admin'::public.app_role ELSE 'user'::public.app_role END
    )
    ON CONFLICT (user_id, role) DO UPDATE SET role = EXCLUDED.role;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
