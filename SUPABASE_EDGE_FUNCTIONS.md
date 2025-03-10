# Supabase Edge Functions for Authentication and Payments

This document outlines how Supabase Edge Functions are used specifically for user authentication and Stripe payment processing in the application.

## Data Flow Architecture

### Primary Data Source
- **Main Application Data**: All primary application data (plans, subscriptions, tokens, etc.) is served from the external API at `agent.ops.geniusos.co`
- **Supabase Usage**: Supabase is used ONLY for:
  1. User authentication (SSO)
  2. Stripe payment processing via Edge Functions

### Supabase Edge Functions

The application uses three Edge Functions specifically for Stripe integration:

- `stripe-customers`: Handles customer creation and retrieval
- `stripe-payment-methods`: Handles payment method operations
- `stripe-webhook`: Processes Stripe webhook events

These functions are only called during user authentication and payment processing flows.

### Frontend Utilities

The utility file `src/utils/edgeFunctions.js` provides a clean interface for interacting with the Edge Functions:

- Handles JWT token authentication for secure communication
- Provides fallback implementations for development testing
- Only used during authentication and payment flows

## Authentication Flow

The Edge Functions verify the JWT token from the Authorization header and extract the user ID from it. This approach ensures that only authenticated users can access their payment methods and customer data. The client-side code sends the JWT token in the Authorization header with each request to the edge functions.

## Database Structure

The application uses two separate database systems:

1. **Railway PostgreSQL**: Stores all primary application data
   - Plans and subscription data
   - Features column in plans table stores plan features as JSON data
   - All data is accessed via the `agent.ops.geniusos.co` API

2. **Supabase**: Used ONLY for:
   - User authentication
   - Credit card processing via Stripe

## Required Environment Variables

For Supabase Edge Functions:

- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for Edge Functions)
- `STRIPE_SECRET_KEY`: Stripe secret key (for Edge Functions)

## Deploying Edge Functions

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

4. **Deploy the Edge Functions**:
   ```bash
   supabase functions deploy --no-verify-jwt
   ```

5. **Update Stripe Webhook**:
   - Update your webhook endpoint in the Stripe dashboard to point to your Edge Function

## Benefits of This Architecture

- **Clear Separation of Concerns**: Supabase handles only authentication and payments
- **Simplified Data Management**: Main application data is centralized in one API
- **Enhanced Security**: JWT token authentication for sensitive payment operations
- **Serverless Payment Processing**: No need to maintain a separate payment server
- **Scalability**: Edge Functions automatically scale with your application's needs
