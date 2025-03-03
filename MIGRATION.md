# Migration to Supabase Edge Functions

This document outlines the changes made to migrate the application from using a local Express backend to Supabase Edge Functions for Stripe integration.

## Changes Made

### 1. Created Supabase Edge Functions

Created three Edge Functions to replace the Express backend API:

- `stripe-customers`: Handles customer creation and retrieval
- `stripe-payment-methods`: Handles payment method operations
- `stripe-webhook`: Processes Stripe webhook events

### 2. Created Frontend Utilities

Added a new utility file `src/utils/edgeFunctions.js` that provides a clean interface for interacting with the Edge Functions. This utility:

- Automatically detects development vs. production environments
- Uses the local Express server during development if needed
- Uses Supabase Edge Functions in production
- Handles authentication and headers

### 3. Updated Frontend Components

Modified the `PaymentMethods.jsx` component to use the new Edge Functions utility instead of making direct API calls to the local server.

### 4. Updated Environment Variables

Updated the `.env.example` file to include new variables needed for Supabase Edge Functions:

- `VITE_USE_LOCAL_API`: Toggle between local API and Edge Functions
- `VITE_API_URL`: URL for the local API server
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for Edge Functions)

### 5. Created Database Migration

Added a SQL migration file to create the necessary tables in Supabase:

- `stripe_customers`: Stores Stripe customer information
- `payment_methods`: Stores payment method information
- `plans`: Stores subscription plan information
- `subscriptions`: Stores user subscription information
- `token_packages`: Stores token package information
- `token_balances`: Stores user token balances
- `token_transactions`: Stores token transaction history

### 6. Created Migration Script

Added a script to help migrate data from the local database to Supabase:

- Migrates Stripe customers
- Migrates payment methods
- Migrates subscription plans
- Migrates user subscriptions

### 7. Added Documentation

Created comprehensive documentation:

- `supabase/README.md`: Instructions for setting up and deploying Edge Functions
- `MIGRATION.md`: Overview of the migration process

## How to Complete the Migration

1. **Install the Supabase CLI**:
   ```bash
   brew install supabase/tap/supabase
   ```

2. **Link Your Supabase Project**:
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the `supabase` directory with your Supabase and Stripe credentials
   - Update your root `.env` file with the new variables

4. **Run the Database Migration**:
   - Apply the SQL migration to your Supabase project using the Supabase dashboard or CLI

5. **Migrate Your Data** (if needed):
   ```bash
   node scripts/migrate-to-edge-functions.js
   ```

6. **Deploy the Edge Functions**:
   ```bash
   supabase functions deploy --no-verify-jwt
   ```

7. **Update Stripe Webhook**:
   - Update your webhook endpoint in the Stripe dashboard to point to your new Edge Function

8. **Test the Integration**:
   - Test the integration in development mode with `VITE_USE_LOCAL_API=true`
   - Test the integration in production mode with `VITE_USE_LOCAL_API=false`

9. **Deploy Your Frontend**:
   - Deploy your frontend with the updated environment variables

## Benefits of This Migration

- **Serverless Architecture**: No need to maintain a separate backend server
- **Simplified Deployment**: Deploy your frontend and Edge Functions separately
- **Reduced Costs**: Only pay for what you use
- **Improved Security**: Edge Functions run in a secure environment
- **Scalability**: Automatically scales with your application's needs
- **Unified Platform**: Keep all your backend logic within the Supabase ecosystem
