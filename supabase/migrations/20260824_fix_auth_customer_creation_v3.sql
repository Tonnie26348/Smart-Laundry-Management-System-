-- Migration: 20260824_fix_auth_customer_creation_v3.sql

-- Update handle_new_user() to capture phone number and address from user metadata.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_role TEXT;
  safe_full_name TEXT;
  derived_name TEXT;
  v_phone TEXT;
  v_address TEXT;
BEGIN
  -- 1. Secure Role Assignment: Default to 'customer', explicitly ignore privileged roles.
  new_role := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');
  IF new_role NOT IN ('customer') THEN
    new_role := 'customer';
  END IF;

  -- 2. Extract metadata
  v_phone := NEW.raw_user_meta_data->>'phone';
  v_address := NEW.raw_user_meta_data->>'address';

  -- 3. Secure Full Name handling
  derived_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1), 'Customer');
  safe_full_name := TRIM(derived_name);
  IF safe_full_name = '' THEN
    safe_full_name := 'Customer';
  END IF;

  -- 4. Create profile
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id, 
    safe_full_name,
    new_role::public.user_role
  )
  ON CONFLICT (id) DO UPDATE 
    SET full_name = EXCLUDED.full_name,
        role = EXCLUDED.role;

  -- 5. Create customer record if role is customer
  IF new_role = 'customer' THEN
    INSERT INTO public.customers (profile_id, phone, address)
    VALUES (
      NEW.id,
      v_phone,
      v_address
    )
    ON CONFLICT (profile_id) DO UPDATE
      SET phone = EXCLUDED.phone,
          address = EXCLUDED.address;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
