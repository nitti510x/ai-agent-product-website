import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import AIAgentsList from '../components/dashboard/AIAgentsList';
import AgentSettings from '../components/dashboard/AgentSettings';
import AgentActivity from '../components/dashboard/AgentActivity';
import AgentUsage from '../components/dashboard/AgentUsage';
import OverallUsage from '../components/dashboard/OverallUsage';
import RecentActivity from '../components/dashboard/RecentActivity';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Profile from '../components/dashboard/Profile';
import Subscription from '../components/dashboard/Subscription';
import TokenManagement from '../components/dashboard/TokenManagement';
import TokenBalanceWidget from '../components/dashboard/TokenBalanceWidget';
import SetupGuide from '../components/dashboard/SetupGuide';
import UsersManagement from '../components/dashboard/UsersManagement';
import BillingLayout from '../components/billing/BillingLayout';
import TransactionHistory from '../components/billing/TransactionHistory';
import PaymentMethods from '../components/billing/PaymentMethods';
import SubscriptionCheckout from '../components/subscription/SubscriptionCheckout';
import MyAccount from '../pages/MyAccount';
import Logo from '../components/Logo';
import { FiUser, FiLogOut, FiCreditCard } from 'react-icons/fi';

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
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-gray-100">
              <Logo className="h-8" />
            </Link>
            <div className="flex items-center space-x-6">
              {user && (
                <Link to="/dashboard" className="text-text-light hover:text-primary transition-colors">
                  Dashboard
                </Link>
              )}
              {/* Token Balance Widget */}
              <div className="mr-4">
                <TokenBalanceWidget compact={true} />
              </div>
              <Link 
                to="/dashboard/account/profile" 
                className="flex items-center text-gray-400 hover:text-primary transition-colors mr-4"
              >
                <FiUser className="w-6 h-6 mr-1" />
                <span className="text-sm">
                  My Account
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

      <div className="py-8">
        <Routes>
          <Route index element={<DashboardLayout><AIAgentsList /></DashboardLayout>} />
          <Route path="settings/:agentId" element={<DashboardLayout><AgentSettings /></DashboardLayout>} />
          <Route path="activity/:agentId" element={<DashboardLayout><AgentActivity /></DashboardLayout>} />
          <Route path="usage/:agentId" element={<DashboardLayout><AgentUsage /></DashboardLayout>} />
          <Route path="usage" element={<DashboardLayout><OverallUsage /></DashboardLayout>} />
          <Route path="activity" element={<DashboardLayout><RecentActivity /></DashboardLayout>} />
          <Route path="profile" element={<Profile />} />
          <Route path="subscription" element={<BillingLayout><Subscription /></BillingLayout>} />
          <Route path="tokens" element={<DashboardLayout><TokenManagement /></DashboardLayout>} />
          <Route path="setup/:agentId" element={<DashboardLayout><SetupGuide /></DashboardLayout>} />
          <Route path="users" element={<DashboardLayout><UsersManagement /></DashboardLayout>} />
          
          {/* Account Section Routes - All account pages use this layout */}
          <Route path="account" element={<BillingLayout><Subscription /></BillingLayout>} />
          <Route path="account/profile" element={<BillingLayout><Profile /></BillingLayout>} />
          <Route path="account/plans" element={<BillingLayout><Subscription /></BillingLayout>} />
          <Route path="account/payment-methods" element={<BillingLayout><PaymentMethods /></BillingLayout>} />
          <Route path="account/transactions" element={<BillingLayout><TransactionHistory /></BillingLayout>} />
          
          {/* Redirects for backward compatibility */}
          <Route path="my-account/*" element={<Navigate to="/dashboard/account/profile" replace />} />
          <Route path="billing/*" element={<Navigate to="/dashboard/account/profile" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;