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
        
        // Check if we have a hash or query parameters that indicate an OAuth callback
        const hash = window.location.hash;
        const query = window.location.search;
        
        console.log('URL hash:', hash);
        console.log('URL query:', query);
        
        // First check if we already have a session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError(`Session error: ${sessionError.message}`);
          return;
        }
        
        if (sessionData?.session) {
          console.log('Session exists, redirecting to dashboard');
          console.log('User ID:', sessionData.session.user.id);
          navigate('/dashboard');
          return;
        }
        
        // If no session yet but we have auth data in the URL, let's wait a moment
        // for Supabase to process it
        if (hash || query) {
          setStatus('Processing authentication data...');
          
          // Wait a short time for Supabase to process the authentication
          setTimeout(async () => {
            try {
              const { data: delayedSession, error: delayedError } = await supabase.auth.getSession();
              
              if (delayedError) {
                console.error('Error getting delayed session:', delayedError);
                setError(`Session error: ${delayedError.message}`);
                return;
              }
              
              if (delayedSession?.session) {
                console.log('Session established after delay, redirecting to dashboard');
                navigate('/dashboard');
              } else {
                console.error('No session established after delay');
                setError('Authentication failed. Please try again.');
              }
            } catch (err) {
              console.error('Error checking delayed session:', err);
              setError(`Error: ${err.message}`);
            }
          }, 2000);
        } else {
          // No auth data in URL
          console.error('No authentication data found in URL');
          setError('No authentication data found. Please try logging in again.');
        }
      } catch (err) {
        console.error('Unhandled exception in auth callback:', err);
        setError(`Unhandled error: ${err.message}`);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="bg-dark-lighter p-8 rounded-xl shadow-xl w-full max-w-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <h2 className="text-xl text-white font-medium">{status}</h2>
        {error ? (
          <div className="mt-4">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => navigate('/login')} 
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <p className="text-gray-400 mt-2">You'll be redirected in a moment</p>
        )}
      </div>
    </div>
  );
}

export default RedirectHandler;
