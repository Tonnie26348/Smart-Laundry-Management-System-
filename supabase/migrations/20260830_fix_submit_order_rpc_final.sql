-- Drop the old function
DROP FUNCTION IF EXISTS public.submit_order_atomic(UUID, JSONB, JSONB, JSONB);

-- Atomic RPC function
CREATE OR REPLACE FUNCTION public.submit_order_atomic(
  p_customer_id UUID,
  p_items JSONB,
  p_pickup_address_data JSONB,
  p_delivery_address_data JSONB
)
RETURNS JSONB AS $$
DECLARE
  v_customer_id UUID;
  v_order_id UUID;
  v_pickup_addr_id UUID;
  v_delivery_addr_id UUID;
  v_total_price DECIMAL(10,2) := 0;
  v_item RECORD;
  v_unit_price DECIMAL(10,2);
  v_line_total DECIMAL(10,2);
  v_mapping_id UUID;
  
  -- Variables to hold raw address strings
  v_pickup_addr_text TEXT;
  v_delivery_addr_text TEXT;
BEGIN
  -- 1. Validate Auth & Ownership
  SELECT id INTO v_customer_id
  FROM public.customers
  WHERE id = p_customer_id AND profile_id = auth.uid();
  
  IF v_customer_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized customer';
  END IF;

  -- 2. Validate Items
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  -- 3. Create Addresses
  v_pickup_addr_text := (p_pickup_address_data->>'address_line1') || ', ' || (p_pickup_address_data->>'city');
  v_delivery_addr_text := (p_delivery_address_data->>'address_line1') || ', ' || (p_delivery_address_data->>'city');

  INSERT INTO public.delivery_addresses (customer_id, label, address_line1, address_line2, city, postal_code)
  VALUES (
    v_customer_id, 'Pickup',
    (p_pickup_address_data->>'address_line1'),
    (p_pickup_address_data->>'address_line2'),
    (p_pickup_address_data->>'city'),
    (p_pickup_address_data->>'postal_code')
  ) RETURNING id INTO v_pickup_addr_id;

  INSERT INTO public.delivery_addresses (customer_id, label, address_line1, address_line2, city, postal_code)
  VALUES (
    v_customer_id, 'Delivery',
    (p_delivery_address_data->>'address_line1'),
    (p_delivery_address_data->>'address_line2'),
    (p_delivery_address_data->>'city'),
    (p_delivery_address_data->>'postal_code')
  ) RETURNING id INTO v_delivery_addr_id;

  -- 4. Create Order (Initial)
  INSERT INTO public.orders (customer_id, status, total_amount)
  VALUES (v_customer_id, 'pending', 0)
  RETURNING id INTO v_order_id;

  -- 5. Process Items
  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(laundry_item_id UUID, service_id UUID, quantity INTEGER)
  LOOP
    SELECT lis.id, (s.base_price + lis.price_adjustment)
    INTO v_mapping_id, v_unit_price
    FROM public.laundry_item_services lis
    JOIN public.services s ON lis.service_id = s.id
    JOIN public.laundry_items li ON lis.laundry_item_id = li.id
    WHERE lis.laundry_item_id = v_item.laundry_item_id
      AND lis.service_id = v_item.service_id
      AND lis.is_active = true
      AND li.is_active = true
      AND s.is_active = true;

    v_line_total := v_unit_price * v_item.quantity;
    v_total_price := v_total_price + v_line_total;

    INSERT INTO public.order_items (order_id, laundry_item_id, laundry_item_service_id, quantity, unit_price, line_total)
    VALUES (v_order_id, v_item.laundry_item_id, v_mapping_id, v_item.quantity, v_unit_price, v_line_total);
  END LOOP;

  -- 6. Update Order Total
  UPDATE public.orders SET total_amount = v_total_price WHERE id = v_order_id;

  -- 7. Create Deliveries (Matched exactly to verified schema)
  INSERT INTO public.deliveries (
    order_id, 
    customer_id, 
    pickup_address_id, 
    delivery_address_id, 
    pickup_address, 
    delivery_address, 
    status
  )
  VALUES (
    v_order_id, 
    v_customer_id, 
    v_pickup_addr_id, 
    v_delivery_addr_id, 
    v_pickup_addr_text, 
    v_delivery_addr_text, 
    'pending'
  );

  -- 8. Create Payment
  INSERT INTO public.payments (order_id, amount, status)
  VALUES (v_order_id, v_total_price, 'pending');

  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'total_amount', v_total_price,
    'status', 'pending'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
