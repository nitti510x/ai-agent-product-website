import { supabase } from '../config/supabase';

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
    // Get auth token
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
      throw new Error(`No response received from ${functionName}`);
    }
    
    console.log(`Response status: ${response.status}`);
    
    // Safely access headers
    const contentTypeHeader = response.headers ? response.headers.get('content-type') : null;
    console.log(`Response content-type: ${contentTypeHeader || 'unknown'}`);
    
    // Handle response
    if (!response.ok) {
      // Clone the response before reading it
      const clonedResponse = response.clone();
      
      // Try to parse error as JSON
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status} ${response.statusText}`);
      } catch (jsonError) {
        // If parsing fails, use the status text
        try {
          const responseText = await clonedResponse.text();
          throw new Error(`API error: ${response.status} ${response.statusText}${responseText ? ` - ${responseText}` : ''}`);
        } catch (textError) {
          // If both JSON and text parsing fail
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
      }
    }
    
    // For successful responses, we need to be careful with the body stream
    // Clone the response before attempting to read it
    const clonedResponse = response.clone();
    
    // First try to read as JSON if content-type suggests it's JSON
    const contentType = response.headers && response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        const jsonData = await response.json();
        console.log(`Successfully parsed JSON response for ${functionName}`);
        return jsonData;
      } catch (jsonError) {
        console.error(`Error parsing JSON response for ${functionName}:`, jsonError);
        // Fall back to text
        try {
          const textData = await clonedResponse.text();
          if (!textData) return null;
          
          // Try to parse as JSON anyway in case content-type is wrong
          try {
            return JSON.parse(textData);
          } catch (e) {
            // Return as text if not JSON
            return textData;
          }
        } catch (textError) {
          console.error(`Error reading response text for ${functionName}:`, textError);
          return null;
        }
      }
    } else {
      // For non-JSON content types, read as text
      try {
        const textData = await response.text();
        if (!textData) return null;
        
        // Try to parse as JSON anyway in case content-type is wrong
        try {
          const jsonData = JSON.parse(textData);
          console.log(`Successfully parsed text as JSON for ${functionName}`);
          return jsonData;
        } catch (e) {
          // Return as text if not JSON
          return textData;
        }
      } catch (textError) {
        console.error(`Error reading response text for ${functionName}:`, textError);
        return null;
      }
    }
  } catch (error) {
    console.error(`Error calling edge function ${functionName}:`, error);
    throw error;
  }
};

// Helper function to initialize payment methods for specific users
export const initializeUserPaymentMethods = () => {
  // Check if we're in development mode
  if (!import.meta.env.DEV) {
    return;
  }
  
  // Add sample payment methods for specific test users
  const testUsers = {
    'f476ba73-9ab1-4b40-b331-ae0e1f323f3a': [
      {
        id: 'pm_test_visa_1',
        card: {
          brand: 'visa',
          last4: '4242',
          exp_month: 3,
          exp_year: 2025
        },
        is_default: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'pm_test_mastercard_1',
        card: {
          brand: 'mastercard',
          last4: '8210',
          exp_month: 12,
          exp_year: 2026
        },
        is_default: false,
        created_at: new Date().toISOString()
      }
    ]
  };
  
  // Check for the current user
  try {
    supabase.auth.getSession().then(({ data: { session } }) => {
      try {
        if (!session || !session.user) {
          console.log('No authenticated user found for payment method initialization');
          return;
        }
        
        const userId = session.user.id;
        console.log('Checking for test user:', userId);
        
        // If this is a test user, initialize their payment methods
        if (testUsers[userId]) {
          const storageKey = `payment_methods_${userId}`;
          
          try {
            // Only initialize if they don't already have payment methods
            if (!localStorage.getItem(storageKey)) {
              console.log('Initializing test payment methods for user:', userId);
              localStorage.setItem(storageKey, JSON.stringify(testUsers[userId]));
            }
          } catch (storageError) {
            console.error('Error accessing localStorage for payment methods:', storageError);
            // Continue without initializing payment methods
          }
        }
      } catch (sessionError) {
        console.error('Error processing user session for payment methods:', sessionError);
      }
    }).catch(authError => {
      console.error('Error getting session for payment methods:', authError);
    });
  } catch (error) {
    console.error('Error in initializeUserPaymentMethods:', error);
  }
};

// Stripe Customers API
export const stripeCustomers = {
  get: async () => {
    try {
      return await callEdgeFunction('stripe-customers');
    } catch (error) {
      console.error('Error in stripeCustomers.get:', error);
      throw error;
    }
  },
  
  create: async () => {
    try {
      return await callEdgeFunction('stripe-customers', { method: 'POST' });
    } catch (error) {
      console.error('Error in stripeCustomers.create:', error);
      throw error;
    }
  }
};

// Stripe Payment Methods API
export const stripePaymentMethods = {
  list: async () => {
    try {
      return await callEdgeFunction('stripe-payment-methods');
    } catch (error) {
      console.error('Error in stripePaymentMethods.list:', error);
      throw error;
    }
  },
  
  attach: async (paymentMethodId) => {
    try {
      console.log(`Attaching payment method: ${paymentMethodId}`);
      const response = await callEdgeFunction('stripe-payment-methods', { 
        method: 'POST', 
        body: { paymentMethodId } 
      });
      console.log('Payment method attached successfully:', response);
      return response;
    } catch (error) {
      console.error('Error in stripePaymentMethods.attach:', error);
      throw error;
    }
  },
  
  detach: async (paymentMethodId) => {
    try {
      return await callEdgeFunction(`stripe-payment-methods/${paymentMethodId}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error in stripePaymentMethods.detach:', error);
      throw error;
    }
  },
  
  setDefault: async (paymentMethodId) => {
    try {
      await stripePaymentMethods.detach(paymentMethodId);
      return await stripePaymentMethods.attach(paymentMethodId);
    } catch (error) {
      console.error('Error in stripePaymentMethods.setDefault:', error);
      throw error;
    }
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
