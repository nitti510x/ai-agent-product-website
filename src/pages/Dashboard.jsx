import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import AIAgentsList from '../components/dashboard/AIAgentsList';
import AgentSettings from '../components/dashboard/AgentSettings';
import AgentActivity from '../components/dashboard/AgentActivity';
import AgentUsage from '../components/dashboard/AgentUsage';
import OverallUsage from '../components/dashboard/OverallUsage';
import RecentActivity from '../components/dashboard/RecentActivity';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import BillingLayout from '../components/dashboard/BillingLayout';
import Profile from '../components/dashboard/Profile';
import Subscription from '../components/dashboard/Subscription';
import TokenManagement from '../components/dashboard/TokenManagement';
import TokenBalanceWidget from '../components/dashboard/TokenBalanceWidget';
import SetupGuide from '../components/dashboard/SetupGuide';
import UsersManagement from '../components/dashboard/UsersManagement';
import Help from '../components/dashboard/Help';
import HelpFaqs from '../components/dashboard/HelpFaqs';
import HelpSupport from '../components/dashboard/HelpSupport';
import HelpStatus from '../components/dashboard/HelpStatus';
import HelpQuickSetup from '../components/dashboard/HelpQuickSetup';
import TokenPurchase from '../components/dashboard/tokens/TokenPurchase';
import TokenHistory from '../components/dashboard/tokens/TokenHistory';
import TokenSettings from '../components/dashboard/tokens/TokenSettings';
import FAQs from '../components/dashboard/help/FAQs';
import Support from '../components/dashboard/help/Support';
import SystemStatus from '../components/dashboard/help/SystemStatus';
import QuickSetup from '../components/dashboard/QuickSetup';
import Security from '../components/dashboard/account/Security';
import OrganizationProfile from '../components/dashboard/account/OrganizationProfile';
import TransactionHistory from '../components/billing/TransactionHistory';
import PaymentMethods from '../components/billing/PaymentMethods';
import SubscriptionCheckout from '../components/subscription/SubscriptionCheckout';
import MyAccount from '../pages/MyAccount';
import Logo from '../components/Logo';
import { FiUser, FiLogOut, FiCreditCard, FiHelpCircle } from 'react-icons/fi';
import Notifications from '../components/dashboard/notifications/Notifications';
import NotificationDropdown from '../components/dashboard/notifications/NotificationDropdown';
import { NotificationProvider } from '../contexts/NotificationContext';
import MarketingImages from '../components/dashboard/MarketingImages';
import Personalization from './Personalization';
import PublishedContent from '../components/dashboard/content/PublishedContent';
import DraftsContent from '../components/dashboard/content/DraftsContent';
import ScheduledContent from '../components/dashboard/content/ScheduledContent';
import AwaitingApprovalContent from '../components/dashboard/content/AwaitingApprovalContent';
import CampaignsContent from '../components/dashboard/campaigns/CampaignsContent';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loginProvider, setLoginProvider] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Log all localStorage items for debugging
        console.log('All localStorage items:');
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          try {
            const value = localStorage.getItem(key);
            console.log(`${key}:`, value.substring(0, 100) + (value.length > 100 ? '...' : ''));
          } catch (e) {
            console.log(`${key}: [Error reading value]`);
          }
        }
        
        // Dynamically import supabase only when needed
        const { supabase } = await import('../config/supabase');
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        console.log('User data:', user);
        setUser(user);
        
        // Determine login provider
        const loginProvider = getLoginProvider(user);
        setLoginProvider(loginProvider);
        console.log('User logged in via:', loginProvider);
        
        // Get user avatar - directly use the avatar_url from localStorage
        const avatarUrl = localStorage.getItem('avatar_url');
        console.log('Avatar URL from localStorage:', avatarUrl);
        
        if (avatarUrl) {
          setUserAvatar(avatarUrl);
        } else {
          console.log('No avatar found in localStorage');
          
          // Only if no avatar in localStorage, try to get it from user data
          if (user?.user_metadata?.picture) {
            const googlePicture = user.user_metadata.picture;
            console.log('Found picture in user metadata:', googlePicture);
            localStorage.setItem('avatar_url', googlePicture);
            setUserAvatar(googlePicture);
          } else if (user?.user_metadata?.avatar_url) {
            const metadataAvatar = user.user_metadata.avatar_url;
            console.log('Found avatar_url in user metadata:', metadataAvatar);
            localStorage.setItem('avatar_url', metadataAvatar);
            setUserAvatar(metadataAvatar);
          } else if (user?.identities) {
            // Check for Google identity
            const googleIdentity = user.identities.find(id => id.provider === 'google');
            if (googleIdentity?.identity_data?.picture) {
              const googlePicture = googleIdentity.identity_data.picture;
              console.log('Found Google picture in identity_data:', googlePicture);
              localStorage.setItem('avatar_url', googlePicture);
              setUserAvatar(googlePicture);
            }
          }
        }
        
        // Set user name
        if (user.user_metadata?.name) {
          setUserName(user.user_metadata.name);
        } else if (user.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name);
        } else if (user.email) {
          setUserName(user.email);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard/tokens')) {
      setActiveSection('tokens');
    } else if (path.includes('/dashboard/billing')) {
      setActiveSection('billing');
    } else if (path.includes('/dashboard/help')) {
      setActiveSection('help');
    } else if (path.includes('/dashboard/account')) {
      setActiveSection('account');
    } else if (path.includes('/dashboard/notifications')) {
      setActiveSection('notifications');
    } else {
      setActiveSection('dashboard');
    }
  }, [location.pathname]);

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
    try {
      // Dynamically import supabase only when needed
      const { supabase } = await import('../config/supabase');
      
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <nav className="bg-gradient-to-r from-[#111418] via-[#151a20] to-[#1A1E23] border-b border-emerald-500/10 backdrop-blur-sm fixed w-full z-50 shadow-md">
        <div className="max-w-[1440px] mx-auto px-8 py-3">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="text-2xl font-bold text-white hover:text-emerald-400 transition-colors duration-300 flex items-center">
              <Logo className="h-8 mr-2" />
              {/* Removed the duplicate OpAgents text */}
            </Link>
            <div className="flex items-center space-x-5">
              {user && (
                <Link to="/dashboard" className="text-text-light font-medium">
                  Dashboard
                </Link>
              )}
              {/* Token Balance Widget */}
              <div className="mr-2">
                <TokenBalanceWidget compact={true} />
              </div>
              {/* Billing/Subscription Link */}
              <Link 
                to="/dashboard/billing" 
                className="flex items-center text-gray-300"
              >
                <div className="relative">
                  <FiCreditCard className="w-5 h-5 mr-1" />
                </div>
                <span className="text-sm relative hidden sm:inline-block">
                  Billing
                </span>
              </Link>
              {/* Help/Support Link */}
              <Link 
                to="/dashboard/help" 
                className="flex items-center text-gray-300"
              >
                <div className="relative">
                  <FiHelpCircle className="w-5 h-5 mr-1" />
                </div>
                <span className="text-sm relative hidden sm:inline-block">
                  Help
                </span>
              </Link>
              {/* Notifications */}
              <NotificationDropdown />
              {/* My Account Link */}
              <Link 
                to="/dashboard/account" 
                className="flex items-center text-gray-300"
              >
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt="User Avatar" 
                    className="w-7 h-7 rounded-full border-2 border-transparent object-cover"
                  />
                ) : (
                  <div className="relative w-7 h-7 flex items-center justify-center rounded-full bg-[#1A1E23] border border-gray-700/40">
                    <FiUser className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
                <span className="text-sm relative hidden sm:inline-block">
                  My Account
                </span>
              </Link>
              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-300"
              >
                <FiLogOut className="w-5 h-5 mr-1" />
                <span className="text-sm relative hidden sm:inline-block">
                  Sign Out
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Add padding to account for fixed navbar */}
      <div className="pt-16"></div>
      
      <NotificationProvider>
        <DashboardLayout>
          <Routes>
            <Route index element={<AIAgentsList />} />
            <Route path="settings/:agentId" element={<AgentSettings />} />
            <Route path="activity/:agentId" element={<AgentActivity />} />
            <Route path="usage/:agentId" element={<AgentUsage />} />
            <Route path="usage" element={<OverallUsage />} />
            <Route path="activity" element={<RecentActivity />} />
            {/* Help Section Routes */}
            <Route path="help" element={<Help />} />
            <Route path="help/quicksetup" element={<HelpQuickSetup />} />
            <Route path="help/faqs" element={<HelpFaqs />} />
            <Route path="help/support" element={<HelpSupport />} />
            <Route path="help/status" element={<HelpStatus />} />
            <Route path="profile" element={<Profile />} />
            
            {/* Billing Routes */}
            <Route path="billing" element={<BillingLayout><Subscription /></BillingLayout>} />
            <Route path="billing/payment" element={<BillingLayout><PaymentMethods /></BillingLayout>} />
            <Route path="billing/transactions" element={<BillingLayout><TransactionHistory /></BillingLayout>} />
            <Route path="billing/tokens" element={<BillingLayout><TokenManagement /></BillingLayout>} />
            
            {/* Token Management Routes */}
            <Route path="tokens" element={<BillingLayout><TokenManagement /></BillingLayout>} />
            <Route path="tokens/purchase" element={<BillingLayout><TokenPurchase /></BillingLayout>} />
            <Route path="tokens/history" element={<BillingLayout><TokenHistory /></BillingLayout>} />
            <Route path="tokens/settings" element={<BillingLayout><TokenSettings /></BillingLayout>} />
            
            {/* Marketing Assets Routes */}
            <Route path="images" element={<MarketingImages />} />
            <Route path="campaigns" element={<CampaignsContent />} />
            <Route path="scheduled" element={<ScheduledContent />} />
            <Route path="drafts" element={<DraftsContent />} />
            <Route path="published" element={<PublishedContent />} />
            <Route path="content" element={<div><h1 className="text-2xl font-bold text-white">Content</h1><p className="text-gray-400 mt-4">Content management coming soon.</p></div>} />
            <Route path="awaiting-approval" element={<AwaitingApprovalContent />} />
            
            {/* Agent Setup Route */}
            <Route path="setup/:agentId" element={<SetupGuide />} />
            <Route path="users" element={<UsersManagement />} />
            
            {/* Account Section Routes */}
            <Route path="account" element={<Profile />} />
            
            {/* Notifications Route */}
            <Route path="notifications" element={<Notifications />} />
            <Route path="account/organization" element={<OrganizationProfile />} />
            <Route path="account/security" element={<Security />} />
            <Route path="account/team" element={<UsersManagement />} />
            
            {/* Personalization Route */}
            <Route path="personalization" element={<Personalization />} />
            
            {/* Redirects for backward compatibility */}
            <Route path="my-account/*" element={<Navigate to="/dashboard/account" replace />} />
            <Route path="subscription/*" element={<Navigate to="/dashboard/billing" replace />} />
            <Route path="logs/:agentId" element={
              <Navigate to={location => `/dashboard/activity/${location.pathname.split('/').pop()}`} replace />
            } />
          </Routes>
        </DashboardLayout>
      </NotificationProvider>
    </div>
  );
}

export default Dashboard;