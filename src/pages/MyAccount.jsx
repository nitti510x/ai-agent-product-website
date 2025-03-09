import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { FiUser, FiCreditCard, FiFileText, FiList, FiSettings } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';
import Profile from '../components/dashboard/Profile';
import Subscription from '../components/dashboard/Subscription';
import PaymentMethods from '../components/billing/PaymentMethods';
import TransactionHistory from '../components/billing/TransactionHistory';
import TokenManagement from '../components/dashboard/TokenManagement';

function MyAccount() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('');
  
  // Define a consistent gradient matching the screenshot (teal/green to blue)
  const mainGradient = 'from-emerald-400 to-blue-500';
  
  useEffect(() => {
    // Set the active tab based on the current path
    const currentPath = location.pathname;
    setActiveTab(currentPath);
    
    // Add a class to the body for a page-specific background effect
    document.body.classList.add('account-page');
    
    return () => {
      document.body.classList.remove('account-page');
    };
  }, [location]);
  
  // Define the tabs for the My Account page
  const tabs = [
    {
      path: '/dashboard/my-account/profile',
      label: 'Profile',
      icon: <FiUser />
    },
    {
      path: '/dashboard/my-account/subscription',
      label: 'Subscription',
      icon: <FiList />
    },
    {
      path: '/dashboard/my-account/payment-methods',
      label: 'Payments',
      icon: <FiCreditCard />
    },
    {
      path: '/dashboard/my-account/transactions',
      label: 'Transactions',
      icon: <FiFileText />
    },
    {
      path: '/dashboard/my-account/tokens',
      label: 'Credits',
      icon: <FaRobot />
    }
  ];

  // Find the current active tab
  const currentTab = tabs.find(tab => tab.path === activeTab) || tabs[0];

  return (
    <div className="relative">
      {/* Subtle background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full -mr-48 -mt-48 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full -ml-48 -mb-48 blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 py-6">
        {/* Sleek header with inline elements */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              My Account
            </h1>
            <div className="ml-4 bg-dark-card/70 px-3 py-1 rounded-full border border-white/10 hidden md:flex items-center">
              <FiSettings className="text-emerald-400 mr-2" size={14} />
              <span className="text-xs text-gray-300">Settings</span>
            </div>
          </div>
          
          {/* Horizontal Tab Navigation - Sleek and Compact */}
          <div className="mt-4 md:mt-0">
            <div className="flex overflow-x-auto pb-1 scrollbar-hide">
              {tabs.map((tab) => {
                const isActive = location.pathname === tab.path;
                return (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    className={`flex items-center px-3 py-1.5 mr-2 rounded-full transition-all duration-300 text-sm ${
                      isActive
                        ? `bg-dark-card/80 text-emerald-400 font-medium border border-emerald-400/30`
                        : 'bg-dark-card/50 hover:bg-dark-card text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <div className={`flex items-center justify-center ${isActive ? 'text-emerald-400' : 'text-gray-400'}`}>
                      {tab.icon}
                    </div>
                    <span className="ml-1.5 whitespace-nowrap">{tab.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Content Area with consistent header gradient */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl shadow-lg overflow-hidden">
          {/* Section header - subtle and professional */}
          <div className="bg-dark-card/90 border-b border-white/5 px-4 py-2 flex items-center">
            <div className="text-emerald-400 mr-2.5 flex items-center justify-center">
              {currentTab.icon}
            </div>
            <h2 className="text-sm font-medium text-white/90">{currentTab.label}</h2>
          </div>
          
          {/* Section content - with slightly more padding to compensate for smaller header */}
          <div className="p-5">
            <Routes>
              <Route path="profile" element={<Profile />} />
              <Route path="subscription" element={<Subscription />} />
              <Route path="payment-methods" element={<PaymentMethods />} />
              <Route path="transactions" element={<TransactionHistory />} />
              <Route path="tokens" element={<TokenManagement />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;
