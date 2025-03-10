-- Consolidated Plan Features Migration
-- Combines 20250303_create_plan_features_table.sql, 20250303_update_plans_table.sql, 
-- 20250303_populate_plan_features.sql, and 20250303_create_get_plans_function.sql

-- Create plan_features table
CREATE TABLE IF NOT EXISTS plan_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  feature_value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(plan_id, feature_name)
);

-- Add features column to plans table
ALTER TABLE plans ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '{}'::jsonb;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_plan_features_plan_id ON plan_features(plan_id);

-- Enable RLS on plan_features table
ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;

-- Create policy for plan_features table
CREATE POLICY "Anyone can view plan features" 
  ON plan_features FOR SELECT 
  USING (true);

-- Populate plan features
INSERT INTO plan_features (plan_id, feature_name, feature_value)
SELECT 
  p.id,
  'token_limit',
  jsonb_build_object('monthly_tokens', 
    CASE 
      WHEN p.name = 'Free' THEN 100
      WHEN p.name = 'Basic' THEN 1000
      WHEN p.name = 'Pro' THEN 5000
      WHEN p.name = 'Enterprise' THEN 25000
      ELSE 0
    END
  )
FROM plans p
WHERE NOT EXISTS (
  SELECT 1 FROM plan_features pf 
  WHERE pf.plan_id = p.id AND pf.feature_name = 'token_limit'
);

INSERT INTO plan_features (plan_id, feature_name, feature_value)
SELECT 
  p.id,
  'agent_limit',
  jsonb_build_object('max_agents', 
    CASE 
      WHEN p.name = 'Free' THEN 1
      WHEN p.name = 'Basic' THEN 3
      WHEN p.name = 'Pro' THEN 10
      WHEN p.name = 'Enterprise' THEN 50
      ELSE 0
    END
  )
FROM plans p
WHERE NOT EXISTS (
  SELECT 1 FROM plan_features pf 
  WHERE pf.plan_id = p.id AND pf.feature_name = 'agent_limit'
);

-- Update plans table with features JSON
UPDATE plans p
SET features = (
  SELECT jsonb_object_agg(pf.feature_name, pf.feature_value)
  FROM plan_features pf
  WHERE pf.plan_id = p.id
)
WHERE EXISTS (
  SELECT 1 FROM plan_features pf
  WHERE pf.plan_id = p.id
);

-- Create function to get all plans with features
CREATE OR REPLACE FUNCTION get_plans_with_features()
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  amount INTEGER,
  currency TEXT,
  interval TEXT,
  features JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.amount,
    p.currency,
    p.interval,
    p.features
  FROM plans p
  WHERE p.active = true
  ORDER BY p.amount ASC;
END;
$$ LANGUAGE plpgsql;
