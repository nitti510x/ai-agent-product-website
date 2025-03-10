import React, { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;

  const handleOAuthLogin = async (provider) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Initiating ${provider} OAuth login`);
      const redirectUrl = `${siteUrl}/auth/callback`;
      console.log('Using redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          scopes: provider === 'google' ? 'email profile' : '',
        },
      });
      
      if (error) {
        console.error('OAuth login error:', error);
        setError(error.message);
      }
    } catch (err) {
      console.error('Exception during OAuth login:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="bg-dark-lighter p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="GeniusOS Logo" className="h-12" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-100 mb-2 text-center">
          Welcome Back
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Sign in to continue to your dashboard
        </p>
        
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <button
            onClick={() => handleOAuthLogin('slack')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#4A154B] text-white py-2 px-4 rounded hover:bg-[#3e1140] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 15C5.17157 15 4.5 15.6716 4.5 16.5C4.5 17.3284 5.17157 18 6 18C6.82843 18 7.5 17.3284 7.5 16.5V15H6Z" />
              <path d="M7.5 7.5C7.5 6.67157 6.82843 6 6 6C5.17157 6 4.5 6.67157 4.5 7.5C4.5 8.32843 5.17157 9 6 9H7.5V7.5Z" />
              <path d="M9 7.5V6C9 5.17157 8.32843 4.5 7.5 4.5C6.67157 4.5 6 5.17157 6 6V7.5H9Z" />
              <path d="M15 7.5C15.8284 7.5 16.5 6.82843 16.5 6C16.5 5.17157 15.8284 4.5 15 4.5C14.1716 4.5 13.5 5.17157 13.5 6V7.5H15Z" />
              <path d="M13.5 16.5C13.5 17.3284 14.1716 18 15 18C15.8284 18 16.5 17.3284 16.5 16.5C16.5 15.6716 15.8284 15 15 15H13.5V16.5Z" />
              <path d="M12 15V16.5C12 17.3284 12.6716 18 13.5 18C14.3284 18 15 17.3284 15 16.5V15H12Z" />
              <path d="M16.5 9H18C18.8284 9 19.5 8.32843 19.5 7.5C19.5 6.67157 18.8284 6 18 6C17.1716 6 16.5 6.67157 16.5 7.5V9Z" />
              <path d="M18 13.5C17.1716 13.5 16.5 14.1716 16.5 15C16.5 15.8284 17.1716 16.5 18 16.5C18.8284 16.5 19.5 15.8284 19.5 15C19.5 14.1716 18.8284 13.5 18 13.5Z" />
              <path d="M9 16.5V18C9 18.8284 8.32843 19.5 7.5 19.5C6.67157 19.5 6 18.8284 6 18V16.5H9Z" />
              <path d="M7.5 13.5H6C5.17157 13.5 4.5 14.1716 4.5 15C4.5 15.8284 5.17157 16.5 6 16.5C6.82843 16.5 7.5 15.8284 7.5 15V13.5Z" />
              <path d="M13.5 9H15C15.8284 9 16.5 8.32843 16.5 7.5C16.5 6.67157 15.8284 6 15 6C14.1716 6 13.5 6.67157 13.5 7.5V9Z" />
              <path d="M10.5 15C10.5 14.1716 9.82843 13.5 9 13.5C8.17157 13.5 7.5 14.1716 7.5 15C7.5 15.8284 8.17157 16.5 9 16.5H10.5V15Z" />
            </svg>
            Continue with Slack
          </button>
          
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 py-2 px-4 rounded hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>
        
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}

export default Login;