import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import AIAgentsList from '../components/dashboard/AIAgentsList';
import AgentSettings from '../components/dashboard/AgentSettings';
import AgentActivity from '../components/dashboard/AgentActivity';
import AgentUsage from '../components/dashboard/AgentUsage';
import OverallUsage from '../components/dashboard/OverallUsage';
import Profile from '../components/dashboard/Profile';
import Subscription from '../components/dashboard/Subscription';
import TokenManagement from '../components/dashboard/TokenManagement';
import SetupGuide from '../components/dashboard/SetupGuide';
import Logo from '../components/Logo';
import { FiUser, FiLogOut } from 'react-icons/fi';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loginProvider, setLoginProvider] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      console.log('User data:', user);
      setUser(user);
      
      // Determine login provider
      const loginProvider = getLoginProvider(user);
      setLoginProvider(loginProvider);
      console.log('User logged in via:', loginProvider);
    });
  }, []);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-dark">
      <nav className="bg-dark-lighter border-b border-dark-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-gray-100">
              <Logo className="h-8" />
            </Link>
            <div className="flex items-center space-x-6">
              {user && (
                <span className="text-text-light">
                  {user.email}
                </span>
              )}
              <Link 
                to="/dashboard/profile" 
                className="flex items-center text-gray-400 hover:text-primary transition-colors mr-4"
              >
                <FiUser className="w-6 h-6 mr-1" />
                <span className="text-sm">
                  {user?.user_metadata?.full_name || user?.email || 'Profile'}
                </span>
              </Link>
              {/* Removed login provider display from navigation */}
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-400 hover:text-secondary transition-colors"
              >
                <FiLogOut className="w-5 h-5 mr-2" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <Routes>
          <Route index element={<AIAgentsList />} />
          <Route path="settings/:agentId" element={<AgentSettings />} />
          <Route path="activity/:agentId" element={<AgentActivity />} />
          <Route path="usage/:agentId" element={<AgentUsage />} />
          <Route path="usage" element={<OverallUsage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="tokens" element={<TokenManagement />} />
          <Route path="setup/:agentId" element={<SetupGuide />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;