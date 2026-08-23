-- Update handle_new_user to also create a customer record
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_role TEXT;
BEGIN
  -- 1. Determine role
  new_role := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');

  -- 2. Create profile
  -- Note: We removed 'email' column as it doesn't exist in the profiles table
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    new_role::public.app_role
  );

  -- 3. Create customer record if role is customer
  IF new_role = 'customer' THEN
    INSERT INTO public.customers (user_id, phone, address)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'phone', '0000000000'),
      NEW.raw_user_meta_data->>'address'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
