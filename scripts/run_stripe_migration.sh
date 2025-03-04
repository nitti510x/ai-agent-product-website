#!/bin/bash
# Script to run the Stripe migration directly using psql

# Load environment variables from .env file
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set in .env file"
  exit 1
fi

# Path to migration file
MIGRATION_FILE="./supabase/migrations/20250302_stripe_integration.sql"

# Check if migration file exists
if [ ! -f "$MIGRATION_FILE" ]; then
  echo "Error: Migration file not found at $MIGRATION_FILE"
  exit 1
fi

echo "Running Stripe migration..."
psql "$DATABASE_URL" -f "$MIGRATION_FILE"

if [ $? -eq 0 ]; then
  echo "Migration completed successfully!"
else
  echo "Error: Migration failed"
  exit 1
fi

echo "Verifying tables..."
psql "$DATABASE_URL" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('stripe_customers', 'payment_methods', 'plans', 'subscriptions', 'token_packages', 'token_balances', 'token_transactions');"

echo "Done!"
