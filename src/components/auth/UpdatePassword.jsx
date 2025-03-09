import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { FiLock, FiCheck, FiAlertTriangle } from 'react-icons/fi';

function UpdatePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    // Check if we're on the correct URL with the necessary parameters
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
    
    const type = searchParams.get('type') || hashParams.get('type');
    const accessToken = searchParams.get('access_token') || hashParams.get('access_token');
    
    console.log('Reset password params:', { type, accessToken: !!accessToken });
    
    if (type !== 'recovery' || !accessToken) {
      console.error('Invalid password reset parameters', { type, hasAccessToken: !!accessToken });
      setTokenError(true);
      setError('Invalid or expired password reset link. Please request a new password reset.');
    } else {
      // Set the access token in the Supabase session
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: null,
      }).then(({ error }) => {
        if (error) {
          console.error('Error setting session:', error);
          setTokenError(true);
          setError('Invalid or expired password reset token. Please request a new password reset.');
        }
      });
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setMessage(null);
    
    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      setMessage('Updating your password...');
      
      // Update the user's password
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });
      
      console.log('Password update response:', { success: !!data, error });
      
      if (error) throw error;
      
      // Success!
      setSuccess(true);
      setMessage('Password updated successfully!');
      
      // Clear form
      setPassword('');
      setConfirmPassword('');
      
    } catch (error) {
      console.error('Error updating password:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark to-dark-lighter">
      <div className="max-w-md w-full p-8 bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] text-transparent bg-clip-text">
            Update Password
          </h2>
          <p className="text-gray-400 mt-2">
            Create a new secure password for your account
          </p>
        </div>

        {tokenError ? (
          <div className="text-center">
            <div className="bg-red-900/20 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6 flex items-center justify-center">
              <FiAlertTriangle className="mr-2" size={20} />
              {error}
            </div>
            <button
              onClick={() => navigate('/auth/forgot-password')}
              className="w-full bg-primary hover:bg-primary-hover text-dark font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-glow"
            >
              Request New Password Reset
            </button>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="text-center">
            <div className="bg-green-900/20 border border-green-500/50 text-green-500 p-4 rounded-lg mb-6 flex items-center justify-center">
              <FiCheck className="mr-2" size={20} />
              Password updated successfully!
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-primary hover:bg-primary-hover text-dark font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-glow"
            >
              Sign In
            </button>
          </div>
        ) : !tokenError ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                New Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark border border-dark-card rounded-lg pl-10 pr-4 py-3 text-gray-100 focus:border-primary focus:outline-none"
                  placeholder="Your new password"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-dark border border-dark-card rounded-lg pl-10 pr-4 py-3 text-gray-100 focus:border-primary focus:outline-none"
                  placeholder="Confirm your new password"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-dark font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-glow flex items-center justify-center"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
            
            {message && !error && !success && (
              <div className="text-center text-gray-400 mt-4">
                {message}
              </div>
            )}
          </form>
        ) : null}
      </div>
    </div>
  );
}

export default UpdatePassword;
