import { supabase } from './supabase.js';

// API base URL - use external API only
const API_BASE_URL = 'https://agent.ops.geniusos.co';
const API_URL = `${API_BASE_URL}/api`;

// Subscription service for managing user subscriptions and tokens
export const subscriptionService = {
  // Get the current authenticated user
  getCurrentUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user from Supabase:', user);
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },

  // Get subscription for a user
  getUserSubscription: async (userId) => {
    try {
      // Get the authentication token
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      
      if (!token) {
        console.error('No authentication token available');
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/subscriptions/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch subscription: ${response.status} ${response.statusText}`);
      }
      
      const subscription = await response.json();
      return subscription;
    } catch (error) {
      console.error(`Error fetching subscription for user ${userId}:`, error);
      throw error;
    }
  },

  // Cancel a subscription (set cancel_at_period_end to true)
  cancelSubscription: async (subscriptionId) => {
    try {
      // Get the authentication token
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      
      if (!token) {
        console.error('No authentication token available');
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to cancel subscription: ${response.status} ${response.statusText}`);
      }
      
      const subscription = await response.json();
      return subscription;
    } catch (error) {
      console.error(`Error canceling subscription ${subscriptionId}:`, error);
      throw error;
    }
  },

  // Reactivate a subscription (set cancel_at_period_end to false)
  reactivateSubscription: async (subscriptionId) => {
    try {
      // Get the authentication token
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      
      if (!token) {
        console.error('No authentication token available');
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/subscriptions/${subscriptionId}/reactivate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to reactivate subscription: ${response.status} ${response.statusText}`);
      }
      
      const subscription = await response.json();
      return subscription;
    } catch (error) {
      console.error(`Error reactivating subscription ${subscriptionId}:`, error);
      throw error;
    }
  },

  // Get all available plans
  getPlans: async () => {
    try {
      // Get the authentication token
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      
      if (!token) {
        console.error('No authentication token available');
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/plans/?active_only=true`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch plans: ${response.status} ${response.statusText}`);
      }
      
      const plans = await response.json();
      return plans;
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
  },

  // Get user token balance and transaction history
  getUserTokens: async (userId) => {
    try {
      // Get the authentication token
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      
      if (!token) {
        console.error('No authentication token available');
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/tokens/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user tokens: ${response.status} ${response.statusText}`);
      }
      
      const tokens = await response.json();
      return tokens;
    } catch (error) {
      console.error(`Error fetching tokens for user ${userId}:`, error);
      throw error;
    }
  },

  // Get available token packages
  getTokenPackages: async () => {
    try {
      // Get the authentication token
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      
      if (!token) {
        console.error('No authentication token available');
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/tokens/packages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch token packages: ${response.status} ${response.statusText}`);
      }
      
      const packages = await response.json();
      return packages;
    } catch (error) {
      console.error('Error fetching token packages:', error);
      throw error;
    }
  },

  // Purchase tokens
  purchaseTokens: async (userId, packageId, paymentMethodId) => {
    try {
      // Get the authentication token
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      
      if (!token) {
        console.error('No authentication token available');
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/tokens/purchase`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          packageId,
          paymentMethodId
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to purchase tokens: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error purchasing tokens:', error);
      throw error;
    }
  },

  // Use tokens (deduct from balance)
  useTokens: async (userId, amount, description) => {
    try {
      // Get the authentication token
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      
      if (!token) {
        console.error('No authentication token available');
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/tokens/use`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          amount,
          description
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to use tokens: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error using tokens:', error);
      throw error;
    }
  },

  // Get user transaction history
  getUserTransactions: async (userId) => {
    try {
      // Get the authentication token
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      
      if (!token) {
        console.error('No authentication token available');
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/transactions/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
      }
      
      const transactions = await response.json();
      return transactions;
    } catch (error) {
      console.error(`Error fetching transactions for user ${userId}:`, error);
      throw error;
    }
  },

  // Get user payment methods
  getUserPaymentMethods: async (userId) => {
    try {
      // Get the authentication token
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      
      if (!token) {
        console.error('No authentication token available');
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/payment-methods/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch payment methods: ${response.status} ${response.statusText}`);
      }
      
      const paymentMethods = await response.json();
      return paymentMethods;
    } catch (error) {
      console.error(`Error fetching payment methods for user ${userId}:`, error);
      throw error;
    }
  },

  // Add a payment method
  addPaymentMethod: async (userId, paymentMethodData) => {
    try {
      // Get the authentication token
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      
      if (!token) {
        console.error('No authentication token available');
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/payment-methods/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentMethodData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add payment method: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  },

  // Delete a payment method
  deletePaymentMethod: async (userId, paymentMethodId) => {
    try {
      // Get the authentication token
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      
      if (!token) {
        console.error('No authentication token available');
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/payment-methods/${userId}/${paymentMethodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete payment method: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  },

  // Set default payment method
  setDefaultPaymentMethod: async (userId, paymentMethodId) => {
    try {
      // Get the authentication token
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      
      if (!token) {
        console.error('No authentication token available');
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/payment-methods/${userId}/${paymentMethodId}/default`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to set default payment method: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  }
};

export default {
  subscriptionService
};
