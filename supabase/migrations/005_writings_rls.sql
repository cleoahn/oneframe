-- Enable RLS and policies for writings
ALTER TABLE writings ENABLE ROW LEVEL SECURITY;

-- Select own writings
CREATE POLICY writings_select_own
  ON writings FOR SELECT
  USING (user_id = auth.uid());

-- Insert own writings
CREATE POLICY writings_insert_own
  ON writings FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Update own writings
CREATE POLICY writings_update_own
  ON writings FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

