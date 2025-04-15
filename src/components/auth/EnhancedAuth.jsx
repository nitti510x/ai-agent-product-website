import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';
import SlackLogo from '../icons/SlackLogo';
import Logo from '../Logo';
import { useNotifications } from '../../contexts/NotificationContext';

const EnhancedAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [view, setView] = useState('sign_in'); // sign_in, sign_up, forgot_password
  const [animateIn, setAnimateIn] = useState(false);
  const [supabaseClient, setSupabaseClient] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotifications();

  // Get the redirect path from location state (if available)
  const from = location.state?.from?.pathname || '/dashboard';

  // Animation effect when component mounts
  useEffect(() => {
    setAnimateIn(true);
    
    // Lazily load the Supabase client
    const loadSupabase = async () => {
      try {
        const { supabase } = await import('../../config/supabase');
        setSupabaseClient(supabase);
      } catch (error) {
        console.error('Error loading Supabase client:', error);
        setError('Failed to initialize authentication system. Please try again later.');
        showNotification && showNotification('Authentication Error', 'Failed to initialize authentication system. Please try again later.', 'error');
      }
    };
    
    loadSupabase();
  }, [showNotification]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleViewChange = (newView) => {
    setAnimateIn(false);
    setTimeout(() => {
      setView(newView);
      setError(null);
      setSuccess(null);
      setAnimateIn(true);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!supabaseClient) {
      setError('Authentication system not initialized. Please try again later.');
      setLoading(false);
      return;
    }

    try {
      if (view === 'sign_in') {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        // Redirect to dashboard on successful login
        navigate(from);
      } else if (view === 'sign_up') {
        const { error } = await supabaseClient.auth.signUp({
          email,
          password
        });
        
        if (error) throw error;
        
        setSuccess('Registration successful! Please check your email to confirm your account.');
      } else if (view === 'forgot_password') {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/update-password`,
        });
        
        if (error) throw error;
        
        setSuccess('Password reset instructions have been sent to your email.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (!supabaseClient) {
        setError('Authentication system not initialized. Please try again later.');
        return;
      }
      
      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${siteUrl}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError(error.message || 'An error occurred during Google sign-in.');
      showNotification && showNotification('Authentication Error', error.message || 'An error occurred during Google sign-in.', 'error');
    }
  };

  const handleSlackSignIn = async () => {
    try {
      if (!supabaseClient) {
        setError('Authentication system not initialized. Please try again later.');
        return;
      }
      
      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'slack',
        options: {
          redirectTo: `${siteUrl}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Slack sign-in error:', error);
      setError(error.message || 'An error occurred during Slack sign-in.');
      showNotification && showNotification('Authentication Error', error.message || 'An error occurred during Slack sign-in.', 'error');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-dark p-4">
      <div className={`w-full max-w-md bg-dark-lighter rounded-xl shadow-xl overflow-hidden transition-all duration-300 transform ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo className="h-10" />
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            {view === 'sign_in' ? 'Welcome back' : view === 'sign_up' ? 'Create an account' : 'Reset your password'}
          </h2>
          <p className="text-gray-400 text-center mb-8">
            {view === 'sign_in' ? 'Sign in to your account to continue' : view === 'sign_up' ? 'Join the geniusOS platform' : 'Enter your email to receive reset instructions'}
          </p>
          
          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button 
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-dark-lightest transition-colors duration-300"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-3" />
              Sign in with Google
            </button>
            <button 
              onClick={handleSlackSignIn}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-dark-lightest transition-colors duration-300"
            >
              <SlackLogo className="w-5 h-5 mr-3" />
              Sign in with Slack
            </button>
          </div>
          
          {/* Divider */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="mx-4 text-gray-500 text-sm">or continue with email</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>
          
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-800 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-3 bg-green-900/30 border border-green-800 rounded-lg">
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-dark-lightest text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            
            {view !== 'forgot_password' && (
              <div>
                <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
                  {view === 'sign_up' ? 'Create a password' : 'Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-500" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-600 rounded-lg bg-dark-lightest text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-500 hover:text-gray-300 focus:outline-none"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-300"
            >
              <span className="relative flex items-center justify-center">
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {view === 'sign_in' ? 'Sign in' : view === 'sign_up' ? 'Sign up' : 'Send reset instructions'}
              </span>
            </button>
          </form>
          
          {/* Links */}
          <div className="mt-6 text-center">
            {view === 'sign_in' ? (
              <>
                <button 
                  onClick={() => handleViewChange('forgot_password')}
                  className="text-[#2AC4FF] hover:text-[#25b0e6] text-sm transition-colors duration-300"
                >
                  Forgot your password?
                </button>
                <div className="mt-3">
                  <span className="text-gray-400 text-sm">Don't have an account? </span>
                  <button 
                    onClick={() => handleViewChange('sign_up')}
                    className="text-[#2AC4FF] hover:text-[#25b0e6] text-sm transition-colors duration-300"
                  >
                    Sign up
                  </button>
                </div>
              </>
            ) : view === 'sign_up' ? (
              <div>
                <span className="text-gray-400 text-sm">Already have an account? </span>
                <button 
                  onClick={() => handleViewChange('sign_in')}
                  className="text-[#2AC4FF] hover:text-[#25b0e6] text-sm transition-colors duration-300"
                >
                  Sign in
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleViewChange('sign_in')}
                className="text-[#2AC4FF] hover:text-[#25b0e6] text-sm transition-colors duration-300 flex items-center justify-center mx-auto"
              >
                <FiArrowLeft className="mr-1" /> Back to sign in
              </button>
            )}
          </div>
          
          {/* Credits */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center text-gray-500 text-xs">
              <FaRobot className="mr-1 text-emerald-400" />
              <span>Powered by geniusOS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAuth;
