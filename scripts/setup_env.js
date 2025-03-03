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
    let content = '';
    for (const [key, value] of Object.entries(envVars)) {
      content += `${key}=${value}\n`;
    }
    
    fs.writeFileSync(envFile, content);
    console.log('\n.env file has been updated successfully!');
  } catch (error) {
    console.error('Error writing .env file:', error);
    process.exit(1);
  }
}

// Main function
async function main() {
  console.log('Setting up environment variables for Railway PostgreSQL integration...');
  
  // Read .env.example and current .env
  const exampleContent = readEnvExample();
  const currentContent = readCurrentEnv();
  
  // Parse env vars
  const exampleVars = parseEnvContent(exampleContent);
  const currentVars = parseEnvContent(currentContent);
  
  // Merge vars, with current values taking precedence
  const mergedVars = { ...exampleVars, ...currentVars };
  
  // Ask for DATABASE_URL if not set
  if (!mergedVars.DATABASE_URL || mergedVars.DATABASE_URL === 'postgresql://postgres:password@host:port/railway') {
    console.log('\nPlease enter your Railway PostgreSQL connection string:');
    console.log('Example: postgresql://postgres:password@host:port/railway');
    
    const answer = await new Promise(resolve => {
      rl.question('DATABASE_URL=', resolve);
    });
    
    if (answer.trim()) {
      mergedVars.DATABASE_URL = answer.trim();
    } else {
      console.log('Using default value for DATABASE_URL');
    }
  }
  
  // Update .env file
  updateEnvFile(mergedVars);
  
  rl.close();
}

// Run the script
main();
