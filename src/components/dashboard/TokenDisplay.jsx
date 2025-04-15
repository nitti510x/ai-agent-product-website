import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaChartLine, FaPlus } from 'react-icons/fa6';
import { useOrganization } from '../../contexts/OrganizationContext';

const TokenDisplay = () => {
  const { subscription } = useOrganization();
  const [tokenCount, setTokenCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch token count from local storage or subscription data
    const fetchTokenCount = () => {
      setIsLoading(true);
      try {
        // Check if token count is in subscription data
        if (subscription && subscription.features && subscription.features.tokens) {
          setTokenCount(parseInt(subscription.features.tokens) || 0);
        } else {
          // Fallback to local storage
          const storedTokens = localStorage.getItem('tokenCount');
          setTokenCount(storedTokens ? parseInt(storedTokens) : 0);
        }
      } catch (error) {
        console.error('Error fetching token count:', error);
        setTokenCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTokenCount();
  }, [subscription]);

  return (
    <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-xl">
      <div className="p-5 border-b border-white/5">
        <h2 className="text-lg font-bold text-white">Token Balance</h2>
      </div>
      
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-emerald-500/20 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-emerald-500/20 rounded w-3/4"></div>
                <div className="h-4 bg-emerald-500/20 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 border border-emerald-500/30">
                <FaRobot className="text-emerald-400" size={28} />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                </span>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  {tokenCount.toLocaleString()}
                </div>
                <div className="text-sm text-emerald-500/70 font-medium">AVAILABLE TOKENS</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Link 
                to="/dashboard/tokens/purchase" 
                className="flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg"
              >
                <FaPlus size={14} />
                Purchase Tokens
              </Link>
              
              <Link 
                to="/dashboard/tokens/history" 
                className="flex items-center justify-center gap-2 py-3 rounded-lg bg-dark-lighter border border-white/10 text-white font-medium hover:bg-dark-card/70 transition-all duration-300"
              >
                <FaChartLine size={14} />
                Usage History
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TokenDisplay;
