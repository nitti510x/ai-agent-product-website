#!/usr/bin/env node

/**
 * This script helps migrate data from your Express backend to Supabase
 * It will:
 * 1. Create the necessary tables in Supabase if they don't exist
 * 2. Migrate Stripe customers from your local database to Supabase
 * 3. Migrate payment methods from your local database to Supabase
 * 4. Migrate subscriptions from your local database to Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const readline = require('readline');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Create Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Create PostgreSQL pool for local database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  console.log('🚀 Starting migration to Supabase Edge Functions');
  
  try {
    // Step 1: Create tables in Supabase
    console.log('\n📊 Step 1: Creating tables in Supabase...');
    await createTables();
    
    // Step 2: Migrate Stripe customers
    console.log('\n👤 Step 2: Migrating Stripe customers...');
    await migrateCustomers();
    
    // Step 3: Migrate payment methods
    console.log('\n💳 Step 3: Migrating payment methods...');
    await migratePaymentMethods();
    
    // Step 4: Migrate subscriptions
    console.log('\n📅 Step 4: Migrating subscriptions...');
    await migrateSubscriptions();
    
    console.log('\n✅ Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Deploy your Edge Functions to Supabase');
    console.log('2. Update your Stripe webhook endpoint in the Stripe dashboard');
    console.log('3. Set VITE_USE_LOCAL_API=false in your production environment');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    rl.close();
    pool.end();
  }
}

async function createTables() {
  try {
    // Read SQL file
    const sqlFilePath = path.resolve(__dirname, '../supabase/migrations/20250302_stripe_integration.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute SQL in Supabase
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    
    // Ask user if they want to continue
    const answer = await askQuestion('Do you want to continue with the migration? (y/n): ');
    if (answer.toLowerCase() !== 'y') {
      throw new Error('Migration aborted by user');
    }
  }
}

async function migrateCustomers() {
  try {
    // Get customers from local database
    const { rows: customers } = await pool.query('SELECT * FROM stripe_customers');
    
    console.log(`Found ${customers.length} customers to migrate`);
    
    // Insert customers into Supabase
    for (const customer of customers) {
      const { error } = await supabase
        .from('stripe_customers')
        .upsert({
          user_id: customer.user_id,
          stripe_customer_id: customer.stripe_customer_id,
          email: customer.email,
          name: customer.name,
          created_at: customer.created_at,
          updated_at: customer.updated_at
        });
      
      if (error) {
        console.error(`❌ Error migrating customer ${customer.stripe_customer_id}:`, error);
      }
    }
    
    console.log('✅ Customers migrated successfully');
  } catch (error) {
    console.error('❌ Error migrating customers:', error);
    
    // Ask user if they want to continue
    const answer = await askQuestion('Do you want to continue with the migration? (y/n): ');
    if (answer.toLowerCase() !== 'y') {
      throw new Error('Migration aborted by user');
    }
  }
}

async function migratePaymentMethods() {
  try {
    // Get payment methods from local database
    const { rows: paymentMethods } = await pool.query('SELECT * FROM payment_methods');
    
    console.log(`Found ${paymentMethods.length} payment methods to migrate`);
    
    // Insert payment methods into Supabase
    for (const method of paymentMethods) {
      const { error } = await supabase
        .from('payment_methods')
        .upsert({
          user_id: method.user_id,
          stripe_payment_method_id: method.stripe_payment_method_id,
          is_default: method.is_default,
          card_brand: method.card_brand,
          card_last4: method.card_last4,
          card_exp_month: method.card_exp_month,
          card_exp_year: method.card_exp_year,
          created_at: method.created_at,
          updated_at: method.updated_at
        });
      
      if (error) {
        console.error(`❌ Error migrating payment method ${method.stripe_payment_method_id}:`, error);
      }
    }
    
    console.log('✅ Payment methods migrated successfully');
  } catch (error) {
    console.error('❌ Error migrating payment methods:', error);
    
    // Ask user if they want to continue
    const answer = await askQuestion('Do you want to continue with the migration? (y/n): ');
    if (answer.toLowerCase() !== 'y') {
      throw new Error('Migration aborted by user');
    }
  }
}

async function migrateSubscriptions() {
  try {
    // Get plans from local database
    const { rows: plans } = await pool.query('SELECT * FROM plans');
    
    console.log(`Found ${plans.length} plans to migrate`);
    
    // Insert plans into Supabase
    for (const plan of plans) {
      const { error } = await supabase
        .from('plans')
        .upsert({
          id: plan.id,
          name: plan.name,
          description: plan.description,
          stripe_product_id: plan.stripe_product_id,
          stripe_price_id: plan.stripe_price_id,
          amount: plan.amount,
          currency: plan.currency,
          interval: plan.interval,
          interval_count: plan.interval_count,
          trial_period_days: plan.trial_period_days,
          active: plan.active,
          created_at: plan.created_at,
          updated_at: plan.updated_at
        });
      
      if (error) {
        console.error(`❌ Error migrating plan ${plan.name}:`, error);
      }
    }
    
    // Get subscriptions from local database
    const { rows: subscriptions } = await pool.query('SELECT * FROM subscriptions');
    
    console.log(`Found ${subscriptions.length} subscriptions to migrate`);
    
    // Insert subscriptions into Supabase
    for (const subscription of subscriptions) {
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          id: subscription.id,
          user_id: subscription.user_id,
          plan_id: subscription.plan_id,
          stripe_subscription_id: subscription.stripe_subscription_id,
          status: subscription.status,
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end,
          cancel_at_period_end: subscription.cancel_at_period_end,
          canceled_at: subscription.canceled_at,
          created_at: subscription.created_at,
          updated_at: subscription.updated_at
        });
      
      if (error) {
        console.error(`❌ Error migrating subscription ${subscription.stripe_subscription_id}:`, error);
      }
    }
    
    console.log('✅ Subscriptions migrated successfully');
  } catch (error) {
    console.error('❌ Error migrating subscriptions:', error);
  }
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Run the script
main();
