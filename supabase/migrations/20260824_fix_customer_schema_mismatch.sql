-- Migration: 20260824_fix_customer_schema_mismatch.sql

-- 1. Add profile_id to customers if not present
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 2. Populate profile_id from user_id if user_id exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='user_id') THEN
    UPDATE public.customers SET profile_id = user_id WHERE profile_id IS NULL AND user_id IS NOT NULL;
  END IF;
END $$;

-- 3. Make profile_id NOT NULL and UNIQUE
ALTER TABLE public.customers ALTER COLUMN profile_id SET NOT NULL;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customers_profile_id_key') THEN
    ALTER TABLE public.customers ADD CONSTRAINT customers_profile_id_key UNIQUE (profile_id);
  END IF;
END $$;

-- 4. Drop user_id column
ALTER TABLE public.customers DROP COLUMN IF EXISTS user_id;

-- 5. Update RLS policies
DROP POLICY IF EXISTS "Customers can view own record" ON public.customers;
DROP POLICY IF EXISTS "Customers can update own record" ON public.customers;

CREATE POLICY "Customers can view own record" ON public.customers FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Customers can update own record" ON public.customers FOR UPDATE USING (profile_id = auth.uid());

-- 6. Update handle_new_user trigger to use profile_id
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_role TEXT;
BEGIN
  -- Determine role
  new_role := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');

  -- Create profile (if it doesn't already exist, handle conflicts)
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    new_role::public.user_role
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create customer record if role is customer
  IF new_role = 'customer' THEN
    INSERT INTO public.customers (profile_id, phone, address)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'phone', '0000000000'),
      NEW.raw_user_meta_data->>'address'
    )
    ON CONFLICT (profile_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
