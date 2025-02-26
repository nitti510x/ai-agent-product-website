/*
  # Subscription and Token Management Schema

  This migration adds tables for managing user subscriptions and token usage:
  
  1. New Tables:
    - `subscriptions` - Stores user subscription information
    - `plans` - Available subscription plans
    - `subscription_events` - Tracks subscription lifecycle events
    - `user_tokens` - Tracks token balances for users
    - `token_transactions` - Records token purchases and usage
    - `token_packages` - Available token packages for purchase
  
  2. Security:
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read their own subscription and token data
      - Create and update their own subscription and token data
*/

-- Create enum for subscription status
CREATE TYPE subscription_status AS ENUM (
  'active', 
  'canceled', 
  'past_due', 
  'trialing', 
  'incomplete', 
  'incomplete_expired'
);

-- Create plans table to store available subscription plans
CREATE TABLE IF NOT EXISTS plans (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  interval VARCHAR(20) NOT NULL, -- 'month', 'year', etc.
  features JSONB,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) NOT NULL REFERENCES plans(id),
  status subscription_status NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- Create subscription_events table to track subscription lifecycle events
CREATE TABLE IF NOT EXISTS subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- 'created', 'updated', 'canceled', etc.
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_tokens table to track token balances
CREATE TABLE IF NOT EXISTS user_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create token_transactions table to track token purchases and usage
CREATE TABLE IF NOT EXISTS token_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type VARCHAR(20) NOT NULL, -- 'purchase', 'usage', 'refund', 'subscription_grant'
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_transaction_type CHECK (
    transaction_type IN ('purchase', 'usage', 'refund', 'subscription_grant')
  )
);

-- Create token_packages table for purchasable token packages
CREATE TABLE IF NOT EXISTS token_packages (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  token_amount INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default token packages
INSERT INTO token_packages (id, name, description, token_amount, price)
VALUES
  ('small', 'Small Token Pack', '1,000 additional tokens', 1000, 4.99),
  ('medium', 'Medium Token Pack', '5,000 additional tokens', 5000, 19.99),
  ('large', 'Large Token Pack', '15,000 additional tokens', 15000, 49.99)
ON CONFLICT (id) DO NOTHING;

-- Insert default plans
INSERT INTO plans (id, name, description, price, interval, features)
VALUES 
  ('basic', 'Basic Plan', 'Basic features for individual users', 9.99, 'month', 
   '{"feature_limits": {"agents": 2, "requests": 100, "tokens": 1000}}'),
  ('pro', 'Professional Plan', 'Advanced features for professionals', 19.99, 'month', 
   '{"feature_limits": {"agents": 5, "requests": 500, "tokens": 5000}}'),
  ('enterprise', 'Enterprise Plan', 'Full access for teams', 49.99, 'month', 
   '{"feature_limits": {"agents": 20, "requests": 2000, "tokens": 20000}}')
ON CONFLICT (id) DO NOTHING;

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

-- Create trigger for token_packages table
CREATE TRIGGER update_token_packages_updated_at
BEFORE UPDATE ON token_packages
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_subscription_id ON subscription_events(subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_tokens_user_id ON user_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_token_transactions_user_id ON token_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_token_transactions_created_at ON token_transactions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_packages ENABLE ROW LEVEL SECURITY;

-- Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for subscription_events
CREATE POLICY "Users can view their own subscription events"
  ON subscription_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions
      WHERE subscriptions.id = subscription_events.subscription_id
      AND subscriptions.user_id = auth.uid()
    )
  );

-- Policies for user_tokens
CREATE POLICY "Users can view their own token balance"
  ON user_tokens
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own token balance"
  ON user_tokens
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own token balance"
  ON user_tokens
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for token_transactions
CREATE POLICY "Users can view their own token transactions"
  ON token_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own token transactions"
  ON token_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for plans (read-only for authenticated users)
CREATE POLICY "Users can view all plans"
  ON plans
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for token_packages (read-only for authenticated users)
CREATE POLICY "Users can view all token packages"
  ON token_packages
  FOR SELECT
  TO authenticated
  USING (true);

-- Create function to grant tokens when a subscription is created
CREATE OR REPLACE FUNCTION grant_subscription_tokens()
RETURNS TRIGGER AS $$
DECLARE
  token_limit INTEGER;
BEGIN
  -- Get the token limit from the plan
  SELECT (features->'feature_limits'->>'tokens')::INTEGER INTO token_limit
  FROM plans
  WHERE id = NEW.plan_id;
  
  IF token_limit IS NOT NULL AND token_limit > 0 THEN
    -- Insert a token transaction
    INSERT INTO token_transactions (
      user_id, 
      amount, 
      transaction_type, 
      description,
      metadata
    )
    VALUES (
      NEW.user_id,
      token_limit,
      'subscription_grant',
      'Initial tokens from ' || NEW.plan_id || ' subscription',
      json_build_object('subscription_id', NEW.id)
    );
    
    -- Update or create user token balance
    INSERT INTO user_tokens (user_id, balance)
    VALUES (NEW.user_id, token_limit)
    ON CONFLICT (user_id) DO UPDATE
    SET balance = user_tokens.balance + token_limit,
        last_updated = NOW();
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to grant tokens on subscription creation
CREATE TRIGGER grant_subscription_tokens_trigger
AFTER INSERT ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION grant_subscription_tokens();

-- Create function to process token purchases
CREATE OR REPLACE FUNCTION process_token_purchase()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process purchase transactions
  IF NEW.transaction_type = 'purchase' THEN
    -- Update user token balance
    INSERT INTO user_tokens (user_id, balance)
    VALUES (NEW.user_id, NEW.amount)
    ON CONFLICT (user_id) DO UPDATE
    SET balance = user_tokens.balance + NEW.amount,
        last_updated = NOW();
  -- Process usage transactions (negative amounts)
  ELSIF NEW.transaction_type = 'usage' AND NEW.amount < 0 THEN
    -- Update user token balance
    UPDATE user_tokens
    SET balance = balance + NEW.amount, -- amount is negative
        last_updated = NOW()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to process token purchases
CREATE TRIGGER process_token_purchase_trigger
AFTER INSERT ON token_transactions
FOR EACH ROW
EXECUTE FUNCTION process_token_purchase();
