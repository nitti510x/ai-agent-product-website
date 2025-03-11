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
import Help from '../components/dashboard/Help';
import TokenPurchase from '../components/dashboard/tokens/TokenPurchase';
import TokenHistory from '../components/dashboard/tokens/TokenHistory';
import TokenSettings from '../components/dashboard/tokens/TokenSettings';
import FAQs from '../components/dashboard/help/FAQs';
import Support from '../components/dashboard/help/Support';
import SystemStatus from '../components/dashboard/help/SystemStatus';
import QuickSetup from '../components/dashboard/QuickSetup';
import Security from '../components/dashboard/account/Security';
import OrganizationProfile from '../components/dashboard/account/OrganizationProfile';
import BillingLayout from '../components/billing/BillingLayout';
import TransactionHistory from '../components/billing/TransactionHistory';
import PaymentMethods from '../components/billing/PaymentMethods';
import SubscriptionCheckout from '../components/subscription/SubscriptionCheckout';
import MyAccount from '../pages/MyAccount';
import Logo from '../components/Logo';
import { FiUser, FiLogOut, FiCreditCard, FiHelpCircle } from 'react-icons/fi';
import Notifications from '../components/dashboard/notifications/Notifications';
import NotificationDropdown from '../components/dashboard/notifications/NotificationDropdown';
import { NotificationProvider } from '../contexts/NotificationContext';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loginProvider, setLoginProvider] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      console.log('User data:', user);
      setUser(user);
      
      // Determine login provider
      const loginProvider = getLoginProvider(user);
      setLoginProvider(loginProvider);
      console.log('User logged in via:', loginProvider);
      
      // Get user avatar
      if (user) {
        // Try to get avatar from user metadata
        let avatarUrl = null;
        
        // Check user_metadata for avatar
        if (user.user_metadata?.avatar_url) {
          avatarUrl = user.user_metadata.avatar_url;
        } else if (user.user_metadata?.picture) {
          avatarUrl = user.user_metadata.picture;
        }
        
        // For Slack users, the avatar might be in a different location
        if (!avatarUrl && user.identities) {
          const slackIdentity = user.identities.find(id => 
            id.provider === 'slack' || id.provider === 'slack_oidc'
          );
          if (slackIdentity?.identity_data?.user?.image_48) {
            avatarUrl = slackIdentity.identity_data.user.image_48;
          }
        }
        
        // Set the avatar URL if found
        if (avatarUrl) {
          console.log('Found user avatar:', avatarUrl);
          setUserAvatar(avatarUrl);
        } else {
          console.log('No avatar found for user');
        }
      }
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
              {/* Billing/Subscription Link */}
              <Link 
                to="/dashboard/billing" 
                className="flex items-center text-gray-400 hover:text-primary transition-colors"
              >
                <FiCreditCard className="w-5 h-5 mr-1" />
                <span className="text-sm">
                  Billing
                </span>
              </Link>
              {/* Help/Support Link */}
              <Link 
                to="/dashboard/help" 
                className="flex items-center text-gray-400 hover:text-primary transition-colors"
              >
                <FiHelpCircle className="w-5 h-5 mr-1" />
                <span className="text-sm">
                  Help
                </span>
              </Link>
              {/* Notifications */}
              <NotificationDropdown />
              {/* My Account Link */}
              <Link 
                to="/dashboard/account" 
                className="flex items-center text-gray-400 hover:text-primary transition-colors"
              >
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt="User Avatar" 
                    className="w-8 h-8 rounded-full mr-2 border border-gray-700"
                  />
                ) : (
                  <FiUser className="w-5 h-5 mr-1" />
                )}
                <span className="text-sm">
                  My Account
                </span>
              </Link>
              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-400 hover:text-secondary transition-colors"
              >
                <FiLogOut className="w-5 h-5 mr-1" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-8 pb-0">
        <Routes>
          <Route index element={<DashboardLayout><AIAgentsList /></DashboardLayout>} />
          <Route path="settings/:agentId" element={<DashboardLayout><AgentSettings /></DashboardLayout>} />
          <Route path="activity/:agentId" element={<DashboardLayout><AgentActivity /></DashboardLayout>} />
          <Route path="usage/:agentId" element={<DashboardLayout><AgentUsage /></DashboardLayout>} />
          <Route path="usage" element={<DashboardLayout><OverallUsage /></DashboardLayout>} />
          <Route path="activity" element={<DashboardLayout><RecentActivity /></DashboardLayout>} />
          <Route path="quicksetup" element={<DashboardLayout><QuickSetup /></DashboardLayout>} />
          <Route path="profile" element={<Profile />} />
          <Route path="billing" element={<BillingLayout><Subscription /></BillingLayout>} />
          <Route path="billing/payment" element={<BillingLayout><PaymentMethods /></BillingLayout>} />
          <Route path="billing/transactions" element={<BillingLayout><TransactionHistory /></BillingLayout>} />
          <Route path="billing/tokens" element={<Navigate to="/dashboard/tokens" replace />} />
          {/* Token Management Routes */}
          <Route path="tokens" element={<DashboardLayout><TokenManagement /></DashboardLayout>} />
          <Route path="tokens/purchase" element={<DashboardLayout><TokenPurchase /></DashboardLayout>} />
          <Route path="tokens/history" element={<DashboardLayout><TokenHistory /></DashboardLayout>} />
          <Route path="tokens/settings" element={<DashboardLayout><TokenSettings /></DashboardLayout>} />
          
          {/* Agent Setup Route */}
          <Route path="setup/:agentId" element={<DashboardLayout><SetupGuide /></DashboardLayout>} />
          <Route path="users" element={<DashboardLayout><UsersManagement /></DashboardLayout>} />
          
          {/* Help Section Routes */}
          <Route path="help" element={<DashboardLayout><Help /></DashboardLayout>} />
          <Route path="help/faqs" element={<DashboardLayout><FAQs /></DashboardLayout>} />
          <Route path="help/support" element={<DashboardLayout><Support /></DashboardLayout>} />
          <Route path="help/status" element={<DashboardLayout><SystemStatus /></DashboardLayout>} />
          
          {/* Account Section Routes */}
          <Route path="account" element={<DashboardLayout><Profile /></DashboardLayout>} />
          
          {/* Notifications Route */}
          <Route path="notifications" element={<DashboardLayout><Notifications /></DashboardLayout>} />
          <Route path="account/organization" element={<DashboardLayout><OrganizationProfile /></DashboardLayout>} />
          <Route path="account/security" element={<DashboardLayout><Security /></DashboardLayout>} />
          <Route path="account/team" element={<DashboardLayout><UsersManagement /></DashboardLayout>} />
          
          {/* Redirects for backward compatibility */}
          <Route path="my-account/*" element={<Navigate to="/dashboard/account" replace />} />
          <Route path="subscription/*" element={<Navigate to="/dashboard/billing" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;