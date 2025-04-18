import React from 'react';
import { FiShoppingCart, FiAlertTriangle } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa6';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../config/supabase';
import { agentService } from '../../../services/agentService';
import PageHeader from '../PageHeader';

function TokenPurchase() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    const fetchUserAndTokens = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUser(user);
          const tokenData = await agentService.getUserTokens(user.id);
          setTokenData(tokenData);
        }
      } catch (error) {
        console.error('Error fetching user or token data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserAndTokens();
  }, []);

  // Sample token packages
  const tokenPackages = [
    {
      id: 1,
      name: 'Starter Pack',
      token_amount: 100,
      price: 10,
      popular: false
    },
    {
      id: 2,
      name: 'Pro Pack',
      token_amount: 500,
      price: 45,
      popular: true
    },
    {
      id: 3,
      name: 'Business Pack',
      token_amount: 1000,
      price: 80,
      popular: false
    },
    {
      id: 4,
      name: 'Enterprise Pack',
      token_amount: 5000,
      price: 350,
      popular: false
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="mb-8 bg-red-900/20 border border-red-500/50 text-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <FiAlertTriangle className="mr-2" size={20} />
            <span>You must be logged in to view this page</span>
          </div>
        </div>
      </div>
    );
  }

  const subscriptionWarning = !tokenData?.subscription && (
    <div className="mb-8 bg-yellow-900/20 border border-yellow-500/50 text-yellow-500 p-4 rounded-lg">
      <div className="flex items-center">
        <FiAlertTriangle className="mr-2" size={20} />
        <span>
          You must have an active subscription to purchase tokens. 
          <Link to="/dashboard/billing" className="text-primary underline ml-1 hover:text-primary-hover">
            Subscribe to a plan
          </Link>
        </span>
      </div>
    </div>
  );

  return (
    <div>
      {subscriptionWarning}
      <PageHeader 
        title="Purchase Tokens"
        description="Add more tokens to your account"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {tokenPackages.map((pkg) => (
          <div 
            key={pkg.id}
            className={`relative bg-[#1A1E23] rounded-2xl shadow-2xl border ${
              pkg.popular ? 'border-primary' : 'border-dark-card/30'
            } p-6 flex flex-col`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <h3 className="text-lg font-semibold text-white mb-2">{pkg.name}</h3>
            <div className="flex items-center mb-4">
              <span className="text-3xl font-bold text-primary">${pkg.price}</span>
              <span className="text-gray-400 ml-2">one-time</span>
            </div>
            <div className="space-y-3 mb-6 flex-grow">
              <div className="flex items-center text-gray-300">
                <FaRobot className="text-primary mr-2" />
                <span>{pkg.token_amount} tokens</span>
              </div>
              <div className="flex items-center text-gray-300">
                <FaRobot className="text-primary mr-2" />
                <span>${(pkg.price / pkg.token_amount).toFixed(2)} per token</span>
              </div>
              <div className="flex items-center text-gray-300">
                <FaRobot className="text-primary mr-2" />
                <span>Never expires</span>
              </div>
            </div>
            <button 
              className="w-full bg-primary hover:bg-primary/80 text-black font-medium py-2 rounded-lg transition-colors flex items-center justify-center"
              disabled={!tokenData?.subscription}
              title={!tokenData?.subscription ? "You need an active subscription to purchase tokens" : ""}
            >
              <FiShoppingCart className="mr-2" />
              Purchase Now
            </button>
          </div>
        ))}
      </div>

      <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Token Purchase FAQ</h3>
        <div className="space-y-4">
          <div className="border-b border-gray-700 pb-4">
            <h4 className="text-white font-medium mb-2">How do token packs work?</h4>
            <p className="text-gray-300">
              Token packs are additional tokens you can purchase that don't expire with your billing cycle. 
              The system automatically uses your subscription plan tokens first before using tokens from your purchased packs.
            </p>
          </div>
          <div className="border-b border-gray-700 pb-4">
            <h4 className="text-white font-medium mb-2">When will I receive my tokens?</h4>
            <p className="text-gray-300">
              Tokens are added to your account immediately after your purchase is processed. You can start using them right away.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Can I get a refund for unused tokens?</h4>
            <p className="text-gray-300">
              We do not offer refunds for purchased token packs. All sales are final, but your tokens never expire, 
              so you can use them at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenPurchase;
