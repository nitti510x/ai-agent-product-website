import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCreditCard, FiDollarSign, FiUser, FiFileText, FiList, FiShoppingCart } from 'react-icons/fi';
import { useSubscription } from '../../contexts/SubscriptionContext';

function BillingLayout({ children }) {
  const location = useLocation();
  const { selectedPlan, isFreeTrialSelected } = useSubscription();
  
  // Check if we're on the checkout page (main billing route)
  const isCheckoutPage = location.pathname === '/dashboard/billing';
  
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
            <h1 className="text-3xl font-bold text-white">
              {isCheckoutPage ? 'Complete Your Order' : 'My Account'}
            </h1>
          </div>
          
          {!isCheckoutPage && (
            <div className="bg-dark-lighter rounded-xl p-1 mb-8">
              <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-dark-card scrollbar-track-transparent">
                <div className="flex w-full">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center ${
                        location.pathname === item.path
                          ? 'bg-dark text-primary'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-dark-lighter rounded-xl p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default BillingLayout;
