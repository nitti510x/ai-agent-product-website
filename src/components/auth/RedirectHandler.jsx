import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../config/supabase';

function RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const maxRetries = 5;

  useEffect(() => {
    async function handleAuthCallback() {
      try {
        console.log('RedirectHandler: Processing authentication callback');
        
        // Get the URL hash or query parameters
        const hash = window.location.hash;
        const query = window.location.search;
        
        console.log('URL hash:', hash);
        console.log('URL query:', query);
        
        // Check for access_token in hash or query
        const hasAccessToken = hash.includes('access_token=') || query.includes('access_token=');
        const hasCode = query.includes('code=');
        
        console.log('Has access token:', hasAccessToken);
        console.log('Has code:', hasCode);
        
        // First check if we have a session already
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting initial session:', sessionError);
        }
        
        if (sessionData?.session) {
          console.log('Session already exists, redirecting to dashboard');
          console.log('Session user:', sessionData.session.user.id);
          console.log('Session provider:', sessionData.session.user.app_metadata?.provider);
          
          // Store the session in localStorage as a backup
          try {
            localStorage.setItem('last_auth_session', JSON.stringify({
              userId: sessionData.session.user.id,
              timestamp: new Date().toISOString()
            }));
          } catch (storageErr) {
            console.error('Error storing session backup:', storageErr);
          }
          
          navigate('/dashboard');
          return;
        }
        
        // If we have an access token or code in the URL but no session yet,
        // we need to wait for Supabase to process it
        if ((hasAccessToken || hasCode) && retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
          console.log(`Waiting ${delay}ms for Supabase to process the authentication (attempt ${retryCount + 1}/${maxRetries})...`);
          
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, delay);
          
          return;
        }
        
        // If we've exhausted retries and still don't have a session
        if (retryCount >= maxRetries) {
          console.error('Failed to establish session after maximum retries');
          setError('Authentication timed out. Please try again.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error in auth callback:', err);
        setError(err.message);
        setLoading(false);
      }
    }
    
    handleAuthCallback();
  }, [navigate, retryCount]);

  // When retry count changes, check for session again
  useEffect(() => {
    if (retryCount > 0 && retryCount <= maxRetries) {
      async function checkSession() {
        try {
          console.log(`Retry ${retryCount}/${maxRetries}: Checking for session...`);
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error(`Retry ${retryCount}: Error getting session:`, sessionError);
            return;
          }
          
          if (sessionData?.session) {
            console.log(`Retry ${retryCount}: Session found, redirecting to dashboard`);
            navigate('/dashboard');
          } else {
            console.log(`Retry ${retryCount}: No session found yet`);
          }
        } catch (err) {
          console.error(`Retry ${retryCount}: Exception checking session:`, err);
        }
      }
      
      checkSession();
    }
  }, [retryCount, navigate, maxRetries]);

  const handleManualRedirect = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div>
            <div className="text-red-500 text-xl mb-4">Authentication Error</div>
            <p className="text-gray-400 mb-4">{error}</p>
            <button 
              onClick={() => navigate('/login')} 
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 mr-2"
            >
              Return to Login
            </button>
            <button 
              onClick={handleManualRedirect} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Dashboard Anyway
            </button>
          </div>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <h2 className="text-xl text-white font-medium">Completing authentication...</h2>
            <p className="text-gray-400 mt-2">
              {retryCount < maxRetries 
                ? `Attempt ${retryCount + 1} of ${maxRetries}` 
                : "Maximum attempts reached"}
            </p>
            
            {retryCount >= 2 && (
              <button 
                onClick={handleManualRedirect} 
                className="mt-6 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
              >
                Continue to Dashboard
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default RedirectHandler;
