import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiSave } from 'react-icons/fi';
import { supabase } from '../../config/supabase';
import PageHeader from './PageHeader';

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
  const [userAvatar, setUserAvatar] = useState(null);

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
      
      console.log('Profile - User data:', user);
      
      // Determine login provider
      const provider = getLoginProvider(user);
      setLoginProvider(provider);
      
      // Set user data
      setUserData({
        name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
        email: user.email,
      });
      
      // Get user avatar
      let avatarUrl = null;
      
      // Check user_metadata for avatar
      if (user.user_metadata?.avatar_url) {
        avatarUrl = user.user_metadata.avatar_url;
        console.log('Found avatar_url in user_metadata:', avatarUrl);
      } else if (user.user_metadata?.picture) {
        avatarUrl = user.user_metadata.picture;
        console.log('Found picture in user_metadata:', avatarUrl);
      }
      
      // For Slack users, the avatar might be in a different location
      if (!avatarUrl && user.identities) {
        // Try to find Slack identity
        const slackIdentity = user.identities.find(id => 
          id.provider === 'slack' || id.provider === 'slack_oidc'
        );
        
        if (slackIdentity?.identity_data?.user?.image_48) {
          avatarUrl = slackIdentity.identity_data.user.image_48;
          console.log('Found Slack avatar:', avatarUrl);
        } else if (slackIdentity?.identity_data?.image_48) {
          avatarUrl = slackIdentity.identity_data.image_48;
          console.log('Found Slack avatar in identity_data root:', avatarUrl);
        } else if (slackIdentity?.identity_data?.image_url) {
          avatarUrl = slackIdentity.identity_data.image_url;
          console.log('Found Slack image_url:', avatarUrl);
        }
        
        // Check Google identity too
        const googleIdentity = user.identities.find(id => id.provider === 'google');
        
        if (!avatarUrl && googleIdentity?.identity_data?.picture) {
          avatarUrl = googleIdentity.identity_data.picture;
          console.log('Found Google avatar in identity_data:', avatarUrl);
        } else if (!avatarUrl && googleIdentity?.identity_data?.avatar_url) {
          avatarUrl = googleIdentity.identity_data.avatar_url;
          console.log('Found Google avatar_url in identity_data:', avatarUrl);
        }
      }
      
      // Set the avatar URL if found
      if (avatarUrl) {
        console.log('Setting user avatar to:', avatarUrl);
        setUserAvatar(avatarUrl);
      } else {
        console.log('No avatar found for user');
        
        // Try to extract from localStorage as a last resort
        try {
          const supabaseItems = Object.keys(localStorage)
            .filter(key => key.includes('supabase'))
            .reduce((obj, key) => {
              try {
                obj[key] = JSON.parse(localStorage.getItem(key));
              } catch (e) {
                obj[key] = localStorage.getItem(key);
              }
              return obj;
            }, {});
          
          console.log('Supabase items in localStorage:', supabaseItems);
          
          // Try to find avatar in localStorage
          const sbSession = localStorage.getItem('sb-' + import.meta.env.VITE_SUPABASE_URL.split('//')[1].split('.')[0] + '-auth-token');
          if (sbSession) {
            try {
              const sessionData = JSON.parse(sbSession);
              console.log('Session data from localStorage:', sessionData);
              
              if (sessionData?.user?.user_metadata?.avatar_url) {
                setUserAvatar(sessionData.user.user_metadata.avatar_url);
                console.log('Found avatar in localStorage session:', sessionData.user.user_metadata.avatar_url);
              } else if (sessionData?.user?.user_metadata?.picture) {
                setUserAvatar(sessionData.user.user_metadata.picture);
                console.log('Found picture in localStorage session:', sessionData.user.user_metadata.picture);
              }
            } catch (e) {
              console.error('Error parsing localStorage session:', e);
            }
          }
        } catch (e) {
          console.error('Error checking localStorage:', e);
        }
      }
      
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
    <>
      <PageHeader 
        title="My Profile"
        description="Manage your personal information and account security"
      />
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-dark-lighter p-6 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
          
          {/* User Avatar */}
          <div className="flex flex-col items-center mb-6">
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt={userData.name || "User"} 
                className="w-24 h-24 rounded-full mb-3 border-2 border-primary object-cover"
                onError={(e) => {
                  console.error('Error loading avatar image:', e);
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=10B981&color=fff`;
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-dark-card flex items-center justify-center mb-3 border-2 border-primary">
                <FiUser className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <p className="text-lg font-medium text-gray-100">{userData.name}</p>
          </div>
          
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
    </>
  );
}

export default Profile;