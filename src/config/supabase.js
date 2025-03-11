import { createClient } from '@supabase/supabase-js'

// Lazy-loaded Supabase client instance
let supabaseInstance = null;

// Function to get environment variables with logging
const getEnvVariables = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  
  console.log('Environment check - VITE_SUPABASE_URL exists:', !!supabaseUrl);
  console.log('Environment check - VITE_SUPABASE_ANON_KEY exists:', !!supabaseAnonKey);
  console.log('Environment check - VITE_SITE_URL exists:', !!import.meta.env.VITE_SITE_URL);
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing required Supabase configuration');
  }
  
  return { supabaseUrl, supabaseAnonKey, siteUrl };
};

// Create a custom storage implementation that wraps localStorage with error handling
const createCustomStorage = () => {
  console.log('Creating custom storage implementation');
  return {
    getItem: (key) => {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.error(`Error getting item ${key} from localStorage:`, e);
        return null;
      }
    },
    setItem: (key, value) => {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.error(`Error setting item ${key} in localStorage:`, e);
      }
    },
    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error(`Error removing item ${key} from localStorage:`, e);
      }
    }
  };
};

// Function to create a fallback client
const createFallbackClient = () => {
  console.warn('Creating fallback Supabase client');
  const { siteUrl, supabaseUrl } = getEnvVariables();
  
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

// Function to initialize the Supabase client
const initializeSupabase = () => {
  // If we already have an instance, return it
  if (supabaseInstance) {
    return supabaseInstance;
  }
  
  try {
    const { supabaseUrl, supabaseAnonKey, siteUrl } = getEnvVariables();
    
    // Verify we have the required values
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing required Supabase configuration');
    }
    
    // Create client options
    const options = {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: createCustomStorage(),
        cookieOptions: {
          path: '/',
          sameSite: 'Lax'
        }
      }
    };
    
    // Add redirect URL if site URL is available
    if (siteUrl) {
      options.auth.redirectTo = `${siteUrl}/auth/callback`;
      console.log('Setting redirect URL to:', options.auth.redirectTo);
    }
    
    // Create the client
    console.log('Creating Supabase client with URL:', supabaseUrl);
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, options);
    console.log('Supabase client created successfully');
    
    return supabaseInstance;
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    // Return fallback client on error
    supabaseInstance = createFallbackClient();
    return supabaseInstance;
  }
};

// Helper function to check if user is authenticated
const isAuthenticated = async () => {
  try {
    const client = initializeSupabase();
    const { data, error } = await client.auth.getSession();
    
    if (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
    
    return !!data.session;
  } catch (error) {
    console.error('Error in isAuthenticated:', error);
    return false;
  }
};

// Proxy object that initializes the client on first use
const supabase = new Proxy({}, {
  get: function(target, prop) {
    // Initialize the client when any property is accessed
    const client = initializeSupabase();
    return client[prop];
  }
});

// Export both default and named export for backward compatibility
export { supabase, isAuthenticated };
export default supabase;