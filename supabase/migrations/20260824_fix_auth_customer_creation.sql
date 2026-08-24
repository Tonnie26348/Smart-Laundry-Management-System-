-- Migration: 20260824_fix_auth_customer_creation.sql

-- 1. Update handle_new_user() to be robust, secure, and handle all requirements.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_role TEXT;
  safe_full_name TEXT;
  derived_name TEXT;
BEGIN
  -- 1. Secure Role Assignment: Default to 'customer', explicitly ignore privileged roles.
  new_role := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');
  IF new_role NOT IN ('customer') THEN
    new_role := 'customer';
  END IF;

  -- 2. Secure Full Name handling: Never NULL, trimmed, with safe fallbacks.
  derived_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1), 'Customer');
  safe_full_name := TRIM(derived_name);
  IF safe_full_name = '' THEN
    safe_full_name := 'Customer';
  END IF;

  -- 3. Create profile
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id, 
    safe_full_name,
    NEW.email,
    new_role::public.user_role
  )
  ON CONFLICT (id) DO UPDATE 
    SET full_name = EXCLUDED.full_name,
        role = EXCLUDED.role;

  -- 4. Create customer record if role is customer
  IF new_role = 'customer' THEN
    INSERT INTO public.customers (profile_id, address)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'address'
    )
    ON CONFLICT (profile_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. One-time Recovery: Identify and fix missing customer records.
DO $$
DECLARE
  r RECORD;
  missing_count INT;
BEGIN
  -- Count missing
  SELECT count(*) INTO missing_count
  FROM public.profiles p
  LEFT JOIN public.customers c ON p.id = c.profile_id
  WHERE p.role = 'customer' AND c.id IS NULL;

  RAISE NOTICE 'Found % missing customer records to recover.', missing_count;

  -- Perform recovery
  FOR r IN 
    SELECT p.id 
    FROM public.profiles p
    LEFT JOIN public.customers c ON p.id = c.profile_id
    WHERE p.role = 'customer' AND c.id IS NULL
  LOOP
    INSERT INTO public.customers (profile_id, address)
    VALUES (r.id, 'Not set')
    ON CONFLICT (profile_id) DO NOTHING;
  END LOOP;

  -- Verify
  SELECT count(*) INTO missing_count
  FROM public.profiles p
  LEFT JOIN public.customers c ON p.id = c.profile_id
  WHERE p.role = 'customer' AND c.id IS NULL;
  
  RAISE NOTICE 'Missing customer records after recovery: %.', missing_count;
END $$;
