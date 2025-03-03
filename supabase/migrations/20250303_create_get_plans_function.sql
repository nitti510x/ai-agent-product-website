-- Create a function to get all plans with their features
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
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'icon', pf.icon,
            'text', pf.feature_text
          ) ORDER BY pf.sort_order
        )
        FROM plan_features pf
        WHERE pf.plan_id = p.id
      ),
      p.features,  -- Fallback to the features column if plan_features table is not used
      '[]'::jsonb  -- Default empty array if no features found
    ) AS features
  FROM 
    plans p
  WHERE 
    p.active = true
  ORDER BY 
    p.amount;
END;
$$ LANGUAGE plpgsql;

-- Example usage:
-- SELECT * FROM get_plans_with_features();
