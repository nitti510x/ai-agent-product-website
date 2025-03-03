#!/usr/bin/env node

/**
 * This script helps clean up the codebase after migrating to Supabase Edge Functions
 * It will:
 * 1. Remove the Express API server files
 * 2. Update package.json to remove unnecessary dependencies
 * 3. Update .env.example to remove unnecessary variables
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import dotenv from 'dotenv';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Files and directories to remove
const filesToRemove = [
  'api/server.js',
  'api/db.js',
  'api/swagger.json',
  'api/config',
  'api/migrations',
  'api/node_modules',
  'api/package.json',
  'api/package-lock.json',
  'api/.env',
  'api/.env.example'
];

async function main() {
  console.log('🧹 Starting cleanup after migration to Supabase Edge Functions');
  
  // Confirm with user
  const answer = await askQuestion(
    '⚠️ WARNING: This will remove the Express API server files. ' +
    'Make sure you have fully migrated to Supabase Edge Functions and tested everything. ' +
    'Do you want to continue? (y/n): '
  );
  
  if (answer.toLowerCase() !== 'y') {
    console.log('Cleanup aborted by user');
    rl.close();
    return;
  }
  
  try {
    // Step 1: Remove files
    console.log('\n🗑️ Removing Express API server files...');
    await removeFiles();
    
    // Step 2: Update package.json
    console.log('\n📦 Updating package.json...');
    await updatePackageJson();
    
    // Step 3: Update .env.example
    console.log('\n🔧 Updating .env.example...');
    await updateEnvExample();
    
    console.log('\n✅ Cleanup completed successfully!');
    console.log('\nNote: You may still need to update your frontend code if there are any remaining references to the Express API server.');
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  } finally {
    rl.close();
  }
}

async function removeFiles() {
  for (const file of filesToRemove) {
    const filePath = path.resolve(__dirname, '..', file);
    
    try {
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          // Skip node_modules for safety
          if (file === 'api/node_modules') {
            console.log(`⚠️ Skipping ${file} - please remove manually if needed`);
            continue;
          }
          
          fs.rmSync(filePath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(filePath);
        }
        
        console.log(`✅ Removed ${file}`);
      } else {
        console.log(`⚠️ File not found: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Error removing ${file}:`, error);
    }
  }
}

async function updatePackageJson() {
  const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
  
  try {
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Remove scripts related to the API server
      if (packageJson.scripts) {
        delete packageJson.scripts['api'];
        delete packageJson.scripts['api:dev'];
        delete packageJson.scripts['api:start'];
      }
      
      // Write updated package.json
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('✅ Updated package.json');
    } else {
      console.log('⚠️ package.json not found');
    }
  } catch (error) {
    console.error('❌ Error updating package.json:', error);
  }
}

async function updateEnvExample() {
  const envExamplePath = path.resolve(__dirname, '..', '.env.example');
  
  try {
    if (fs.existsSync(envExamplePath)) {
      let envExample = fs.readFileSync(envExamplePath, 'utf8');
      
      // Remove DATABASE_URL
      envExample = envExample.replace(/# Database\nDATABASE_URL=.*\n\n/g, '');
      
      // Set VITE_USE_LOCAL_API to false
      envExample = envExample.replace(/VITE_USE_LOCAL_API=true/g, 'VITE_USE_LOCAL_API=false');
      
      // Remove VITE_API_URL if it exists
      envExample = envExample.replace(/VITE_API_URL=.*\n/g, '');
      
      // Write updated .env.example
      fs.writeFileSync(envExamplePath, envExample);
      console.log('✅ Updated .env.example');
    } else {
      console.log('⚠️ .env.example not found');
    }
  } catch (error) {
    console.error('❌ Error updating .env.example:', error);
  }
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Run the script
main();
