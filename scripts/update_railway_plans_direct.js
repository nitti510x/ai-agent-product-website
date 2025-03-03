import pg from 'pg';

// Railway PostgreSQL connection
const { Pool } = pg;
const pool = new Pool({
  connectionString: 'postgresql://postgres:QZLxtAAYlkHPKWcXwbRGlrJpWjuvfEan@metro.proxy.rlwy.net:44666/railway',
  ssl: false // Disable SSL
});

// Plan data from the pricing page
const plans = [
  {
    id: 'plan_starter',
    name: 'Starter',
    description: 'Perfect for small teams getting started with AI marketing',
    stripe_product_id: 'prod_starter', // Replace with actual Stripe product ID
    stripe_price_id: 'price_starter_monthly', // Replace with actual Stripe price ID
    price: 15.00,
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
    id: 'plan_pro',
    name: 'Pro',
    description: 'Ideal for growing businesses scaling their marketing',
    stripe_product_id: 'prod_pro', // Replace with actual Stripe product ID
    stripe_price_id: 'price_pro_monthly', // Replace with actual Stripe price ID
    price: 30.00,
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
    id: 'plan_business',
    name: 'Business',
    description: 'Custom solutions for large organizations',
    stripe_product_id: 'prod_business', // Replace with actual Stripe product ID
    stripe_price_id: 'price_business_monthly', // Replace with actual Stripe price ID
    price: 79.00,
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
    id: 'plan_enterprise',
    name: 'Enterprise',
    description: 'Tailored solutions for large organizations with custom requirements',
    stripe_product_id: 'prod_enterprise', // Replace with actual Stripe product ID
    stripe_price_id: 'price_enterprise_custom', // Replace with actual Stripe price ID
    price: 0.00, // Custom pricing
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

// Function to update or insert plans
async function upsertPlans() {
  try {
    const client = await pool.connect();
    try {
      for (const plan of plans) {
        // Check if plan exists
        const checkResult = await client.query(
          'SELECT id FROM plans WHERE id = $1',
          [plan.id]
        );
        
        if (checkResult.rows.length > 0) {
          // Update existing plan
          await client.query(`
            UPDATE plans 
            SET 
              name = $1,
              description = $2,
              stripe_product_id = $3,
              stripe_price_id = $4,
              price = $5,
              interval = $6,
              features = $7::jsonb,
              active = true,
              updated_at = NOW()
            WHERE id = $8
          `, [
            plan.name,
            plan.description,
            plan.stripe_product_id,
            plan.stripe_price_id,
            plan.price,
            plan.interval,
            plan.features,
            plan.id
          ]);
          console.log(`Updated plan: ${plan.name}`);
        } else {
          // Insert new plan
          await client.query(`
            INSERT INTO plans (
              id,
              name,
              description,
              stripe_product_id,
              stripe_price_id,
              price,
              interval,
              features,
              active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, true)
          `, [
            plan.id,
            plan.name,
            plan.description,
            plan.stripe_product_id,
            plan.stripe_price_id,
            plan.price,
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
