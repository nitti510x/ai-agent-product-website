import React, { useEffect, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@supabase/supabase-js';

function Login() {
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get environment variables for Supabase configuration
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qdrtpsuqffsdocjrifwm.supabase.co';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkcnRwc3VxZmZzZG9janJpZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NTM4NTMsImV4cCI6MjA1NjAyOTg1M30._qNhJuoI7nmmJxgCJ7JmqfLRYeTk1Kxr-V_N27sj8XE';
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const redirectUrl = `${siteUrl}/auth/callback`;
  
  // Create a custom storage implementation with error handling
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
  
  // Initialize Supabase client directly in the component
  useEffect(() => {
    const initializeSupabase = async () => {
      setIsLoading(true);
      
      // Don't clear auth data on initial load - this might be causing the issue
      // We want to preserve any existing session
      console.log('Login page - Creating Supabase client');
      console.log('Login page - Using URL:', supabaseUrl);
      console.log('Login page - Using site URL:', siteUrl);
      console.log('Login page - Using redirect URL:', redirectUrl);
      
      // Check for existing auth data in localStorage
      try {
        const authKeys = Object.keys(localStorage).filter(key => 
          key.includes('supabase') || key.includes('auth')
        );
        console.log('Login page - Existing auth keys:', authKeys);
        
        // Try to read session data from localStorage
        const sbSession = localStorage.getItem('sb-' + supabaseUrl.split('//')[1].split('.')[0] + '-auth-token');
        if (sbSession) {
          try {
            const sessionData = JSON.parse(sbSession);
            console.log('Login page - Found existing session in localStorage:', sessionData);
            
            // Check if session has expired
            if (sessionData?.expires_at && new Date(sessionData.expires_at * 1000) > new Date()) {
              console.log('Login page - Session is still valid, expires:', new Date(sessionData.expires_at * 1000));
            } else {
              console.log('Login page - Session has expired or no expiry found');
            }
          } catch (e) {
            console.error('Error parsing localStorage session:', e);
          }
        } else {
          console.log('Login page - No session found in localStorage');
        }
      } catch (e) {
        console.error('Error checking localStorage:', e);
      }
      
      try {
        // Create client options with proper headers
        const options = {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            storage: createCustomStorage(),
            storageKey: 'supabase.auth.token',
            redirectTo: redirectUrl
          },
          global: {
            headers: {
              'X-Client-Info': 'supabase-js/2.0.0',
            },
          }
        };
        
        // Create the client directly
        const client = createClient(supabaseUrl, supabaseAnonKey, options);
        console.log('Login page - Supabase client created successfully');
        
        // Verify the client was created properly
        if (!client.auth || typeof client.auth.getSession !== 'function') {
          throw new Error('Invalid Supabase client - auth methods missing');
        }
        
        // Check for existing session
        const { data, error: sessionError } = await client.auth.getSession();
        if (sessionError) {
          console.error('Login page - Error checking session:', sessionError);
        } else if (data?.session) {
          console.log('Login page - Session exists:', data.session);
          console.log('Login page - User:', data.session.user);
          console.log('Login page - Redirecting to dashboard');
          window.location.href = '/dashboard';
          return;
        } else {
          console.log('Login page - No active session found');
        }
        
        setSupabaseClient(client);
        setError(null);
      } catch (err) {
        console.error('Login page - Error creating Supabase client:', err);
        setError('Failed to initialize authentication. Please try again or contact support.');
        
        // Try with minimal options as fallback
        try {
          console.log('Login page - Attempting to create client with minimal options');
          const minimalClient = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
              persistSession: true,
              detectSessionInUrl: true,
              storage: createCustomStorage(),
              redirectTo: redirectUrl
            }
          });
          console.log('Login page - Created client with minimal options');
          setSupabaseClient(minimalClient);
          setError(null);
        } catch (fallbackError) {
          console.error('Login page - Fallback client creation also failed:', fallbackError);
          setError('Authentication service unavailable. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeSupabase();
  }, [supabaseUrl, supabaseAnonKey, siteUrl, redirectUrl]);
  
  // Handle clearing auth data and retrying
  const handleClearAuthAndRetry = () => {
    try {
      // Clear all auth-related localStorage items
      Object.keys(localStorage).forEach(key => {
        if (key.includes('supabase') || key.includes('auth')) {
          console.log('Login page - Removing auth key:', key);
          localStorage.removeItem(key);
        }
      });
      // Reload the page
      window.location.reload();
    } catch (e) {
      console.error('Error clearing auth data:', e);
      setError('Failed to clear authentication data. Please try refreshing the page.');
    }
  };
  
  // Handle direct navigation to dashboard (bypass auth)
  const handleDirectDashboard = () => {
    window.location.href = '/dashboard';
  };
  
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="bg-dark-lighter p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          Welcome to geniusOS AIForce
        </h2>
        
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Initializing authentication...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={handleClearAuthAndRetry}
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded"
            >
              Retry
            </button>
          </div>
        ) : supabaseClient ? (
          <>
            <Auth
              supabaseClient={supabaseClient}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#10B981',
                      brandAccent: '#059669',
                    }
                  }
                }
              }}
              providers={['google', 'slack']}
              socialLayout="horizontal"
              theme="dark"
              redirectTo={redirectUrl}
              onlyThirdPartyProviders={true}
              view="sign_in"
            />
            <div className="mt-6 text-center text-sm text-gray-400">
              <p>Having trouble logging in?</p>
              <div className="flex flex-col mt-2 space-y-2">
                <button 
                  onClick={handleClearAuthAndRetry}
                  className="text-emerald-500 hover:text-emerald-400"
                >
                  Clear Auth Data & Retry
                </button>
                <button 
                  onClick={handleDirectDashboard}
                  className="text-blue-500 hover:text-blue-400"
                >
                  Go Directly to Dashboard (Bypass Auth)
                </button>
                <a 
                  href="/test-auth.html"
                  className="text-purple-500 hover:text-purple-400"
                >
                  Use Test Auth Page
                </a>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400">
            <p className="mb-4">Unable to initialize authentication.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded"
            >
              Refresh Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;