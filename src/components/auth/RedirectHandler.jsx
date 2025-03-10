import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';

function RedirectHandler() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('RedirectHandler: Processing authentication callback');
        console.log('Current URL:', window.location.href);
        
        // Check for session
        console.log('Checking for existing session...');
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError(sessionError.message);
          navigate('/login');
          return;
        }
        
        if (data?.session) {
          console.log('Session found, redirecting to dashboard');
          navigate('/dashboard');
          return;
        }
        
        // If no session exists yet, wait a moment and try again
        console.log('No session found, waiting and trying again...');
        setTimeout(async () => {
          const { data: delayedData, error: delayedError } = await supabase.auth.getSession();
          
          if (delayedError) {
            console.error('Error getting session after delay:', delayedError);
            setError(delayedError.message);
            navigate('/login');
            return;
          }
          
          if (delayedData?.session) {
            console.log('Session found after delay, redirecting to dashboard');
            navigate('/dashboard');
          } else {
            console.error('No session found after delay');
            setError('Authentication failed. Please try again.');
            navigate('/login');
          }
        }, 2000);
      } catch (err) {
        console.error('Exception in auth callback:', err);
        setError(err.message);
        navigate('/login');
      }
    };
    
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
          </>
        )}
      </div>
    </div>
  );
}

export default RedirectHandler;
