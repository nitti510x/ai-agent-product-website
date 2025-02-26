import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { readFile } from 'fs/promises';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load and serve Swagger documentation
const loadSwagger = async () => {
  try {
    const swaggerData = await readFile(new URL('./swagger.json', import.meta.url), 'utf8');
    const swaggerDocument = JSON.parse(swaggerData);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('Swagger documentation available at /api-docs');
  } catch (error) {
    console.error('Error loading Swagger documentation:', error);
  }
};

loadSwagger();

// PostgreSQL connection
const pool = new pg.Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'metro.proxy.rlwy.net',
  database: process.env.POSTGRES_DB || 'railway',
  password: process.env.POSTGRES_PASSWORD || 'QZLxtAAYlkHPKWcXwbRGlrJpWjuvfEan',
  port: process.env.POSTGRES_PORT || 44666,
  ssl: {
    rejectUnauthorized: false
  }
});

// Helper function to execute SQL queries
const executeQuery = async (text, params = []) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
};

// API Routes

// Get user subscription
app.get('/api/subscriptions/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const query = `
      SELECT * FROM subscriptions 
      WHERE user_id = $1 AND status = 'active' 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    const result = await executeQuery(query, [userId]);
    res.json(result.rows[0] || null);
  } catch (error) {
    console.error('Error getting user subscription:', error);
    res.status(500).json({ error: 'Failed to get user subscription' });
  }
});

// Get all plans
app.get('/api/plans', async (req, res) => {
  try {
    const query = `SELECT * FROM plans WHERE active = true ORDER BY price ASC`;
    const result = await executeQuery(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting plans:', error);
    res.status(500).json({ error: 'Failed to get plans' });
  }
});

// Create subscription
app.post('/api/subscriptions', async (req, res) => {
  try {
    const { user_id, plan_id, status, current_period_start, current_period_end, cancel_at_period_end, metadata } = req.body;
    
    console.log('Creating subscription for user:', user_id);
    console.log('Subscription data:', req.body);
    
    // Validate that we have a valid UUID for user_id
    if (!user_id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user_id)) {
      console.error('Invalid user_id format:', user_id);
      return res.status(400).json({ error: 'Invalid user_id format. Must be a valid UUID.' });
    }
    
    const query = `
      INSERT INTO subscriptions (
        user_id, plan_id, status, current_period_start, current_period_end, 
        cancel_at_period_end, metadata, created_at, updated_at
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
    `;
    
    const values = [
      user_id, 
      plan_id, 
      status, 
      current_period_start, 
      current_period_end, 
      cancel_at_period_end, 
      JSON.stringify(metadata || {})
    ];
    
    console.log('Executing query with values:', values);
    
    const result = await executeQuery(query, values);
    console.log('Subscription created successfully:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription', details: error.message });
  }
});

// Cancel a subscription (set cancel_at_period_end to true)
app.put('/api/subscriptions/:subscriptionId/cancel', async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    
    // Validate subscription ID
    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID is required' });
    }
    
    // Update the subscription in the database
    const query = `
      UPDATE subscriptions
      SET cancel_at_period_end = true, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await executeQuery(query, [subscriptionId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription', details: error.message });
  }
});

// Reactivate a subscription (set cancel_at_period_end to false)
app.put('/api/subscriptions/:subscriptionId/reactivate', async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    
    // Validate subscription ID
    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID is required' });
    }
    
    // Update the subscription in the database
    const query = `
      UPDATE subscriptions
      SET cancel_at_period_end = false, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await executeQuery(query, [subscriptionId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    res.status(500).json({ error: 'Failed to reactivate subscription', details: error.message });
  }
});

// Get user token balance
app.get('/api/tokens/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate that we have a valid UUID for user_id
    if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      console.error('Invalid user_id format:', userId);
      return res.status(400).json({ error: 'Invalid user_id format. Must be a valid UUID.' });
    }
    
    // First check if user has a token balance record
    let query = `SELECT * FROM user_tokens WHERE user_id = $1`;
    let result = await executeQuery(query, [userId]);
    
    // If no record exists, create one with default values
    if (result.rows.length === 0) {
      query = `
        INSERT INTO user_tokens (user_id, balance, last_updated, created_at)
        VALUES ($1, 0, NOW(), NOW())
        RETURNING *
      `;
      result = await executeQuery(query, [userId]);
    }
    
    // Get the user's active subscription to check token limits
    const subscriptionQuery = `
      SELECT s.*, p.features
      FROM subscriptions s
      JOIN plans p ON s.plan_id = p.id
      WHERE s.user_id = $1 AND s.status = 'active' AND s.current_period_end > NOW()
      ORDER BY s.created_at DESC
      LIMIT 1
    `;
    
    const subscriptionResult = await executeQuery(subscriptionQuery, [userId]);
    const subscription = subscriptionResult.rows[0];
    
    // Get token transaction history
    const transactionQuery = `
      SELECT * FROM token_transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 20
    `;
    
    const transactionResult = await executeQuery(transactionQuery, [userId]);
    
    res.json({
      tokens: result.rows[0],
      subscription: subscription || null,
      transactions: transactionResult.rows
    });
  } catch (error) {
    console.error('Error getting user tokens:', error);
    res.status(500).json({ error: 'Failed to get user tokens', details: error.message });
  }
});

