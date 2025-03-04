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
const envDevFile = path.join(rootDir, '.env.development');

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

// Function to read .env.development file if it exists
function readEnvDevelopment() {
  try {
    if (fs.existsSync(envDevFile)) {
      return fs.readFileSync(envDevFile, 'utf8');
    }
    return '';
  } catch (error) {
    console.error('Error reading .env.development file:', error);
    return '';
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
    if (line.trim().startsWith('#') || !line.trim()) continue;
    
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
  try {
    let content = '# Environment Variables\n# Generated on ' + new Date().toISOString() + '\n\n';
    
    // Group variables by category
    const categories = {
      'Supabase': ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
      'Stripe': ['VITE_STRIPE_PUBLISHABLE_KEY', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
      'API Configuration': ['VITE_USE_LOCAL_API'],
      'Database': ['DATABASE_URL']
    };
    
    // Add variables by category
    for (const [category, keys] of Object.entries(categories)) {
      content += `# ${category}\n`;
      for (const key of keys) {
        if (envVars[key]) {
          content += `${key}=${envVars[key]}\n`;
        }
      }
      content += '\n';
    }
    
    // Add any remaining variables
    const handledKeys = Object.values(categories).flat();
    for (const [key, value] of Object.entries(envVars)) {
      if (!handledKeys.includes(key)) {
        content += `${key}=${value}\n`;
      }
    }
    
    fs.writeFileSync(envFile, content);
    console.log('\n.env file has been updated successfully!');
  } catch (error) {
    console.error('Error writing .env file:', error);
    process.exit(1);
  }
}

// Function to ask for a variable value
async function promptForVariable(key, defaultValue, description) {
  console.log(`\n${description || key}:`);
  if (defaultValue) {
    console.log(`Current value: ${defaultValue}`);
  }
  
  const answer = await new Promise(resolve => {
    rl.question(`${key}= (Press Enter to ${defaultValue ? 'keep current value' : 'skip'}): `, resolve);
  });
  
  return answer.trim() || defaultValue || '';
}

// Main function
async function main() {
  console.log('Setting up environment variables for Supabase and Stripe integration...');
  
  // Read .env.example, .env.development, and current .env
  const exampleContent = readEnvExample();
  const devContent = readEnvDevelopment();
  const currentContent = readCurrentEnv();
  
  // Parse env vars
  const exampleVars = parseEnvContent(exampleContent);
  const devVars = parseEnvContent(devContent);
  const currentVars = parseEnvContent(currentContent);
  
  // Merge vars, with current values taking precedence
  const mergedVars = { ...exampleVars, ...devVars, ...currentVars };
  
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
    const value = await promptForVariable(key, mergedVars[key], description);
    if (value) {
      mergedVars[key] = value;
    }
  }
  
  // Set VITE_USE_LOCAL_API
  const useLocalApi = await promptForVariable(
    'VITE_USE_LOCAL_API', 
    mergedVars.VITE_USE_LOCAL_API || 'false',
    'Use local API instead of Supabase Edge Functions? (true/false)'
  );
  mergedVars.VITE_USE_LOCAL_API = useLocalApi || 'false';
  
  // Update .env file
  updateEnvFile(mergedVars);
  
  console.log('\nDon\'t forget to run the database migration to create the required tables:');
  console.log('node scripts/create_stripe_tables.js');
  
  rl.close();
}

// Run the script
main();
