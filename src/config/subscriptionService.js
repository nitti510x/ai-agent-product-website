import { supabase } from './supabase.js';
import { apiUrl } from './api.js';

const API_URL = 'https://agent.ops.geniusos.co/api';

/**
 * Subscription service for managing user subscriptions
 * This service interacts with the external API for all subscription-related operations
 */
export const subscriptionService = {
  // Get plans from the API
  getPlans: async () => {
    try {
      // Get the authentication token
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      
      if (!token) {
        console.error('No authentication token available');
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/plans?active_only=true`, {
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

  // Get transactions for a user
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
  }
};

export default {
  subscriptionService
};
