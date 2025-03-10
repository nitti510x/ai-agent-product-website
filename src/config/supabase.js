import { createClient } from '@supabase/supabase-js'

// Log environment variables for debugging (values will be hidden in production)
console.log('Environment check - VITE_SUPABASE_URL exists:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('Environment check - VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

// Get Supabase credentials from environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qdrtpsuqffsdocjrifwm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkcnRwc3VxZmZzZG9janJpZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NTM4NTMsImV4cCI6MjA1NjAyOTg1M30._qNhJuoI7nmmJxgCJ7JmqfLRYeTk1Kxr-V_N27sj8XE';

console.log('Using Supabase URL:', supabaseUrl);
console.log('Using Supabase Anon Key (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...');

// Function to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';
console.log('Is browser environment:', isBrowser);

// Create a minimal Supabase client with no extra options to avoid errors
let supabase;

// Wrap in a function to better handle errors
const initSupabase = () => {
  try {
    // Log browser capabilities for debugging
    if (isBrowser) {
      console.log('Browser features check:');
      console.log('- localStorage available:', !!window.localStorage);
      console.log('- sessionStorage available:', !!window.sessionStorage);
      console.log('- fetch available:', typeof fetch !== 'undefined');
    }
    
    // Check if URL is valid
    try {
      new URL(supabaseUrl);
      console.log('Supabase URL is valid');
    } catch (e) {
      console.error('Invalid Supabase URL format:', e.message);
      throw new Error(`Invalid Supabase URL: ${supabaseUrl}`);
    }
    
    // Check if anon key looks valid (basic format check)
    if (!supabaseAnonKey || supabaseAnonKey.length < 30) {
      console.error('Supabase Anon Key appears invalid (too short)');
      throw new Error('Invalid Supabase Anon Key format');
    }
    
    console.log('Creating Supabase client...');
    
    // Most basic client creation possible
    const client = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test if auth is available
    if (!client.auth) {
      throw new Error('Supabase client created but auth is not available');
    }
    
    console.log('Supabase client created successfully with auth methods available');
    return client;
  } catch (error) {
    // Detailed error logging
    console.error('Error creating Supabase client:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.cause) {
      console.error('Error cause:', error.cause);
    }
    
    // Create a mock client as fallback
    const mockClient = {
      auth: {
        getSession: () => {
          console.log('Using mock getSession');
          return Promise.resolve({ data: { session: null } });
        },
        getUser: () => {
          console.log('Using mock getUser');
          return Promise.resolve({ data: { user: null } });
        },
        signOut: () => {
          console.log('Using mock signOut');
          return Promise.resolve({ error: null });
        },
        onAuthStateChange: () => {
          console.log('Using mock onAuthStateChange');
          return { data: { subscription: { unsubscribe: () => {} } } };
        },
        signInWithOAuth: (options) => {
          console.error('Using mock signInWithOAuth due to client creation failure');
          console.error('Original error:', error.message);
          alert(`Authentication service error: ${error.message || 'Unknown error'}. Please try again later.`);
          return Promise.resolve({ error: new Error(`Failed to create Supabase client: ${error.message}`) });
        }
      }
    };
    
    return mockClient;
  }
};

// Initialize the Supabase client
supabase = initSupabase();

// Helper function to check if user is authenticated
const isAuthenticated = async () => {
  try {
    console.log('Checking authentication status...');
    const { data } = await supabase.auth.getSession();
    const isAuth = !!data.session;
    console.log('User is authenticated:', isAuth);
    return isAuth;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

// Export both default and named export for backward compatibility
export { supabase, isAuthenticated };
export default supabase;