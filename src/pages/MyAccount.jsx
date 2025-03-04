import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { FiUser, FiCreditCard, FiFileText, FiList, FiSettings } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import Profile from '../components/dashboard/Profile';
import Subscription from '../components/dashboard/Subscription';
import PaymentMethods from '../components/billing/PaymentMethods';
import TransactionHistory from '../components/billing/TransactionHistory';
import TokenManagement from '../components/dashboard/TokenManagement';

function MyAccount() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('');
  
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
      icon: <FiUser />,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      path: '/dashboard/my-account/subscription',
      label: 'Subscription',
      icon: <FiList />,
      color: 'from-emerald-500 to-green-600'
    },
    {
      path: '/dashboard/my-account/payment-methods',
      label: 'Payments',
      icon: <FiCreditCard />,
      color: 'from-purple-500 to-indigo-600'
    },
    {
      path: '/dashboard/my-account/transactions',
      label: 'Transactions',
      icon: <FiFileText />,
      color: 'from-amber-500 to-orange-600'
    },
    {
      path: '/dashboard/my-account/tokens',
      label: 'Credits',
      icon: <IoDiamond />,
      color: 'from-primary to-blue-600'
    }
  ];

  // Find the current active tab
  const currentTab = tabs.find(tab => tab.path === activeTab) || tabs[0];

  return (
    <div className="relative">
      {/* Subtle background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full -ml-48 -mb-48 blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 py-6">
        {/* Sleek header with inline elements */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              My Account
            </h1>
            <div className="ml-4 bg-dark-card/70 px-3 py-1 rounded-full border border-white/10 hidden md:flex items-center">
              <FiSettings className="text-primary mr-2" size={14} />
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
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-md`
                        : 'bg-dark-card/50 hover:bg-dark-card text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <div className={`flex items-center justify-center ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      {tab.icon}
                    </div>
                    <span className="ml-1.5 whitespace-nowrap">{tab.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Content Area with subtle header based on active tab */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl shadow-lg overflow-hidden">
          {/* Section header - more compact */}
          <div className={`bg-gradient-to-r ${currentTab.color} px-4 py-2.5 flex items-center`}>
            <div className="bg-white/20 p-1.5 rounded-lg mr-2">
              {currentTab.icon}
            </div>
            <h2 className="text-lg font-bold text-white">{currentTab.label}</h2>
          </div>
          
          {/* Section content */}
          <div className="p-4">
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
