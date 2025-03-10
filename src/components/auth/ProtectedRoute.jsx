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
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking authentication:', error);
          setAuthenticated(false);
        } else {
          const isAuth = !!data.session;
          console.log('User is authenticated:', isAuth);
          setAuthenticated(isAuth);
        }
      } catch (err) {
        console.error('Exception checking authentication:', err);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // Check authentication status
    checkAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      setAuthenticated(!!session);
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
    // Redirect to login page with a return URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;