import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';

function RedirectHandler() {
  const navigate = useNavigate();
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
        
        // First check if we have a session already
        try {
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Error checking initial session:', sessionError);
          } else if (sessionData?.session) {
            console.log('Session already exists, redirecting to dashboard');
            navigate('/dashboard');
            return;
          }
        } catch (sessionErr) {
          console.error('Exception checking initial session:', sessionErr);
        }
        
        // If no session exists, we need to exchange the code for a session
        // This happens automatically with the Supabase JS client
        // We just need to check again after a short delay
        
        console.log('Waiting for Supabase to process the authentication...');
        
        // Give Supabase a moment to process the authentication
        setTimeout(async () => {
          try {
            const { data: delayedSessionData, error: delayedSessionError } = await supabase.auth.getSession();
            
            if (delayedSessionError) {
              console.error('Error getting delayed session:', delayedSessionError);
              setError(delayedSessionError.message);
            } else if (delayedSessionData?.session) {
              console.log('Successfully authenticated after delay');
              navigate('/dashboard');
              return;
            } else {
              console.error('No session found after delay');
              
              // One more attempt with a longer delay
              setTimeout(async () => {
                try {
                  const { data: finalSessionData, error: finalSessionError } = await supabase.auth.getSession();
                  
                  if (finalSessionError) {
                    console.error('Error getting final session:', finalSessionError);
                    setError(finalSessionError.message);
                  } else if (finalSessionData?.session) {
                    console.log('Successfully authenticated after final delay');
                    navigate('/dashboard');
                    return;
                  } else {
                    console.error('Authentication failed after all attempts');
                    setError('Authentication failed. Please try again.');
                  }
                } catch (finalErr) {
                  console.error('Exception in final session check:', finalErr);
                  setError(finalErr.message);
                }
                setLoading(false);
              }, 2000); // 2 second additional delay
            }
          } catch (delayedErr) {
            console.error('Exception in delayed session check:', delayedErr);
            setError(delayedErr.message);
            setLoading(false);
          }
        }, 2000); // 2 second initial delay
      } catch (err) {
        console.error('Error in auth callback:', err);
        setError(err.message);
        setLoading(false);
      }
    }
    
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div>
            <div className="text-red-500 text-xl mb-4">Authentication Error</div>
            <p className="text-gray-400 mb-4">{error}</p>
            <button 
              onClick={() => navigate('/login')} 
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <h2 className="text-xl text-white font-medium">Completing authentication...</h2>
            <p className="text-gray-400 mt-2">You'll be redirected in a moment</p>
            {loading && (
              <div className="mt-8 text-xs text-gray-500">
                <p>If you're not redirected within 10 seconds, please try logging in again.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default RedirectHandler;
