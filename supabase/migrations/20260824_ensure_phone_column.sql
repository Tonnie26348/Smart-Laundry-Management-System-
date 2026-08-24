-- Ensure the phone column exists in the customers table.
-- If it already exists, this will simply do nothing.
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name='customers' AND column_name='phone'
  ) THEN
    ALTER TABLE public.customers ADD COLUMN phone TEXT;
  END IF;
END $$;
