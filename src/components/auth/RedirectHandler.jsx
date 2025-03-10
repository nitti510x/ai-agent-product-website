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
        
        // Try to get the session directly first
        console.log('Checking for existing session...');
        const { data: initialSession, error: initialError } = await supabase.auth.getSession();
        
        console.log('Initial session check result:', initialSession);
        if (initialError) console.error('Initial session check error:', initialError);
        
        if (initialSession?.session) {
          console.log('Session already exists:', initialSession.session);
          console.log('User:', initialSession.session.user.email);
          setLoading(false);
          navigate('/dashboard');
          return;
        }
        
        // If no hash or query, we can't proceed
        if (!hash && !query) {
          console.error('No hash or query parameters found in URL');
          setError('No authentication data found in URL');
          setLoading(false);
          return;
        }
        
        // For Supabase OAuth, we need to explicitly process the hash/query
        console.log('Attempting to process auth callback...');
        
        // First try - immediate check
        console.log('First attempt to get session after callback...');
        const { data: firstAttempt, error: firstError } = await supabase.auth.getSession();
        
        if (firstError) {
          console.error('First attempt error:', firstError);
        }
        
        if (firstAttempt?.session) {
          console.log('Session created on first attempt:', firstAttempt.session);
          console.log('User:', firstAttempt.session.user.email);
          setLoading(false);
          navigate('/dashboard');
          return;
        }
        
        // Second try - wait a bit longer (3 seconds)
        console.log('No session found immediately, waiting 3 seconds...');
        setTimeout(async () => {
          try {
            console.log('Second attempt to get session after delay...');
            const { data: secondAttempt, error: secondError } = await supabase.auth.getSession();
            
            if (secondError) {
              console.error('Second attempt error:', secondError);
              setError(`Authentication error: ${secondError.message}`);
              setLoading(false);
              return;
            }
            
            if (secondAttempt?.session) {
              console.log('Session created after delay:', secondAttempt.session);
              console.log('User:', secondAttempt.session.user.email);
              navigate('/dashboard');
            } else {
              // Last resort - try to manually refresh the auth state
              console.log('No session after delay, trying manual refresh...');
              
              // Third try - wait a bit more and try again
              setTimeout(async () => {
                try {
                  console.log('Final attempt to get session...');
                  const { data: finalAttempt, error: finalError } = await supabase.auth.getSession();
                  
                  if (finalError) {
                    console.error('Final attempt error:', finalError);
                    setError(`Authentication error: ${finalError.message}`);
                    setLoading(false);
                    return;
                  }
                  
                  if (finalAttempt?.session) {
                    console.log('Session created on final attempt:', finalAttempt.session);
                    console.log('User:', finalAttempt.session.user.email);
                    navigate('/dashboard');
                  } else {
                    console.error('Failed to create session after multiple attempts');
                    setError('Authentication failed. Please try again.');
                    navigate('/login');
                  }
                } catch (err) {
                  console.error('Error in final attempt:', err);
                  setError(`Error: ${err.message}`);
                }
                setLoading(false);
              }, 3000);
            }
          } catch (err) {
            console.error('Error in second attempt:', err);
            setError(`Error: ${err.message}`);
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
