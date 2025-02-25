/*
  # AI Agents Schema

  1. New Tables
    - `ai_agents`
      - `id` (uuid, primary key)
      - `name` (text)
      - `status` (text)
      - `response_time` (text)
      - `model` (text)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `agent_activities`
      - `id` (uuid, primary key)
      - `agent_id` (uuid, foreign key to ai_agents)
      - `type` (text)
      - `channel` (text)
      - `content` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to:
      - Read their own agents and activities
      - Create new agents and activities
      - Update their own agents
      - Delete their own agents (which cascades to activities)
*/

-- Create ai_agents table
CREATE TABLE IF NOT EXISTS ai_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'inactive',
  response_time text NOT NULL DEFAULT 'normal',
  model text NOT NULL DEFAULT 'gpt-3.5',
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('active', 'inactive')),
  CONSTRAINT valid_response_time CHECK (response_time IN ('fast', 'normal', 'thorough')),
  CONSTRAINT valid_model CHECK (model IN ('gpt-4', 'gpt-3.5', 'claude'))
);

-- Create agent_activities table
CREATE TABLE IF NOT EXISTS agent_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
  type text NOT NULL,
  channel text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_type CHECK (type IN ('response', 'analysis', 'error', 'status_change'))
);

-- Enable Row Level Security
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_activities ENABLE ROW LEVEL SECURITY;

-- Policies for ai_agents
CREATE POLICY "Users can view their own agents"
  ON ai_agents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create agents"
  ON ai_agents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agents"
  ON ai_agents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agents"
  ON ai_agents
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for agent_activities
CREATE POLICY "Users can view activities of their agents"
  ON agent_activities
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_agents
      WHERE ai_agents.id = agent_activities.agent_id
      AND ai_agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create activities for their agents"
  ON agent_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_agents
      WHERE ai_agents.id = agent_activities.agent_id
      AND ai_agents.user_id = auth.uid()
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for ai_agents
CREATE TRIGGER update_ai_agents_updated_at
  BEFORE UPDATE
  ON ai_agents
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_agents_user_id ON ai_agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_activities_agent_id ON agent_activities(agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_agents_status ON ai_agents(status);
CREATE INDEX IF NOT EXISTS idx_agent_activities_created_at ON agent_activities(created_at DESC);
