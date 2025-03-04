// Script to check if Supabase Edge Functions are accessible
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables. Please check your .env file.');
  process.exit(1);
}

// Functions to check
const functions = [
  'stripe-payment-methods',
  'stripe-customers'
];

async function checkFunction(functionName) {
  try {
    const url = `${supabaseUrl}/functions/v1/${functionName}`;
    console.log(`Checking ${functionName} at ${url}`);
    
    const response = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`);
    
    if (response.status === 204 || response.status === 200) {
      console.log(`✅ ${functionName} is accessible`);
      return true;
    } else {
      console.log(`❌ ${functionName} returned status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error checking ${functionName}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('Checking Supabase Edge Functions...');
  console.log(`Supabase URL: ${supabaseUrl}`);
  
  let allGood = true;
  
  for (const func of functions) {
    const result = await checkFunction(func);
    if (!result) allGood = false;
    console.log('-----------------------------------');
  }
  
  if (allGood) {
    console.log('✅ All functions are accessible');
  } else {
    console.log('❌ Some functions are not accessible');
    console.log('Please deploy the edge functions using:');
    console.log('./scripts/deploy_edge_functions.sh');
  }
}

main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});
