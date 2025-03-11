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

// Create a custom storage implementation that wraps localStorage with error handling
const createCustomStorage = () => {
  console.log('Creating custom storage implementation');
  return {
    getItem: (key) => {
      try {
        console.log(`Getting item: ${key}`);
        return localStorage.getItem(key);
      } catch (e) {
        console.error(`Error getting item ${key} from localStorage:`, e);
        return null;
      }
    },
    setItem: (key, value) => {
      try {
        console.log(`Setting item: ${key}`);
        localStorage.setItem(key, value);
      } catch (e) {
        console.error(`Error setting item ${key} in localStorage:`, e);
      }
    },
    removeItem: (key) => {
      try {
        console.log(`Removing item: ${key}`);
        localStorage.removeItem(key);
      } catch (e) {
        console.error(`Error removing item ${key} from localStorage:`, e);
      }
    }
  };
};

// Create a Supabase client with proper OAuth configuration
let supabase;

// Function to create a fallback client
const createFallbackClient = () => {
  console.warn('Creating fallback Supabase client');
  return {
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
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          then: () => Promise.resolve([])
        })
      })
    })
  };
};

// Create client with defensive error handling
try {
  console.log('Creating Supabase client with URL:', supabaseUrl);
  
  // Verify we have the required values before attempting to create the client
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing required Supabase configuration');
  }
  
  // Verify that createClient is available
  if (typeof createClient !== 'function') {
    console.error('createClient is not a function:', createClient);
    throw new Error('Supabase createClient function is not available');
  }
  
  // Create a minimal client with basic options
  const options = {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: createCustomStorage(),
      storageKey: 'supabase.auth.token',
      cookieOptions: {
        path: '/',
        sameSite: 'Lax'
      }
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js/2.0.0',
      },
    }
  };
  
  // Add redirect URL if site URL is available
  if (siteUrl) {
    options.auth.redirectTo = `${siteUrl}/auth/callback`;
    console.log('Setting redirect URL to:', options.auth.redirectTo);
  }
  
  // Create the client with additional error handling
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, options);
    console.log('Supabase client created successfully');
  } catch (clientError) {
    console.error('Error during Supabase client creation:', clientError);
    // Try one more time with a simpler configuration
    try {
      console.log('Attempting to create client with minimal options');
      supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          detectSessionInUrl: true
        },
        global: {
          headers: {
            'X-Client-Info': 'supabase-js/2.0.0',
          },
        }
      });
      console.log('Supabase client created with minimal options');
    } catch (fallbackError) {
      console.error('Fallback client creation also failed:', fallbackError);
      throw fallbackError;
    }
  }
  
  // Verify the client was created properly by checking a method
  if (!supabase.auth || typeof supabase.auth.getSession !== 'function') {
    console.error('Supabase client created but auth methods are missing');
    throw new Error('Invalid Supabase client');
  }
  
  // Set up auth state change listener
  try {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      console.log('Session exists:', !!session);
      if (session) {
        console.log('User ID:', session.user.id);
        console.log('Provider:', session.user.app_metadata?.provider);
      }
    });
    console.log('Auth state change listener set up successfully');
  } catch (listenerError) {
    console.error('Error setting up auth state change listener:', listenerError);
    // Continue even if listener setup fails
  }
} catch (error) {
  console.error('Error creating Supabase client:', error);
  console.error('Error details:', {
    name: error.name,
    message: error.message,
    stack: error.stack
  });
  
  // Create a fallback client
  supabase = createFallbackClient();
}

// Helper function to check if user is authenticated
const isAuthenticated = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
    console.log('Session check result:', data);
    return !!data.session;
  } catch (err) {
    console.error('Exception checking authentication:', err);
    return false;
  }
};

// Export both default and named export for backward compatibility
export { supabase, isAuthenticated };
export default supabase;