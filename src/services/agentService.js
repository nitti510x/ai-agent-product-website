import { supabase } from '../config/supabase';

/**
 * Agent API service for subscription and plan data
 * This service handles all interactions with the agent.ops.geniusos.co API
 */
export const agentService = {
  /**
   * Get the current authenticated user
   * @returns {Promise<Object|null>} The current user or null if not authenticated
   */
  getCurrentUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },

  /**
   * Get all available subscription plans
   * @returns {Promise<Array>} Array of available plans
   */
  getPlans: async () => {
    try {
      console.log('Fetching plans from agent API...');
      
      // Make the request with the exact format from the curl example
      const response = await fetch('https://agent.ops.geniusos.co/plans/?active_only=true', {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });
      
      // Check if the response is successful
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response from plans endpoint: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to fetch plans: ${response.status} ${response.statusText}`);
      }
      
      // Parse the JSON response
      const plans = await response.json();
      console.log('Plans fetched successfully:', plans.length, 'plans');
      
      // Sort plans by price (free plans first, then ascending by price)
      const sortedPlans = [...plans].sort((a, b) => {
        // Put free plans first
        if (a.price === 0 && b.price !== 0) return -1;
        if (a.price !== 0 && b.price === 0) return 1;
        // Then sort by price
        return a.price - b.price;
      });
      
      return sortedPlans;
    } catch (error) {
      console.error('Error fetching plans:', error);
      return [];
    }
  },

  /**
   * Get a plan by ID
   * @param {string} planId - The ID of the plan to fetch
   * @returns {Promise<Object>} The plan object
   */
  getPlanById: async (planId) => {
    try {
      console.log(`Fetching plan with ID: ${planId}`);
      
      const response = await fetch(`https://agent.ops.geniusos.co/plans/${planId}/?`, {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response from plan endpoint for ${planId}: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to fetch plan: ${response.status} ${response.statusText}`);
      }
      
      const plan = await response.json();
      console.log('Plan fetched successfully:', plan);
      return plan;
    } catch (error) {
      console.error(`Error fetching plan ${planId}:`, error);
      throw error;
    }
  },

  /**
   * Get subscription for a user
   * @param {string} userId - The user ID
   * @returns {Promise<Object|null>} The user's subscription or null if not found
   */
  getUserSubscription: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      console.log(`Fetching subscription for user: ${userId}`);
      
      // Get the JWT token for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.access_token) {
        console.error('No valid session found when fetching subscription');
        throw new Error('No valid session found');
      }

      const response = await fetch(`https://agent.ops.geniusos.co/subscriptions/${userId}/?`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        // If 404, it means the user doesn't have a subscription yet
        if (response.status === 404) {
          console.log('No subscription found for user (404 response)');
          return null;
        }
        const errorText = await response.text();
        console.error(`Error response from subscription endpoint for ${userId}: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to fetch subscription: ${response.status} ${response.statusText}`);
      }

      const subscription = await response.json();
      console.log('Subscription fetched successfully:', subscription);
      return subscription;
    } catch (error) {
      console.error('Error getting user subscription:', error);
      return null;
    }
  },

  /**
   * Get user token balance and transaction history
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} Object containing token balance and transactions
   */
  getUserTokens: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      console.log(`Fetching tokens for user: ${userId}`);
      
      // Get the JWT token for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.access_token) {
        console.error('No valid session found when fetching tokens');
        throw new Error('No valid session found');
      }

      const response = await fetch(`https://agent.ops.geniusos.co/tokens/${userId}/?`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response from tokens endpoint for ${userId}: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to fetch user tokens: ${response.status} ${response.statusText}`);
      }

      const tokenData = await response.json();
      console.log('Tokens fetched successfully:', tokenData);
      
      // Ensure the return object has the expected structure for the UI
      return {
        subscription: tokenData.subscription || null,
        tokens: tokenData.tokens || { balance: 0, user_id: userId },
        transactions: tokenData.transactions || []
      };
    } catch (error) {
      console.error('Error getting user tokens:', error);
      // Return a default structure even on error to prevent UI crashes
      return {
        subscription: null,
        tokens: { balance: 0, user_id: userId },
        transactions: []
      };
    }
  },

  /**
   * Get available token packages
   * @returns {Promise<Array>} Array of available token packages
   */
  getTokenPackages: async () => {
    try {
      console.log('Fetching token packages from agent API...');
      
      const response = await fetch('https://agent.ops.geniusos.co/token-packages/?active_only=true', {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response from token packages endpoint: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to fetch token packages: ${response.status} ${response.statusText}`);
      }
      
      const packages = await response.json();
      console.log('Token packages fetched successfully:', packages.length, 'packages');
      return packages;
    } catch (error) {
      console.error('Error fetching token packages:', error);
      return [];
    }
  }
};

export default agentService;
