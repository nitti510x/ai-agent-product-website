// PostgreSQL service using fetch API to connect to the backend
// API URL - use environment-aware URL
const isDevelopment = import.meta.env.DEV;
const API_URL = isDevelopment ? 'http://localhost:3001/api' : '/api';

// PostgreSQL service for database operations
export const postgresService = {
  /**
   * Get all plans from the database
   * @returns {Promise<Array>} Array of plans
   */
  async getPlans() {
    try {
      const response = await fetch(`${API_URL}/plans`);
      if (!response.ok) {
        throw new Error(`Failed to fetch plans: ${response.status} ${response.statusText}`);
      }
      const plans = await response.json();
      return plans;
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error; // Let the UI handle the error
    }
  },

  /**
   * Get a plan by ID
   * @param {string} planId - The ID of the plan to fetch
   * @returns {Promise<Object>} The plan object
   */
  async getPlanById(planId) {
    try {
      const response = await fetch(`${API_URL}/plans/${planId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch plan: ${response.status} ${response.statusText}`);
      }
      const plan = await response.json();
      return plan;
    } catch (error) {
      console.error(`Error fetching plan ${planId}:`, error);
      throw error; // Let the UI handle the error
    }
  },

  /**
   * Get user subscription from the database
   * @param {string} userId - The ID of the user
   * @returns {Promise<Object>} The subscription object
   */
  async getUserSubscription(userId) {
    try {
      // In a real implementation, this would make a fetch request to a backend API
      // For now, return null to indicate no subscription
      return null;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      throw error;
    }
  },

  /**
   * Create a new subscription
   * @param {Object} subscriptionData - The subscription data
   * @returns {Promise<Object>} The created subscription
   */
  async createSubscription(subscriptionData) {
    try {
      // In a real implementation, this would make a fetch request to a backend API
      // For now, throw an error to indicate this is not implemented
      throw new Error('Subscription creation not implemented');
    } catch (error) {
      console.error('Error creating subscription:', error);
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
      // In a real implementation, this would make a fetch request to a backend API
      // For now, throw an error to indicate this is not implemented
      throw new Error('Subscription cancellation not implemented');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
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
      // In a real implementation, this would make a fetch request to a backend API
      // For now, throw an error to indicate this is not implemented
      throw new Error('Subscription reactivation not implemented');
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw error;
    }
  }
};
