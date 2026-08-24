-- Migration: 20260824_repair_deliveries_schema.sql

-- Add missing columns to the deliveries table to match the approved schema.
ALTER TABLE public.deliveries
ADD COLUMN IF NOT EXISTS pickup_address TEXT;

ALTER TABLE public.deliveries
ADD COLUMN IF NOT EXISTS delivery_address TEXT;
