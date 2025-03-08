import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import Logo from '../Logo';

const EnhancedUpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const navigate = useNavigate();

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');

  // Animation effect when component mounts
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  // Check password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordFeedback('');
      return;
    }

    // Basic password strength check
    let strength = 0;
    let feedback = '';

    // Length check
    if (password.length >= 8) {
      strength += 1;
    } else {
      feedback = 'Password should be at least 8 characters';
    }

    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    // Set feedback based on strength
    if (strength === 5) {
      feedback = 'Strong password';
    } else if (strength >= 3) {
      feedback = 'Good password';
    } else if (strength >= 1) {
      feedback = 'Weak password';
    }

    setPasswordStrength(strength);
    setPasswordFeedback(feedback);
  }, [password]);

  const getStrengthColor = () => {
    if (passwordStrength >= 4) return 'bg-emerald-500';
    if (passwordStrength >= 3) return 'bg-blue-500';
    if (passwordStrength >= 2) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (passwordStrength < 3) {
      setError('Please use a stronger password');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      setSuccess(true);
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setError(error.message || 'An error occurred while updating your password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark to-dark-lighter p-4 bg-auth">
      <div className={`max-w-md w-full p-8 bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 backdrop-blur-sm transition-all duration-500 auth-card ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Particles for visual effect */}
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo className="h-10 logo-animation" />
        </div>
        
        {/* Header */}
        <div className="text-center mb-8 relative">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] text-transparent bg-clip-text">Update Password</h2>
          <p className="text-gray-400 mt-2">Create a new secure password for your account</p>
        </div>
        
        {/* Success message */}
        {success && (
          <div className="mb-6 p-6 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-center">
            <FiCheckCircle className="mx-auto text-4xl text-emerald-400 mb-2" />
            <h3 className="text-xl font-medium text-white mb-1">Password Updated!</h3>
            <p className="text-emerald-300 text-sm">Your password has been successfully updated.</p>
            <p className="text-gray-400 text-xs mt-2">Redirecting to dashboard...</p>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}
        
        {!success && (
          <form onSubmit={handleUpdatePassword}>
            {/* New Password Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
              <div className="relative input-focus-effect">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-2 border-[#2f3946] focus:border-[#2AC4FF] rounded-xl py-3 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                  placeholder="Enter new password"
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
              
              {/* Password strength indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div 
                        key={level}
                        className={`h-1 flex-1 rounded-full ${
                          passwordStrength >= level ? getStrengthColor() : 'bg-gray-700'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className={`text-xs ${
                    passwordStrength >= 4 ? 'text-emerald-400' : 
                    passwordStrength >= 3 ? 'text-blue-400' : 
                    passwordStrength >= 2 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {passwordFeedback}
                  </p>
                </div>
              )}
            </div>
            
            {/* Confirm Password Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-1">Confirm Password</label>
              <div className="relative input-focus-effect">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-500" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-transparent border-2 ${
                    confirmPassword && password !== confirmPassword 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-[#2f3946] focus:border-[#2AC4FF]'
                  } rounded-xl py-3 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300`}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] hover:from-[#2ce28f] hover:to-[#25b0e6] text-black font-semibold rounded-xl transition-all duration-300 relative overflow-hidden group btn-glow"
              disabled={loading}
            >
              <span className="absolute -inset-x-full top-0 bottom-0 w-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer"></span>
              <span className="relative flex items-center justify-center">
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                Update Password
              </span>
            </button>
          </form>
        )}
        
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

export default EnhancedUpdatePassword;
