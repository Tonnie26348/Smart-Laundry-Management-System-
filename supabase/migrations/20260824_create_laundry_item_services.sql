-- Migration: 20260824_create_laundry_item_services.sql

CREATE TABLE public.laundry_item_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    laundry_item_id UUID NOT NULL REFERENCES public.laundry_items(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    price_adjustment NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(laundry_item_id, service_id)
);

-- Indexes for performance
CREATE INDEX idx_laundry_item_services_laundry_item_id ON public.laundry_item_services(laundry_item_id);
CREATE INDEX idx_laundry_item_services_service_id ON public.laundry_item_services(service_id);
CREATE INDEX idx_laundry_item_services_is_active ON public.laundry_item_services(is_active);

-- Enable RLS
ALTER TABLE public.laundry_item_services ENABLE ROW LEVEL SECURITY;

-- Policies: Everyone can view active catalog mappings
CREATE POLICY "Everyone can view active pricing mappings" 
ON public.laundry_item_services FOR SELECT USING (is_active = true);

-- Policies: Admin/Manager can manage all
CREATE POLICY "Admin/Manager can manage pricing mappings" 
ON public.laundry_item_services FOR ALL USING (get_user_role(auth.uid()) IN ('administrator', 'manager'));

-- Trigger for updated_at (reusing existing set_updated_at function)
CREATE TRIGGER update_laundry_item_services_updated_at
    BEFORE UPDATE ON public.laundry_item_services
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
