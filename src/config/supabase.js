import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWJzZHF0YmJuZnNwamxmdGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM1ODI0NTcsImV4cCI6MjAwOTE1ODQ1N30.mock-key'

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
      console.warn('Error writing to localStorage:', error);
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

// Safe auth state change handler
const safeAuthStateChangeHandler = (event, session) => {
  try {
    // Handle auth state change events
    if (event === 'SIGNED_OUT') {
      console.log('User signed out');
    } else if (event === 'SIGNED_IN') {
      console.log('User signed in');
    } else if (event === 'TOKEN_REFRESHED') {
      console.log('Token refreshed');
    } else if (event === 'USER_UPDATED') {
      console.log('User updated');
    }
  } catch (error) {
    console.error('Error in auth state change handler:', error);
  }
};

// Create a Supabase client with improved error handling
const createSupabaseClient = () => {
  if (typeof window === 'undefined') {
    // Return a mock client for SSR
    return {
      auth: {
        getSession: () => Promise.resolve(null),
        getUser: () => Promise.resolve(null),
        signOut: () => Promise.resolve(),
        onAuthStateChange: () => ({ data: null })
      }
    };
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: safeLocalStorage,
        onAuthStateChange: safeAuthStateChangeHandler,
        storageKey: 'supabase.auth.token',
        flowType: 'implicit'
      },
      global: {
        headers: {
          'X-Client-Info': 'geniusOS-AgentOps'
        }
      }
    });
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    // Return a mock client if creation fails
    return {
      auth: {
        getSession: () => Promise.resolve(null),
        getUser: () => Promise.resolve(null),
        signOut: () => Promise.resolve(),
        onAuthStateChange: () => ({ data: null })
      }
    };
  }
};

// Initialize the Supabase client
const supabase = createSupabaseClient();

// Add a flag to check if we're using mock credentials
export const isUsingMockSupabase = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const { data } = await supabase.auth.getSession();
    return !!data?.session;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
}

// Export both default and named export for backward compatibility
export { supabase };
export default supabase;