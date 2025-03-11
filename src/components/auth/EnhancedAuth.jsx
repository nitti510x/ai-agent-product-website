import React, { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';

const EnhancedAuth = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSupabase = async () => {
      try {
        console.log('EnhancedAuth: Loading Supabase client');
        setLoading(true);
        
        // Dynamically import the Supabase client
        const { supabase } = await import('../../config/supabase');
        setSupabaseClient(supabase);
        
        // Check if user is already authenticated
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          setError('Failed to check authentication status. Please try again.');
        } else if (data?.session) {
          console.log('User is already authenticated, redirecting to dashboard');
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error initializing authentication:', err);
        setError('Failed to initialize authentication. Please try again later.');
        showNotification('Authentication Error', 'Failed to initialize authentication system. Please try again later.', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    loadSupabase();
  }, [navigate, showNotification]);

  // Get the site URL from environment variables
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const redirectUrl = `${siteUrl}/auth/callback`;
  
  console.log('EnhancedAuth: Using redirect URL:', redirectUrl);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-dark-lighter rounded-xl shadow-xl overflow-hidden p-8">
          <h2 className="text-xl font-semibold text-white mb-4">Authentication Error</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-secondary hover:bg-secondary-dark text-white rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!supabaseClient) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white">Initializing authentication system...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-md bg-dark-lighter rounded-xl shadow-xl overflow-hidden p-8">
        <Auth
          supabaseClient={supabaseClient}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#10b981',
                  brandAccent: '#059669',
                  brandButtonText: 'white',
                  inputBackground: '#1f2937',
                  inputBorder: '#374151',
                  inputText: 'white',
                  inputPlaceholder: '#9ca3af',
                }
              }
            },
            className: {
              button: 'bg-secondary hover:bg-secondary-dark text-white',
              input: 'bg-dark-lighter text-white border border-gray-600',
              label: 'text-gray-300',
              anchor: 'text-secondary hover:text-secondary-dark',
            }
          }}
          providers={['google', 'slack']}
          redirectTo={redirectUrl}
          onlyThirdPartyProviders={false}
          magicLink={true}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email address',
                password_label: 'Password',
                button_label: 'Sign in',
                loading_button_label: 'Signing in...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: 'Already have an account? Sign in',
              },
              sign_up: {
                email_label: 'Email address',
                password_label: 'Create a password',
                button_label: 'Sign up',
                loading_button_label: 'Signing up...',
                social_provider_text: 'Sign up with {{provider}}',
                link_text: 'Don\'t have an account? Sign up',
              },
              magic_link: {
                email_input_label: 'Email address',
                button_label: 'Send magic link',
                loading_button_label: 'Sending magic link...',
                link_text: 'Send a magic link email',
              },
            }
          }}
        />
      </div>
    </div>
  );
};

export default EnhancedAuth;
