import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { readFile } from 'fs/promises';
import Stripe from 'stripe';
import supabase from './config/supabase.js';
import { migrate as dropStripeCustomersMigration } from './migrations/20250301_drop_stripe_customers.js';
import { migrate as createSupabaseTablesMigration } from './migrations/create_supabase_tables.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// For JSON parsing
app.use(express.json());

// Special handling for Stripe webhooks
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  if (req.originalUrl === '/api/stripe/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

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

// Stripe API Endpoints

// Get a Stripe customer by user ID
app.get('/api/stripe/customers', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Check if customer exists in Supabase
    const { data, error } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Supabase error:', error);
      throw error;
    }
    
    if (!data) {
      return res.json({ customerId: null });
    }
    
    res.json({ customerId: data.stripe_customer_id });
  } catch (error) {
    console.error('Error getting Stripe customer:', error);
    res.status(500).json({ error: 'Failed to get Stripe customer' });
  }
});

// Create a new Stripe customer
app.post('/api/stripe/customers', async (req, res) => {
  try {
    const { email, name, metadata } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Create customer in Stripe
    const customer = await stripe.customers.create({
      email,
      name,
      metadata
    });
    
    // Store customer in Supabase
    const { data, error } = await supabase
      .from('stripe_customers')
      .upsert({
        user_id: metadata.user_id,
        stripe_customer_id: customer.id,
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    res.status(201).json({ customerId: customer.id });
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    res.status(500).json({ error: 'Failed to create Stripe customer' });
  }
});

// Get payment methods for a user
app.get('/api/payment-methods/user/:userId', async (req, res) => {
  console.log(`Received request for payment methods for user: ${req.params.userId}`);
  try {
    const { userId } = req.params;
    
    // Check if we're in development mode without proper environment variables
    if (process.env.NODE_ENV === 'development' && (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY || !process.env.STRIPE_SECRET_KEY)) {
      console.log('Running in development mode with mock data');
      // Return mock payment methods for development
      const mockData = [
        {
          id: 'pm_mock_1',
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            exp_month: 12,
            exp_year: 2025
          },
          metadata: {
            is_default: 'true'
          }
        },
        {
          id: 'pm_mock_2',
          type: 'card',
          card: {
            brand: 'mastercard',
            last4: '5555',
            exp_month: 10,
            exp_year: 2024
          },
          metadata: {
            is_default: 'false'
          }
        }
      ];
      console.log('Returning mock data:', JSON.stringify(mockData));
      return res.json(mockData);
    }

    // Check if Supabase is configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      return res.status(500).json({ error: 'Supabase is not configured' });
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Stripe is not configured' });
    }

    // Get customer ID from Supabase
    const { data: customerData, error: customerError } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', userId)
      .single();

    if (customerError) {
      console.error('Error fetching customer ID:', customerError);
      return res.status(404).json({ error: 'Customer not found' });
    }

    const customerId = customerData?.customer_id;

    if (!customerId) {
      return res.json([]);
    }

    // Get payment methods from Stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card'
    });

    res.json(paymentMethods.data);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
});

// Add a payment method to a customer
app.post('/api/stripe/payment-methods', async (req, res) => {
  try {
    const { customerId, paymentMethodId, userId } = req.body;
    
    if (!customerId || !paymentMethodId) {
      return res.status(400).json({ error: 'Customer ID and Payment Method ID are required' });
    }
    
    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId
    });
    
    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });
    
    // Get payment method details
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    
    // Store payment method in Supabase
    if (userId) {
      // First, update all existing payment methods to not be default
      const { error: updateError } = await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error('Supabase error updating existing payment methods:', updateError);
      }
      
      // Then add the new payment method as default
      const { error } = await supabase
        .from('payment_methods')
        .upsert({
          user_id: userId,
          stripe_payment_method_id: paymentMethodId,
          is_default: true,
          card_brand: paymentMethod.card?.brand,
          card_last4: paymentMethod.card?.last4,
          card_exp_month: paymentMethod.card?.exp_month,
          card_exp_year: paymentMethod.card?.exp_year,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Supabase error:', error);
        // Continue even if there's an error with Supabase
      }
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error adding payment method:', error);
    res.status(500).json({ error: 'Failed to add payment method' });
  }
});

// Delete a payment method
app.delete('/api/stripe/payment-methods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Payment Method ID is required' });
    }
    
    // Detach payment method from customer
    await stripe.paymentMethods.detach(id);
    
    // Remove from Supabase if userId is provided
    if (userId) {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('stripe_payment_method_id', id)
        .eq('user_id', userId);
      
      if (error) {
        console.error('Supabase error:', error);
        // Continue even if there's an error with Supabase
      }
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({ error: 'Failed to delete payment method' });
  }
});

