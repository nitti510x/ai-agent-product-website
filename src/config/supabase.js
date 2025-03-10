import { createClient } from '@supabase/supabase-js'

// Log environment variables for debugging
console.log('Environment check - VITE_SUPABASE_URL exists:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('Environment check - VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('Environment check - VITE_SITE_URL exists:', !!import.meta.env.VITE_SITE_URL);

// Get Supabase credentials from environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qdrtpsuqffsdocjrifwm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkcnRwc3VxZmZzZG9janJpZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NTM4NTMsImV4cCI6MjA1NjAyOTg1M30._qNhJuoI7nmmJxgCJ7JmqfLRYeTk1Kxr-V_N27sj8XE';
const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;

console.log('Using Supabase URL:', supabaseUrl);
console.log('Using Supabase Anon Key (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...');
console.log('Using Site URL for redirects:', siteUrl);

// Create a Supabase client with proper OAuth configuration
let supabase;

try {
  // Create the client with auth configuration
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: window.localStorage,
      storageKey: 'supabase.auth.token',
      redirectTo: `${siteUrl}/auth/callback`
    }
  });
  console.log('Supabase client created successfully with PKCE flow');
} catch (error) {
  console.error('Error creating Supabase client:', error);
  
  // Create a fallback client that redirects to Supabase auth directly
  supabase = {
    auth: {
      getSession: async () => {
        console.error('Using fallback getSession method');
        return { data: null, error: new Error('Supabase client initialization failed') };
      },
      getUser: async () => {
        console.error('Using fallback getUser method');
        return { data: null, error: new Error('Supabase client initialization failed') };
      },
      signOut: async () => {
        console.error('Using fallback signOut method');
        window.location.href = '/login';
        return { error: null };
      },
      onAuthStateChange: (callback) => {
        console.error('Using fallback onAuthStateChange method');
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      signInWithOAuth: async (params) => {
        console.error('Using fallback signInWithOAuth method');
        try {
          const provider = params.provider;
          const redirectTo = params.options?.redirectTo || `${siteUrl}/auth/callback`;
          
          // Construct a direct URL to the Supabase OAuth endpoint
          const authUrl = `${supabaseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectTo)}`;
          
          console.log('Redirecting to Supabase auth URL:', authUrl);
          window.location.href = authUrl;
          
          return { data: null, error: null };
        } catch (err) {
          console.error('Error in fallback signInWithOAuth:', err);
          return { data: null, error: err };
        }
      }
    }
  };
}

// Helper function to check if user is authenticated
const isAuthenticated = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
    return !!data.session;
  } catch (err) {
    console.error('Exception checking authentication:', err);
    return false;
  }
};

// Export both default and named export for backward compatibility
export { supabase, isAuthenticated };
export default supabase;