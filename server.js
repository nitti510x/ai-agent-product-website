import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:QZLxtAAYlkHPKWcXwbRGlrJpWjuvfEan@metro.proxy.rlwy.net:44666/railway',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoint to fetch plans
app.get('/api/plans', async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          id, 
          name, 
          description, 
          price, 
          interval,
          stripe_product_id,
          stripe_price_id,
          features
        FROM 
          plans 
        WHERE 
          active = true 
        ORDER BY 
          price
      `);
      
      // Format the response to match what the frontend expects
      const formattedPlans = result.rows.map(plan => ({
        ...plan,
        // Convert price from decimal to cents for frontend
        amount: plan.price === 0 ? 0 : Math.round(plan.price * 100),
        currency: 'usd',
        // Parse features if it's a string
        features: typeof plan.features === 'string' 
          ? JSON.parse(plan.features) 
          : plan.features
      }));
      
      res.json(formattedPlans);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// For any request that doesn't match an API route or static file, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
