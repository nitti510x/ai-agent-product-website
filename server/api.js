import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from main .env file
dotenv.config({ path: resolve(__dirname, '..', '.env') });

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

// Redirect any API requests to the external API
app.use('/api/*', (req, res) => {
  const externalApiBase = 'https://agent.ops.geniusos.co';
  const path = req.originalUrl.replace('/api', '');
  
  console.log(`Redirecting ${req.method} ${req.originalUrl} to external API: ${externalApiBase}${path}`);
  
  res.redirect(307, `${externalApiBase}${path}`);
});

// Root route for API info
app.get('/api', (req, res) => {
  res.json({
    name: 'GeniusOS API',
    version: '1.0.0',
    description: 'API for GeniusOS subscription plans and user management'
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
  if (process.env.NODE_ENV === 'production') {
    console.log(`Frontend application served from the same server`);
  }
});
