-- Migration: 20260824_add_delivery_address_rls.sql

-- Enable RLS if not already enabled
ALTER TABLE public.delivery_addresses ENABLE ROW LEVEL SECURITY;

-- Allow customers to insert their own delivery addresses
CREATE POLICY "Customers can insert own delivery addresses" 
ON public.delivery_addresses 
FOR INSERT 
WITH CHECK (customer_id IN (SELECT id FROM public.customers WHERE profile_id = auth.uid()));

-- Allow customers to view their own delivery addresses
CREATE POLICY "Customers can view own delivery addresses" 
ON public.delivery_addresses 
FOR SELECT 
USING (customer_id IN (SELECT id FROM public.customers WHERE profile_id = auth.uid()));
