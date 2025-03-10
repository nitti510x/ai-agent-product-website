import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWJzZHF0YmJuZnNwamxmdGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM1ODI0NTcsImV4cCI6MjAwOTE1ODQ1N30.mock-key'

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

// Create a Supabase client with custom storage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: customStorage
  },
  global: {
    headers: {
      'x-client-info': `@supabase/javascript-client`
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

// Safely set up auth state change listener
try {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('Supabase auth event:', event);
    if (event === "SIGNED_OUT") {
      console.log('User signed out');
    } else if (event === "SIGNED_IN") {
      console.log('User signed in');
    }
  });

  // Add unsubscribe method to window for debugging
  if (typeof window !== 'undefined') {
    window.__SUPABASE_AUTH_LISTENER__ = subscription;
  }
} catch (error) {
  console.error('Error setting up auth listener:', error);
}

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