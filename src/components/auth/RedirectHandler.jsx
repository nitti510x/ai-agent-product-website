import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../config/supabase';

function RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    async function handleAuthCallback() {
      try {
        console.log('RedirectHandler: Processing authentication callback');
        
        // Get the URL hash or query parameters
        const hash = window.location.hash;
        const query = window.location.search;
        const fullUrl = window.location.href;
        
        console.log('Full URL:', fullUrl);
        console.log('URL hash:', hash);
        console.log('URL query:', query);
        
        // Store debug info
        setDebugInfo({
          fullUrl,
          hash,
          query,
          timestamp: new Date().toISOString()
        });
        
        // Process the hash if it exists (Supabase OAuth returns access_token in the hash)
        if (hash && hash.includes('access_token')) {
          console.log('Found access_token in hash, processing...');
          
          // Let Supabase process the hash
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error getting session after hash processing:', error);
            setError(`Authentication error: ${error.message}`);
            setLoading(false);
            return;
          }
          
          if (data?.session) {
            console.log('Session created successfully:', data.session.user.email);
            navigate('/dashboard');
            return;
          }
        }
        
        // Check if we already have a session
        console.log('Checking for existing session...');
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error checking session:', sessionError);
          setError(`Session error: ${sessionError.message}`);
          setLoading(false);
          return;
        }
        
        if (sessionData?.session) {
          console.log('Existing session found:', sessionData.session.user.email);
          navigate('/dashboard');
          return;
        }
        
        // If we reach here, we don't have a session yet
        console.log('No session found, waiting for auth completion...');
        
        // Wait 3 seconds and check again
        setTimeout(async () => {
          try {
            const { data: delayedData, error: delayedError } = await supabase.auth.getSession();
            
            if (delayedError) {
              console.error('Error checking delayed session:', delayedError);
              setError(`Authentication error: ${delayedError.message}`);
              setLoading(false);
              return;
            }
            
            if (delayedData?.session) {
              console.log('Session created after delay:', delayedData.session.user.email);
              navigate('/dashboard');
              return;
            }
            
            // Final attempt
            console.log('No session after delay, making final attempt...');
            setTimeout(async () => {
              try {
                const { data: finalData, error: finalError } = await supabase.auth.getSession();
                
                if (finalError) {
                  console.error('Error in final session check:', finalError);
                  setError(`Authentication error: ${finalError.message}`);
                } else if (finalData?.session) {
                  console.log('Session created in final attempt:', finalData.session.user.email);
                  navigate('/dashboard');
                  return;
                } else {
                  console.error('Failed to create session after multiple attempts');
                  setError('Authentication failed. Please try again.');
                }
              } catch (err) {
                console.error('Exception in final attempt:', err);
                setError(`Unexpected error: ${err.message}`);
              }
              setLoading(false);
            }, 3000);
          } catch (err) {
            console.error('Exception in delayed session check:', err);
            setError(`Unexpected error: ${err.message}`);
            setLoading(false);
          }
        }, 3000);
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setError(`Unexpected error: ${err.message}`);
        setLoading(false);
      }
    }
    
    handleAuthCallback();
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        {error ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-red-500 text-xl mb-4">Authentication Error</div>
            <p className="text-gray-400 mb-4">{error}</p>
            <div className="text-left text-xs text-gray-500 mb-4 overflow-auto max-h-40">
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
            <button 
              onClick={() => navigate('/login')} 
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <h2 className="text-xl text-white font-medium">Completing authentication...</h2>
            <p className="text-gray-400 mt-2">You'll be redirected in a moment</p>
            {loading && (
              <div className="mt-8 text-xs text-gray-500">
                <p>If you're not redirected within 10 seconds, please try logging in again.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RedirectHandler;
