import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../config/supabase';

function RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function handleAuthCallback() {
      try {
        console.log('RedirectHandler: Processing authentication callback');
        
        // Get the URL hash or query parameters
        const hash = window.location.hash;
        const query = window.location.search;
        
        console.log('URL hash:', hash);
        console.log('URL query:', query);
        
        // For Supabase OAuth, we need to call setSession with the URL fragment
        // This is required for the OAuth flow to complete properly
        if (hash || query) {
          console.log('Found hash or query parameters, setting session...');
          
          // Get the site URL from environment variables
          const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
          console.log('Using site URL:', siteUrl);
          
          try {
            // Try to extract the session from the URL
            const { data, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) {
              console.error('Error getting session:', sessionError);
              setError(sessionError.message);
              setLoading(false);
              return;
            }
            
            if (data?.session) {
              console.log('Session successfully created:', data.session.user.email);
              setLoading(false);
              navigate('/dashboard');
              return;
            }
            
            // If no session yet, wait a bit and try again
            console.log('No session found immediately, waiting...');
            setTimeout(async () => {
              const { data: delayedData, error: delayedError } = await supabase.auth.getSession();
              
              if (delayedError) {
                console.error('Error getting delayed session:', delayedError);
                setError(delayedError.message);
                setLoading(false);
                return;
              }
              
              if (delayedData?.session) {
                console.log('Session created after delay:', delayedData.session.user.email);
                navigate('/dashboard');
              } else {
                console.error('Failed to create session after delay');
                setError('Authentication failed. Please try again.');
                navigate('/login');
              }
              
              setLoading(false);
            }, 2000);
          } catch (err) {
            console.error('Error processing auth callback:', err);
            setError(`Error processing authentication: ${err.message}`);
            setLoading(false);
          }
        } else {
          console.log('No hash or query parameters found');
          setError('No authentication data found in URL');
          setLoading(false);
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setError(err.message);
        setLoading(false);
      }
    }
    
    handleAuthCallback();
  }, [navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <h2 className="text-xl text-white font-medium">Completing authentication...</h2>
          <p className="text-gray-400 mt-2">You'll be redirected in a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
          <div className="text-red-500 text-xl mb-4">Authentication Error</div>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/login')} 
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <h2 className="text-xl text-white font-medium">Authentication successful!</h2>
        <p className="text-gray-400 mt-2">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}

export default RedirectHandler;
