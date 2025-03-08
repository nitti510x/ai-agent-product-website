import React, { useState } from 'react';
import { FiLock, FiShield, FiAlertTriangle, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';

function Security() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  // Password validation
  const validatePassword = (password) => {
    if (password.length < 8) {
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      return false;
    }
    if (!/[a-z]/.test(password)) {
      return false;
    }
    if (!/[0-9]/.test(password)) {
      return false;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return false;
    }
    return true;
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength(newPassword);
  
  // Password change handler
  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordError('');
    
    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    
    if (!validatePassword(newPassword)) {
      setPasswordError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    // In a real implementation, this would call an API to update the password
    // For demo purposes, we'll just simulate success
    setTimeout(() => {
      setPasswordChangeSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setPasswordChangeSuccess(false);
      }, 5000);
    }, 1000);
  };
  
  // Two-factor authentication toggle
  const handleTwoFactorToggle = () => {
    if (twoFactorEnabled) {
      setTwoFactorEnabled(false);
    } else {
      setShowTwoFactorSetup(true);
    }
  };
  
  // Complete two-factor setup
  const completeTwoFactorSetup = (e) => {
    e.preventDefault();
    
    // In a real implementation, this would verify the code with an API
    // For demo purposes, we'll just simulate success
    if (verificationCode.length === 6) {
      setTwoFactorEnabled(true);
      setShowTwoFactorSetup(false);
      setVerificationCode('');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Security Settings</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your account security and authentication</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Password Change Section */}
        <div className="md:col-span-2">
          <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6 mb-8">
            <div className="flex items-center mb-6">
              <FiLock className="text-primary mr-3 w-5 h-5" />
              <h3 className="text-lg font-semibold text-white">Change Password</h3>
            </div>
            
            {passwordChangeSuccess && (
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4 mb-6 flex items-center">
                <FiCheckCircle className="text-emerald-400 mr-3" />
                <p className="text-emerald-300">Password successfully updated!</p>
              </div>
            )}
            
            {passwordError && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 flex items-center">
                <FiAlertTriangle className="text-red-400 mr-3" />
                <p className="text-red-300">{passwordError}</p>
              </div>
            )}
            
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="current-password" className="block text-white font-medium mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-dark-card/70 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="new-password" className="block text-white font-medium mb-2">New Password</label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-dark-card/70 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  
                  {/* Password strength indicator */}
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Password Strength:</span>
                        <span className="text-xs">
                          {passwordStrength === 0 && <span className="text-red-400">Very Weak</span>}
                          {passwordStrength === 1 && <span className="text-red-400">Weak</span>}
                          {passwordStrength === 2 && <span className="text-yellow-400">Fair</span>}
                          {passwordStrength === 3 && <span className="text-yellow-400">Good</span>}
                          {passwordStrength === 4 && <span className="text-emerald-400">Strong</span>}
                          {passwordStrength === 5 && <span className="text-emerald-400">Very Strong</span>}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            passwordStrength <= 1 ? 'bg-red-500' : 
                            passwordStrength <= 3 ? 'bg-yellow-500' : 
                            'bg-emerald-500'
                          }`} 
                          style={{ width: `${passwordStrength * 20}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <ul className="mt-2 space-y-1 text-xs text-gray-400">
                    <li className={`flex items-center ${newPassword.length >= 8 ? 'text-emerald-400' : ''}`}>
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${newPassword.length >= 8 ? 'bg-emerald-400' : 'bg-gray-600'}`}></span>
                      At least 8 characters
                    </li>
                    <li className={`flex items-center ${/[A-Z]/.test(newPassword) ? 'text-emerald-400' : ''}`}>
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${/[A-Z]/.test(newPassword) ? 'bg-emerald-400' : 'bg-gray-600'}`}></span>
                      At least one uppercase letter
                    </li>
                    <li className={`flex items-center ${/[a-z]/.test(newPassword) ? 'text-emerald-400' : ''}`}>
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${/[a-z]/.test(newPassword) ? 'bg-emerald-400' : 'bg-gray-600'}`}></span>
                      At least one lowercase letter
                    </li>
                    <li className={`flex items-center ${/[0-9]/.test(newPassword) ? 'text-emerald-400' : ''}`}>
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${/[0-9]/.test(newPassword) ? 'bg-emerald-400' : 'bg-gray-600'}`}></span>
                      At least one number
                    </li>
                    <li className={`flex items-center ${/[^A-Za-z0-9]/.test(newPassword) ? 'text-emerald-400' : ''}`}>
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${/[^A-Za-z0-9]/.test(newPassword) ? 'bg-emerald-400' : 'bg-gray-600'}`}></span>
                      At least one special character
                    </li>
                  </ul>
                </div>
                
                <div>
                  <label htmlFor="confirm-password" className="block text-white font-medium mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-dark-card/70 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary/80 text-black font-medium px-6 py-2 rounded-lg transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Security Sidebar */}
        <div className="space-y-6">
          {/* Two-Factor Authentication */}
          <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6">
            <div className="flex items-center mb-4">
              <FiShield className="text-primary mr-3 w-5 h-5" />
              <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
            </div>
            
            {!showTwoFactorSetup ? (
              <div>
                <p className="text-gray-300 mb-4">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">
                    {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={twoFactorEnabled}
                      onChange={handleTwoFactorToggle}
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-300 mb-4">
                  Scan the QR code with your authenticator app and enter the verification code below.
                </p>
                
                {/* This would be a real QR code in a production app */}
                <div className="bg-white p-4 w-48 h-48 mx-auto mb-4 flex items-center justify-center">
                  <div className="text-black text-center">
                    <p className="font-bold">QR Code Placeholder</p>
                    <p className="text-xs mt-2">Scan with your authenticator app</p>
                  </div>
                </div>
                
                <form onSubmit={completeTwoFactorSetup}>
                  <div className="mb-4">
                    <label htmlFor="verification-code" className="block text-white font-medium mb-2">Verification Code</label>
                    <input
                      id="verification-code"
                      type="text"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Enter 6-digit code"
                      className="w-full bg-dark-card/70 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setShowTwoFactorSetup(false)}
                      className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={verificationCode.length !== 6}
                      className={`bg-primary text-black font-medium px-4 py-2 rounded-lg transition-colors ${
                        verificationCode.length !== 6 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/80'
                      }`}
                    >
                      Verify & Enable
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          
          {/* Recent Security Activity */}
          <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Security Activity</h3>
            <div className="space-y-4">
              <div className="border-b border-gray-700 pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white">Password Changed</p>
                    <p className="text-gray-400 text-sm">From IP: 192.168.1.1</p>
                  </div>
                  <span className="text-gray-400 text-sm">2 days ago</span>
                </div>
              </div>
              <div className="border-b border-gray-700 pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white">New Login</p>
                    <p className="text-gray-400 text-sm">From IP: 192.168.1.1</p>
                  </div>
                  <span className="text-gray-400 text-sm">5 days ago</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white">Account Created</p>
                    <p className="text-gray-400 text-sm">From IP: 192.168.1.1</p>
                  </div>
                  <span className="text-gray-400 text-sm">30 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Security;
