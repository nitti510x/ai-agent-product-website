import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiDollarSign, FiAlertTriangle, FiCreditCard, FiClock } from 'react-icons/fi';
import { supabase } from '../../config/supabase';
import { subscriptionService } from '../../config/postgres';
import { formatDistanceToNow } from 'date-fns';

const TokenManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [packages, setPackages] = useState([]);
  const [user, setUser] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }
        
        setUser(user);
        
        // Get user tokens and subscription
        const tokens = await subscriptionService.getUserTokens(user.id);
        setTokenData(tokens);
        
        // Get token packages
        const tokenPackages = await subscriptionService.getTokenPackages();
        setPackages(tokenPackages);
      } catch (error) {
        console.error('Error fetching token data:', error);
        setError('Failed to load token data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handlePurchaseTokens = (packageId) => {
    const pkg = packages.find(p => p.id === packageId);
    if (pkg) {
      setSelectedPackage(pkg);
      setShowConfirmation(true);
    }
  };

  const confirmPurchase = async () => {
    if (!selectedPackage || !user) return;
    
    try {
      setPurchasing(true);
      setError(null);
      
      // Purchase tokens
      const result = await subscriptionService.purchaseTokens(user.id, selectedPackage.id);
      
      // Update token data
      const updatedTokens = await subscriptionService.getUserTokens(user.id);
      setTokenData(updatedTokens);
      
      setSuccess(`Successfully purchased ${selectedPackage.token_amount} tokens!`);
      setShowConfirmation(false);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (error) {
      console.error('Error purchasing tokens:', error);
      setError('Failed to purchase tokens. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

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

  if (!tokenData?.subscription) {
    return (
      <div className="p-6">
        <div className="mb-8 bg-yellow-900/20 border border-yellow-500/50 text-yellow-500 p-4 rounded-lg">
          <div className="flex items-center">
            <FiAlertTriangle className="mr-2" size={20} />
            <span>You must have an active subscription to purchase tokens. Please subscribe to a plan first.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] text-transparent bg-clip-text">
            Token Management
          </h1>
        </div>
      </div>

      {error && (
        <div className="mb-8 bg-red-900/20 border border-red-500/50 text-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <FiAlertTriangle className="mr-2" size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-8 bg-green-900/20 border border-green-500/50 text-green-500 p-4 rounded-lg">
          <div className="flex items-center">
            <FiDollarSign className="mr-2" size={20} />
            <span>{success}</span>
          </div>
        </div>
      )}

      {/* Current Token Balance */}
      <div className="mb-12 bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Your Token Balance</h2>
        
        <div className="flex items-center mb-6">
          <span className="text-4xl font-bold text-primary mr-3">
            {tokenData?.tokens?.balance || 0}
          </span>
          <span className="text-gray-400">tokens remaining</span>
        </div>
        
        <p className="text-gray-300 mb-4">
          Your {tokenData?.subscription?.plan_id} plan includes {tokenData?.subscription?.features?.feature_limits?.tokens} tokens per billing cycle.
        </p>
        
        {tokenData?.tokens?.balance < 100 && (
          <div className="bg-yellow-900/20 border border-yellow-500/50 text-yellow-500 p-4 rounded-lg mt-4">
            <div className="flex items-center">
              <FiAlertTriangle className="mr-2" size={20} />
              <span>Your token balance is running low! Consider purchasing more tokens below.</span>
            </div>
          </div>
        )}
      </div>

      {/* Available Token Packages */}
      <h2 className="text-2xl font-bold text-white mb-6">Purchase Additional Tokens</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
            <p className="text-gray-400 mb-4">{pkg.description}</p>
            
            <div className="mb-4">
              <span className="text-3xl font-bold text-white">${pkg.price}</span>
            </div>
            
            <div className="flex-grow mb-6">
              <div className="flex items-center text-gray-300 mb-2">
                <FiDollarSign className="mr-2 text-primary" />
                <span>{pkg.token_amount} tokens</span>
              </div>
            </div>
            
            <button
              onClick={() => handlePurchaseTokens(pkg.id)}
              disabled={purchasing}
              className="w-full py-3 rounded-lg font-semibold flex items-center justify-center bg-primary hover:bg-primary-hover text-dark hover:shadow-glow transition-all duration-300"
            >
              <FiCreditCard className="mr-2" />
              {purchasing ? 'Processing...' : 'Purchase'}
            </button>
          </div>
        ))}
      </div>

      {/* Transaction History */}
      <h2 className="text-2xl font-bold text-white mb-6">Transaction History</h2>
      
      <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6">
        {tokenData?.transactions?.length > 0 ? (
          <div className="space-y-4">
            {tokenData.transactions.map((transaction) => (
              <div key={transaction.id} className="border-b border-dark-lighter pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-white font-medium">{transaction.description}</div>
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        transaction.transaction_type === 'purchase' 
                          ? 'bg-blue-900/20 text-blue-400' 
                          : transaction.transaction_type === 'usage'
                            ? 'bg-red-900/20 text-red-400'
                            : transaction.transaction_type === 'subscription_grant'
                              ? 'bg-green-900/20 text-green-400'
                              : 'bg-purple-900/20 text-purple-400'
                      }`}>
                        {transaction.transaction_type}
                      </span>
                      <div className="flex items-center text-gray-400 text-sm ml-4">
                        <FiClock className="mr-1" size={14} />
                        {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount} tokens
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No transactions found
          </div>
        )}
      </div>

      {/* Purchase Confirmation Modal */}
      {showConfirmation && selectedPackage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Purchase</h3>
            <p className="text-gray-400 mb-6">
              You are about to purchase <span className="text-white font-semibold">{selectedPackage.token_amount} tokens</span> for ${selectedPackage.price}.
            </p>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPurchase}
                disabled={purchasing}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-dark rounded-lg transition-colors"
              >
                {purchasing ? 'Processing...' : 'Confirm Purchase'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenManagement;
