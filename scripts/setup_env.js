#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const envFile = path.join(rootDir, '.env');
const envExampleFile = path.join(rootDir, '.env.example');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to read .env.example file
function readEnvExample() {
  try {
    return fs.readFileSync(envExampleFile, 'utf8');
  } catch (error) {
    console.error('Error reading .env.example file:', error);
    process.exit(1);
  }
}

// Function to read current .env file if it exists
function readCurrentEnv() {
  try {
    if (fs.existsSync(envFile)) {
      return fs.readFileSync(envFile, 'utf8');
    }
    return '';
  } catch (error) {
    console.error('Error reading .env file:', error);
    return '';
  }
}

// Function to parse env file content into key-value pairs
function parseEnvContent(content) {
  const envVars = {};
  if (!content) return envVars;

  const lines = content.split('\n');
  for (const line of lines) {
    // Skip comments and empty lines
    if (line.startsWith('#') || line.trim() === '') continue;

    // Parse key-value pairs
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      envVars[key] = value;
    }
  }

  return envVars;
}

// Function to update .env file
function updateEnvFile(envVars) {
  let content = '';
  
  // Read the example file to get structure and comments
  const exampleContent = readEnvExample();
  const exampleLines = exampleContent.split('\n');
  
  let currentSection = '';
  
  for (const line of exampleLines) {
    if (line.startsWith('#')) {
      // Keep comments and section headers
      content += line + '\n';
      
      // Track current section for better organization
      if (line.includes(':') || line.includes(' - ')) {
        currentSection = line;
      }
    } else if (line.trim() === '') {
      // Keep empty lines
      content += '\n';
    } else {
      // Handle variables
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        if (envVars[key] !== undefined) {
          content += `${key}=${envVars[key]}\n`;
          delete envVars[key]; // Remove processed variable
        } else {
          content += line + '\n'; // Keep original line if not in our vars
        }
      } else {
        content += line + '\n'; // Keep other lines as is
      }
    }
  }
  
  // Add any remaining variables that weren't in the example
  if (Object.keys(envVars).length > 0) {
    content += '\n# Additional Variables\n';
    for (const [key, value] of Object.entries(envVars)) {
      content += `${key}=${value}\n`;
    }
  }
  
  // Write to .env file
  fs.writeFileSync(envFile, content);
  console.log(`Environment file updated: ${envFile}`);
}

// Function to ask for a variable value
function promptForVariable(key, defaultValue, description) {
  return new Promise((resolve) => {
    const prompt = description 
      ? `Enter ${key} (${description}) [${defaultValue || 'leave empty'}]: `
      : `Enter ${key} [${defaultValue || 'leave empty'}]: `;
    
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultValue || '');
    });
  });
}

// Main function
async function main() {
  console.log('Setting up environment variables for Supabase and Stripe integration...');
  
  // Read .env.example and current .env
  const exampleContent = readEnvExample();
  const currentContent = readCurrentEnv();
  
  // Parse content into key-value pairs
  const exampleVars = parseEnvContent(exampleContent);
  const currentVars = parseEnvContent(currentContent);
  
  // Combine variables, with current values taking precedence
  const combinedVars = { ...exampleVars, ...currentVars };
  
  // Variables to prompt for
  const variablesToPrompt = [
    { key: 'VITE_SUPABASE_URL', description: 'Supabase URL (from Project Settings > API)' },
    { key: 'VITE_SUPABASE_ANON_KEY', description: 'Supabase Anon Key (from Project Settings > API)' },
    { key: 'SUPABASE_SERVICE_ROLE_KEY', description: 'Supabase Service Role Key (from Project Settings > API)' },
    { key: 'VITE_STRIPE_PUBLISHABLE_KEY', description: 'Stripe Publishable Key (from Stripe Dashboard > Developers > API keys)' },
    { key: 'STRIPE_SECRET_KEY', description: 'Stripe Secret Key (from Stripe Dashboard > Developers > API keys)' },
    { key: 'STRIPE_WEBHOOK_SECRET', description: 'Stripe Webhook Secret (from Stripe Dashboard > Developers > Webhooks)' },
    { key: 'DATABASE_URL', description: 'PostgreSQL Connection String (from Railway or Supabase)' }
  ];
  
  // Ask for each variable
  for (const { key, description } of variablesToPrompt) {
    if (!combinedVars[key]) {
      combinedVars[key] = await promptForVariable(key, '', description);
    }
  }
  
  // Set VITE_USE_LOCAL_API
  const useLocalApi = await promptForVariable(
    'VITE_USE_LOCAL_API', 
    combinedVars.VITE_USE_LOCAL_API || 'false',
    'Use local API instead of Supabase Edge Functions? (true/false)'
  );
  combinedVars.VITE_USE_LOCAL_API = useLocalApi || 'false';
  
  // Update .env file
  updateEnvFile(combinedVars);
  
  console.log('\nDon\'t forget to run the database migration to create the required tables:');
  console.log('node scripts/create_stripe_tables.js');
  
  console.log('Environment setup complete!');
  rl.close();
}

// Run the script
main();
