# GeniusOS AI Agents Platform

A comprehensive platform for AI agents with subscription management and token-based usage system.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
  - [Railway PostgreSQL Configuration](#railway-postgresql-configuration)
  - [Supabase Configuration](#supabase-configuration)
  - [Stripe Integration](#stripe-integration)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)

## Overview

GeniusOS AI Agents Platform provides a subscription-based service for accessing AI agents. Users can subscribe to different plans and purchase additional tokens for extended usage.

## Architecture

The application uses a modern serverless architecture:

- **Frontend**: React application with Vite
- **External API**: All data operations must use `agent.ops.geniusos.co`
- **Authentication**: Supabase Auth
- **Payments**: Stripe integration via the external API service

> **IMPORTANT**: This application should NEVER implement any API services locally. All data operations (plans, subscriptions, tokens, etc.) MUST be accessed through the external API service at `agent.ops.geniusos.co`. This is a critical architectural requirement.

## External API Service

The application relies exclusively on the external API service at `agent.ops.geniusos.co` for all data operations:

- **Plans and Pricing**: `/plans` endpoint for subscription plans
- **User Tokens**: Token management and usage tracking
- **Transactions**: Payment processing and history
- **Agent Configuration**: Settings and operational data for AI agents

All client-side code should make direct requests to the external API endpoints. No local API services or proxies should be implemented within this application.

## Features

- User authentication and management via Supabase
- Subscription plans with different tiers
- Token-based usage system
- Secure payment processing with Stripe
- Dashboard for managing subscriptions and tokens
- RESTful API for accessing subscription plans and managing user subscriptions

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **External API**: `agent.ops.geniusos.co` for all data operations
- **Authentication**: Supabase Auth
- **UI Components**: Custom components with FaRobot icons from react-icons/fa6
- **Styling**: Tailwind CSS with custom color scheme (#1A1E23 for content panels, #1F242B for sidebar)
- **Payment Processing**: Stripe (via external API)
- **Deployment**: Railway

## Installation

### Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL database
- Stripe account
- Supabase account

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-agents-geniusos-co.git
   cd ai-agents-geniusos-co
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd api
   npm install

   # Install frontend dependencies
   cd ..
   npm install
   ```

3. Set up environment variables (see Configuration section)

4. Run database migrations:
   ```bash
   # Execute the SQL migration file
   psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB -f api/migrations/stripe_tables.sql
   ```

5. Start the development servers:
   ```bash
   # Start backend
   cd api
   npm run dev

   # In another terminal, start frontend
   cd ..
   npm run dev
   ```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# API Configuration
VITE_USE_LOCAL_API=true  # Set to 'false' in production to use Supabase Edge Functions

# Railway PostgreSQL
DATABASE_URL=postgresql://postgres:password@host:port/railway
```

### Railway PostgreSQL Configuration

1. Create a Railway PostgreSQL database at [railway.app](https://railway.app)
2. Get your connection string from the Railway dashboard
3. Add it to your `.env` file as `DATABASE_URL`
4. Run the setup script to initialize your environment:
   ```bash
   node scripts/setup_env.js
   ```
5. Run the script to update plans in the database:
   ```bash
   node scripts/update_railway_plans_direct.js
   ```

### Supabase Configuration

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Set up authentication providers as needed
3. Get your Supabase URL and anon key from the project settings
4. Add them to your `.env` file

### Stripe Integration

#### Setting Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard (Developers > API keys)
3. Add them to your `.env` file:
   - `VITE_STRIPE_PUBLISHABLE_KEY`: Your publishable key (starts with `pk_`)
   - `STRIPE_SECRET_KEY`: Your secret key (starts with `sk_`)

#### Creating Products and Prices

1. Go to Products in your Stripe Dashboard
2. Create products for your subscription plans and token packages
3. For each product, create a price:
   - For subscription plans: Set as recurring
   - For token packages: Set as one-time
4. Update your Railway PostgreSQL database with the Stripe product and price IDs:
   - Edit the `scripts/update_stripe_ids.js` file with your actual Stripe IDs
   - Run the script to update the database:
     ```bash
     node scripts/update_stripe_ids.js
     ```

#### Setting Up Webhooks

1. Go to Developers > Webhooks in your Stripe Dashboard
2. Add an endpoint with your API URL: `https://your-api-domain.com/api/stripe/webhook`
3. Select events to listen for (at minimum: payment_intent.succeeded, customer.subscription.created/updated/deleted)
4. Copy the signing secret to your `.env` file as `STRIPE_WEBHOOK_SECRET`

#### Local Webhook Testing

For local development, use the Stripe CLI:

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Login to your Stripe account:
   ```bash
   stripe login
   ```
3. Forward webhook events to your local server:
   ```bash
   stripe listen --forward-to http://localhost:3001/api/stripe/webhook
   ```
4. Use the provided webhook signing secret for local testing

## Development

### Database Migrations

Database migrations are stored in the `api/migrations` directory. To apply migrations:

```bash
psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB -f api/migrations/stripe_tables.sql
```

### API Server

The API server is built with Supabase Edge Functions and handles:
- User authentication via Supabase
- Stripe payment processing
- Subscription management
- Token purchases and usage

To deploy the Edge Functions:

1. Install the Supabase CLI:
   ```bash
   brew install supabase/tap/supabase
   ```

2. Link your Supabase project:
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   ```

3. Deploy the Edge Functions:
   ```bash
   supabase functions deploy --no-verify-jwt
   ```

For local development, you can run the Edge Functions locally:

```bash
supabase functions serve --env-file ./supabase/.env
```

See the [Supabase Edge Functions documentation](https://supabase.com/docs/guides/functions) for more details.

### Frontend

The frontend is built with React and Vite. To start the frontend development server:

```bash
npm run dev
```

## API Documentation

The application includes a RESTful API for accessing subscription plans and managing user subscriptions. The API is documented using Swagger UI.

### Accessing the API Documentation

When running the development server, you can access the API documentation at:

```
http://localhost:3001/api-docs
```

### Available Endpoints

- `GET /api/plans` - Get all active subscription plans
- `GET /api/plans/{id}` - Get a specific plan by ID
- `GET /api/subscriptions` - Get the user's active subscription (requires authentication)
- `POST /api/subscriptions` - Create a new subscription (requires authentication)
- `POST /api/subscriptions/{id}/cancel` - Cancel a subscription (requires authentication)
- `POST /api/subscriptions/{id}/reactivate` - Reactivate a subscription (requires authentication)

### Authentication

Authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

The JWT token is obtained from Supabase authentication.

## Railway PostgreSQL Integration

The application uses Railway PostgreSQL for storing subscription plans and user subscriptions. The database schema includes:

### Plans Table

```sql
CREATE TABLE plans (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  stripe_product_id VARCHAR(100),
  stripe_price_id VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  interval VARCHAR(20) NOT NULL,
  features JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Subscriptions Table

```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  plan_id VARCHAR(50) NOT NULL REFERENCES plans(id),
  status VARCHAR(20) NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Database Setup

The database tables and initial data are set up using the `setup-database.js` script:

```bash
npm run setup-db
```

### Updating Plans

You can update the subscription plans in the database using the `update_railway_plans_direct.js` script:

```bash
node scripts/update_railway_plans_direct.js
```

## Deployment

### Railway Deployment

This project is configured for deployment on Railway:

1. Create a new project on Railway
2. Connect your GitHub repository
3. Add environment variables
4. Deploy the application

### Environment Variables for Production

For production deployment, make sure to:
1. Use production Stripe API keys
2. Update the webhook secret to the production value
3. Configure the correct API URL
