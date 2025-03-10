import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../../config/supabase';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('ProtectedRoute: Checking authentication status...');
        
        // First attempt
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking authentication:', error);
          setAuthenticated(false);
          setLoading(false);
          return;
        }
        
        const isAuth = !!data.session;
        console.log('User is authenticated (first check):', isAuth);
        
        if (isAuth) {
          setAuthenticated(true);
          setLoading(false);
          return;
        }
        
        // If not authenticated on first check, try again after a short delay
        // This helps when the page is loaded right after an OAuth callback
        setTimeout(async () => {
          try {
            console.log('ProtectedRoute: Checking authentication again after delay...');
            const { data: delayedData, error: delayedError } = await supabase.auth.getSession();
            
            if (delayedError) {
              console.error('Error checking delayed authentication:', delayedError);
              setAuthenticated(false);
            } else {
              const isDelayedAuth = !!delayedData.session;
              console.log('User is authenticated (delayed check):', isDelayedAuth);
              setAuthenticated(isDelayedAuth);
            }
          } catch (err) {
            console.error('Exception in delayed auth check:', err);
            setAuthenticated(false);
          } finally {
            setLoading(false);
          }
        }, 1000);
      } catch (err) {
        console.error('Exception checking authentication:', err);
        setAuthenticated(false);
        setLoading(false);
      }
    };

    // Check authentication status
    checkAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      const isAuth = !!session;
      console.log('User is authenticated (from event):', isAuth);
      setAuthenticated(isAuth);
      setLoading(false);
    });

    // Clean up the subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <h2 className="text-xl text-white font-medium">Verifying authentication...</h2>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    console.log('User is not authenticated, redirecting to login');
    // Redirect to login page with a return URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  console.log('User is authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute;