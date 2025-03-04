#!/bin/bash

# Script to deploy all Supabase Edge Functions

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI is not installed. Please install it first."
    echo "You can install it with: npm install -g supabase"
    exit 1
fi

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Navigate to the project directory
cd "$PROJECT_DIR"

# Deploy all edge functions
echo "Deploying all Supabase Edge Functions..."
supabase functions deploy --project-ref $(grep VITE_SUPABASE_URL .env | cut -d '=' -f2 | cut -d '/' -f5) stripe-payment-methods
supabase functions deploy --project-ref $(grep VITE_SUPABASE_URL .env | cut -d '=' -f2 | cut -d '/' -f5) stripe-customers

echo "Edge functions deployed successfully!"
