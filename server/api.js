import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: resolve(__dirname, '..', '.env.development') });
} else {
  dotenv.config();
}

// Load swagger document
const swaggerDocument = JSON.parse(fs.readFileSync(resolve(__dirname, 'swagger.json'), 'utf8'));

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// PostgreSQL connection has been removed - now using agent.ops.geniusos.co endpoint

// API routes for plans have been removed - now using agent.ops.geniusos.co endpoint

// All API routes have been removed - now using agent.ops.geniusos.co endpoint
// Payment methods should be accessed via https://agent.ops.geniusos.co/payment-methods/

// Redirect any API requests to the external API
app.use('/api/*', (req, res) => {
  const externalApiBase = 'https://agent.ops.geniusos.co';
  const path = req.originalUrl.replace('/api', '');
  
  console.log(`Redirecting ${req.method} ${req.originalUrl} to external API: ${externalApiBase}${path}`);
  
  res.redirect(307, `${externalApiBase}${path}`);
});

// POST /api/payment-methods endpoint removed - now using external API

// DELETE /api/payment-methods/:id endpoint removed - now using external API

// POST /api/payment-methods/:id/default endpoint removed - now using external API

// All subscription routes removed - now using external API

// Health check endpoint for Railway
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API server is running' });
});

// Root route for API info
app.get('/api', (req, res) => {
  res.json({
    name: 'GeniusOS API',
    version: '1.0.0',
    description: 'API for GeniusOS subscription plans and user management',
    documentation: `http://localhost:${port}/api-docs`
  });
});

// Serve static files from the frontend build in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files
  app.use(express.static(resolve(__dirname, '..', 'dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(resolve(__dirname, '..', 'dist', 'index.html'));
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`API documentation available at http://localhost:${port}/api-docs`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`Frontend application served from the same server`);
  }
});
