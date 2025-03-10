import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSupabase } from '../../contexts/SupabaseContext';
import { supabase as directSupabase } from '../../config/supabase';

function Login() {
  const { supabase } = useSupabase();
  const clientToUse = supabase || directSupabase;
  
  // Clear any stale auth state on login page load
  useEffect(() => {
    const clearStaleAuth = async () => {
      try {
        // Check if we have a session that might be invalid
        const { data, error } = await clientToUse.auth.getSession();
        console.log('Login page - Current session check:', data?.session ? 'Exists' : 'None');
        
        if (error) {
          console.error('Error checking session on login page:', error);
          // If there's an error, clear local storage auth data
          try {
            const authKeys = Object.keys(localStorage).filter(key => 
              key.includes('supabase') || key.includes('auth')
            );
            console.log('Clearing potential stale auth keys:', authKeys);
            authKeys.forEach(key => localStorage.removeItem(key));
          } catch (e) {
            console.error('Error clearing localStorage:', e);
          }
        }
      } catch (err) {
        console.error('Exception in login page session check:', err);
      }
    };
    
    clearStaleAuth();
  }, [clientToUse]);

  // Get the site URL for redirects
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const redirectUrl = `${siteUrl}/auth/callback`;
  
  console.log('Login page - Using redirect URL:', redirectUrl);

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="bg-dark-lighter p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          Welcome to geniusOS AIForce
        </h2>
        {!import.meta.env.VITE_SUPABASE_URL ? (
          <div className="text-center text-gray-400">
            <p className="mb-4">Please connect to Supabase to enable authentication.</p>
            <p>Click the "Connect to Supabase" button in the top right corner to get started.</p>
          </div>
        ) : (
          <Auth
            supabaseClient={clientToUse}
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
        )}
      </div>
    </div>
  );
}

export default Login;