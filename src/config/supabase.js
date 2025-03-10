import { createClient } from '@supabase/supabase-js'

// Log environment variables for debugging (values will be hidden in production)
console.log('Environment check - VITE_SUPABASE_URL exists:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('Environment check - VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

// Get Supabase credentials from environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qdrtpsuqffsdocjrifwm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkcnRwc3VxZmZzZG9janJpZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NTM4NTMsImV4cCI6MjA1NjAyOTg1M30._qNhJuoI7nmmJxgCJ7JmqfLRYeTk1Kxr-V_N27sj8XE';

console.log('Using Supabase URL:', supabaseUrl);

// Create a minimal Supabase client with no extra options to avoid errors
let supabase;

try {
  // Most basic client creation possible
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Supabase client created successfully');
} catch (error) {
  console.error('Error creating Supabase client:', error);
  
  // Create a mock client as fallback
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      getUser: () => Promise.resolve({ data: { user: null } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithOAuth: (options) => {
        console.error('Using mock signInWithOAuth due to client creation failure');
        alert('Authentication service is currently unavailable. Please try again later.');
        return Promise.resolve({ error: new Error('Failed to create Supabase client') });
      }
    }
  };
}

// Helper function to check if user is authenticated
const isAuthenticated = async () => {
  try {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

// Export both default and named export for backward compatibility
export { supabase, isAuthenticated };
export default supabase;