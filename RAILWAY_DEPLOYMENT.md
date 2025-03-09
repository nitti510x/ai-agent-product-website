# Railway Deployment Guide for GeniusOS

This guide provides step-by-step instructions for deploying the GeniusOS application to Railway.

## Prerequisites

- A Railway account (https://railway.app)
- Git repository connected to Railway
- Railway CLI installed (optional, for local testing)

## Deployment Steps

1. **Create a new project in Railway**

   - Log in to your Railway account
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub repository

2. **Configure Environment Variables**

   Set the following environment variables in Railway:

   ```
   NODE_ENV=production
   PORT=3001 (Railway will override this)
   CORS_ORIGIN=${RAILWAY_PUBLIC_DOMAIN}
   VITE_SUPABASE_URL=https://qdrtpsuqffsdocjrifwm.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_USE_LOCAL_API=true
   VITE_AGENT_API_URL=https://agent.ops.geniusos.co
   ```

   Note: Replace sensitive keys with your actual keys. Railway will automatically set `RAILWAY_PUBLIC_DOMAIN` to your deployment URL.

3. **Deploy the Application**

   - Railway will automatically deploy your application based on the configuration in `railway.json`
   - The deployment will use the `npm run build` command to build the frontend and `npm start` to run the server

4. **Verify Deployment**

   - Once deployed, Railway will provide a URL to access your application
   - Verify that the application is running by visiting the URL
   - Check the health endpoint at `/api/health` to ensure the API is functioning correctly

## Troubleshooting

- **Health Check Failures**: If the health check fails, check the logs in Railway to identify the issue
- **Build Failures**: Ensure that all dependencies are properly listed in package.json
- **Environment Variables**: Double-check that all required environment variables are set correctly

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway CLI Documentation](https://docs.railway.app/develop/cli)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
