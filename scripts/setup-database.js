// This script sets up the database tables and initial data for the application
// Run with: node --experimental-json-modules scripts/setup-database.js

import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '..', '.env.development') });

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Setting up database tables...');
    
    // Create plans table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS plans (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2),
        interval VARCHAR(20) NOT NULL,
        features JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Create subscriptions table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL,
        plan_id VARCHAR(50) NOT NULL REFERENCES plans(id),
        status VARCHAR(20) NOT NULL,
        current_period_start TIMESTAMP WITH TIME ZONE,
        current_period_end TIMESTAMP WITH TIME ZONE,
        cancel_at_period_end BOOLEAN DEFAULT FALSE,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Check if plans exist
    const plansResult = await client.query('SELECT COUNT(*) FROM plans');
    const plansCount = parseInt(plansResult.rows[0].count);
    
    // Insert default plans if none exist
    if (plansCount === 0) {
      console.log('Inserting default plans...');
      
      // Free plan
      await client.query(`
        INSERT INTO plans (id, name, description, price, interval, features)
        VALUES (
          'plan_free',
          'Free Trial',
          'Perfect for teams ready to revolutionize their social media strategy',
          0.00,
          'month',
          '{"icon":"credit","text":"50 credits (free)","feature_limits":{"agents":1,"requests":50,"channels":2,"tokens":50}}'
        );
      `);
      
      // Starter plan
      await client.query(`
        INSERT INTO plans (id, name, description, price, interval, features)
        VALUES (
          'plan_starter',
          'Starter',
          'Perfect for small teams getting started with AI marketing',
          15.00,
          'month',
          '{"icon":"assistant","text":"1 AI Marketing Assistant","feature_limits":{"agents":2,"requests":100,"channels":5,"tokens":1000}}'
        );
      `);
      
      // Pro plan
      await client.query(`
        INSERT INTO plans (id, name, description, price, interval, features)
        VALUES (
          'plan_pro',
          'Pro',
          'Ideal for growing businesses scaling their marketing',
          30.00,
          'month',
          '{"icon":"assistant","text":"3 AI Marketing Assistants","feature_limits":{"agents":5,"requests":500,"channels":15,"tokens":5000}}'
        );
      `);
      
      // Business plan
      await client.query(`
        INSERT INTO plans (id, name, description, price, interval, features)
        VALUES (
          'plan_business',
          'Business',
          'Custom solutions for large organizations',
          79.00,
          'month',
          '{"icon":"assistant","text":"Unlimited AI Marketing Assistants","feature_limits":{"agents":20,"requests":2000,"channels":"Unlimited","tokens":20000}}'
        );
      `);
      
      // Enterprise plan
      await client.query(`
        INSERT INTO plans (id, name, description, price, interval, features)
        VALUES (
          'plan_enterprise',
          'Enterprise',
          'Tailored solutions for large organizations with custom requirements',
          0.00,
          'month',
          '{"icon":"assistant","text":"Unlimited AI Marketing Assistants","feature_limits":{"agents":"Unlimited","requests":"Unlimited","channels":"Unlimited","tokens":"Unlimited"}}'
        );
      `);
      
      console.log('Default plans inserted successfully!');
    } else {
      console.log(`Found ${plansCount} existing plans. Skipping default plan creation.`);
    }
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase().catch(console.error);
