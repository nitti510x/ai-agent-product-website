// scripts/check_stripe_tables.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  try {
    console.log('Checking Stripe-related tables...');
    
    // List of tables to check
    const tables = [
      'stripe_customers',
      'payment_methods',
      'plans',
      'subscriptions',
      'token_packages',
      'token_balances',
      'token_transactions'
    ];
    
    let missingTables = [];
    
    for (const table of tables) {
      try {
        console.log(`Checking table: ${table}`);
        const { data, error } = await supabase.from(table).select('count', { count: 'exact', head: true });
        
        if (error) {
          console.error(`Error checking table ${table}:`, error);
          missingTables.push(table);
        } else {
          console.log(`✅ Table ${table} exists with ${data.count} rows`);
        }
      } catch (error) {
        console.error(`Error checking table ${table}:`, error);
        missingTables.push(table);
      }
    }
    
    if (missingTables.length > 0) {
      console.error('\n❌ Missing tables:', missingTables.join(', '));
      console.log('\nTo create the missing tables, you need to run the SQL migration:');
      console.log('1. Go to the Supabase dashboard');
      console.log('2. Navigate to the SQL Editor');
      console.log('3. Run the SQL from supabase/migrations/20250302_stripe_integration.sql');
    } else {
      console.log('\n✅ All Stripe-related tables exist!');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

checkTables();
