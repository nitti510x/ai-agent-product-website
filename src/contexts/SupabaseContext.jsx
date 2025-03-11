import React, { createContext, useContext, useEffect, useState } from 'react';

const SupabaseContext = createContext();

export function SupabaseProvider({ children }) {
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Dynamically import the Supabase client
    const loadSupabase = async () => {
      try {
        console.log('SupabaseContext: Loading Supabase client');
        setLoading(true);
        
        // Import the supabase client from our config file
        const { supabase } = await import('../config/supabase');
        setSupabaseClient(supabase);
        
        // Get the initial session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('SupabaseContext: Error getting initial session:', error);
          setError(error.message);
        } else {
          console.log('SupabaseContext: Initial session:', !!data.session);
          setSession(data.session);
        }
        
        // Set up auth state change listener
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
        console.error('SupabaseContext: Error initializing Supabase client:', e);
        setError('Failed to initialize authentication system');
      } finally {
        setLoading(false);
      }
    };
    
    loadSupabase();
  }, []);

  const value = {
    supabase: supabaseClient,
    session,
    loading,
    error
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  return useContext(SupabaseContext);
}

export default SupabaseContext;