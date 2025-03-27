import { createClient } from '@supabase/supabase-js'

// Log environment variables for debugging
console.log('Environment check - VITE_SUPABASE_URL exists:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('Environment check - VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('Environment check - VITE_SITE_URL exists:', !!import.meta.env.VITE_SITE_URL);

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Get site URL with fallback handling
let siteUrl;
try {
  // Prioritize the environment variable for site URL
  siteUrl = import.meta.env.VITE_SITE_URL;
  
  // Fall back to window.location.origin if VITE_SITE_URL is not available
  if (!siteUrl) {
    siteUrl = window.location.origin;
    console.log('VITE_SITE_URL not found, using window.location.origin:', siteUrl);
  } else {
    console.log('Using VITE_SITE_URL for redirects:', siteUrl);
  }
} catch (e) {
  console.error('Error determining site URL:', e);
  // Hardcoded fallback as last resort
  siteUrl = window.location.hostname.includes('localhost') 
    ? 'http://localhost:5173' 
    : 'https://opagents.geniusos.co';
  console.log('Using fallback site URL:', siteUrl);
}

console.log('Using Supabase URL:', supabaseUrl);
console.log('Using Site URL for redirects:', siteUrl);

// Create a Supabase client with proper configuration
let supabase;

try {
  console.log('Creating Supabase client...');
  
  // Create client with proper options
  const options = {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'x-application-name': 'geniusos',
      },
    },
  };
  
  // Set redirect URL
  if (siteUrl) {
    options.auth.redirectTo = `${siteUrl}/auth/callback`;
    console.log('Setting redirect URL to:', options.auth.redirectTo);
  }
  
  // Create the client
  supabase = createClient(supabaseUrl, supabaseAnonKey, options);
  console.log('Supabase client created successfully');
  
  // Set up auth state change listener for debugging
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event);
    console.log('Session exists:', !!session);
    if (session) {
      console.log('User ID:', session.user.id);
      console.log('Provider:', session.user.app_metadata?.provider);
    }
  });
} catch (error) {
  console.error('Error creating Supabase client:', error);
  console.error('Error details:', {
    name: error.name,
    message: error.message,
    stack: error.stack
  });
  
  // Create a fallback client that will redirect to login
  supabase = {
    auth: {
      getSession: async () => {
        console.error('Using fallback getSession method');
        return { data: { session: null }, error: null };
      },
      getUser: async () => {
        console.error('Using fallback getUser method');
        return { data: { user: null }, error: null };
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