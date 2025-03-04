import React, { useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { FiUser, FiCreditCard, FiFileText, FiList, FiDollarSign } from 'react-icons/fi';
import Profile from '../components/dashboard/Profile';
import Subscription from '../components/dashboard/Subscription';
import PaymentMethods from '../components/billing/PaymentMethods';
import TransactionHistory from '../components/billing/TransactionHistory';
import TokenManagement from '../components/dashboard/TokenManagement';

function MyAccount() {
  const location = useLocation();
  
  // Define the tabs for the My Account page
  const tabs = [
    {
      path: '/dashboard/my-account/profile',
      label: 'Profile',
      icon: <FiUser className="mr-2" />
    },
    {
      path: '/dashboard/my-account/subscription',
      label: 'Subscription Plans',
      icon: <FiList className="mr-2" />
    },
    {
      path: '/dashboard/my-account/payment-methods',
      label: 'Payment Methods',
      icon: <FiCreditCard className="mr-2" />
    },
    {
      path: '/dashboard/my-account/transactions',
      label: 'Transaction History',
      icon: <FiFileText className="mr-2" />
    },
    {
      path: '/dashboard/my-account/tokens',
      label: 'Credit Management',
      icon: <FiDollarSign className="mr-2" />
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">My Account</h1>
      
      {/* Horizontal Tab Navigation */}
      <div className="mb-8">
        <div className="flex overflow-x-auto border-b border-dark-card pb-1">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex items-center px-4 py-2 mr-4 whitespace-nowrap transition-colors ${
                location.pathname === tab.path
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Content Area */}
      <div className="bg-dark rounded-xl p-6">
        <Routes>
          <Route path="profile" element={<Profile />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="payment-methods" element={<PaymentMethods />} />
          <Route path="transactions" element={<TransactionHistory />} />
          <Route path="tokens" element={<TokenManagement />} />
        </Routes>
      </div>
    </div>
  );
}

export default MyAccount;
