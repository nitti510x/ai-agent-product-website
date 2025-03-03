# Supabase Edge Functions for Stripe Integration

This directory contains Supabase Edge Functions that handle Stripe integration for the application. These functions replace the Express.js backend server, allowing for a serverless architecture.

## Setup Instructions

### 1. Install the Supabase CLI

```bash
# For macOS
brew install supabase/tap/supabase

# For other platforms, see: https://github.com/supabase/cli#install-the-cli
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link Your Project

```bash
# Initialize Supabase in your project (if not already done)
supabase init

# Link to your existing Supabase project
supabase link --project-ref your-project-ref
```

### 4. Set Environment Variables

Create a `.env` file in the `supabase` directory with the following variables:

```
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 5. Test Locally

```bash
# Start the local development server
supabase start

# Serve a specific function
supabase functions serve stripe-customers --env-file ./supabase/.env
```

### 6. Deploy to Production

```bash
# Deploy all functions
supabase functions deploy --no-verify-jwt

# Or deploy a specific function
supabase functions deploy stripe-customers --no-verify-jwt
```

## Function Endpoints

### Stripe Customers

- **GET** `/functions/v1/stripe-customers?userId={userId}`
  - Get a customer by user ID
  
- **POST** `/functions/v1/stripe-customers`
  - Create a new customer
  - Body: `{ "userId": "...", "email": "...", "name": "..." }`

### Stripe Payment Methods

- **GET** `/functions/v1/stripe-payment-methods?userId={userId}`
  - Get payment methods for a user
  
- **POST** `/functions/v1/stripe-payment-methods`
  - Attach a payment method to a customer
  - Body: `{ "userId": "...", "paymentMethodId": "..." }`
  
- **DELETE** `/functions/v1/stripe-payment-methods/{paymentMethodId}?userId={userId}`
  - Detach a payment method

### Stripe Webhook

- **POST** `/functions/v1/stripe-webhook`
  - Handle Stripe webhook events
  - Requires `stripe-signature` header

## Database Schema

These functions expect the following tables to exist in your Supabase database:

1. `stripe_customers`
   - `user_id` (foreign key to auth.users)
   - `stripe_customer_id`
   - `email`
   - `name`

2. `payment_methods`
   - `user_id` (foreign key to auth.users)
   - `stripe_payment_method_id`
   - `is_default` (boolean)
   - `card_brand`
   - `card_last4`
   - `card_exp_month`
   - `card_exp_year`

3. `subscriptions`
   - `user_id` (foreign key to auth.users)
   - `plan_id` (foreign key to plans)
   - `stripe_subscription_id`
   - `status`
   - `current_period_start`
   - `current_period_end`
   - `cancel_at_period_end`

4. `plans`
   - `id`
   - `name`
   - `stripe_product_id`
   - `stripe_price_id`
   - `amount`
   - `currency`
   - `interval`

## Migrating from Express Backend

If you're migrating from the Express backend, make sure to:

1. Update your frontend code to use the Edge Functions
2. Set `VITE_USE_LOCAL_API=false` in your production environment
3. Deploy all the Edge Functions to Supabase
4. Update your Stripe webhook endpoint in the Stripe dashboard

## Troubleshooting

- If you encounter CORS issues, make sure your Supabase project has the correct CORS configuration
- For JWT verification errors, you may need to add `--no-verify-jwt` when deploying functions that don't require authentication
- For local development, make sure your `.env` file has all the required variables
