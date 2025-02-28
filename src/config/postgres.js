import { supabase } from './supabase.js';

// API base URL - in production, this would be your deployed API URL
const API_URL = 'http://localhost:3001/api';

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

  // Reactivate a subscription (set cancel_at_period_end to false)
  reactivateSubscription: async (subscriptionId) => {
    try {
      console.log('Reactivating subscription:', subscriptionId);
      
      // In a real implementation with API ready, uncomment this:
      // const response = await fetch(`${API_URL}/subscriptions/${subscriptionId}/reactivate`, {
      //   method: 'PUT'
      // });
      // if (!response.ok) throw new Error('Failed to reactivate subscription');
      // return await response.json();
      
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
          price: 15,
          interval: "month",
          features: {
            feature_limits: {
              agents: 2,
              requests: 100,
              channels: 5,
              tokens: 1000
            }
          }
        },
        {
          id: "pro",
          name: "Professional Plan",
          description: "Advanced features for professionals",
          price: 30,
          interval: "month",
          features: {
            feature_limits: {
              agents: 5,
              requests: 500,
              channels: 15,
              tokens: 5000
            }
          }
        },
        {
          id: "business",
          name: "Business Plan",
          description: "Full access for teams",
          price: 79,
          interval: "month",
          features: {
            feature_limits: {
              agents: 20,
              requests: 2000,
              channels: "Unlimited",
              tokens: 20000
            }
          }
        },
        {
          id: "enterprise",
          name: "Enterprise Plan",
          description: "Custom solutions for large organizations",
          price: null, // Custom pricing
          interval: "month",
          features: {
            feature_limits: {
              agents: "Unlimited",
              requests: "Unlimited",
              channels: "Unlimited",
              tokens: "Unlimited"
            }
          }
        }
      ];
    } catch (error) {
      console.error('Error getting plans:', error);
      return [];
    }
  },

  // Get user token balance and transaction history
  getUserTokens: async (userId) => {
    try {
      // Validate that we have a valid UUID for user_id
      if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
        console.error('Invalid user_id format:', userId);
        throw new Error('Invalid user ID format');
      }

      console.log('Getting tokens for user:', userId);
      
      // In a real implementation with API ready, uncomment this:
      // const response = await fetch(`${API_URL}/tokens/user/${userId}`);
      // if (!response.ok) throw new Error('Failed to fetch user tokens');
      // return await response.json();
      
      // For now, return mock data
      return {
        tokens: {
          id: 1,
          user_id: userId,
          balance: 500,
          last_updated: new Date(),
          created_at: new Date()
        },
        subscription: {
          id: 'temp-id',
          user_id: userId,
          plan_id: 'basic',
          status: 'active',
          current_period_start: new Date(),
          current_period_end: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          cancel_at_period_end: false,
          features: {
            feature_limits: {
              tokens: 1000
            }
          }
        },
        transactions: [
          {
            id: 1,
            user_id: userId,
            amount: 1000,
            transaction_type: 'subscription_grant',
            description: 'Initial tokens from Basic Plan subscription',
            created_at: new Date(new Date().setDate(new Date().getDate() - 5))
          },
          {
            id: 2,
            user_id: userId,
            amount: -500,
            transaction_type: 'usage',
            description: 'Token usage for AI requests',
            created_at: new Date(new Date().setDate(new Date().getDate() - 2))
          }
        ]
      };
    } catch (error) {
      console.error('Error getting user tokens:', error);
      return {
        tokens: { balance: 0 },
        subscription: null,
        transactions: []
      };
    }
  },

  // Get available token packages
  getTokenPackages: async () => {
    try {
      // In a real implementation with API ready, uncomment this:
      // const response = await fetch(`${API_URL}/tokens/packages`);
      // if (!response.ok) throw new Error('Failed to fetch token packages');
      // return await response.json();
      
      // For now, return hardcoded packages
      return [
        {
          id: 'small',
          name: 'Small Token Pack',
          description: '1,000 additional tokens',
          token_amount: 1000,
          price: 4.99
        },
        {
          id: 'medium',
          name: 'Medium Token Pack',
          description: '5,000 additional tokens',
          token_amount: 5000,
          price: 19.99
        },
        {
          id: 'large',
          name: 'Large Token Pack',
          description: '15,000 additional tokens',
          token_amount: 15000,
          price: 49.99
        }
      ];
    } catch (error) {
      console.error('Error getting token packages:', error);
      return [];
    }
  },

  // Purchase tokens
  purchaseTokens: async (userId, packageId, paymentMethodId) => {
    try {
      // Validate that we have a valid UUID for user_id
      if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
        console.error('Invalid user_id format:', userId);
        throw new Error('Invalid user ID format');
      }

      console.log('Purchasing tokens for user:', userId, 'package:', packageId);
      
      // In a real implementation with API ready, uncomment this:
      // const response = await fetch(`${API_URL}/tokens/purchase`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     user_id: userId,
      //     package_id: packageId,
      //     payment_method_id: paymentMethodId
      //   })
      // });
      // if (!response.ok) throw new Error('Failed to purchase tokens');
      // return await response.json();
      
      // For now, return mock data
      const packages = await subscriptionService.getTokenPackages();
      const selectedPackage = packages.find(p => p.id === packageId);
      
      if (!selectedPackage) {
        throw new Error('Invalid package ID');
      }
      
      const userTokens = await subscriptionService.getUserTokens(userId);
      
      return {
        transaction: {
          id: Math.floor(Math.random() * 1000),
          user_id: userId,
          amount: selectedPackage.token_amount,
          transaction_type: 'purchase',
          description: `Purchased ${selectedPackage.name}`,
          created_at: new Date()
        },
        tokens: {
          id: userTokens.tokens.id || 1,
          user_id: userId,
          balance: (userTokens.tokens.balance || 0) + selectedPackage.token_amount,
          last_updated: new Date(),
          created_at: userTokens.tokens.created_at || new Date()
        }
      };
    } catch (error) {
      console.error('Error purchasing tokens:', error);
      throw error;
    }
  },

  // Use tokens (deduct from balance)
  useTokens: async (userId, amount, description) => {
    try {
      // Validate that we have a valid UUID for user_id
      if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
        console.error('Invalid user_id format:', userId);
        throw new Error('Invalid user ID format');
      }

      if (!amount || isNaN(amount) || amount <= 0) {
        console.error('Invalid amount:', amount);
        throw new Error('Amount must be a positive number');
      }

      console.log(`Using ${amount} tokens for user ${userId} with description: ${description}`);
      
      // In a real implementation with API ready, uncomment this:
      // const response = await fetch(`${API_URL}/tokens/use`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ user_id: userId, amount, description })
      // });
      // if (!response.ok) throw new Error('Failed to use tokens');
      // return await response.json();
      
      // For now, simulate a successful token usage
      const mockUserTokens = await this.getUserTokens(userId);
      
      if (!mockUserTokens || mockUserTokens.balance < amount) {
        throw new Error('Insufficient token balance');
      }
      
      // Update the mock balance
      mockUserTokens.balance -= amount;
      
      // Add a transaction record
      mockUserTokens.transactions.unshift({
        id: `txn_${Date.now()}`,
        user_id: userId,
        amount: -amount,
        description: description || 'Token usage',
        created_at: new Date().toISOString(),
        type: 'usage'
      });
      
      return {
        success: true,
        balance: mockUserTokens.balance,
        amount: amount,
        description: description
      };
    } catch (error) {
      console.error('Error using tokens:', error);
      throw error;
    }
  },

  // Get user transaction history
  getUserTransactions: async (userId) => {
    try {
      // Validate that we have a valid UUID for user_id
      if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
        console.error('Invalid user_id format:', userId);
        throw new Error('Invalid user ID format');
      }

      console.log('Getting transaction history for user:', userId);
      
      // In a real implementation with API ready, uncomment this:
      // const response = await fetch(`${API_URL}/transactions/user/${userId}`);
      // if (!response.ok) throw new Error('Failed to fetch transactions');
      // return await response.json();
      
      // For now, return mock transaction data
      return [
        {
          id: 'txn_1',
          user_id: userId,
          amount: 1500, // $15.00
          description: 'Monthly subscription - Basic Plan',
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
          status: 'succeeded',
          type: 'subscription'
        },
        {
          id: 'txn_2',
          user_id: userId,
          amount: 2000, // $20.00
          description: 'Token purchase - 100 tokens',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
          status: 'succeeded',
          type: 'token_purchase'
        },
        {
          id: 'txn_3',
          user_id: userId,
          amount: 1000, // $10.00
          description: 'Token purchase - 50 tokens',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          status: 'succeeded',
          type: 'token_purchase'
        },
        {
          id: 'txn_4',
          user_id: userId,
          amount: 500, // $5.00
          description: 'Failed payment attempt',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          status: 'failed',
          type: 'token_purchase'
        }
      ];
    } catch (error) {
      console.error('Error getting user transactions:', error);
      return [];
    }
  },

  // Get user payment methods
  getUserPaymentMethods: async (userId) => {
    try {
      // Validate that we have a valid UUID for user_id
      if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
        console.error('Invalid user_id format:', userId);
        throw new Error('Invalid user ID format');
      }

      console.log('Getting payment methods for user:', userId);
      
      // In a real implementation with API ready, uncomment this:
      // const response = await fetch(`${API_URL}/payment-methods/user/${userId}`);
      // if (!response.ok) throw new Error('Failed to fetch payment methods');
      // return await response.json();
      
      // For now, return mock payment method data
      return [
        {
          id: 'pm_1',
          user_id: userId,
          last4: '4242',
          brand: 'Visa',
          expMonth: '12',
          expYear: '2025',
          isDefault: true
        },
        {
          id: 'pm_2',
          user_id: userId,
          last4: '1234',
          brand: 'Mastercard',
          expMonth: '08',
          expYear: '2026',
          isDefault: false
        }
      ];
    } catch (error) {
      console.error('Error getting user payment methods:', error);
      return [];
    }
  },

  // Add a payment method
  addPaymentMethod: async (userId, paymentMethodData) => {
    try {
      // Validate that we have a valid UUID for user_id
      if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
        console.error('Invalid user_id format:', userId);
        throw new Error('Invalid user ID format');
      }

      console.log('Adding payment method for user:', userId);
      
      // In a real implementation with API ready, uncomment this:
      // const response = await fetch(`${API_URL}/payment-methods`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ user_id: userId, ...paymentMethodData })
      // });
      // if (!response.ok) throw new Error('Failed to add payment method');
      // return await response.json();
      
      // For now, simulate a successful payment method addition
      return {
        success: true,
        paymentMethod: {
          id: `pm_${Date.now()}`,
          user_id: userId,
          last4: paymentMethodData.cardNumber.slice(-4),
          brand: 'Visa', // In a real implementation, this would be determined by the card number
          expMonth: paymentMethodData.expiryDate.split('/')[0],
          expYear: `20${paymentMethodData.expiryDate.split('/')[1]}`,
          isDefault: paymentMethodData.isDefault
        }
      };
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  },

  // Delete a payment method
  deletePaymentMethod: async (userId, paymentMethodId) => {
    try {
      // Validate that we have a valid UUID for user_id
      if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
        console.error('Invalid user_id format:', userId);
        throw new Error('Invalid user ID format');
      }

      console.log(`Deleting payment method ${paymentMethodId} for user ${userId}`);
      
      // In a real implementation with API ready, uncomment this:
      // const response = await fetch(`${API_URL}/payment-methods/${paymentMethodId}`, {
      //   method: 'DELETE',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ user_id: userId })
      // });
      // if (!response.ok) throw new Error('Failed to delete payment method');
      // return await response.json();
      
      // For now, simulate a successful payment method deletion
      return {
        success: true,
        message: 'Payment method deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  },

  // Set default payment method
  setDefaultPaymentMethod: async (userId, paymentMethodId) => {
    try {
      // Validate that we have a valid UUID for user_id
      if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
        console.error('Invalid user_id format:', userId);
        throw new Error('Invalid user ID format');
      }

      console.log(`Setting payment method ${paymentMethodId} as default for user ${userId}`);
      
      // In a real implementation with API ready, uncomment this:
      // const response = await fetch(`${API_URL}/payment-methods/${paymentMethodId}/default`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ user_id: userId })
      // });
      // if (!response.ok) throw new Error('Failed to set default payment method');
      // return await response.json();
      
      // For now, simulate a successful default payment method update
      return {
        success: true,
        message: 'Default payment method updated successfully'
      };
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  }
};

export default {
  subscriptionService
};
