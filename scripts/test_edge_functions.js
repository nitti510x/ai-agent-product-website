// scripts/test_edge_functions.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Initialize environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to get edge function URL
const getEdgeFunctionUrl = (functionName) => {
  return `${supabaseUrl}/functions/v1/${functionName}`;
};

// Function to test an edge function
async function testEdgeFunction(functionName, method = 'GET', body = null) {
  try {
    console.log(`Testing edge function: ${functionName}`);
    
    // Get auth token
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return;
    }
    
    if (!session) {
      console.error('No session found. Please sign in first.');
      return;
    }
    
    // Prepare headers
    const headers = {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    };
    
    // Make request
    const url = getEdgeFunctionUrl(functionName);
    console.log(`Making ${method} request to ${url}`);
    
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    
    // Log response status
    console.log(`Response status: ${response.status}`);
    
    // Log response headers
    console.log('Response headers:');
    response.headers.forEach((value, name) => {
      console.log(`  ${name}: ${value}`);
    });
    
    // Try to parse response as JSON
    try {
      const responseClone = response.clone();
      const data = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));
    } catch (jsonError) {
      console.error('Error parsing response as JSON:', jsonError);
      const text = await response.text();
      console.log('Response text:', text);
    }
    
    console.log('Test completed for', functionName);
    console.log('-'.repeat(50));
  } catch (error) {
    console.error(`Error testing edge function ${functionName}:`, error);
  }
}

async function runTests() {
  try {
    // Test authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Authentication error:', authError);
      console.log('Please sign in first using:');
      console.log('  npx supabase login');
      return;
    }
    
    console.log('Authenticated as:', user.email);
    console.log('-'.repeat(50));
    
    // Test stripe-customers edge function
    await testEdgeFunction('stripe-customers');
    
    // Test stripe-payment-methods edge function
    await testEdgeFunction('stripe-payment-methods');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

runTests();
