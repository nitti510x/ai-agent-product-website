import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: resolve(__dirname, '..', '.env.development') });
} else {
  dotenv.config();
}

// Load swagger document
const swaggerDocument = JSON.parse(fs.readFileSync(resolve(__dirname, 'swagger.json'), 'utf8'));

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Create a PostgreSQL connection pool
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Add error handler for the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

// API routes
app.get('/api/plans', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM plans WHERE active = true ORDER BY price ASC');
    
    // Process the features column which is stored as JSON
    const plans = result.rows.map(plan => ({
      ...plan,
      features: typeof plan.features === 'string' 
        ? JSON.parse(plan.features) 
        : plan.features
    }));
    
    res.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

app.get('/api/plans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM plans WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    const plan = result.rows[0];
    
    // Process the features column which is stored as JSON
    res.json({
      ...plan,
      features: typeof plan.features === 'string' 
        ? JSON.parse(plan.features) 
        : plan.features
    });
  } catch (error) {
    console.error('Error fetching plan by ID:', error);
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
});

// Subscription routes (to be implemented)
app.get('/api/subscriptions', (req, res) => {
  // This route requires authentication
  res.status(501).json({ error: 'Not implemented yet' });
});

app.post('/api/subscriptions', (req, res) => {
  // This route requires authentication
  res.status(501).json({ error: 'Not implemented yet' });
});

app.post('/api/subscriptions/:id/cancel', (req, res) => {
  // This route requires authentication
  res.status(501).json({ error: 'Not implemented yet' });
});

app.post('/api/subscriptions/:id/reactivate', (req, res) => {
  // This route requires authentication
  res.status(501).json({ error: 'Not implemented yet' });
});

// Root route for API info
app.get('/api', (req, res) => {
  res.json({
    name: 'GeniusOS API',
    version: '1.0.0',
    description: 'API for GeniusOS subscription plans and user management',
    documentation: `http://localhost:${port}/api-docs`
  });
});

// Serve static files from the frontend build in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files
  app.use(express.static(resolve(__dirname, '..', 'dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(resolve(__dirname, '..', 'dist', 'index.html'));
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`API documentation available at http://localhost:${port}/api-docs`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`Frontend application served from the same server`);
  }
});
