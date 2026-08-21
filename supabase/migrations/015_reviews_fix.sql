-- 1. Refine RLS for reviews
DROP POLICY IF EXISTS "Customers can insert own reviews" ON reviews;

CREATE POLICY "Customers can insert own reviews" ON reviews FOR INSERT WITH CHECK (
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
    AND order_id IN (SELECT id FROM orders WHERE status = 'completed')
);

-- 2. Add constraint to ensure order is completed (via trigger/check)
CREATE OR REPLACE FUNCTION check_review_eligibility()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM orders WHERE id = NEW.order_id AND status = 'completed') THEN
        RAISE EXCEPTION 'Review can only be submitted for completed orders';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_review_eligibility_trigger
BEFORE INSERT ON reviews
FOR EACH ROW EXECUTE PROCEDURE check_review_eligibility();
