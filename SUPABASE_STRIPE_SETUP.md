# Supabase Stripe Integration Setup

## Important Architecture Note

This document ONLY applies to the Stripe payment processing integration with Supabase. It does NOT affect the main application data flow.

- **Main Application Data**: All primary application data (plans, subscriptions, tokens, etc.) is served from the external API at `agent.ops.geniusos.co`
- **Supabase Usage**: Supabase is used ONLY for user authentication (SSO) and Stripe payment processing

## Issue

The "Failed to load payment methods: API error: 400 Bad Request" error occurs because the necessary database tables for Stripe payment processing have not been created in your Supabase database.

## Solution

You need to run the SQL script to create the required tables in Supabase for payment processing only.

### Option 1: Run the SQL Script through Supabase Dashboard

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the SQL from `supabase/migrations/20250302_stripe_integration.sql`
4. Run the SQL script

### Option 2: Run the Script through Supabase CLI

If you have the Supabase CLI installed and configured:

```bash
supabase db push
```

### Option 3: Check Table Status

You can check if the required tables exist by running:

```bash
node scripts/check_stripe_tables.js
```

Note: This requires your `.env` file to have the correct Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Required Tables in Supabase

The following tables need to be created in Supabase ONLY for payment processing:

1. `stripe_customers` - Links Supabase users to Stripe customers
2. `payment_methods` - Stores payment method information
3. `plans` - Stores subscription plan information
4. `subscriptions` - Stores user subscription information
5. `token_packages` - Stores token package information
6. `token_balances` - Stores user token balances
7. `token_transactions` - Stores token transaction history

## After Setup

After running the SQL script, the payment methods functionality should work correctly. The edge functions have been updated to handle the case when tables don't exist more gracefully, providing clearer error messages.

Remember that these tables are ONLY used for Stripe payment processing. All other application data comes from the external API at `agent.ops.geniusos.co`.
