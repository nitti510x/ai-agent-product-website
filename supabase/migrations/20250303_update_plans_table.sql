-- First, add a features column to store the features as JSON
ALTER TABLE plans ADD COLUMN IF NOT EXISTS features JSONB;

-- Clear existing data if needed
-- TRUNCATE TABLE plans;

-- Insert the Starter plan
INSERT INTO plans (
  name,
  description,
  stripe_product_id,
  stripe_price_id,
  amount,
  currency,
  interval,
  features
) VALUES (
  'Starter',
  'Perfect for small teams getting started with AI marketing',
  'prod_starter', -- Replace with actual Stripe product ID
  'price_starter_monthly', -- Replace with actual Stripe price ID
  1500, -- $15.00
  'usd',
  'month',
  '[
    {"icon": "assistant", "text": "1 AI Marketing Assistant"},
    {"icon": "social", "text": "3 Social Media Platforms"},
    {"icon": "analytics", "text": "Basic Analytics"},
    {"icon": "team", "text": "5 Team Members"},
    {"icon": "support", "text": "Standard Support"},
    {"icon": "generation", "text": "1,000 AI Generations/mo"}
  ]'::jsonb
);

-- Insert the Pro plan
INSERT INTO plans (
  name,
  description,
  stripe_product_id,
  stripe_price_id,
  amount,
  currency,
  interval,
  features
) VALUES (
  'Pro',
  'Ideal for growing businesses scaling their marketing',
  'prod_pro', -- Replace with actual Stripe product ID
  'price_pro_monthly', -- Replace with actual Stripe price ID
  3000, -- $30.00
  'usd',
  'month',
  '[
    {"icon": "assistant", "text": "3 AI Marketing Assistants"},
    {"icon": "social", "text": "All Social Platforms"},
    {"icon": "analytics", "text": "Advanced Analytics"},
    {"icon": "team", "text": "15 Team Members"},
    {"icon": "support", "text": "Priority Support"},
    {"icon": "generation", "text": "5,000 AI Generations/mo"},
    {"icon": "template", "text": "Custom Templates"},
    {"icon": "api", "text": "API Access"}
  ]'::jsonb
);

-- Insert the Business plan
INSERT INTO plans (
  name,
  description,
  stripe_product_id,
  stripe_price_id,
  amount,
  currency,
  interval,
  features
) VALUES (
  'Business',
  'Custom solutions for large organizations',
  'prod_business', -- Replace with actual Stripe product ID
  'price_business_monthly', -- Replace with actual Stripe price ID
  7900, -- $79.00
  'usd',
  'month',
  '[
    {"icon": "assistant", "text": "Unlimited AI Assistants"},
    {"icon": "social", "text": "All Social Platforms"},
    {"icon": "analytics", "text": "Enterprise Analytics"},
    {"icon": "team", "text": "Unlimited Team Members"},
    {"icon": "support", "text": "24/7 Dedicated Support"},
    {"icon": "generation", "text": "Unlimited AI Generations"},
    {"icon": "integration", "text": "Custom Integration"},
    {"icon": "sla", "text": "SLA Guarantee"}
  ]'::jsonb
);

-- Insert the Enterprise plan
INSERT INTO plans (
  name,
  description,
  stripe_product_id,
  stripe_price_id,
  amount,
  currency,
  interval,
  features
) VALUES (
  'Enterprise',
  'Tailored solutions for large organizations with custom requirements',
  'prod_enterprise', -- Replace with actual Stripe product ID
  'price_enterprise_custom', -- Replace with actual Stripe price ID
  0, -- Custom pricing
  'usd',
  'month',
  '[
    {"icon": "assistant", "text": "Unlimited AI Assistants"},
    {"icon": "social", "text": "All Social Platforms"},
    {"icon": "analytics", "text": "Enterprise Analytics"},
    {"icon": "integration", "text": "Custom Integrations"},
    {"icon": "account", "text": "Dedicated Account Manager"},
    {"icon": "generation", "text": "Unlimited AI Generations"},
    {"icon": "feature", "text": "Priority Feature Access"},
    {"icon": "sla", "text": "Custom SLA"}
  ]'::jsonb
);
