-- 1. Update the trigger function to handle customer record creation safely
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_role TEXT;
BEGIN
  BEGIN
    -- Determine role
    new_role := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');

    -- Create profile
    -- Cast the role to public.user_role as required by the table column
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
      NEW.id, 
      NEW.raw_user_meta_data->>'full_name',
      new_role::public.user_role
    );

    -- Create customer record if role is customer
    IF new_role = 'customer' THEN
      INSERT INTO public.customers (user_id, phone, address)
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'phone', '0000000000'),
        NEW.raw_user_meta_data->>'address'
      );
    END IF;

  EXCEPTION WHEN OTHERS THEN
    -- Log errors to debug_logs table
    INSERT INTO public.debug_logs (message) 
    VALUES ('Trigger error: ' || SQLERRM || ' | Details: ' || SQLSTATE);
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
