import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase, isAuthenticated } from '../../config/supabase';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('ProtectedRoute: Checking authentication...');
        const authed = await isAuthenticated();
        console.log('Authentication check result:', authed);
        setAuthenticated(authed);
        setLoading(false);

        // If not authenticated, try one more time after a delay
        // This helps in cases where the auth state might be in transition
        if (!authed) {
          console.log('Not authenticated, will check again after delay...');
          setTimeout(async () => {
            const secondCheck = await isAuthenticated();
            console.log('Second authentication check result:', secondCheck);
            setAuthenticated(secondCheck);
          }, 1000);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthenticated(false);
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, !!session);
      if (event === 'SIGNED_IN' && session) {
        setAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setAuthenticated(false);
      }
    });

    checkAuth();

    // Clean up auth listener on unmount
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;