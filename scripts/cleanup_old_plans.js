import pg from 'pg';

// Railway PostgreSQL connection
const { Pool } = pg;
const pool = new Pool({
  connectionString: 'postgresql://postgres:QZLxtAAYlkHPKWcXwbRGlrJpWjuvfEan@metro.proxy.rlwy.net:44666/railway',
  ssl: false // Disable SSL
});

// IDs of the plans to keep (our new plans)
const plansToKeep = [
  'plan_starter',
  'plan_pro',
  'plan_business',
  'plan_enterprise'
];

// Function to deactivate old plans
async function deactivateOldPlans() {
  try {
    const client = await pool.connect();
    try {
      // First, let's list all plans
      console.log('Current plans in the database:');
      const allPlansResult = await client.query(`
        SELECT id, name, price, active 
        FROM plans 
        ORDER BY price
      `);
      
      allPlansResult.rows.forEach(plan => {
        console.log(`- ${plan.id}: ${plan.name} ($${plan.price}) - Active: ${plan.active}`);
      });
      
      // Deactivate plans that are not in the plansToKeep list
      const deactivateResult = await client.query(`
        UPDATE plans 
        SET active = false 
        WHERE id NOT IN (${plansToKeep.map((_, i) => `$${i + 1}`).join(',')})
        RETURNING id, name
      `, plansToKeep);
      
      if (deactivateResult.rowCount > 0) {
        console.log('\nDeactivated the following plans:');
        deactivateResult.rows.forEach(plan => {
          console.log(`- ${plan.id}: ${plan.name}`);
        });
      } else {
        console.log('\nNo plans were deactivated.');
      }
      
      // List active plans after deactivation
      console.log('\nActive plans after cleanup:');
      const activePlansResult = await client.query(`
        SELECT id, name, price 
        FROM plans 
        WHERE active = true 
        ORDER BY price
      `);
      
      activePlansResult.rows.forEach(plan => {
        console.log(`- ${plan.id}: ${plan.name} ($${plan.price})`);
      });
      
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error deactivating old plans:', err);
    throw err;
  }
}

// Main function to run the script
async function main() {
  try {
    console.log('Connecting to Railway PostgreSQL database...');
    
    // Deactivate old plans
    await deactivateOldPlans();
    
    console.log('\nScript completed successfully!');
  } catch (err) {
    console.error('Script failed:', err);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the script
main();
