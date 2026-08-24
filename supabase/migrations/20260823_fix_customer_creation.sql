-- 1. Create the app_role enum type if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE app_role AS ENUM (
            'administrator',
            'manager',
            'laundry_staff',
            'delivery_staff',
            'customer'
        );
    END IF;
END$$;

-- 2. Update the trigger function to handle customer record creation safely
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_role TEXT;
BEGIN
  BEGIN
    -- 1. Determine role
    new_role := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');

    -- 2. Create profile (safely casting the role string to our enum)
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

  EXCEPTION WHEN OTHERS THEN
    -- Log any other errors to our debug table so we can see it
    INSERT INTO public.debug_logs (message) 
    VALUES ('Trigger error: ' || SQLERRM || ' | Details: ' || SQLSTATE);
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-enable the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
