import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';

function RedirectHandler() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing authentication...');
  const [error, setError] = useState(null);

  useEffect(() => {
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
        
        // Get tokens from URL
        const tokens = extractTokensFromUrl();
        if (tokens) {
          console.log('Authentication tokens found in URL');
        }
        
        // First check if supabase client is available
        if (!supabase || !supabase.auth) {
          console.error('Supabase client not available');
          setError('Authentication service unavailable. Please try again later.');
          
          // Try to redirect back to login after a delay
          setTimeout(() => navigate('/login'), 3000);
          return;
        }
        
        // Try to get the session
        try {
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Error getting session:', sessionError);
            setError(`Session error: ${sessionError.message}`);
            
            // Clear any potential stale auth data
            try {
              const authKeys = Object.keys(localStorage).filter(key => 
                key.includes('supabase') || key.includes('auth')
              );
              console.log('Clearing potential stale auth keys:', authKeys);
              authKeys.forEach(key => localStorage.removeItem(key));
            } catch (e) {
              console.error('Error clearing localStorage:', e);
            }
            
            // Try to redirect back to login after a delay
            setTimeout(() => navigate('/login'), 3000);
            return;
          }
          
          if (sessionData?.session) {
            console.log('Session exists, redirecting to dashboard');
            console.log('User ID:', sessionData.session.user.id);
            navigate('/dashboard');
            return;
          }
        } catch (err) {
          console.error('Exception checking session:', err);
          // Continue with the process, as we might still be able to recover
        }
        
        // If we have tokens in the URL but no session yet, let's wait a moment
        // for Supabase to process it
        if (tokens || window.location.hash || window.location.search) {
          setStatus('Processing authentication data...');
          
          // Wait a short time for Supabase to process the authentication
          setTimeout(async () => {
            try {
              // Try getting the session again after a delay
              const { data: delayedSession, error: delayedError } = await supabase.auth.getSession();
              
              if (delayedError) {
                console.error('Error getting delayed session:', delayedError);
                setError(`Session error: ${delayedError.message}`);
                setTimeout(() => navigate('/login'), 3000);
                return;
              }
              
              if (delayedSession?.session) {
                console.log('Session established after delay, redirecting to dashboard');
                navigate('/dashboard');
              } else {
                console.error('No session established after delay');
                setError('Authentication failed. Please try again.');
                setTimeout(() => navigate('/login'), 3000);
              }
            } catch (err) {
              console.error('Error checking delayed session:', err);
              setError(`Error: ${err.message}`);
              setTimeout(() => navigate('/login'), 3000);
            }
          }, 2000);
        } else {
          // No auth data in URL
          console.error('No authentication data found in URL');
          setError('No authentication data found. Please try logging in again.');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err) {
        console.error('Unhandled exception in auth callback:', err);
        setError(`Unhandled error: ${err.message}`);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="bg-dark-lighter p-8 rounded-xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">
          {error ? 'Authentication Error' : 'Completing Login'}
        </h2>
        
        {error ? (
          <div className="text-red-500 mb-4">{error}</div>
        ) : (
          <div className="text-gray-300 mb-4">{status}</div>
        )}
        
        <div className="mt-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded"
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default RedirectHandler;
