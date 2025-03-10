import { createClient } from '@supabase/supabase-js'

// Log environment variables for debugging
console.log('Environment check - VITE_SUPABASE_URL exists:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('Environment check - VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

// Get Supabase credentials from environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qdrtpsuqffsdocjrifwm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkcnRwc3VxZmZzZG9janJpZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NTM4NTMsImV4cCI6MjA1NjAyOTg1M30._qNhJuoI7nmmJxgCJ7JmqfLRYeTk1Kxr-V_N27sj8XE';

console.log('Using Supabase URL:', supabaseUrl);
console.log('Using Supabase Anon Key (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...');

// Create a mock Supabase client that handles OAuth redirects without using the actual Supabase client
// This is a workaround for the "Cannot read properties of undefined (reading 'headers')" error
const mockSupabaseClient = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    getUser: () => Promise.resolve({ data: { user: null } }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithOAuth: (params) => {
      try {
        console.log('Using direct OAuth redirect instead of Supabase client');
        const provider = params.provider;
        const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
        const redirectTo = params.options?.redirectTo || `${siteUrl}/auth/callback`;
        
        // Construct the OAuth URL manually
        // This bypasses the Supabase client entirely and directly redirects to the OAuth provider
        let oauthUrl;
        
        if (provider === 'google') {
          // Redirect directly to Google OAuth
          const googleClientId = '1234567890-example.apps.googleusercontent.com'; // Replace with your actual Google client ID
          oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectTo)}&response_type=code&scope=email%20profile`;
        } else if (provider === 'slack' || provider === 'slack_oidc') {
          // Redirect directly to Slack OAuth
          const slackClientId = '1234567890.1234567890'; // Replace with your actual Slack client ID
          oauthUrl = `https://slack.com/oauth/v2/authorize?client_id=${slackClientId}&redirect_uri=${encodeURIComponent(redirectTo)}&scope=users:read&user_scope=identity.basic`;
        } else {
          // For other providers, redirect to Supabase auth endpoint
          oauthUrl = `${supabaseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectTo)}`;
        }
        
        console.log('Redirecting to OAuth URL:', oauthUrl);
        
        // Perform the redirect
        window.location.href = oauthUrl;
        
        return Promise.resolve({ data: null, error: null });
      } catch (error) {
        console.error('Error in manual OAuth redirect:', error);
        return Promise.resolve({ data: null, error });
      }
    }
  }
};

// Use the mock client
const supabase = mockSupabaseClient;

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