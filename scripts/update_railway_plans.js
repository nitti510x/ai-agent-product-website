import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Railway PostgreSQL connection
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // Disable SSL
});

// Plan data from the pricing page
const plans = [
  {
    name: 'Starter',
    description: 'Perfect for small teams getting started with AI marketing',
    stripe_product_id: 'prod_starter', // Replace with actual Stripe product ID
    stripe_price_id: 'price_starter_monthly', // Replace with actual Stripe price ID
    amount: 1500, // $15.00
    currency: 'usd',
    interval: 'month',
    features: JSON.stringify([
      { icon: 'assistant', text: '1 AI Marketing Assistant' },
      { icon: 'social', text: '3 Social Media Platforms' },
      { icon: 'analytics', text: 'Basic Analytics' },
      { icon: 'team', text: '5 Team Members' },
      { icon: 'support', text: 'Standard Support' },
      { icon: 'generation', text: '1,000 AI Generations/mo' }
    ])
  },
  {
    name: 'Pro',
    description: 'Ideal for growing businesses scaling their marketing',
    stripe_product_id: 'prod_pro', // Replace with actual Stripe product ID
    stripe_price_id: 'price_pro_monthly', // Replace with actual Stripe price ID
    amount: 3000, // $30.00
    currency: 'usd',
    interval: 'month',
    features: JSON.stringify([
      { icon: 'assistant', text: '3 AI Marketing Assistants' },
      { icon: 'social', text: 'All Social Platforms' },
      { icon: 'analytics', text: 'Advanced Analytics' },
      { icon: 'team', text: '15 Team Members' },
      { icon: 'support', text: 'Priority Support' },
      { icon: 'generation', text: '5,000 AI Generations/mo' },
      { icon: 'template', text: 'Custom Templates' },
      { icon: 'api', text: 'API Access' }
    ])
  },
  {
    name: 'Business',
    description: 'Custom solutions for large organizations',
    stripe_product_id: 'prod_business', // Replace with actual Stripe product ID
    stripe_price_id: 'price_business_monthly', // Replace with actual Stripe price ID
    amount: 7900, // $79.00
    currency: 'usd',
    interval: 'month',
    features: JSON.stringify([
      { icon: 'assistant', text: 'Unlimited AI Assistants' },
      { icon: 'social', text: 'All Social Platforms' },
      { icon: 'analytics', text: 'Enterprise Analytics' },
      { icon: 'team', text: 'Unlimited Team Members' },
      { icon: 'support', text: '24/7 Dedicated Support' },
      { icon: 'generation', text: 'Unlimited AI Generations' },
      { icon: 'integration', text: 'Custom Integration' },
      { icon: 'sla', text: 'SLA Guarantee' }
    ])
  },
  {
    name: 'Enterprise',
    description: 'Tailored solutions for large organizations with custom requirements',
    stripe_product_id: 'prod_enterprise', // Replace with actual Stripe product ID
    stripe_price_id: 'price_enterprise_custom', // Replace with actual Stripe price ID
    amount: 0, // Custom pricing
    currency: 'usd',
    interval: 'month',
    features: JSON.stringify([
      { icon: 'assistant', text: 'Unlimited AI Assistants' },
      { icon: 'social', text: 'All Social Platforms' },
      { icon: 'analytics', text: 'Enterprise Analytics' },
      { icon: 'integration', text: 'Custom Integrations' },
      { icon: 'account', text: 'Dedicated Account Manager' },
      { icon: 'generation', text: 'Unlimited AI Generations' },
      { icon: 'feature', text: 'Priority Feature Access' },
      { icon: 'sla', text: 'Custom SLA' }
    ])
  }
];

// Function to check if the plans table exists
async function checkPlansTable() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public'
          AND table_name = 'plans'
        );
      `);
      return result.rows[0].exists;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error checking plans table:', err);
    throw err;
  }
}

// Function to create the plans table if it doesn't exist
async function createPlansTable() {
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS plans (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT,
          stripe_product_id TEXT NOT NULL,
          stripe_price_id TEXT NOT NULL,
          amount INTEGER NOT NULL,
          currency TEXT NOT NULL DEFAULT 'usd',
          interval TEXT NOT NULL,
          interval_count INTEGER NOT NULL DEFAULT 1,
          trial_period_days INTEGER,
          features JSONB,
          active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(stripe_product_id),
          UNIQUE(stripe_price_id)
        );
      `);
      console.log('Plans table created or already exists');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error creating plans table:', err);
    throw err;
  }
}

// Function to check if a column exists in the plans table
async function checkColumnExists(columnName) {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public'
          AND table_name = 'plans'
          AND column_name = $1
        );
      `, [columnName]);
      return result.rows[0].exists;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(`Error checking if column ${columnName} exists:`, err);
    throw err;
  }
}

// Function to add the features column if it doesn't exist
async function addFeaturesColumn() {
  try {
    const featuresExists = await checkColumnExists('features');
    if (!featuresExists) {
      const client = await pool.connect();
      try {
        await client.query(`
          ALTER TABLE plans 
          ADD COLUMN features JSONB;
        `);
        console.log('Added features column to plans table');
      } finally {
        client.release();
      }
    } else {
      console.log('Features column already exists');
    }
  } catch (err) {
    console.error('Error adding features column:', err);
    throw err;
  }
}

// Function to update or insert plans
async function upsertPlans() {
  try {
    const client = await pool.connect();
    try {
      for (const plan of plans) {
        // Check if plan exists
        const checkResult = await client.query(
          'SELECT id FROM plans WHERE name = $1',
          [plan.name]
        );
        
        if (checkResult.rows.length > 0) {
          // Update existing plan
          await client.query(`
            UPDATE plans 
            SET 
              description = $1,
              stripe_product_id = $2,
              stripe_price_id = $3,
              amount = $4,
              currency = $5,
              interval = $6,
              features = $7::jsonb,
              updated_at = NOW()
            WHERE name = $8
          `, [
            plan.description,
            plan.stripe_product_id,
            plan.stripe_price_id,
            plan.amount,
            plan.currency,
            plan.interval,
            plan.features,
            plan.name
          ]);
          console.log(`Updated plan: ${plan.name}`);
        } else {
          // Insert new plan
          await client.query(`
            INSERT INTO plans (
              name,
              description,
              stripe_product_id,
              stripe_price_id,
              amount,
              currency,
              interval,
              features
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)
          `, [
            plan.name,
            plan.description,
            plan.stripe_product_id,
            plan.stripe_price_id,
            plan.amount,
            plan.currency,
            plan.interval,
            plan.features
          ]);
          console.log(`Inserted plan: ${plan.name}`);
        }
      }
      console.log('All plans have been updated or inserted');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error upserting plans:', err);
    throw err;
  }
}

// Main function to run the script
async function main() {
  try {
    console.log('Connecting to Railway PostgreSQL database...');
    
    // Check if plans table exists, create if it doesn't
    const tableExists = await checkPlansTable();
    if (!tableExists) {
      await createPlansTable();
    }
    
    // Add features column if it doesn't exist
    await addFeaturesColumn();
    
    // Update or insert plans
    await upsertPlans();
    
    console.log('Script completed successfully!');
  } catch (err) {
    console.error('Script failed:', err);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the script
main();
