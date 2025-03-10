import { createClient } from '@supabase/supabase-js'

// Log environment variables for debugging
console.log('Environment check - VITE_SUPABASE_URL exists:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('Environment check - VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

// Get Supabase credentials from environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qdrtpsuqffsdocjrifwm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkcnRwc3VxZmZzZG9janJpZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NTM4NTMsImV4cCI6MjA1NjAyOTg1M30._qNhJuoI7nmmJxgCJ7JmqfLRYeTk1Kxr-V_N27sj8XE';

console.log('Using Supabase URL:', supabaseUrl);
console.log('Using Supabase Anon Key (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...');

// Create a Supabase client with minimal options to avoid errors
let supabase;

try {
  // Create the client with minimal options
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  });
  console.log('Supabase client created successfully');
} catch (error) {
  console.error('Error creating Supabase client:', error);
  
  // Create a fallback client that redirects to Supabase auth directly
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      getUser: () => Promise.resolve({ data: { user: null } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithOAuth: (params) => {
        try {
          console.log('Using fallback OAuth redirect');
          const provider = params.provider;
          const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
          const redirectTo = params.options?.redirectTo || `${siteUrl}/auth/callback`;
          
          // Redirect directly to Supabase auth endpoint
          const authUrl = `${supabaseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectTo)}`;
          
          console.log('Redirecting to Supabase auth URL:', authUrl);
          window.location.href = authUrl;
          
          return Promise.resolve({ data: null, error: null });
        } catch (err) {
          console.error('Error in fallback OAuth redirect:', err);
          return Promise.resolve({ data: null, error: err });
        }
      }
    }
  };
}

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