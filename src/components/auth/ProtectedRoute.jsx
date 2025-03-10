import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../../config/supabase';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  const location = useLocation();
  const maxChecks = 3;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log(`ProtectedRoute: Checking authentication status (attempt ${checkCount + 1}/${maxChecks})...`);
        
        // Log local storage contents for debugging (only keys, not values for security)
        try {
          const localStorageKeys = Object.keys(localStorage);
          console.log('LocalStorage keys:', localStorageKeys);
          
          // Check specifically for Supabase auth keys
          const supabaseKeys = localStorageKeys.filter(key => key.includes('supabase') || key.includes('auth'));
          console.log('Supabase related localStorage keys:', supabaseKeys);
        } catch (storageErr) {
          console.error('Error accessing localStorage:', storageErr);
        }
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking authentication:', error);
          
          if (checkCount < maxChecks - 1) {
            // Try again after a delay
            setCheckCount(prev => prev + 1);
            return;
          }
          
          setAuthenticated(false);
        } else {
          const isAuth = !!data.session;
          console.log('User is authenticated:', isAuth);
          console.log('Session data:', data.session ? {
            user_id: data.session.user.id,
            expires_at: data.session.expires_at,
            provider: data.session.user.app_metadata?.provider
          } : 'No session');
          
          if (isAuth) {
            setAuthenticated(true);
            setLoading(false);
          } else if (checkCount < maxChecks - 1) {
            // Try again after a delay if not authenticated yet
            setCheckCount(prev => prev + 1);
            return;
          } else {
            setAuthenticated(false);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Exception checking authentication:', err);
        
        if (checkCount < maxChecks - 1) {
          // Try again after a delay
          setCheckCount(prev => prev + 1);
          return;
        }
        
        setAuthenticated(false);
        setLoading(false);
      }
    };

    // Check authentication with increasing delays
    if (checkCount === 0) {
      checkAuth();
    } else if (checkCount < maxChecks) {
      const timer = setTimeout(checkAuth, 2000); // 2 second delay between checks
      return () => clearTimeout(timer);
    }

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      console.log('Session in auth state change:', session ? 'exists' : 'null');
      
      if (session) {
        setAuthenticated(true);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setAuthenticated(false);
        setLoading(false);
      }
    });

    // Clean up the subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [checkCount]);

  // Manual check for URL parameters that might indicate successful auth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    
    console.log('Checking URL for auth indicators');
    console.log('URL search params:', window.location.search);
    console.log('URL hash:', hash);
    
    // If we have access_token in the URL, consider the user authenticated
    if (params.has('access_token') || hash.includes('access_token=')) {
      console.log('Found access_token in URL, considering user authenticated');
      setAuthenticated(true);
      setLoading(false);
    }
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <h2 className="text-xl text-white font-medium">Verifying authentication...</h2>
          <p className="text-gray-400 mt-2">Attempt {checkCount + 1} of {maxChecks}</p>
          {checkCount >= maxChecks - 1 && (
            <button 
              onClick={() => window.location.href = '/dashboard'} 
              className="mt-6 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Retry Dashboard Access
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!authenticated) {
    console.log('User not authenticated, redirecting to login');
    // Redirect to login page with a return URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  console.log('User authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute;