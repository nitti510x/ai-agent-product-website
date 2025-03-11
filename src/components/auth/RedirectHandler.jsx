import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RedirectHandler() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing authentication...');
  const [error, setError] = useState(null);
  const [supabaseClient, setSupabaseClient] = useState(null);

  useEffect(() => {
    // Load Supabase client
    const loadSupabase = async () => {
      try {
        const { supabase } = await import('../../config/supabase');
        setSupabaseClient(supabase);
        return supabase;
      } catch (error) {
        console.error('Error loading Supabase client:', error);
        setError('Failed to initialize authentication system. Please try again later.');
        return null;
      }
    };
    
    // Function to handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        console.log('RedirectHandler: Starting authentication processing');
        setStatus('Checking for authentication data...');
        
        // Extract tokens from URL if present
        const extractTokensFromUrl = () => {
          const hash = window.location.hash;
          const query = window.location.search;
          
          console.log('URL hash:', hash);
          console.log('URL query:', query);
          
          // Extract access_token from hash
          if (hash && hash.includes('access_token')) {
            try {
              // Parse the hash parameters
              const hashParams = {};
              hash.substring(1).split('&').forEach(pair => {
                const [key, value] = pair.split('=');
                hashParams[key] = decodeURIComponent(value || '');
              });
              
              console.log('Hash parameters found:', Object.keys(hashParams));
              return hashParams;
            } catch (err) {
              console.error('Error parsing hash parameters:', err);
            }
          }
          
          // Extract from query parameters if not in hash
          if (query && (query.includes('code=') || query.includes('error='))) {
            try {
              // Parse the query parameters
              const queryParams = {};
              query.substring(1).split('&').forEach(pair => {
                const [key, value] = pair.split('=');
                queryParams[key] = decodeURIComponent(value || '');
              });
              
              console.log('Query parameters found:', Object.keys(queryParams));
              return queryParams;
            } catch (err) {
              console.error('Error parsing query parameters:', err);
            }
          }
          
          return null;
        };
        
        // Get URL parameters
        const urlParams = extractTokensFromUrl();
        console.log('URL parameters extracted:', urlParams);
        
        // Check for error in URL parameters
        if (urlParams && urlParams.error) {
          console.error('OAuth error from provider:', urlParams.error);
          console.error('Error description:', urlParams.error_description);
          throw new Error(urlParams.error_description || urlParams.error);
        }
        
        // Load Supabase client
        const supabase = await loadSupabase();
        if (!supabase) {
          throw new Error('Failed to initialize authentication system');
        }
        
        // Check if we already have a session
        setStatus('Checking authentication session...');
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('Session data:', sessionData);
        
        if (sessionData?.session) {
          console.log('User is already authenticated, redirecting to dashboard');
          navigate('/dashboard');
          return;
        }
        
        // If we have an access_token in the URL, we can use it to set the session
        if (urlParams && urlParams.access_token) {
          console.log('Found access_token in URL, setting session');
          setStatus('Setting up your session...');
          
          const { data, error } = await supabase.auth.setSession({
            access_token: urlParams.access_token,
            refresh_token: urlParams.refresh_token,
          });
          
          if (error) {
            console.error('Error setting session:', error);
            throw error;
          }
          
          console.log('Session set successfully:', data);
          navigate('/dashboard');
          return;
        }
        
        // If we have a code parameter, we need to exchange it for a token
        if (urlParams && urlParams.code) {
          console.log('Found code in URL, exchanging for token');
          setStatus('Finalizing your login...');
          
          // The code exchange is handled automatically by Supabase
          // We just need to wait for the session to be established
          
          // Wait for a short time to allow Supabase to process the code
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Check if we have a session now
          const { data: sessionAfterCode } = await supabase.auth.getSession();
          console.log('Session after code exchange:', sessionAfterCode);
          
          if (sessionAfterCode?.session) {
            console.log('Authentication successful, redirecting to dashboard');
            navigate('/dashboard');
            return;
          }
        }
        
        // If we reach here, we don't have a valid session yet
        console.log('No valid session established, checking for user');
        
        // Try to get the user one more time
        const { data: userData } = await supabase.auth.getUser();
        console.log('User data:', userData);
        
        if (userData?.user) {
          console.log('User is authenticated, redirecting to dashboard');
          navigate('/dashboard');
        } else {
          console.log('No authenticated user found, redirecting to login');
          setError('Authentication failed. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err.message || 'Authentication failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };
    
    // Execute the callback handler
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4">
      <div className="w-full max-w-md bg-dark-lighter rounded-xl shadow-xl overflow-hidden p-8 text-center">
        <div className="mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary mx-auto"></div>
        </div>
        
        <h2 className="text-xl font-semibold text-white mb-2">
          {error ? 'Authentication Error' : 'Completing Your Sign In'}
        </h2>
        
        {error ? (
          <p className="text-red-400 mb-4">{error}</p>
        ) : (
          <p className="text-gray-400 mb-4">{status}</p>
        )}
        
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-4 py-2 bg-secondary hover:bg-secondary-dark text-white rounded transition-colors"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
}

export default RedirectHandler;
