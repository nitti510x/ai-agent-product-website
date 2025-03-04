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

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
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
    const plans = result.rows.map(plan => {
      // Handle different types of features storage
      let features = plan.features;
      
      // If features is a string, try to parse it as JSON
      if (typeof features === 'string') {
        try {
          features = JSON.parse(features);
        } catch (e) {
          console.error(`Error parsing features JSON for plan ${plan.id}:`, e);
          // Keep as is if parsing fails
        }
      }
      
      return {
        ...plan,
        features
      };
    });
    
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
    let features = plan.features;
    
    // If features is a string, try to parse it as JSON
    if (typeof features === 'string') {
      try {
        features = JSON.parse(features);
      } catch (e) {
        console.error(`Error parsing features JSON for plan ${plan.id}:`, e);
        // Keep as is if parsing fails
      }
    }
    
    res.json({
      ...plan,
      features
    });
  } catch (error) {
    console.error('Error fetching plan by ID:', error);
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
});

// In-memory storage for payment methods during development
const paymentMethodsStore = {
  // userId -> { payment_methods: [], default_payment_method: null }
};

// Payment Methods API routes
app.get('/api/payment-methods', (req, res) => {
  // Mock implementation for development
  console.log('GET /api/payment-methods called');
  
  // Extract user ID from auth header (in production this would verify the JWT)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Extract token and use it as user ID for simplicity in development
  const token = authHeader.split(' ')[1];
  const userId = token.split('.')[0]; // Use first part of token as mock user ID
  
  console.log('Getting payment methods for user:', userId);
  
  // Return stored payment methods or empty array
  const userStore = paymentMethodsStore[userId] || { 
    payment_methods: [],
    default_payment_method: null
  };
  
  res.json(userStore);
});

app.post('/api/payment-methods', (req, res) => {
  // Mock implementation for development
  console.log('POST /api/payment-methods called');
  
  // Extract user ID from auth header (in production this would verify the JWT)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Extract token and use it as user ID for simplicity in development
  const token = authHeader.split(' ')[1];
  const userId = token.split('.')[0]; // Use first part of token as mock user ID
  
  const { paymentMethodId } = req.body;
  if (!paymentMethodId) {
    return res.status(400).json({ error: 'Payment method ID is required' });
  }
  
  console.log(`Adding payment method ${paymentMethodId} for user ${userId}`);
  
  // Initialize user store if not exists
  if (!paymentMethodsStore[userId]) {
    paymentMethodsStore[userId] = {
      payment_methods: [],
      default_payment_method: null
    };
  }
  
  // Create a mock payment method
  const newPaymentMethod = {
    id: paymentMethodId,
    type: 'card',
    card: {
      brand: 'visa',
      last4: '4242',
      exp_month: 12,
      exp_year: 2030
    },
    billing_details: {
      name: 'Test User',
      email: 'test@example.com'
    },
    created: Date.now() / 1000
  };
  
  // Add to user's payment methods
  paymentMethodsStore[userId].payment_methods.push(newPaymentMethod);
  
  // If this is the first payment method, set it as default
  if (paymentMethodsStore[userId].payment_methods.length === 1) {
    paymentMethodsStore[userId].default_payment_method = paymentMethodId;
  }
  
  console.log('Updated payment methods store:', paymentMethodsStore[userId]);
  
  // In development, return success
  res.json({ 
    success: true,
    message: 'Payment method attached successfully',
    payment_method: newPaymentMethod
  });
});

app.delete('/api/payment-methods/:id', (req, res) => {
  // Mock implementation for development
  console.log('DELETE /api/payment-methods/:id called');
  
  // Extract user ID from auth header (in production this would verify the JWT)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Extract token and use it as user ID for simplicity in development
  const token = authHeader.split(' ')[1];
  const userId = token.split('.')[0]; // Use first part of token as mock user ID
  
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Payment method ID is required' });
  }
  
  console.log(`Removing payment method ${id} for user ${userId}`);
  
  // Check if user has payment methods
  if (!paymentMethodsStore[userId]) {
    return res.status(404).json({ error: 'No payment methods found for user' });
  }
  
  // Find payment method index
  const methodIndex = paymentMethodsStore[userId].payment_methods.findIndex(pm => pm.id === id);
  if (methodIndex === -1) {
    return res.status(404).json({ error: 'Payment method not found' });
  }
  
  // Remove payment method
  paymentMethodsStore[userId].payment_methods.splice(methodIndex, 1);
  
  // If this was the default payment method, update default
  if (paymentMethodsStore[userId].default_payment_method === id) {
    paymentMethodsStore[userId].default_payment_method = 
      paymentMethodsStore[userId].payment_methods.length > 0 
        ? paymentMethodsStore[userId].payment_methods[0].id 
        : null;
  }
  
  console.log('Updated payment methods store:', paymentMethodsStore[userId]);
  
  // In development, return success
  res.json({ 
    success: true,
    message: 'Payment method detached successfully'
  });
});

app.post('/api/payment-methods/:id/default', (req, res) => {
  // Mock implementation for development
  console.log('POST /api/payment-methods/:id/default called');
  
  // Extract user ID from auth header (in production this would verify the JWT)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Extract token and use it as user ID for simplicity in development
  const token = authHeader.split(' ')[1];
  const userId = token.split('.')[0]; // Use first part of token as mock user ID
  
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Payment method ID is required' });
  }
  
  console.log(`Setting payment method ${id} as default for user ${userId}`);
  
  // Check if user has payment methods
  if (!paymentMethodsStore[userId]) {
    return res.status(404).json({ error: 'No payment methods found for user' });
  }
  
  // Find payment method
  const methodExists = paymentMethodsStore[userId].payment_methods.some(pm => pm.id === id);
  if (!methodExists) {
    return res.status(404).json({ error: 'Payment method not found' });
  }
  
  // Set as default
  paymentMethodsStore[userId].default_payment_method = id;
  
  console.log('Updated payment methods store:', paymentMethodsStore[userId]);
  
  // In development, return success
  res.json({ 
    success: true,
    message: 'Default payment method set successfully'
  });
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

// Health check endpoint for Railway
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API server is running' });
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
