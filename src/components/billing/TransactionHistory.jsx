import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiDownload, FiAlertTriangle, FiClock, FiFilter, FiSearch } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';
import { supabase } from '../../config/supabase.js';
import { subscriptionService } from '../../config/postgres.js';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }
        
        // Fetch transaction history from the subscription service
        const userTransactions = await subscriptionService.getUserTransactions(user.id);
        setTransactions(userTransactions || []);
      } catch (error) {
        console.error('Error fetching transaction history:', error);
        setError('Failed to load transaction history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'succeeded': 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20',
      'pending': 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
      'failed': 'bg-red-500/10 text-red-400 border border-red-500/20',
      'refunded': 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
    };
    
    return statusMap[status] || 'bg-gray-700/30 text-gray-400 border border-gray-700';
  };

  const getStatusIcon = (status) => {
    if (status === 'succeeded') return <FiDownload className="mr-1.5" size={12} />;
    if (status === 'pending') return <FiClock className="mr-1.5" size={12} />;
    if (status === 'failed') return <FiAlertTriangle className="mr-1.5" size={12} />;
    return null;
  };

  const getTransactionIcon = (type) => {
    if (type === 'subscription') return <div className="bg-blue-500/10 p-1.5 rounded-md"><FiDownload className="text-blue-400" size={14} /></div>;
    if (type === 'token_purchase') return <div className="bg-emerald-500/10 p-1.5 rounded-md"><FaRobot className="text-emerald-400" size={14} /></div>;
    return <div className="bg-gray-700/30 p-1.5 rounded-md"><FiDownload className="text-gray-400" size={14} /></div>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="mb-4 bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">
          <div className="flex items-center">
            <FiAlertTriangle className="mr-2" size={16} />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl shadow-lg overflow-hidden">
        {/* Transaction list header with search and filter */}
        <div className="p-4 border-b border-dark-card/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-medium text-white">Your Transactions</h2>
            <p className="text-xs text-gray-400">View all your payments and credit purchases</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={14} />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className="bg-dark/50 border border-dark-card/50 rounded-full py-1.5 pl-9 pr-4 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-400/30 focus:border-emerald-400/30 w-full md:w-48"
              />
            </div>
            <button className="bg-dark/50 border border-dark-card/50 rounded-full p-1.5 text-gray-400 hover:text-white hover:border-white/20 transition-colors">
              <FiFilter size={14} />
            </button>
          </div>
        </div>
        
        {transactions.length === 0 ? (
          <div className="text-center py-12 bg-dark/30">
            <p className="text-gray-400 mb-2">No transaction history found</p>
            <p className="text-gray-500 text-sm">Your payment history will appear here once you make a purchase</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-dark/30">
                  <th className="text-left py-2.5 px-4 text-xs text-gray-400 font-medium">Date</th>
                  <th className="text-left py-2.5 px-4 text-xs text-gray-400 font-medium">Description</th>
                  <th className="text-left py-2.5 px-4 text-xs text-gray-400 font-medium">Amount</th>
                  <th className="text-left py-2.5 px-4 text-xs text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={transaction.id || index} className="border-b border-dark-card/20 hover:bg-dark-card/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-300">{formatDate(transaction.created_at)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {getTransactionIcon(transaction.type)}
                        <div className="ml-3">
                          <div className="text-sm text-white font-medium">
                            {transaction.description || (transaction.type === 'subscription' ? 'Monthly subscription - Basic Plan' : 'Token purchase - 100 tokens')}
                          </div>
                          <div className="text-xs text-gray-400">
                            {transaction.type === 'subscription' ? 'Subscription' : 'Token Pack'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-white">{formatCurrency(transaction.amount / 100)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${getStatusBadge(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="p-4 border-t border-dark-card/30 bg-dark/20">
          <p className="text-xs text-gray-400 flex items-center">
            <FiAlertTriangle className="mr-2" size={12} />
            Transaction history shows all payments and token purchases for your account
          </p>
        </div>
      </div>
    </div>
  );
}

export default TransactionHistory;
