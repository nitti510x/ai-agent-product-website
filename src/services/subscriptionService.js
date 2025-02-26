import { supabase } from '../config/supabase';
import pg from 'pg';
const { Pool } = pg;

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'metro.proxy.rlwy.net',
  database: process.env.POSTGRES_DB || 'railway',
  password: process.env.POSTGRES_PASSWORD || 'QZLxtAAYlkHPKWcXwbRGlrJpWjuvfEan',
  port: process.env.POSTGRES_PORT || 44666,
  ssl: {
    rejectUnauthorized: false // Required for Railway PostgreSQL
  }
});

// Helper function to execute SQL queries
const executeQuery = async (text, params = []) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

/**
 * Service for managing user subscriptions and tokens
 */
export const subscriptionService = {
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
   * Get subscription for a user
   * @param {string} userId - The user ID
   * @returns {Promise<Object|null>} The user's subscription or null if not found
   */
  getUserSubscription: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const query = `
        SELECT s.*, p.*
        FROM subscriptions s
        JOIN plans p ON s.plan_id = p.id
        WHERE s.user_id = $1
        ORDER BY s.created_at DESC
        LIMIT 1
      `;
      
      const result = await executeQuery(query, [userId]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const data = result.rows[0];
      
      // Format the subscription data
      return {
        id: data.id,
        user_id: data.user_id,
        plan_id: data.plan_id,
        status: data.status,
        current_period_start: data.current_period_start,
        current_period_end: data.current_period_end,
        cancel_at_period_end: data.cancel_at_period_end,
        created_at: data.created_at,
        updated_at: data.updated_at,
        features: data.features || {}
      };
    } catch (error) {
      console.error('Error getting user subscription:', error);
      return null;
    }
  },

  /**
   * Get all available subscription plans
   * @returns {Promise<Array>} Array of available plans
   */
  getPlans: async () => {
    try {
      const query = `
        SELECT * FROM plans
        WHERE active = true
        ORDER BY price ASC
      `;
      
      const result = await executeQuery(query);
      return result.rows || [];
    } catch (error) {
      console.error('Error getting plans:', error);
      return [];
    }
  },

  /**
   * Create a new subscription for a user
   * @param {Object} subscriptionData - The subscription data
   * @returns {Promise<Object>} The created subscription
   */
  createSubscription: async (subscriptionData) => {
    try {
      if (!subscriptionData.user_id || !subscriptionData.plan_id) {
        throw new Error('User ID and Plan ID are required');
      }

      // Set the current period start and end dates
      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setMonth(periodEnd.getMonth() + 1); // Default to 1 month

      const query = `
        INSERT INTO subscriptions (
          user_id, plan_id, status, current_period_start, 
          current_period_end, cancel_at_period_end, metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      const params = [
        subscriptionData.user_id,
        subscriptionData.plan_id,
        'active',
        now.toISOString(),
        periodEnd.toISOString(),
        false,
        JSON.stringify(subscriptionData.metadata || {})
      ];
      
      const result = await executeQuery(query, params);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  },

  /**
   * Cancel a subscription (set cancel_at_period_end to true)
   * @param {string} subscriptionId - The subscription ID
   * @returns {Promise<Object>} The updated subscription
   */
  cancelSubscription: async (subscriptionId) => {
    try {
      if (!subscriptionId) {
        throw new Error('Subscription ID is required');
      }

      const query = `
        UPDATE subscriptions
        SET cancel_at_period_end = true
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await executeQuery(query, [subscriptionId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  },

  /**
   * Reactivate a subscription (set cancel_at_period_end to false)
   * @param {string} subscriptionId - The subscription ID
   * @returns {Promise<Object>} The updated subscription
   */
  reactivateSubscription: async (subscriptionId) => {
    try {
      if (!subscriptionId) {
        throw new Error('Subscription ID is required');
      }

      const query = `
        UPDATE subscriptions
        SET cancel_at_period_end = false
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await executeQuery(query, [subscriptionId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw error;
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

      // Get user subscription
      const subscription = await subscriptionService.getUserSubscription(userId);

      // Get user token balance
      const tokenQuery = `
        SELECT * FROM user_tokens
        WHERE user_id = $1
      `;
      
      const tokenResult = await executeQuery(tokenQuery, [userId]);
      const tokenData = tokenResult.rows.length > 0 ? tokenResult.rows[0] : null;

      // Get token transactions
      const transactionQuery = `
        SELECT * FROM token_transactions
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 50
      `;
      
      const transactionResult = await executeQuery(transactionQuery, [userId]);
      const transactions = transactionResult.rows || [];

      return {
        subscription,
        tokens: tokenData || { balance: 0, user_id: userId },
        transactions: transactions
      };
    } catch (error) {
      console.error('Error getting user tokens:', error);
      // Return a default structure even on error
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
      const query = `
        SELECT * FROM token_packages
        WHERE active = true
        ORDER BY price ASC
      `;
      
      const result = await executeQuery(query);
      return result.rows || [];
    } catch (error) {
      console.error('Error getting token packages:', error);
      return [];
    }
  },

  /**
   * Purchase tokens
   * @param {string} userId - The user ID
   * @param {string} packageId - The token package ID
   * @param {string} [paymentMethodId] - Optional payment method ID for real payments
   * @returns {Promise<Object>} Object containing the transaction and updated token balance
   */
  purchaseTokens: async (userId, packageId, paymentMethodId) => {
    const client = await pool.connect();
    
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      if (!packageId) {
        throw new Error('Package ID is required');
      }

      // Start transaction
      await client.query('BEGIN');

      // Get the token package
      const packageQuery = `
        SELECT * FROM token_packages
        WHERE id = $1
      `;
      
      const packageResult = await client.query(packageQuery, [packageId]);
      
      if (packageResult.rows.length === 0) {
        throw new Error('Token package not found');
      }
      
      const packageData = packageResult.rows[0];

      // In a real implementation, you would process the payment here
      // For now, we'll just create a transaction and update the token balance

      // Create a transaction
      const transactionQuery = `
        INSERT INTO token_transactions (
          user_id, amount, transaction_type, description, metadata
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      
      const transactionParams = [
        userId,
        packageData.token_amount,
        'purchase',
        `Purchased ${packageData.name}`,
        JSON.stringify({
          package_id: packageId,
          payment_method_id: paymentMethodId
        })
      ];
      
      const transactionResult = await client.query(transactionQuery, transactionParams);
      const transactionData = transactionResult.rows[0];

      // Update or create user token balance
      const tokenQuery = `
        INSERT INTO user_tokens (user_id, balance)
        VALUES ($1, $2)
        ON CONFLICT (user_id)
        DO UPDATE SET balance = user_tokens.balance + $2, last_updated = NOW()
        RETURNING *
      `;
      
      const tokenResult = await client.query(tokenQuery, [userId, packageData.token_amount]);
      const tokenData = tokenResult.rows[0];

      // Commit transaction
      await client.query('COMMIT');

      return {
        transaction: transactionData,
        tokens: tokenData
      };
    } catch (error) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      console.error('Error purchasing tokens:', error);
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Use tokens (deduct from balance)
   * @param {string} userId - The user ID
   * @param {number} amount - The amount of tokens to use (positive number)
   * @param {string} description - Description of the token usage
   * @returns {Promise<Object>} Object containing the transaction and updated token balance
   */
  useTokens: async (userId, amount, description) => {
    const client = await pool.connect();
    
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      if (!amount || amount <= 0) {
        throw new Error('Amount must be a positive number');
      }

      // Start transaction
      await client.query('BEGIN');

      // Get current token balance
      const balanceQuery = `
        SELECT * FROM user_tokens
        WHERE user_id = $1
      `;
      
      const balanceResult = await client.query(balanceQuery, [userId]);
      const tokenData = balanceResult.rows.length > 0 ? balanceResult.rows[0] : null;
      
      const currentBalance = tokenData?.balance || 0;
      if (currentBalance < amount) {
        throw new Error('Insufficient tokens');
      }

      // Create a transaction (negative amount for usage)
      const transactionQuery = `
        INSERT INTO token_transactions (
          user_id, amount, transaction_type, description, metadata
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      
      const transactionParams = [
        userId,
        -amount, // Negative amount for usage
        'usage',
        description || 'Token usage',
        JSON.stringify({})
      ];
      
      const transactionResult = await client.query(transactionQuery, transactionParams);
      const transactionData = transactionResult.rows[0];

      // Update user token balance
      const tokenQuery = `
        UPDATE user_tokens
        SET balance = balance - $2, last_updated = NOW()
        WHERE user_id = $1
        RETURNING *
      `;
      
      const tokenResult = await client.query(tokenQuery, [userId, amount]);
      const updatedTokenData = tokenResult.rows[0];

      // Commit transaction
      await client.query('COMMIT');

      return {
        transaction: transactionData,
        tokens: updatedTokenData
      };
    } catch (error) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      console.error('Error using tokens:', error);
      throw error;
    } finally {
      client.release();
    }
  }
};

export default subscriptionService;
