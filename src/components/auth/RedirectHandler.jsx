import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RedirectHandler() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing authentication...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('RedirectHandler: Starting authentication processing');
        setStatus('Checking for authentication data...');
        
        const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
        console.log('Using site URL:', siteUrl);
        
        const extractTokensFromUrl = () => {
          const hash = window.location.hash;
          const query = window.location.search;
          
          console.log('URL hash:', hash);
          console.log('URL query:', query);
          
          if (hash && hash.includes('access_token')) {
            try {
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
          
          if (query && (query.includes('code=') || query.includes('error='))) {
            try {
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
        
        const urlParams = extractTokensFromUrl();
        console.log('URL parameters extracted:', urlParams);
        
        if (urlParams && urlParams.error) {
          console.error('OAuth error from provider:', urlParams.error);
          console.error('Error description:', urlParams.error_description);
          throw new Error(urlParams.error_description || urlParams.error);
        }
        
        const { supabase } = await import('../../config/supabase');
        
        setStatus('Checking authentication session...');
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          throw sessionError;
        }
        
        console.log('Session data:', sessionData);
        
        if (sessionData?.session) {
          console.log('User is already authenticated, redirecting to dashboard');
          navigate('/dashboard');
          return;
        }
        
        if (urlParams && urlParams.access_token) {
          console.log('Found access_token in URL, setting session');
          setStatus('Setting up your session...');
          
          try {
            if (typeof supabase.auth.setSession !== 'function') {
              console.error('supabase.auth.setSession is not a function');
              
              localStorage.setItem('supabase.auth.token', JSON.stringify({
                access_token: urlParams.access_token,
                refresh_token: urlParams.refresh_token,
                expires_at: urlParams.expires_in ? Date.now() + (urlParams.expires_in * 1000) : null
              }));
              
              window.location.href = `${siteUrl}/dashboard`;
              return;
            }
            
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
          } catch (err) {
            console.error('Error setting session:', err);
            
            window.location.href = `${siteUrl}/dashboard`;
            return;
          }
        }
        
        if (urlParams && urlParams.code) {
          console.log('Found code in URL, exchanging for token');
          setStatus('Finalizing your login...');
          
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const { data: sessionAfterCode, error: sessionAfterCodeError } = await supabase.auth.getSession();
          
          if (sessionAfterCodeError) {
            console.error('Error getting session after code exchange:', sessionAfterCodeError);
            throw sessionAfterCodeError;
          }
          
          console.log('Session after code exchange:', sessionAfterCode);
          
          if (sessionAfterCode?.session) {
            console.log('Authentication successful, redirecting to dashboard');
            navigate('/dashboard');
            return;
          } else {
            console.log('No session after code exchange, refreshing page');
            window.location.href = `${siteUrl}/dashboard`;
            return;
          }
        }
        
        console.log('No valid session established, checking for user');
        
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error getting user:', userError);
          throw userError;
        }
        
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
