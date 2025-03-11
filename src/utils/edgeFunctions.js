import { createClient } from '@supabase/supabase-js';

// Lazy-loaded Supabase client
let supabaseClient = null;

// Function to get Supabase client only when needed
const getSupabaseClient = async () => {
  if (supabaseClient) {
    return supabaseClient;
  }
  
  try {
    // Dynamically import the supabase client only when needed
    const { supabase } = await import('../config/supabase');
    supabaseClient = supabase;
    return supabaseClient;
  } catch (error) {
    console.error('Error loading Supabase client:', error);
    throw new Error('Failed to initialize Supabase client');
  }
};

// Base URL for Supabase Edge Functions
const getEdgeFunctionUrl = (functionName) => {
  // Always use Supabase Edge Functions
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  console.log(`Using Supabase edge function for ${functionName}: ${supabaseUrl}/functions/v1/${functionName}`);
  return `${supabaseUrl}/functions/v1/${functionName}`;
};

// Helper to call edge functions
export const callEdgeFunction = async (functionName, options = {}) => {
  const { method = 'GET', body, params = {} } = options;
  
  try {
    // Get Supabase client and auth token
    const supabase = await getSupabaseClient();
    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    
    if (!session) {
      console.error('Authentication session not found');
      throw new Error('Not authenticated');
    }
    
    // Build URL with query parameters
    let url = getEdgeFunctionUrl(functionName);
    
    if (Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      url = `${url}?${queryParams.toString()}`;
    }
    
    // Prepare headers
    const headers = {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    };
    
    // Make request
    console.log(`Making ${method} request to ${url}`);
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    
    if (!response) {
      console.error('No response received from edge function');
      throw new Error('No response received');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Edge function error (${response.status}):`, errorText);
      throw new Error(`Edge function returned ${response.status}: ${errorText}`);
    }
    
    // Parse response
    try {
      const result = await response.json();
      return result;
    } catch (e) {
      console.error('Error parsing response:', e);
      // If response is not JSON, return text
      const text = await response.text();
      return { text };
    }
  } catch (error) {
    console.error(`Error calling edge function ${functionName}:`, error);
    throw error;
  }
};

// Helper function to initialize payment methods for specific users
export const initializeUserPaymentMethods = async () => {
  // Only run in development environment with local API
  if (import.meta.env.VITE_USE_LOCAL_API !== 'true') {
    console.log('Skipping payment method initialization in production');
    return;
  }
  
  try {
    console.log('Initializing test payment methods...');
    
    // Check if user is authenticated before proceeding
    const supabase = await getSupabaseClient();
    const { data } = await supabase.auth.getSession();
    if (!data?.session) {
      console.log('No authenticated user, skipping payment method initialization');
      return;
    }
    
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      console.error('Error getting user:', userError);
      return;
    }
    
    const user = userData.user;
    console.log('Current user:', user.email);
    
    // Check if this is a test user
    const testEmails = [
      'test@example.com',
      'demo@example.com',
      'user@example.com'
    ];
    
    if (!testEmails.includes(user.email)) {
      console.log('Not a test user, skipping payment method initialization');
      return;
    }
    
    // Get customer
    const customer = await stripeCustomers.get();
    if (!customer) {
      console.log('Creating customer for test user...');
      await stripeCustomers.create();
    } else {
      console.log('Customer already exists:', customer.id);
    }
    
    // Check if test payment method already exists
    const paymentMethods = await stripePaymentMethods.list();
    if (paymentMethods && paymentMethods.length > 0) {
      console.log('Test payment methods already exist:', paymentMethods.length);
      return;
    }
    
    // Create test payment method
    console.log('No payment methods found, would create test payment method here');
    // Note: Actual payment method creation would be done through Stripe Elements in the UI
    
    console.log('Test payment methods initialized successfully');
  } catch (error) {
    console.error('Error initializing test payment methods:', error);
  }
};

// Stripe Customers API
export const stripeCustomers = {
  get: async () => {
    try {
      return await callEdgeFunction('stripe-customers-get');
    } catch (error) {
      console.error('Error getting customer:', error);
      return null;
    }
  },
  create: async () => {
    try {
      return await callEdgeFunction('stripe-customers-create', { method: 'POST' });
    } catch (error) {
      console.error('Error creating customer:', error);
      return null;
    }
  }
};

// Stripe Payment Methods API
export const stripePaymentMethods = {
  list: async () => {
    try {
      return await callEdgeFunction('stripe-payment-methods-list');
    } catch (error) {
      console.error('Error listing payment methods:', error);
      return [];
    }
  },
  attach: async (paymentMethodId) => {
    try {
      return await callEdgeFunction('stripe-payment-methods-attach', {
        method: 'POST',
        body: { paymentMethodId }
      });
    } catch (error) {
      console.error('Error attaching payment method:', error);
      throw error;
    }
  },
  detach: async (paymentMethodId) => {
    try {
      return await callEdgeFunction('stripe-payment-methods-detach', {
        method: 'POST',
        body: { paymentMethodId }
      });
    } catch (error) {
      console.error('Error detaching payment method:', error);
      throw error;
    }
  },
  setDefault: async (paymentMethodId) => {
    try {
      return await callEdgeFunction('stripe-payment-methods-set-default', {
        method: 'POST',
        body: { paymentMethodId }
      });
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  }
};

// Stripe Subscriptions API (you can add this later)
export const stripeSubscriptions = {
  // Add subscription-related functions here
};
