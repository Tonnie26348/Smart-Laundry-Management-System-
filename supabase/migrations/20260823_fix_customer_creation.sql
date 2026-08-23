-- Update handle_new_user to also create a customer record
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Create profile
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name', 
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'customer'::app_role)
  );

  -- 2. Create customer record if role is customer
  IF COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'customer'::app_role) = 'customer' THEN
    INSERT INTO public.customers (user_id, phone, address)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'phone',
      NEW.raw_user_meta_data->>'address'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
