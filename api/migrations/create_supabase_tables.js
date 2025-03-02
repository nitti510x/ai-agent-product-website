import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import supabase from '../config/supabase.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Migration to create Stripe-related tables in Supabase
 */
export async function migrate() {
  console.log('Running migration: Create Stripe tables in Supabase');
  
  try {
    // Create stripe_customers table
    const { error: customersError } = await supabase.from('stripe_customers').select('id').limit(1).maybeSingle();
    
    if (customersError && customersError.code === '42P01') {
      console.log('Creating stripe_customers table...');
      const { error } = await supabase.rpc('create_stripe_customers_table');
      
      if (error) {
        // Table doesn't exist and we couldn't create it via RPC, so we'll use raw SQL
        // We'll create it manually in the Supabase dashboard
        console.log('Could not create stripe_customers table automatically.');
        console.log('Please create the table manually in the Supabase dashboard with the following structure:');
        console.log(`
CREATE TABLE public.stripe_customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  email TEXT,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own stripe customers"
  ON public.stripe_customers
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all stripe customers"
  ON public.stripe_customers
  USING (auth.jwt() ->> 'role' = 'service_role');
        `);
      }
    } else {
      console.log('stripe_customers table already exists');
    }
    
    // Create payment_methods table
    const { error: paymentMethodsError } = await supabase.from('payment_methods').select('id').limit(1).maybeSingle();
    
    if (paymentMethodsError && paymentMethodsError.code === '42P01') {
      console.log('Creating payment_methods table...');
      const { error } = await supabase.rpc('create_payment_methods_table');
      
      if (error) {
        // Table doesn't exist and we couldn't create it via RPC, so we'll use raw SQL
        // We'll create it manually in the Supabase dashboard
        console.log('Could not create payment_methods table automatically.');
        console.log('Please create the table manually in the Supabase dashboard with the following structure:');
        console.log(`
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  card_brand TEXT,
  card_last4 TEXT,
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own payment methods"
  ON public.payment_methods
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all payment methods"
  ON public.payment_methods
  USING (auth.jwt() ->> 'role' = 'service_role');
        `);
      }
    } else {
      console.log('payment_methods table already exists');
    }
    
    return { 
      success: true, 
      message: 'Tables checked/created successfully. If tables could not be created automatically, please create them manually in the Supabase dashboard.' 
    };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, message: error.message };
  }
}

// Run the migration if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  migrate().then(result => {
    console.log('Migration result:', result);
    process.exit(result.success ? 0 : 1);
  });
}
