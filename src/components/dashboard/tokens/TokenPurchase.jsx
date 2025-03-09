import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';

function TokenPurchase() {
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Purchase Tokens</h2>
          <p className="text-gray-400 text-sm mt-1">Add more tokens to your account</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {tokenPackages.map((pkg) => (
          <div 
            key={pkg.id}
            className={`relative bg-dark-card rounded-2xl shadow-2xl border ${
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
            <button className="w-full bg-primary hover:bg-primary/80 text-black font-medium py-2 rounded-lg transition-colors flex items-center justify-center">
              <FiShoppingCart className="mr-2" />
              Purchase Now
            </button>
          </div>
        ))}
      </div>

      <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6 mb-8">
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
