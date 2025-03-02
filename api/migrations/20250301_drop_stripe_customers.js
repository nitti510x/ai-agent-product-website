import { executeQuery } from '../db.js';

/**
 * Migration to drop the stripe_customers table from Railway PostgreSQL
 * since we're now storing this data in Supabase
 */
export async function migrate() {
  console.log('Running migration: Drop stripe_customers table from Railway');
  
  try {
    // Check if the table exists before dropping it
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'stripe_customers'
      );
    `;
    
    const tableExists = await executeQuery(checkTableQuery);
    
    if (tableExists.rows[0].exists) {
      // Drop the table
      const dropTableQuery = `DROP TABLE IF EXISTS stripe_customers;`;
      await executeQuery(dropTableQuery);
      console.log('Successfully dropped stripe_customers table');
    } else {
      console.log('stripe_customers table does not exist, skipping');
    }
    
    return { success: true, message: 'Migration completed successfully' };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, message: error.message };
  }
}
