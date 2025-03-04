# Stripe Integration Setup

## Fixing the "Failed to load payment methods" Error

If you encounter the error "Failed to load payment methods: Failed to execute 'text' on 'Response': body stream already read" or similar errors related to payment methods, follow these steps to resolve the issue:

## 1. Create Required Database Tables

The error occurs because the necessary database tables for Stripe integration have not been created in your Supabase database. You have several options to create these tables:

### Option A: Run the Migration Script (Recommended)

If you have access to the database URL in your `.env` file, you can run the migration script directly:

```bash
# Make the script executable
chmod +x ./scripts/run_stripe_migration.sh

# Run the migration
./scripts/run_stripe_migration.sh
```

### Option B: Use the Supabase Dashboard

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the SQL from `supabase/migrations/20250302_stripe_integration.sql`
4. Run the SQL script

### Option C: Use the Node.js Script

If you have the Supabase service role key in your `.env` file, you can run the Node.js script:

```bash
node scripts/create_stripe_tables.js
```

## 2. Verify the Tables Were Created

You can verify that the tables were created successfully by running:

```bash
node scripts/check_stripe_tables.js
```

This will check if all the required tables exist and are accessible.

## 3. Deploy Edge Functions

After creating the tables, deploy the edge functions to ensure they're using the latest code:

```bash
npm run deploy:edge
```

## 4. Required Tables

The following tables need to be created:

1. `stripe_customers` - Links Supabase users to Stripe customers
2. `payment_methods` - Stores payment method information
3. `plans` - Stores subscription plan information
4. `subscriptions` - Stores user subscription information
5. `token_packages` - Stores token package information
6. `token_balances` - Stores user token balances
7. `token_transactions` - Stores token transaction history

## Troubleshooting

If you continue to experience issues after following these steps:

1. Check the browser console for specific error messages
2. Verify that your Stripe API keys are correctly set in your `.env` file
3. Make sure your Supabase JWT authentication is working correctly
4. Try clearing your browser cache and refreshing the page

For persistent issues, you may need to check the Supabase edge function logs through the Supabase dashboard.
