import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SupabaseContext = createContext();

// Create a custom storage implementation that wraps localStorage with error handling
const createCustomStorage = () => {
  console.log('SupabaseContext: Creating custom storage implementation');
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

export function SupabaseProvider({ children }) {
  const [supabase] = useState(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qdrtpsuqffsdocjrifwm.supabase.co';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkcnRwc3VxZmZzZG9janJpZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NTM4NTMsImV4cCI6MjA1NjAyOTg1M30._qNhJuoI7nmmJxgCJ7JmqfLRYeTk1Kxr-V_N27sj8XE';
    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
    
    console.log('SupabaseContext: Creating Supabase client');
    console.log('Using URL:', supabaseUrl);
    console.log('Using site URL:', siteUrl);
    
    try {
      // Create the client with proper options
      const options = {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          storage: createCustomStorage(),
          storageKey: 'supabase.auth.token',
          redirectTo: `${siteUrl}/auth/callback`
        },
        global: {
          headers: {
            'X-Client-Info': 'supabase-js/2.0.0',
          },
        }
      };
      
      const client = createClient(supabaseUrl, supabaseAnonKey, options);
      console.log('SupabaseContext: Client created successfully');
      return client;
    } catch (error) {
      console.error('Error creating Supabase client in context:', error);
      
      // Try with minimal options
      try {
        console.log('SupabaseContext: Attempting to create client with minimal options');
        const minimalClient = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: true,
            detectSessionInUrl: true,
            storage: createCustomStorage()
          },
          global: {
            headers: {
              'X-Client-Info': 'supabase-js/2.0.0',
            },
          }
        });
        console.log('SupabaseContext: Created client with minimal options');
        return minimalClient;
      } catch (fallbackError) {
        console.error('SupabaseContext: Fallback client creation also failed:', fallbackError);
        
        // Return a dummy client that won't throw errors
        console.warn('SupabaseContext: Returning dummy client');
        return {
          auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            signOut: async () => ({ error: null })
          }
        };
      }
    }
  });
  
  const [session, setSession] = useState(null);

  useEffect(() => {
    const setupAuth = async () => {
      try {
        if (!supabase || !supabase.auth) {
          console.error('SupabaseContext: Invalid supabase client');
          return;
        }
        
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('SupabaseContext: Error getting initial session:', error);
        } else {
          setSession(data.session);
        }

        try {
          const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('SupabaseContext: Auth state changed, new session:', !!session);
            setSession(session);
          });
          
          return () => {
            try {
              if (authListener?.subscription?.unsubscribe) {
                authListener.subscription.unsubscribe();
              }
            } catch (e) {
              console.error('SupabaseContext: Error unsubscribing from auth listener:', e);
            }
          };
        } catch (listenerError) {
          console.error('SupabaseContext: Error setting up auth listener:', listenerError);
        }
      } catch (e) {
        console.error('SupabaseContext: Unhandled error in auth setup:', e);
      }
    };
    
    setupAuth();
  }, [supabase]);

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  return useContext(SupabaseContext);
}