import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiSave } from 'react-icons/fi';
import { supabase } from '../../config/supabase';

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  });
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loginProvider, setLoginProvider] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return;
      }
      
      // Determine login provider
      const provider = getLoginProvider(user);
      setLoginProvider(provider);
      
      // Set user data
      setUserData({
        name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
        email: user.email,
      });
      
    } catch (error) {
      console.error('Error loading user profile:', error);
      setError('Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  // Function to determine login provider
  const getLoginProvider = (user) => {
    if (!user) return null;
    
    // Check app_metadata.provider
    const provider = user.app_metadata?.provider;
    
    if (provider === 'google') return 'Google';
    if (provider === 'slack' || provider === 'slack_oidc') return 'Slack';
    if (provider === 'email') return 'Email/Password';
    
    // Fallback to checking identities
    if (user.identities?.length > 0) {
      const identity = user.identities[0];
      if (identity.provider === 'google') return 'Google';
      if (identity.provider === 'slack' || identity.provider === 'slack_oidc') return 'Slack';
      if (identity.provider === 'email') return 'Email/Password';
    }
    
    return 'Unknown';
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (!formData.currentPassword || !formData.newPassword) {
      alert('Please fill in all password fields');
      return;
    }
    
    try {
      setLoading(true);
      
      // First verify the current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: formData.currentPassword
      });
      
      if (signInError) {
        alert('Current password is incorrect');
        setLoading(false);
        return;
      }
      
      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });
      
      if (error) throw error;
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error.message);
      alert('Error updating password: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-dark-lighter p-6 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Full Name
              </label>
              <div className="flex items-center">
                <FiUser className="w-5 h-5 text-gray-400 mr-3" />
                <p className="text-gray-100">{userData.name}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <div className="flex items-center">
                <FiMail className="w-5 h-5 text-gray-400 mr-3" />
                <p className="text-gray-100">{userData.email}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Login Provider
              </label>
              <div className="flex items-center">
                <FiLock className="w-5 h-5 text-gray-400 mr-3" />
                <p className="text-gray-100">{loginProvider}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Password Change - Only show for email/password users */}
        {loginProvider === 'Email/Password' && (
          <div className="bg-dark-lighter p-6 rounded-xl">
            <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full bg-dark border border-dark-card rounded-lg pl-10 pr-4 py-2 text-gray-100 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full bg-dark border border-dark-card rounded-lg pl-10 pr-4 py-2 text-gray-100 focus:border-primary focus:outline-none"
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
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-dark border border-dark-card rounded-lg pl-10 pr-4 py-2 text-gray-100 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="flex items-center justify-center w-full bg-primary hover:bg-primary-hover text-dark font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-glow"
              >
                <FiSave className="mr-2" />
                Update Password
              </button>
            </form>
          </div>
        )}
        
        {/* Message for SSO users */}
        {loginProvider && loginProvider !== 'Email/Password' && (
          <div className="bg-dark-lighter p-6 rounded-xl">
            <h2 className="text-xl font-bold text-white mb-6">Password Management</h2>
            <div className="p-4 bg-dark rounded-lg border border-dark-card">
              <p className="text-gray-300">
                You're signed in with {loginProvider}. Password management is handled through your {loginProvider} account.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;