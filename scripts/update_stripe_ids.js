import pg from 'pg';

// Railway PostgreSQL connection
const { Pool } = pg;
const pool = new Pool({
  connectionString: 'postgresql://postgres:QZLxtAAYlkHPKWcXwbRGlrJpWjuvfEan@metro.proxy.rlwy.net:44666/railway',
  ssl: false // Disable SSL
});

// Stripe product and price IDs for each plan
// Replace these with your actual Stripe IDs when you have them
const stripeIds = {
  plan_starter: {
    stripe_product_id: 'prod_XXXXXXXXXXXXXXX', // Replace with actual Stripe product ID
    stripe_price_id: 'price_XXXXXXXXXXXXXXX'   // Replace with actual Stripe price ID
  },
  plan_pro: {
    stripe_product_id: 'prod_XXXXXXXXXXXXXXX', // Replace with actual Stripe product ID
    stripe_price_id: 'price_XXXXXXXXXXXXXXX'   // Replace with actual Stripe price ID
  },
  plan_business: {
    stripe_product_id: 'prod_XXXXXXXXXXXXXXX', // Replace with actual Stripe product ID
    stripe_price_id: 'price_XXXXXXXXXXXXXXX'   // Replace with actual Stripe price ID
  },
  plan_enterprise: {
    stripe_product_id: 'prod_XXXXXXXXXXXXXXX', // Replace with actual Stripe product ID
    stripe_price_id: 'price_XXXXXXXXXXXXXXX'   // Replace with actual Stripe price ID
  }
};

// Function to update Stripe IDs for plans
async function updateStripeIds() {
  try {
    const client = await pool.connect();
    try {
      console.log('Current plans in the database:');
      const allPlansResult = await client.query(`
        SELECT id, name, stripe_product_id, stripe_price_id 
        FROM plans 
        WHERE active = true
      `);
      
      allPlansResult.rows.forEach(plan => {
        console.log(`- ${plan.id}: ${plan.name}`);
        console.log(`  Product ID: ${plan.stripe_product_id || 'Not set'}`);
        console.log(`  Price ID: ${plan.stripe_price_id || 'Not set'}`);
      });
      
      console.log('\nUpdating Stripe IDs...');
      
      // Update each plan with its Stripe IDs
      for (const [planId, ids] of Object.entries(stripeIds)) {
        const updateResult = await client.query(`
          UPDATE plans 
          SET 
            stripe_product_id = $1,
            stripe_price_id = $2
          WHERE id = $3
          RETURNING id, name
        `, [ids.stripe_product_id, ids.stripe_price_id, planId]);
        
        if (updateResult.rowCount > 0) {
          console.log(`Updated ${planId}: ${updateResult.rows[0].name}`);
        } else {
          console.log(`Plan ${planId} not found.`);
        }
      }
      
      console.log('\nPlans after update:');
      const updatedPlansResult = await client.query(`
        SELECT id, name, stripe_product_id, stripe_price_id 
        FROM plans 
        WHERE active = true
      `);
      
      updatedPlansResult.rows.forEach(plan => {
        console.log(`- ${plan.id}: ${plan.name}`);
        console.log(`  Product ID: ${plan.stripe_product_id || 'Not set'}`);
        console.log(`  Price ID: ${plan.stripe_price_id || 'Not set'}`);
      });
      
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error updating Stripe IDs:', err);
    throw err;
  }
}

// Main function to run the script
async function main() {
  try {
    console.log('Connecting to Railway PostgreSQL database...');
    
    // Update Stripe IDs
    await updateStripeIds();
    
    console.log('\nScript completed successfully!');
  } catch (err) {
    console.error('Script failed:', err);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the script
// Uncomment the line below when you have your actual Stripe IDs
// main();
