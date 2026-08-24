-- Migration: 20260824_add_order_item_service_reference.sql

-- Add laundry_item_service_id to order_items for new orders
ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS laundry_item_service_id UUID REFERENCES public.laundry_item_services(id);

-- Make it nullable for now to support backward compatibility with historical orders
-- The application logic will ensure it is set for new orders.
