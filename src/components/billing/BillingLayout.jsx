import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCreditCard, FiDollarSign, FiUser, FiFileText, FiList, FiShoppingCart } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { useSubscription } from '../../contexts/SubscriptionContext';

function BillingLayout({ children }) {
  const location = useLocation();
  const { selectedPlan, isFreeTrialSelected } = useSubscription();
  
  // Check if we're on the checkout page (main billing route)
  const isCheckoutPage = location.pathname === '/dashboard/billing';
  
  const menuItems = [
    {
      path: '/dashboard/account/profile',
      label: 'Profile',
      icon: <FiUser className="mr-2" />
    },
    {
      path: '/dashboard/account/plans',
      label: 'Subscription Plans',
      icon: <FiList className="mr-2" />
    },
    {
      path: '/dashboard/account/payment-methods',
      label: 'Payment Methods',
      icon: <FiCreditCard className="mr-2" />
    },
    {
      path: '/dashboard/account/transactions',
      label: 'Transaction History',
      icon: <FiFileText className="mr-2" />
    },
    {
      path: '/dashboard/tokens',
      label: 'Credit Management',
      icon: <IoDiamond className="mr-2" />,
      isCredit: true
    }
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-8">
      {!isCheckoutPage && (
        <div className="flex items-center mb-8">
          <div className="bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] h-8 w-1 rounded-full mr-3"></div>
          <h1 className="text-3xl font-bold text-white">My Account</h1>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-8">
        {!isCheckoutPage && (
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-4">
              <h2 className="text-lg font-bold text-white mb-4 px-2">Account Menu</h2>
              <nav>
                <ul className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-primary/20 text-primary'
                              : 'text-gray-300 hover:bg-dark-card/70 hover:text-white'
                          }`}
                        >
                          {item.isCredit ? (
                            <IoDiamond className={`mr-2 ${isActive ? 'text-primary' : ''}`} />
                          ) : (
                            item.icon
                          )}
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        )}
        
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export default BillingLayout;
