import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { subscriptionService } from '../src/config/postgres.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the database
async function initializeDatabase() {
  console.log('Initializing database...');
  
  try {
    // Create tables and default data
    await subscriptionService.initializeTables();
    
    console.log('Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();
