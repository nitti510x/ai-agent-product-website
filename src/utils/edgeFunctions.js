import { supabase } from '../config/supabase';

// Base URL for Supabase Edge Functions
const getEdgeFunctionUrl = (functionName) => {
  // In development, you might want to use a local server
  // For production, use the Supabase Edge Functions URL
  const isLocalDevelopment = import.meta.env.DEV && import.meta.env.VITE_USE_LOCAL_API === 'true';
  
  if (isLocalDevelopment) {
    return `http://localhost:3001/api/${functionName.replace('stripe-', '')}`;
  }
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  return `${supabaseUrl}/functions/v1/${functionName}`;
};

// Helper to get auth headers
const getAuthHeaders = async () => {
  const { data } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${data.session?.access_token || ''}`
  };
};

// Stripe Customers API
export const stripeCustomers = {
  get: async (userId) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getEdgeFunctionUrl('stripe-customers')}?userId=${userId}`, {
      method: 'GET',
      headers
    });
    return response.json();
  },
  
  create: async (userData) => {
    const headers = await getAuthHeaders();
    const response = await fetch(getEdgeFunctionUrl('stripe-customers'), {
      method: 'POST',
      headers,
      body: JSON.stringify(userData)
    });
    return response.json();
  }
};

// Stripe Payment Methods API
export const stripePaymentMethods = {
  list: async (userId) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getEdgeFunctionUrl('stripe-payment-methods')}?userId=${userId}`, {
      method: 'GET',
      headers
    });
    return response.json();
  },
  
  attach: async (data) => {
    const headers = await getAuthHeaders();
    const response = await fetch(getEdgeFunctionUrl('stripe-payment-methods'), {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  detach: async (paymentMethodId, userId) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getEdgeFunctionUrl('stripe-payment-methods')}/${paymentMethodId}?userId=${userId}`, {
      method: 'DELETE',
      headers
    });
    return response.json();
  }
};

// Stripe Subscriptions API (you can add this later)
export const stripeSubscriptions = {
  // Add subscription-related functions here
};

// Stripe Tokens API (you can add this later)
export const stripeTokens = {
  // Add token-related functions here
};
