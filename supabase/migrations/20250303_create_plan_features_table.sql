-- Create a separate table for plan features
CREATE TABLE IF NOT EXISTS plan_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  icon TEXT NOT NULL,
  feature_text TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;

-- Create policy for reading plan features
CREATE POLICY "Anyone can read plan features" ON plan_features
  FOR SELECT USING (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_plan_features_plan_id ON plan_features(plan_id);

-- Helper function to insert plan features
CREATE OR REPLACE FUNCTION insert_plan_features(
  p_plan_name TEXT,
  p_features JSONB
) RETURNS VOID AS $$
DECLARE
  v_plan_id UUID;
  v_feature JSONB;
  v_index INTEGER;
BEGIN
  -- Get the plan ID
  SELECT id INTO v_plan_id FROM plans WHERE name = p_plan_name;
  
  IF v_plan_id IS NULL THEN
    RAISE EXCEPTION 'Plan with name % not found', p_plan_name;
  END IF;
  
  -- Delete existing features for this plan
  DELETE FROM plan_features WHERE plan_id = v_plan_id;
  
  -- Insert new features
  v_index := 0;
  FOR v_feature IN SELECT * FROM jsonb_array_elements(p_features)
  LOOP
    INSERT INTO plan_features (
      plan_id,
      icon,
      feature_text,
      sort_order
    ) VALUES (
      v_plan_id,
      v_feature->>'icon',
      v_feature->>'text',
      v_index
    );
    v_index := v_index + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Example of how to use the function:
-- SELECT insert_plan_features('Starter', '[
--   {"icon": "assistant", "text": "1 AI Marketing Assistant"},
--   {"icon": "social", "text": "3 Social Media Platforms"}
-- ]'::jsonb);
