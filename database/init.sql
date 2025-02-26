-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- Create enum for subscription status
CREATE TYPE IF NOT EXISTS subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'incomplete', 'incomplete_expired');

-- Create plans table to store available subscription plans
CREATE TABLE IF NOT EXISTS plans (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  interval VARCHAR(20) NOT NULL, -- 'month', 'year', etc.
  features JSONB,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some default plans
INSERT INTO plans (id, name, description, price, interval, features)
VALUES 
  ('basic', 'Basic Plan', 'Basic features for individual users', 9.99, 'month', '{"feature_limits": {"agents": 2, "requests": 100}}'),
  ('pro', 'Professional Plan', 'Advanced features for professionals', 19.99, 'month', '{"feature_limits": {"agents": 5, "requests": 500}}'),
  ('enterprise', 'Enterprise Plan', 'Full access for teams', 49.99, 'month', '{"feature_limits": {"agents": 20, "requests": 2000}}')
ON CONFLICT (id) DO NOTHING;

-- Create subscription_events table to track subscription lifecycle events
CREATE TABLE IF NOT EXISTS subscription_events (
  id SERIAL PRIMARY KEY,
  subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- 'created', 'updated', 'canceled', etc.
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for subscription events
CREATE INDEX IF NOT EXISTS idx_subscription_events_subscription_id ON subscription_events(subscription_id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for subscriptions table
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create trigger for plans table
CREATE TRIGGER update_plans_updated_at
BEFORE UPDATE ON plans
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create function to log subscription events
CREATE OR REPLACE FUNCTION log_subscription_event()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO subscription_events (subscription_id, event_type, event_data)
    VALUES (NEW.id, 'created', row_to_json(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    -- Only log if certain fields change
    IF NEW.status != OLD.status OR NEW.cancel_at_period_end != OLD.cancel_at_period_end OR NEW.current_period_end != OLD.current_period_end THEN
      INSERT INTO subscription_events (subscription_id, event_type, event_data)
      VALUES (NEW.id, 'updated', json_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW)));
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for subscription events
CREATE TRIGGER log_subscription_changes
AFTER INSERT OR UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION log_subscription_event();
