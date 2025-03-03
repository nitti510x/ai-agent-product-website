-- Populate the plan_features table using the helper function

-- Starter Plan Features
SELECT insert_plan_features('Starter', '[
  {"icon": "assistant", "text": "1 AI Marketing Assistant"},
  {"icon": "social", "text": "3 Social Media Platforms"},
  {"icon": "analytics", "text": "Basic Analytics"},
  {"icon": "team", "text": "5 Team Members"},
  {"icon": "support", "text": "Standard Support"},
  {"icon": "generation", "text": "1,000 AI Generations/mo"}
]'::jsonb);

-- Pro Plan Features
SELECT insert_plan_features('Pro', '[
  {"icon": "assistant", "text": "3 AI Marketing Assistants"},
  {"icon": "social", "text": "All Social Platforms"},
  {"icon": "analytics", "text": "Advanced Analytics"},
  {"icon": "team", "text": "15 Team Members"},
  {"icon": "support", "text": "Priority Support"},
  {"icon": "generation", "text": "5,000 AI Generations/mo"},
  {"icon": "template", "text": "Custom Templates"},
  {"icon": "api", "text": "API Access"}
]'::jsonb);

-- Business Plan Features
SELECT insert_plan_features('Business', '[
  {"icon": "assistant", "text": "Unlimited AI Assistants"},
  {"icon": "social", "text": "All Social Platforms"},
  {"icon": "analytics", "text": "Enterprise Analytics"},
  {"icon": "team", "text": "Unlimited Team Members"},
  {"icon": "support", "text": "24/7 Dedicated Support"},
  {"icon": "generation", "text": "Unlimited AI Generations"},
  {"icon": "integration", "text": "Custom Integration"},
  {"icon": "sla", "text": "SLA Guarantee"}
]'::jsonb);

-- Enterprise Plan Features
SELECT insert_plan_features('Enterprise', '[
  {"icon": "assistant", "text": "Unlimited AI Assistants"},
  {"icon": "social", "text": "All Social Platforms"},
  {"icon": "analytics", "text": "Enterprise Analytics"},
  {"icon": "integration", "text": "Custom Integrations"},
  {"icon": "account", "text": "Dedicated Account Manager"},
  {"icon": "generation", "text": "Unlimited AI Generations"},
  {"icon": "feature", "text": "Priority Feature Access"},
  {"icon": "sla", "text": "Custom SLA"}
]'::jsonb);
