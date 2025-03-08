import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import SlackLogo from '../icons/SlackLogo';
import Logo from '../Logo';

const EnhancedAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [view, setView] = useState('sign_in'); // sign_in, sign_up, forgot_password
  const [animateIn, setAnimateIn] = useState(false);
  const navigate = useNavigate();

  // Animation effect when component mounts
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  // Animation effect when view changes
  useEffect(() => {
    setAnimateIn(false);
    setTimeout(() => setAnimateIn(true), 50);
  }, [view]);

  const handleViewChange = (newView) => {
    setError(null);
    setSuccess(null);
    setView(newView);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      setSuccess('Check your email for the confirmation link');
    } catch (error) {
      setError(error.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      
      if (error) throw error;
      
      setSuccess('Check your email for the password reset link');
    } catch (error) {
      setError(error.message || 'An error occurred during password reset');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      // OAuth flow will redirect the user
    } catch (error) {
      setError(error.message || `An error occurred during ${provider} sign in`);
      setLoading(false);
    }
  };

  const getViewTitle = () => {
    switch (view) {
      case 'sign_up':
        return 'Get Started';
      case 'forgot_password':
        return 'Reset Password';
      case 'sign_in':
      default:
        return 'Welcome Back';
    }
  };

  const getViewDescription = () => {
    switch (view) {
      case 'sign_up':
        return 'Create your account to access all features';
      case 'forgot_password':
        return "We'll send you instructions to reset your password";
      case 'sign_in':
      default:
        return 'Sign in to continue to your dashboard';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark to-dark-lighter p-4">
      <div className={`max-w-md w-full p-8 bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 backdrop-blur-sm transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Floating particles for visual effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-purple-500/10 rounded-full blur-xl"></div>
        </div>
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo className="h-10" />
        </div>
        
        {/* Header */}
        <div className="text-center mb-8 relative">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] text-transparent bg-clip-text">{getViewTitle()}</h2>
          <p className="text-gray-400 mt-2">{getViewDescription()}</p>
        </div>
        
        {/* Error and success messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm">
            {success}
          </div>
        )}
        
        {/* OAuth Buttons */}
        {view !== 'forgot_password' && (
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuthSignIn('slack_oidc')}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#2E2E2E] hover:bg-[#3d3d3d] text-white rounded-xl transition-colors duration-300 font-medium"
              disabled={loading}
            >
              <SlackLogo className="w-5 h-5" />
              Continue with Slack
            </button>
            
            <button
              onClick={() => handleOAuthSignIn('google')}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#2E2E2E] hover:bg-[#3d3d3d] text-white rounded-xl transition-colors duration-300 font-medium"
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
          </div>
        )}
        
        {/* Divider */}
        {view !== 'forgot_password' && (
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <div className="px-4 text-sm text-gray-400">or</div>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>
        )}
        
        {/* Forms */}
        <form onSubmit={view === 'sign_in' ? handleSignIn : view === 'sign_up' ? handleSignUp : handleResetPassword}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-2 border-[#2f3946] focus:border-[#2AC4FF] rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>
          
          {/* Password Field - Only for sign in and sign up */}
          {view !== 'forgot_password' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-2 border-[#2f3946] focus:border-[#2AC4FF] rounded-xl py-3 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                  placeholder="Your secure password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          )}
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] hover:from-[#2ce28f] hover:to-[#25b0e6] text-black font-semibold rounded-xl transition-all duration-300 relative overflow-hidden group"
            disabled={loading}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] group-hover:from-[#2ce28f] group-hover:to-[#25b0e6] transition-all duration-300"></span>
            <span className="absolute -inset-x-full top-0 bottom-0 w-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer"></span>
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
            <IoDiamond className="mr-1 text-emerald-400" />
            <span>Powered by geniusOS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAuth;
