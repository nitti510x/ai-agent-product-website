import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Custom storage implementation that handles errors
const customStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
    }
  }
};

// Safe auth state change handler
const safeAuthStateChangeHandler = (callback) => {
  return {
    data: {
      subscription: {
        unsubscribe: () => {
          console.log('Auth state change subscription unsubscribed safely');
        }
      }
    }
  };
};

// Initialize Supabase client with safe defaults
const initializeSupabase = () => {
  try {
    console.log('Initializing Supabase client with URL:', supabaseUrl);
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase URL or Anon Key');
      throw new Error('Supabase configuration is incomplete');
    }
    
    // Create client with safe defaults
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: customStorage,
        // Safe default for auth state change
        onAuthStateChange: safeAuthStateChangeHandler
      },
      global: {
        headers: {
          'x-client-info': '@supabase/javascript-client'
        },
        // Log errors in development
        fetch: (...args) => {
          return fetch(...args).catch(error => {
            console.error('Supabase fetch error:', error);
            throw error;
          });
        }
      },
      // Disable storage features to prevent errors
      storageOptions: {
        skipStorageAccess: true
      }
    });
    
    console.log('Supabase client initialized successfully');
    return client;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    // Return a minimal mock client to prevent app crashes
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: () => Promise.resolve({ error: null })
      },
      from: () => ({
        select: () => ({ data: [], error: null })
      })
    };
  }
};

// Export initialized client
export const supabase = initializeSupabase();

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const { data } = await supabase.auth.getSession();
    return !!data?.session;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};
