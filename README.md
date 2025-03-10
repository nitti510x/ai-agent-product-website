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
  - [OAuth Configuration](#oauth-configuration)
  - [Stripe Integration](#stripe-integration)
- [Development](#development)
- [Deployment](#deployment)

## Overview

GeniusOS AI Agents Platform provides a subscription-based service for accessing AI agents. Users can subscribe to different plans and purchase additional tokens for extended usage.

## Architecture

The application uses a modern serverless architecture with clear separation of concerns:

- **Frontend**: React application with Vite
- **External API**: All primary data operations use `agent.ops.geniusos.co`
- **Authentication**: Supabase Auth for SSO users only
- **Payments**: Stripe integration via Supabase Edge Functions only

### Data Flow Architecture

1. **Primary Data Source**: 
   - All application data (plans, subscriptions, tokens, etc.) is served from the external API at `agent.ops.geniusos.co`
   - The Railway PostgreSQL database stores plans and subscription data, accessed via the external API

2. **Supabase Usage (LIMITED SCOPE)**:
   - Supabase is used ONLY for:
     - User authentication (SSO)
     - Stripe payment processing via Edge Functions
   - No application data is stored in or retrieved from Supabase

> **IMPORTANT**: This application should NEVER implement any API services locally. All data operations (plans, subscriptions, tokens, etc.) MUST be accessed through the external API service at `agent.ops.geniusos.co`. This is a critical architectural requirement.

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

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ai-agents-geniusos-co.git
   cd ai-agents-geniusos-co
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see Configuration section)

4. Start the development servers:
   ```bash
   # Start the frontend
   npm run dev
   ```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Supabase Configuration (ONLY for authentication and Stripe payments)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Railway PostgreSQL (accessed via agent.ops.geniusos.co, not directly)
DATABASE_URL=postgresql://postgres:password@host:port/railway
```

### Railway PostgreSQL Configuration

1. Create a Railway PostgreSQL database at [railway.app](https://railway.app)
2. Get your connection string from the Railway dashboard
3. Add it to your `.env` file as `DATABASE_URL`
4. Run the setup script to initialize your environment:

### Supabase Configuration

Supabase is used ONLY for:
1. User authentication (SSO)
2. Stripe payment processing via Edge Functions

To configure Supabase:

1. Create a project at [supabase.com](https://supabase.com)
2. Enable email authentication in the Auth settings
3. Get your Supabase URL and anon key from the project settings
4. Add them to your `.env` file

### OAuth Configuration

The application uses OAuth providers (Google, Slack) for authentication. To configure OAuth:

#### Google OAuth Setup

1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/)
2. Go to "APIs & Services" > "Credentials"
3. Create an OAuth 2.0 Client ID (Web application)
4. Add authorized JavaScript origins:
   - Development: `http://localhost:5173` (fixed port in vite.config.js)
   - Production: `https://agentops.geniusos.co`
   - Supabase URL: `https://qdrtpsuqffsdocjrifwm.supabase.co`
5. Add authorized redirect URIs:
   - Development: `http://localhost:5173/auth/callback`
   - Production: `https://agentops.geniusos.co/auth/callback`
   - Supabase callback: `https://qdrtpsuqffsdocjrifwm.supabase.co/auth/v1/callback`

#### Slack OAuth Setup

1. Create a Slack app at [api.slack.com/apps](https://api.slack.com/apps)
2. Under "OAuth & Permissions", add redirect URLs:
   - Development: `http://localhost:5173/auth/callback`
   - Production: `https://agentops.geniusos.co/auth/callback`
   - Supabase callback: `https://qdrtpsuqffsdocjrifwm.supabase.co/auth/v1/callback`
3. Add the necessary scopes (typically `identity.basic`, `identity.email`)

#### Supabase OAuth Configuration

1. In the Supabase dashboard, go to Authentication > Providers
2. Enable and configure Google and Slack providers with the client IDs and secrets
3. Ensure the redirect URL in Supabase matches what you've configured in the OAuth providers

### Supabase Edge Functions

The application uses Supabase Edge Functions specifically for Stripe integration:

- `stripe-customers`: Handles customer creation and retrieval
- `stripe-payment-methods`: Handles payment method operations
- `stripe-subscriptions`: Handles subscription operations

These functions are only called during user authentication and payment processing flows. For more details, see the [SUPABASE_EDGE_FUNCTIONS.md](./SUPABASE_EDGE_FUNCTIONS.md) document.

### Stripe Integration

#### Setting Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard (Developers > API keys)
3. Add them to your `.env` file:
   - `VITE_STRIPE_PUBLISHABLE_KEY`: Your publishable key (starts with `pk_`)

#### Creating Products and Prices

1. Go to Products in your Stripe Dashboard
2. Create products for your subscription plans and token packages
3. For each product, create a price:
   - For subscription plans: Set as recurring
   - For token packages: Set as one-time

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

### API Endpoints

All primary application data is accessed through the external API at `agent.ops.geniusos.co`:

- `GET /api/plans` - Get all active subscription plans
- `GET /api/plans/{id}` - Get a specific plan by ID

### Supabase Edge Functions

The Supabase Edge Functions handle ONLY:
- User authentication via Supabase
- Stripe payment processing

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
