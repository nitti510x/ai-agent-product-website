// API service using fetch API to connect to the external backend
import { supabase } from '../config/supabase.js';
import { apiUrl } from '../config/api.js';

// Get the API URL from the configuration
const API_URL = 'https://agent.ops.geniusos.co/api';

// API service for external operations
export const apiService = {
  /**
   * Get user subscription from the external API
   * @param {string} userId - The ID of the user
   * @returns {Promise<Object>} The subscription object
   */
  async getUserSubscription(userId) {
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

  /**
   * Cancel a subscription (set cancel_at_period_end to true)
   * @param {string} subscriptionId - The ID of the subscription to cancel
   * @returns {Promise<Object>} The updated subscription
   */
  async cancelSubscription(subscriptionId) {
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

  /**
   * Reactivate a subscription (set cancel_at_period_end to false)
   * @param {string} subscriptionId - The ID of the subscription to reactivate
   * @returns {Promise<Object>} The updated subscription
   */
  async reactivateSubscription(subscriptionId) {
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

  /**
   * Get user payment methods from the external API
   * @param {string} userId - The ID of the user
   * @returns {Promise<Array>} Array of payment methods
   */
  async getUserPaymentMethods(userId) {
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
  }
};
