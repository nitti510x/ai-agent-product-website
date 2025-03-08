import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';

function RedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a hash in the URL (typical for OAuth redirects)
    if (window.location.hash) {
      // Process the hash with Supabase auth
      supabase.auth.getSession().then(({ data }) => {
        if (data?.session) {
          console.log('Successfully authenticated');
          // Redirect to dashboard after successful auth
          navigate('/dashboard');
        } else {
          console.error('Authentication failed');
          navigate('/login');
        }
      });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <h2 className="text-xl text-white font-medium">Completing authentication...</h2>
        <p className="text-gray-400 mt-2">You'll be redirected in a moment</p>
      </div>
    </div>
  );
}

export default RedirectHandler;
