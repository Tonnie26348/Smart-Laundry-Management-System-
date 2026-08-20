-- RPC for updating stock
CREATE OR REPLACE FUNCTION update_stock(item_id UUID, quantity DECIMAL, type TEXT)
RETURNS VOID AS $$
BEGIN
    IF type = 'addition' THEN
        UPDATE inventory_items SET current_stock = current_stock + quantity WHERE id = item_id;
    ELSE
        UPDATE inventory_items SET current_stock = current_stock - quantity WHERE id = item_id;
    END IF;
    
    INSERT INTO inventory_transactions (item_id, type, quantity, performed_by)
    VALUES (item_id, type, quantity, auth.uid());
END;
$$ LANGUAGE plpgsql;
