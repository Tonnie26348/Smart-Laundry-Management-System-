-- Migration: 20260824_create_submit_order_rpc.sql

-- RPC to submit an order atomically
CREATE OR REPLACE FUNCTION public.submit_order(
  p_customer_id UUID,
  p_items JSONB,
  p_pickup_address_line1 TEXT,
  p_pickup_city TEXT,
  p_delivery_address_line1 TEXT,
  p_delivery_city TEXT,
  p_total_amount DECIMAL
)
RETURNS UUID AS $$
DECLARE
  v_order_id UUID;
  v_pickup_addr_id UUID;
  v_delivery_addr_id UUID;
BEGIN
  -- 1. Create Order
  INSERT INTO public.orders (customer_id, status, total_amount)
  VALUES (p_customer_id, 'pending', p_total_amount)
  RETURNING id INTO v_order_id;

  -- 2. Create Pickup Address
  INSERT INTO public.delivery_addresses (customer_id, address_line1, city, label)
  VALUES (p_customer_id, p_pickup_address_line1, p_pickup_city, 'Pickup')
  RETURNING id INTO v_pickup_addr_id;

  -- 3. Create Delivery Address
  INSERT INTO public.delivery_addresses (customer_id, address_line1, city, label)
  VALUES (p_customer_id, p_delivery_address_line1, p_delivery_city, 'Delivery')
  RETURNING id INTO v_delivery_addr_id;

  -- 4. Create Deliveries
  INSERT INTO public.deliveries (order_id, delivery_type, pickup_address_id, pickup_address, delivery_address_id, delivery_address, status)
  VALUES 
    (v_order_id, 'pickup', v_pickup_addr_id, p_pickup_address_line1, NULL, NULL, 'pending'),
    (v_order_id, 'delivery', NULL, NULL, v_delivery_addr_id, p_delivery_address_line1, 'pending');

  -- 5. Create Order Items (simplified for now based on items JSONB)
  -- This assumes p_items is an array of objects: [{item_id, quantity, price}]
  INSERT INTO public.order_items (order_id, item_id, quantity, price_at_time)
  SELECT v_order_id, (item->>'item_id')::UUID, (item->>'quantity')::INTEGER, (item->>'price')::DECIMAL
  FROM jsonb_array_elements(p_items) AS item;

  -- 6. Create Payment Record (Placeholder)
  INSERT INTO public.payments (order_id, amount, status)
  VALUES (v_order_id, p_total_amount, 'pending');

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
