import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SupabaseContext = createContext();

export function SupabaseProvider({ children }) {
  const [supabase] = useState(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qdrtpsuqffsdocjrifwm.supabase.co';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkcnRwc3VxZmZzZG9janJpZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NTM4NTMsImV4cCI6MjA1NjAyOTg1M30._qNhJuoI7nmmJxgCJ7JmqfLRYeTk1Kxr-V_N27sj8XE';
    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
    
    console.log('SupabaseContext: Creating Supabase client');
    console.log('Using URL:', supabaseUrl);
    console.log('Using site URL:', siteUrl);
    
    try {
      return createClient(supabaseUrl, supabaseAnonKey, {
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
    } catch (error) {
      console.error('Error creating Supabase client in context:', error);
      // Return a minimal client
      return createClient(supabaseUrl, supabaseAnonKey);
    }
  });
  
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  return useContext(SupabaseContext);
}