// PostgreSQL service using fetch API to connect to the backend
// API URL - use relative path in production
const API_URL = '/api';

// PostgreSQL service for database operations
export const postgresService = {
  // Get all plans from the database via API
  getPlans: async () => {
    try {
      const response = await fetch(`${API_URL}/plans`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const plans = await response.json();
      console.log('Fetched plans from API:', plans);
      return plans;
    } catch (error) {
      console.error('Error fetching plans from API:', error);
      // Return fallback data on error
      return getFallbackPlans();
    }
  },

  // Get a specific plan by ID via API
  getPlanById: async (planId) => {
    try {
      const response = await fetch(`${API_URL}/plans/${planId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      const plan = await response.json();
      return plan;
    } catch (error) {
      console.error('Error fetching plan by ID from API:', error);
      // Return fallback data on error
      const plans = getFallbackPlans();
      return plans.find(p => p.id === planId) || null;
    }
  },

  // Get user subscription from the database
  getUserSubscription: async (userId) => {
    try {
      // In a real implementation, this would make a fetch request to a backend API
      // For now, return null to indicate no subscription
      return null;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
  },

  // Create a new subscription
  createSubscription: async (subscriptionData) => {
    try {
      // In a real implementation, this would make a fetch request to a backend API
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
      // In a real implementation, this would make a fetch request to a backend API
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

  // Reactivate a subscription (set cancel_at_period_end to false)
  reactivateSubscription: async (subscriptionId) => {
    try {
      // In a real implementation, this would make a fetch request to a backend API
      // For now, return a mock updated subscription
      return {
        id: subscriptionId,
        cancel_at_period_end: false,
        updated_at: new Date()
      };
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw error;
    }
  }
};

// Fallback plans data when API connection fails
function getFallbackPlans() {
  return [
    {
      id: "plan_free",
      name: "Free Trial",
      description: "Perfect for teams ready to revolutionize their social media strategy",
      price: 0.00,
      interval: "month",
      features: {
        icon: "credit",
        text: "50 credits (free)",
        feature_limits: {
          agents: 1,
          requests: 50,
          channels: 2,
          tokens: 50
        }
      }
    },
    {
      id: "plan_starter",
      name: "Starter 1",
      description: "Perfect for small teams getting started with AI marketing",
      price: 15.00,
      interval: "month",
      features: {
        icon: "assistant",
        text: "1 AI Marketing Assistant",
        feature_limits: {
          agents: 2,
          requests: 100,
          channels: 5,
          tokens: 1000
        }
      }
    },
    {
      id: "plan_pro",
      name: "Pro",
      description: "Ideal for growing businesses scaling their marketing",
      price: 30.00,
      interval: "month",
      features: {
        icon: "assistant",
        text: "3 AI Marketing Assistants",
        feature_limits: {
          agents: 5,
          requests: 500,
          channels: 15,
          tokens: 5000
        }
      }
    },
    {
      id: "plan_business",
      name: "Business",
      description: "Custom solutions for large organizations",
      price: 79.00,
      interval: "month",
      features: {
        icon: "assistant",
        text: "Unlimited AI Marketing Assistants",
        feature_limits: {
          agents: 20,
          requests: 2000,
          channels: "Unlimited",
          tokens: 20000
        }
      }
    },
    {
      id: "plan_enterprise",
      name: "Enterprise",
      description: "Tailored solutions for large organizations with custom requirements",
      price: 0.00,
      interval: "month",
      features: {
        icon: "assistant",
        text: "Unlimited AI Marketing Assistants",
        feature_limits: {
          agents: "Unlimited",
          requests: "Unlimited",
          channels: "Unlimited",
          tokens: "Unlimited"
        }
      }
    }
  ];
}
