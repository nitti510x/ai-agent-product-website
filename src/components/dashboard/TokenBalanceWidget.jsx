import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';
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
      <div className="mb-6 p-4 bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 flex justify-center items-center h-24">
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
        className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#111418] text-white transition-all duration-300 group"
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 to-blue-900/10 opacity-30"></div>
        
        {/* Icon container */}
        <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500/10 to-emerald-700/10">
          <FaRobot className="text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300" size={14} />
        </div>
        
        {/* Token count */}
        <div className="relative z-10 flex flex-col">
          <span className={`font-bold text-sm ${isLowBalance ? 'text-red-400 group-hover:text-red-300' : 'text-emerald-400 group-hover:text-emerald-300'} transition-colors duration-300`}>
            {tokens?.balance.toLocaleString() || 0}
          </span>
        </div>
      </Link>
    );
  }

  // Calculate percentages for progress bars
  const planPercentage = planTokens.total > 0 ? Math.min(100, (planTokens.used / planTokens.total) * 100) : 0;
  const packPercentage = packTokens.total > 0 ? Math.min(100, (packTokens.used / packTokens.total) * 100) : 0;
  
  // Calculate total tokens (plan + pack)
  const totalPlanRemaining = Math.max(0, planTokens.total - planTokens.used);
  const totalPackRemaining = Math.max(0, packTokens.total - packTokens.used);
  const totalTokens = totalPlanRemaining + totalPackRemaining;

  // Full widget version
  return (
    <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-500/5 rounded-full -ml-20 -mb-20 blur-2xl"></div>
      
      <div className="relative">
        {/* Header with total credits */}
        <div className="text-center mb-8">
          <h2 className="text-white font-semibold text-lg mb-1">Your Token Balance</h2>
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-3 rounded-xl inline-flex items-center">
              <FaRobot size={24} className="text-primary mr-3" />
              <span className="text-5xl font-bold text-primary">{totalTokens}</span>
            </div>
            <span className="text-gray-400 ml-3 text-sm"><FaRobot className="inline mr-1" /> tokens remaining</span>
          </div>
        </div>
        
        {/* Token panels in 50/50 layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Plan Credits Panel */}
          <div className="bg-[#1F242B] rounded-xl p-6 border-2 border-primary/30 hover:border-primary/40 transition-all duration-300 shadow-2xl transform hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <FaRobot className="text-primary mr-3 w-5 h-5" />
              <h3 className="text-lg font-semibold text-white">Plan Tokens</h3>
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <div className="text-white font-medium text-xl">{totalPlanRemaining}</div>
              <div className="text-sm text-gray-300 bg-dark-card/70 px-3 py-1 rounded-lg">
                of {planTokens.total} tokens
              </div>
            </div>
            
            <div className="h-4 bg-dark-card/70 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${planPercentage}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">{planTokens.used} used</span>
              <span className="font-medium px-2 py-0.5 rounded-lg bg-primary/10 text-primary">
                {planPercentage.toFixed(0)}% used
              </span>
            </div>
            
            <div className="mt-4 text-sm text-gray-300 flex items-center pt-3 border-t border-gray-700/50">
              <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
              Resets at the end of your billing cycle
            </div>
          </div>

          {/* Token Pack Credits Panel */}
          {packTokens.total > 0 ? (
            <div className="bg-[#1F242B] rounded-xl p-6 border-2 border-yellow-500/30 hover:border-yellow-500/40 transition-all duration-300 shadow-2xl transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <FaRobot className="text-yellow-500 mr-3 w-5 h-5" />
                <h3 className="text-lg font-semibold text-white">Token Pack Tokens</h3>
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <div className="text-white font-medium text-xl">{totalPackRemaining}</div>
                <div className="text-sm text-gray-300 bg-dark-card/70 px-3 py-1 rounded-lg">
                  of {packTokens.total} tokens
                </div>
              </div>
              
              <div className="h-4 bg-dark-card/70 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${packPercentage}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">{packTokens.used} used</span>
                <span className="font-medium px-2 py-0.5 rounded-lg bg-yellow-500/10 text-yellow-500">
                  {packPercentage.toFixed(0)}% used
                </span>
              </div>
              
              <div className="mt-4 text-sm text-gray-300 flex items-center pt-3 border-t border-gray-700/50">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                Does not expire with your billing cycle
              </div>
            </div>
          ) : (
            <div className="bg-[#1F242B] rounded-xl p-6 border-2 border-gray-700/50 hover:border-gray-600 transition-all duration-300 shadow-2xl flex flex-col transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <FaRobot className="text-gray-400 mr-3 w-5 h-5" />
                <h3 className="text-lg font-semibold text-white">Token Pack Tokens</h3>
              </div>
              
              <div className="flex-grow flex flex-col items-center justify-center py-6">
                <div className="text-white font-medium mb-3 text-center">No Token Packs</div>
                <div className="text-sm text-gray-400 mb-6 text-center max-w-xs">
                  You haven't purchased any additional token packs yet. Token packs never expire and are used after your plan tokens.  
                </div>
                <Link 
                  to="/dashboard/tokens" 
                  className="bg-primary hover:bg-primary/80 text-black font-medium px-6 py-2 rounded-lg transition-colors flex items-center justify-center"
                >
                  <FaRobot className="mr-2" />
                  Purchase Token Packs
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Low token balance warning */}
        {isLowBalance && (
          <div className="mb-10 bg-yellow-900/30 border-2 border-yellow-500/50 text-yellow-500 p-5 rounded-xl shadow-lg">
            <div className="flex items-center">
              <FiAlertTriangle className="mr-3" size={24} />
              <span className="text-base">
                Your <FaRobot className="inline mx-0.5" /> token balance is running low! Consider purchasing more <FaRobot className="inline mx-0.5" /> tokens below.
              </span>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default TokenBalanceWidget;
