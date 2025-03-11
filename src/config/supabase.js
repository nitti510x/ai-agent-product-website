import { createClient } from '@supabase/supabase-js';

// Create a custom storage implementation that wraps localStorage with error handling
const createCustomStorage = () => {
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

// Create a proxy handler to lazily initialize the Supabase client
let supabaseInstance = null;

// Function to create the actual Supabase client
const createSupabaseClient = () => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  try {
    // Get environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;

    // Check if required environment variables are available
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase URL or Anon Key is missing. Check your environment variables.');
      return createFallbackClient();
    }

    // Log environment variables
    console.log('Environment check - VITE_SUPABASE_URL exists:', !!supabaseUrl);
    console.log('Environment check - VITE_SUPABASE_ANON_KEY exists:', !!supabaseAnonKey);
    console.log('Environment check - VITE_SITE_URL exists:', !!siteUrl);

    console.log('Creating Supabase client with URL:', supabaseUrl);
    console.log('Using site URL:', siteUrl);

    // Create the client with proper options
    const options = {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: createCustomStorage(),
      },
      global: {
        headers: {
          'x-application-name': 'geniusos',
        },
      },
    };

    // Ensure redirect URLs use the correct site URL
    if (siteUrl) {
      options.auth.redirectTo = `${siteUrl}/auth/callback`;
    }

    // Create the Supabase client
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, options);

    // Verify that the client was created successfully
    if (!supabaseInstance || !supabaseInstance.auth) {
      console.error('Failed to create Supabase client. Using fallback client.');
      return createFallbackClient();
    }

    return supabaseInstance;
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    return createFallbackClient();
  }
};

// Create a fallback client with minimal functionality for error handling
const createFallbackClient = () => {
  console.warn('Creating fallback Supabase client');
  
  // Create a minimal mock client that won't throw errors when methods are called
  return {
    auth: {
      getSession: async () => {
        console.log('Using fallback getSession method');
        return { data: { session: null }, error: null };
      },
      getUser: async () => {
        console.log('Using fallback getUser method');
        return { data: { user: null }, error: null };
      },
      signInWithPassword: async () => {
        console.log('Using fallback signInWithPassword method');
        return { data: null, error: new Error('Authentication is currently unavailable') };
      },
      signInWithOAuth: async () => {
        console.log('Using fallback signInWithOAuth method');
        return { data: null, error: new Error('Authentication is currently unavailable') };
      },
      signUp: async () => {
        console.log('Using fallback signUp method');
        return { data: null, error: new Error('Authentication is currently unavailable') };
      },
      signOut: async () => {
        console.log('Using fallback signOut method');
        return { error: null };
      },
      resetPasswordForEmail: async () => {
        console.log('Using fallback resetPasswordForEmail method');
        return { data: null, error: new Error('Authentication is currently unavailable') };
      },
      setSession: async (params) => {
        console.log('Using fallback setSession method');
        if (params && params.access_token) {
          console.log('Found access_token in URL, setting session');
          return { data: { session: { user: { id: 'fallback-user-id' } } }, error: null };
        }
        return { data: null, error: new Error('Authentication is currently unavailable') };
      },
      onAuthStateChange: (callback) => {
        console.log('Using fallback onAuthStateChange method');
        return { data: { subscription: { unsubscribe: () => {} } } };
      }
    },
    from: () => ({
      select: () => ({ data: null, error: new Error('Database operations are currently unavailable') }),
      insert: () => ({ data: null, error: new Error('Database operations are currently unavailable') }),
      update: () => ({ data: null, error: new Error('Database operations are currently unavailable') }),
      delete: () => ({ data: null, error: new Error('Database operations are currently unavailable') }),
    }),
    storage: {
      from: () => ({
        upload: () => ({ data: null, error: new Error('Storage operations are currently unavailable') }),
        getPublicUrl: () => ({ data: null, error: new Error('Storage operations are currently unavailable') }),
      })
    },
    channel: () => ({
      on: () => ({ data: null, error: new Error('Realtime operations are currently unavailable') }),
      subscribe: () => ({ data: null, error: new Error('Realtime operations are currently unavailable') }),
    }),
  };
};

// Create a proxy to lazily initialize the Supabase client
export const supabase = new Proxy({}, {
  get: function(target, prop) {
    // Initialize the client if it hasn't been initialized yet
    const client = createSupabaseClient();
    
    // Access the property on the client
    const value = client[prop];
    
    // If the property is a function, bind it to the client
    if (typeof value === 'function') {
      return value.bind(client);
    }
    
    // Otherwise, return the property value
    return value;
  }
});

export default supabase;