// Create a subscription
app.post('/api/stripe/subscriptions', async (req, res) => {
  try {
    const { customerId, priceId, paymentMethodId } = req.body;
    
    if (!customerId || !priceId) {
      return res.status(400).json({ error: 'Customer ID and Price ID are required' });
    }
    
    // Set the payment method as the default
    if (paymentMethodId) {
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });
    }
    
    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent']
    });
    
    res.status(201).json(subscription);
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Create a payment intent for token purchase
app.post('/api/stripe/payment-intents', async (req, res) => {
  try {
    const { customerId, amount, metadata } = req.body;
    
    if (!customerId || !amount) {
      return res.status(400).json({ error: 'Customer ID and amount are required' });
    }
    
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: customerId,
      metadata,
      automatic_payment_methods: {
        enabled: true
      }
    });
    
    res.status(201).json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Stripe webhook handler
app.post('/api/stripe/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful:', paymentIntent.id);
      
      // If this is a token purchase, add tokens to the user's account
      if (paymentIntent.metadata.type === 'token_purchase') {
        const userId = paymentIntent.metadata.user_id;
        const tokenAmount = parseInt(paymentIntent.metadata.token_amount, 10);
        
        if (userId && tokenAmount) {
          try {
            // Add tokens to user's account in Railway PostgreSQL
            const query = `
              INSERT INTO token_transactions (
                user_id, amount, type, reference_id, created_at
              )
              VALUES ($1, $2, 'purchase', $3, NOW())
            `;
            
            await executeQuery(query, [userId, tokenAmount, paymentIntent.id]);
            console.log(`Added ${tokenAmount} tokens to user ${userId}`);
          } catch (error) {
            console.error('Error adding tokens to user account:', error);
          }
        }
      }
      break;
      
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object;
      console.log('Subscription was created or updated:', subscription.id);
      
      // Update subscription in Railway PostgreSQL
      try {
        // Get user ID from customer metadata
        const customer = await stripe.customers.retrieve(subscription.customer);
        const userId = customer.metadata.user_id;
        
        if (!userId) {
          console.error('No user_id found in customer metadata');
          break;
        }
        
        // Get plan details from price
        const price = await stripe.prices.retrieve(subscription.items.data[0].price.id, {
          expand: ['product']
        });
        
        const planId = price.product.metadata.plan_id || 'default';
        
        // Update or create subscription in Railway PostgreSQL
        const query = `
          INSERT INTO subscriptions (
            user_id, plan_id, status, current_period_start, current_period_end,
            cancel_at_period_end, metadata, stripe_subscription_id, created_at, updated_at
          )
          VALUES ($1, $2, $3, to_timestamp($4), to_timestamp($5), $6, $7, $8, NOW(), NOW())
          ON CONFLICT (user_id) DO UPDATE
          SET plan_id = $2, status = $3, current_period_start = to_timestamp($4),
              current_period_end = to_timestamp($5), cancel_at_period_end = $6,
              metadata = $7, stripe_subscription_id = $8, updated_at = NOW()
          RETURNING *
        `;
        
        const values = [
          userId,
          planId,
          subscription.status,
          subscription.current_period_start,
          subscription.current_period_end,
          subscription.cancel_at_period_end,
          JSON.stringify({
            stripe_customer_id: subscription.customer,
            stripe_subscription_id: subscription.id
          }),
          subscription.id
        ];
        
        await executeQuery(query, values);
        console.log(`Updated subscription for user ${userId}`);
      } catch (error) {
        console.error('Error updating subscription in database:', error);
      }
      break;
      
    case 'customer.subscription.deleted':
      const canceledSubscription = event.data.object;
      console.log('Subscription was canceled:', canceledSubscription.id);
      
      // Update subscription status in Railway PostgreSQL
      try {
        const query = `
          UPDATE subscriptions
          SET status = 'canceled', updated_at = NOW()
          WHERE stripe_subscription_id = $1
        `;
        
        await executeQuery(query, [canceledSubscription.id]);
        console.log(`Marked subscription ${canceledSubscription.id} as canceled`);
      } catch (error) {
        console.error('Error updating subscription status in database:', error);
      }
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Log environment variables for debugging
  console.log('Database URL:', process.env.DATABASE_URL || process.env.RAILWAY_DATABASE_URL || 'Not set');
  
  // Run database migrations
  try {
    // Run the migration to drop the stripe_customers table
    const dropMigrationResult = await dropStripeCustomersMigration();
    console.log('Drop migration result:', dropMigrationResult);
    
    // Run the migration to create Supabase tables
    const createTablesResult = await createSupabaseTablesMigration();
    console.log('Create tables migration result:', createTablesResult);
  } catch (error) {
    console.error('Error running migrations:', error);
  }
});
