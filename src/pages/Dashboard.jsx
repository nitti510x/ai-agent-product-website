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
          } catch (e) {
            console.error('Error checking localStorage:', e);
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
      <nav className="bg-dark-lighter border-b border-dark-card">
        <div className="max-w-[1440px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="text-2xl font-bold text-gray-100">
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
                    alt={userName || "User"} 
                    className="w-8 h-8 rounded-full mr-2 border border-gray-700 object-cover"
                    onError={(e) => {
                      console.error('Error loading avatar image:', e);
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=10B981&color=fff`;
                    }}
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
          {/* Help Section Routes */}
          <Route path="help" element={<DashboardLayout><Help /></DashboardLayout>} />
          <Route path="help/quicksetup" element={<DashboardLayout><QuickSetup /></DashboardLayout>} />
          <Route path="help/faqs" element={<DashboardLayout><FAQs /></DashboardLayout>} />
          <Route path="help/support" element={<DashboardLayout><Support /></DashboardLayout>} />
          <Route path="help/status" element={<DashboardLayout><SystemStatus /></DashboardLayout>} />
          <Route path="profile" element={<Profile />} />
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
          <Route path="images" element={<DashboardLayout><MarketingImages /></DashboardLayout>} />
          <Route path="campaigns" element={<DashboardLayout><div className="p-6"><h1 className="text-2xl font-bold text-white">Campaigns</h1><p className="text-gray-400 mt-4">Campaign management coming soon.</p></div></DashboardLayout>} />
          <Route path="scheduled" element={<DashboardLayout><div className="p-6"><h1 className="text-2xl font-bold text-white">Scheduled Posts</h1><p className="text-gray-400 mt-4">Scheduled posts management coming soon.</p></div></DashboardLayout>} />
          <Route path="drafts" element={<DashboardLayout><div className="p-6"><h1 className="text-2xl font-bold text-white">Draft Posts</h1><p className="text-gray-400 mt-4">Draft posts management coming soon.</p></div></DashboardLayout>} />
          
          {/* Agent Setup Route */}
          <Route path="setup/:agentId" element={<DashboardLayout><SetupGuide /></DashboardLayout>} />
          <Route path="users" element={<DashboardLayout><UsersManagement /></DashboardLayout>} />
          
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
          <Route path="logs/:agentId" element={
            <Navigate to={location => `/dashboard/activity/${location.pathname.split('/').pop()}`} replace />
          } />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;