// Get available token packages
app.get('/api/tokens/packages', async (req, res) => {
  try {
    const query = `SELECT * FROM token_packages WHERE active = true ORDER BY token_amount ASC`;
    const result = await executeQuery(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting token packages:', error);
    res.status(500).json({ error: 'Failed to get token packages', details: error.message });
  }
});

// Purchase tokens
app.post('/api/tokens/purchase', async (req, res) => {
  try {
    const { user_id, package_id, payment_method_id } = req.body;
    
    // Validate that we have a valid UUID for user_id
    if (!user_id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user_id)) {
      console.error('Invalid user_id format:', user_id);
      return res.status(400).json({ error: 'Invalid user_id format. Must be a valid UUID.' });
    }
    
    // Check if user has an active subscription
    const subscriptionQuery = `
      SELECT * FROM subscriptions
      WHERE user_id = $1 AND status = 'active' AND current_period_end > NOW()
      LIMIT 1
    `;
    
    const subscriptionResult = await executeQuery(subscriptionQuery, [user_id]);
    if (subscriptionResult.rows.length === 0) {
      return res.status(403).json({ error: 'User must have an active subscription to purchase tokens' });
    }
    
    // Get the token package
    const packageQuery = `SELECT * FROM token_packages WHERE id = $1 AND active = true`;
    const packageResult = await executeQuery(packageQuery, [package_id]);
    
    if (packageResult.rows.length === 0) {
      return res.status(404).json({ error: 'Token package not found' });
    }
    
    const tokenPackage = packageResult.rows[0];
    
    // In a real application, you would process the payment here
    // For this example, we'll simulate a successful payment
    
    // Start a transaction
    await executeQuery('BEGIN');
    
    try {
      // Create a token transaction record
      const transactionQuery = `
        INSERT INTO token_transactions (user_id, amount, transaction_type, description, metadata)
        VALUES ($1, $2, 'purchase', $3, $4)
        RETURNING *
      `;
      
      const transactionValues = [
        user_id,
        tokenPackage.token_amount,
        `Purchased ${tokenPackage.name}`,
        JSON.stringify({
          package_id: tokenPackage.id,
          price: tokenPackage.price,
          payment_method_id: payment_method_id
        })
      ];
      
      const transactionResult = await executeQuery(transactionQuery, transactionValues);
      
      // Update the user's token balance
      const updateBalanceQuery = `
        INSERT INTO user_tokens (user_id, balance, last_updated)
        VALUES ($1, $2, NOW())
        ON CONFLICT (user_id)
        DO UPDATE SET
          balance = user_tokens.balance + $2,
          last_updated = NOW()
        RETURNING *
      `;
      
      const balanceResult = await executeQuery(updateBalanceQuery, [user_id, tokenPackage.token_amount]);
      
      // Commit the transaction
      await executeQuery('COMMIT');
      
      res.status(201).json({
        transaction: transactionResult.rows[0],
        tokens: balanceResult.rows[0]
      });
    } catch (error) {
      // Rollback the transaction if there's an error
      await executeQuery('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error purchasing tokens:', error);
    res.status(500).json({ error: 'Failed to purchase tokens', details: error.message });
  }
});

// Use tokens (deduct from balance)
app.post('/api/tokens/use', async (req, res) => {
  try {
    const { user_id, amount, description } = req.body;
    
    if (!user_id || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid request. User ID and positive amount are required.' });
    }
    
    // Start a transaction
    await executeQuery('BEGIN');
    
    try {
      // Check if user has enough tokens
      const balanceQuery = `SELECT * FROM user_tokens WHERE user_id = $1`;
      const balanceResult = await executeQuery(balanceQuery, [user_id]);
      
      let userTokens;
      
      if (balanceResult.rows.length === 0) {
        // Create a new record with 0 balance if it doesn't exist
        const insertQuery = `
          INSERT INTO user_tokens (user_id, balance, last_updated)
          VALUES ($1, 0, NOW())
          RETURNING *
        `;
        userTokens = (await executeQuery(insertQuery, [user_id])).rows[0];
      } else {
        userTokens = balanceResult.rows[0];
      }
      
      if (userTokens.balance < amount) {
        await executeQuery('ROLLBACK');
        return res.status(402).json({ 
          error: 'Insufficient tokens', 
          current_balance: userTokens.balance,
          required: amount
        });
      }
      
      // Create a token transaction record
      const transactionQuery = `
        INSERT INTO token_transactions (user_id, amount, transaction_type, description)
        VALUES ($1, $2, 'usage', $3)
        RETURNING *
      `;
      
      const transactionResult = await executeQuery(transactionQuery, [user_id, -amount, description || 'Token usage']);
      
      // Update the user's token balance
      const updateBalanceQuery = `
        UPDATE user_tokens
        SET balance = balance - $2, last_updated = NOW()
        WHERE user_id = $1
        RETURNING *
      `;
      
      const updatedBalance = await executeQuery(updateBalanceQuery, [user_id, amount]);
      
      // Commit the transaction
      await executeQuery('COMMIT');
      
      res.json({
        transaction: transactionResult.rows[0],
        tokens: updatedBalance.rows[0]
      });
    } catch (error) {
      // Rollback the transaction if there's an error
      await executeQuery('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error using tokens:', error);
    res.status(500).json({ error: 'Failed to use tokens', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
