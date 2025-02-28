import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiAlertTriangle } from 'react-icons/fi';
import { supabase } from '../../config/supabase';
import { subscriptionService } from '../../config/postgres';

const TokenBalanceWidget = ({ compact = false }) => {
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState(null);
  const [tokenLimit, setTokenLimit] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }
        
        const userData = await subscriptionService.getUserTokens(user.id);
        
        if (userData?.tokens) {
          setTokens(userData.tokens);
        }
        
        if (userData?.subscription?.features?.feature_limits?.tokens) {
          setTokenLimit(userData.subscription.features.feature_limits.tokens);
        }
      } catch (error) {
        console.error('Error fetching token data:', error);
        setError('Failed to load token data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTokens();
  }, []);

  if (loading) {
    return compact ? (
      <div className="flex items-center">
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
        <span className="text-gray-400 text-sm">Loading...</span>
      </div>
    ) : (
      <div className="mb-6 p-4 bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !compact) {
    return (
      <div className="mb-6 bg-red-900/20 border border-red-500/50 text-red-500 p-4 rounded-lg">
        <div className="flex items-center">
          <FiAlertTriangle className="mr-2" size={16} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!tokens && !compact) {
    return null;
  }

  const isLowBalance = tokens?.balance < tokenLimit * 0.1; // Less than 10% of the limit

  // Compact version for navigation bar
  if (compact) {
    return (
      <Link 
        to="/dashboard/tokens" 
        className={`flex items-center px-3 py-1.5 rounded-lg ${
          isLowBalance ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30 hover:text-red-300' : 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary-hover'
        } transition-colors`}
      >
        <FiDollarSign className="mr-1.5" />
        <span className="font-medium">{tokens?.balance || 0}</span>
        {isLowBalance && <FiAlertTriangle className="ml-1.5 text-yellow-500" size={14} />}
      </Link>
    );
  }

  // Full widget version
  return (
    <div className="mb-6 bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-primary/20 p-2 rounded-lg mr-3">
            <FiDollarSign size={20} className="text-primary" />
          </div>
          <div>
            <div className="text-white font-semibold">Token Balance</div>
            <div className={`text-xl font-bold ${isLowBalance ? 'text-red-400' : 'text-primary'}`}>
              {tokens?.balance || 0}
            </div>
          </div>
        </div>
        
        <Link 
          to="/dashboard/tokens" 
          className={`px-3 py-1.5 rounded-lg flex items-center text-sm font-medium transition-colors ${
            isLowBalance 
              ? 'bg-red-900/20 hover:bg-red-900/30 text-red-400 hover:text-red-300' 
              : 'bg-primary/20 hover:bg-primary/30 text-primary hover:text-primary-hover'
          }`}
        >
          <FiDollarSign className="mr-1" />
          {isLowBalance ? 'Buy Tokens' : 'Manage'}
        </Link>
      </div>
      
      {isLowBalance && (
        <div className="mt-3 bg-yellow-900/20 border border-yellow-500/50 text-yellow-500 p-2 rounded-lg text-sm">
          <div className="flex items-center">
            <FiAlertTriangle className="mr-2" size={14} />
            <span>Your token balance is running low!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenBalanceWidget;
