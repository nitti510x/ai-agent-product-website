import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCreditCard, FiDollarSign, FiUser, FiFileText, FiList } from 'react-icons/fi';

function BillingLayout({ children }) {
  const location = useLocation();
  
  const menuItems = [
    {
      path: '/dashboard/billing/profile',
      label: 'Profile',
      icon: <FiUser className="mr-2" />
    },
    {
      path: '/dashboard/billing/plans',
      label: 'Subscription Plans',
      icon: <FiList className="mr-2" />
    },
    {
      path: '/dashboard/billing/payment-methods',
      label: 'Payment Methods',
      icon: <FiCreditCard className="mr-2" />
    },
    {
      path: '/dashboard/billing/transactions',
      label: 'Transaction History',
      icon: <FiFileText className="mr-2" />
    },
    {
      path: '/dashboard/tokens',
      label: 'Token Management',
      icon: <FiDollarSign className="mr-2" />
    }
  ];

  return (
    <div className="bg-dark text-white min-h-screen">
      <div className="container mx-auto py-8">
        <div className="mb-10">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] h-8 w-1 rounded-full mr-3"></div>
            <h1 className="text-3xl font-bold text-white">My Account</h1>
          </div>
          
          <div className="bg-dark-lighter rounded-xl p-1 mb-8">
            <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-dark-card scrollbar-track-transparent">
              <div className="flex w-full">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`whitespace-nowrap px-6 py-3 rounded-lg flex items-center transition-all duration-200 flex-1 justify-center ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] text-dark font-medium shadow-lg'
                        : 'hover:bg-dark-card text-gray-400 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {children}
      </div>
    </div>
  );
}

export default BillingLayout;
