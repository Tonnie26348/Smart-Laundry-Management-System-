-- Seed Default Inventory Items
-- This will insert the standard items if they do not already exist.

INSERT INTO public.inventory_items (name, sku, current_stock, min_stock_level, unit)
VALUES 
    ('Detergent', 'DET-001', 50.00, 10.00, 'kg'),
    ('Fabric Softener', 'SOF-001', 30.00, 5.00, 'L'),
    ('Bleach', 'BLC-001', 20.00, 5.00, 'L'),
    ('Packaging Bags', 'PKG-001', 500.00, 100.00, 'pcs'),
    ('Hangers', 'HNG-001', 300.00, 50.00, 'pcs'),
    ('Labels', 'LBL-001', 1000.00, 200.00, 'pcs'),
    ('Gloves', 'GLV-001', 50.00, 10.00, 'pairs'),
    ('Cleaning Chemicals', 'CHM-001', 15.00, 3.00, 'L')
ON CONFLICT (sku) DO NOTHING;
