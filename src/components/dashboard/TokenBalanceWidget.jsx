import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { supabase } from '../../config/supabase';
import { agentService } from '../../services/agentService';

const TokenBalanceWidget = ({ compact = false }) => {
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState(null);
  const [tokenLimit, setTokenLimit] = useState(0);
  const [planTokens, setPlanTokens] = useState({ used: 0, total: 0 });
  const [packTokens, setPackTokens] = useState({ used: 0, total: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }
        
        const userData = await agentService.getUserTokens(user.id);
        
        if (userData?.tokens) {
          setTokens(userData.tokens);
        }
        
        if (userData?.subscription?.features?.feature_limits?.tokens) {
          const planLimit = userData.subscription.features.feature_limits.tokens;
          setTokenLimit(planLimit);
          
          // Calculate plan tokens and pack tokens
          // For this example, we'll assume:
          // 1. Plan tokens are used first
          // 2. Any tokens beyond the plan limit are from token packs
          
          // Get total token usage from transactions
          const totalUsed = userData.transactions
            ? userData.transactions
                .filter(t => t.transaction_type === 'usage')
                .reduce((sum, t) => sum + Math.abs(t.amount), 0)
            : 0;
            
          // Get total tokens from packs
          const totalFromPacks = userData.transactions
            ? userData.transactions
                .filter(t => t.transaction_type === 'purchase')
                .reduce((sum, t) => sum + Math.abs(t.amount), 0)
            : 0;
          
          // Calculate plan usage
          const planUsed = Math.min(totalUsed, planLimit);
          setPlanTokens({
            used: planUsed,
            total: planLimit
          });
          
          // Calculate pack usage
          const packUsed = Math.max(0, totalUsed - planLimit);
          setPackTokens({
            used: packUsed,
            total: totalFromPacks
          });
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
        <IoDiamond className="mr-1.5 text-primary" />
        <span className="font-medium">{tokens?.balance || 0}</span>
        {isLowBalance && <FiAlertTriangle className="ml-1.5 text-yellow-500" size={14} />}
      </Link>
    );
  }

  // Calculate percentages for progress bars
  const planPercentage = planTokens.total > 0 ? Math.min(100, (planTokens.used / planTokens.total) * 100) : 0;
  const packPercentage = packTokens.total > 0 ? Math.min(100, (packTokens.used / packTokens.total) * 100) : 0;
  
  // Calculate total credits (plan + pack)
  const totalPlanRemaining = Math.max(0, planTokens.total - planTokens.used);
  const totalPackRemaining = Math.max(0, packTokens.total - packTokens.used);
  const totalCredits = totalPlanRemaining + totalPackRemaining;

  // Full widget version
  return (
    <div className="mb-6 bg-gradient-to-br from-dark-card to-dark-card/80 rounded-2xl shadow-2xl border border-dark-card/30 p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-500/5 rounded-full -ml-20 -mb-20 blur-2xl"></div>
      
      <div className="relative">
        {/* Header with total credits */}
        <div className="text-center mb-8">
          <h2 className="text-white font-semibold text-lg mb-1">Your Credit Balance</h2>
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-3 rounded-xl inline-flex items-center">
              <IoDiamond size={24} className="text-primary mr-3" />
              <span className="text-5xl font-bold text-primary">{totalCredits}</span>
            </div>
            <span className="text-gray-400 ml-3 text-sm"><IoDiamond className="inline mr-1" /> credits remaining</span>
          </div>
        </div>
        
        {/* Credit panels in 50/50 layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan Credits Panel */}
          <div className="bg-dark-card/40 backdrop-blur-sm rounded-xl p-4 border border-primary/10 hover:border-primary/20 transition-all duration-300 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <div className="text-gray-300 font-medium">Plan Credits</div>
              <div className="text-xs text-gray-400 bg-dark-card/50 px-2 py-1 rounded-full">
                {planTokens.total} credits per billing cycle
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2 text-sm">
              <span className="text-gray-400">{totalPlanRemaining} of {planTokens.total} remaining</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {planPercentage.toFixed(0)}% used
              </span>
            </div>
            
            <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${planPercentage}%` }}
              ></div>
            </div>
            
            <div className="mt-2 text-xs text-gray-400 flex items-center">
              <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
              Resets at the end of your billing cycle
            </div>
          </div>

          {/* Token Pack Credits Panel */}
          {packTokens.total > 0 ? (
            <div className="bg-dark-card/40 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/10 hover:border-yellow-500/20 transition-all duration-300 shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <div className="text-gray-300 font-medium">Token Pack Credits</div>
                <div className="text-xs text-gray-400 bg-dark-card/50 px-2 py-1 rounded-full">
                  {packTokens.total} additional credits purchased
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-gray-400">{totalPackRemaining} of {packTokens.total} remaining</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500">
                  {packPercentage.toFixed(0)}% used
                </span>
              </div>
              
              <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${packPercentage}%` }}
                ></div>
              </div>
              
              <div className="mt-2 text-xs text-gray-400 flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                Does not expire with your billing cycle
              </div>
            </div>
          ) : (
            <div className="bg-dark-card/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-gray-700 transition-all duration-300 shadow-lg flex flex-col justify-center">
              <div className="text-gray-300 font-medium mb-3">Token Pack Credits</div>
              <div className="text-sm text-gray-400 mb-4">
                You haven't purchased any additional token packs
              </div>
              <Link 
                to="/dashboard/tokens" 
                className="text-sm bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary-hover text-white px-4 py-2 rounded-lg text-center transition-all duration-300 shadow-md hover:shadow-glow-sm"
              >
                Purchase Token Packs
              </Link>
            </div>
          )}
        </div>
        
        <div className="text-center text-xs text-gray-400 mt-6">
          Your basic plan includes {planTokens.total} <IoDiamond className="inline mx-0.5" /> credits per billing cycle.
        </div>
      </div>
    </div>
  );
};

export default TokenBalanceWidget;
