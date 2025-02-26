import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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

// Cancel subscription
app.put('/api/subscriptions/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      UPDATE subscriptions 
      SET cancel_at_period_end = true, updated_at = NOW() 
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await executeQuery(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
