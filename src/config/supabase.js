import { createClient } from '@supabase/supabase-js'

// Log environment variables for debugging (values will be hidden in production)
console.log('Environment check - VITE_SUPABASE_URL exists:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('Environment check - VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qdrtpsuqffsdocjrifwm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkcnRwc3VxZmZzZG9janJpZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NTM4NTMsImV4cCI6MjA1NjAyOTg1M30._qNhJuoI7nmmJxgCJ7JmqfLRYeTk1Kxr-V_N27sj8XE';

// Safe storage functions with proper error handling
const safeLocalStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('Error setting localStorage:', error);
    }
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
    }
  }
};

// Create a Supabase client with improved error handling
const createSupabaseClient = () => {
  console.log('Creating Supabase client with URL:', supabaseUrl);
  
  try {
    // Create the client with minimal options first - no global headers to avoid the TypeError
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: safeLocalStorage
      }
    });
    
    console.log('Supabase client created successfully');
    return client;
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    // Return a minimal mock client if creation fails
    return {
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
};

// Initialize the Supabase client
const supabase = createSupabaseClient();

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