import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables:');
  console.error('SUPABASE_URL:', supabaseUrl ? 'defined' : 'undefined');
  console.error('SUPABASE_SERVICE_KEY:', supabaseServiceKey ? 'defined' : 'undefined');
  throw new Error('Missing Supabase environment variables');
}

// Create a Supabase client with the service key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;
