import { supabase } from './supabase.js';

// API base URL - in production, this would be your deployed API URL
const API_URL = 'http://localhost:3001/api';

// Subscription service for managing user subscriptions
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
      // Validate that we have a valid UUID for user_id
      if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
        console.error('Invalid user_id format:', userId);
        throw new Error('Invalid user ID format');
      }

      console.log('Getting subscription for user:', userId);
      
      // In a real implementation with API ready, uncomment this:
      // const response = await fetch(`${API_URL}/subscriptions/user/${userId}`);
      // if (!response.ok) throw new Error('Failed to fetch subscription');
      // return await response.json();
      
      // For now, return null to simulate no subscription
      return null;
    } catch (error) {
      console.error('Error getting user subscription:', error);
      return null;
    }
  },

  // Create a new subscription
  createSubscription: async (subscriptionData) => {
    try {
      // Validate that we have a valid UUID for user_id
      if (!subscriptionData.user_id || 
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(subscriptionData.user_id)) {
        console.error('Invalid user_id format:', subscriptionData.user_id);
        throw new Error('Invalid user ID format');
      }

      console.log('Creating subscription with data:', subscriptionData);
      
      // In a real implementation with API ready, uncomment this:
      // const response = await fetch(`${API_URL}/subscriptions`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(subscriptionData)
      // });
      // if (!response.ok) throw new Error('Failed to create subscription');
      // return await response.json();
      
      // For now, return a mock subscription
      return {
        id: 'temp-id',
        user_id: subscriptionData.user_id,
        plan_id: subscriptionData.plan_id,
        status: 'active',
        current_period_start: subscriptionData.current_period_start,
        current_period_end: subscriptionData.current_period_end,
        cancel_at_period_end: false,
        created_at: new Date(),
        updated_at: new Date()
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  },

  // Cancel a subscription (set cancel_at_period_end to true)
  cancelSubscription: async (subscriptionId) => {
    try {
      console.log('Canceling subscription:', subscriptionId);
      
      // In a real implementation with API ready, uncomment this:
      // const response = await fetch(`${API_URL}/subscriptions/${subscriptionId}/cancel`, {
      //   method: 'PUT'
      // });
      // if (!response.ok) throw new Error('Failed to cancel subscription');
      // return await response.json();
      
      // For now, return a mock updated subscription
      return {
        id: subscriptionId,
        cancel_at_period_end: true,
        updated_at: new Date()
      };
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  },

  // Get all available plans
  getPlans: async () => {
    try {
      // In a real implementation with API ready, uncomment this:
      // const response = await fetch(`${API_URL}/plans`);
      // if (!response.ok) throw new Error('Failed to fetch plans');
      // return await response.json();
      
      // For now, return hardcoded plans
      return [
        {
          id: "basic",
          name: "Basic Plan",
          description: "Essential features for individuals",
          price: 9.99,
          interval: "month",
          features: {
            feature_limits: {
              agents: 2,
              requests: 100,
              channels: 5
            }
          }
        },
        {
          id: "pro",
          name: "Professional Plan",
          description: "Advanced features for professionals",
          price: 19.99,
          interval: "month",
          features: {
            feature_limits: {
              agents: 5,
              requests: 500,
              channels: 15
            }
          }
        },
        {
          id: "enterprise",
          name: "Enterprise Plan",
          description: "Full access for teams",
          price: 49.99,
          interval: "month",
          features: {
            feature_limits: {
              agents: 20,
              requests: 2000,
              channels: "Unlimited"
            }
          }
        }
      ];
    } catch (error) {
      console.error('Error getting plans:', error);
      return [];
    }
  }
};

export default {
  subscriptionService
};
