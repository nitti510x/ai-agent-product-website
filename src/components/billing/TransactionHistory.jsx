import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiDownload, FiAlertTriangle, FiClock } from 'react-icons/fi';
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
      'succeeded': 'bg-green-900/20 text-green-500',
      'pending': 'bg-yellow-900/20 text-yellow-500',
      'failed': 'bg-red-900/20 text-red-500',
      'refunded': 'bg-blue-900/20 text-blue-500'
    };
    
    return statusMap[status] || 'bg-gray-900/20 text-gray-500';
  };

  const getStatusIcon = (status) => {
    if (status === 'succeeded') return <FiDownload className="mr-2" />;
    if (status === 'pending') return <FiClock className="mr-2" />;
    if (status === 'failed') return <FiAlertTriangle className="mr-2" />;
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-8">
        <div className="bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] h-8 w-1 rounded-full mr-3"></div>
        <h1 className="text-3xl font-bold text-white">Transaction History</h1>
      </div>

      {error && (
        <div className="mb-8 bg-red-900/20 border border-red-500/50 text-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <FiAlertTriangle className="mr-2" size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Your Transactions</h2>
        
        {transactions.length === 0 ? (
          <div className="text-center py-12 bg-dark rounded-lg border border-dark-card/50">
            <p className="text-gray-400 mb-4">No transaction history found.</p>
            <p className="text-gray-500 text-sm">Your payment history will appear here once you make a purchase.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-card/50">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Description</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={transaction.id || index} className="border-b border-dark-card/30 hover:bg-dark-card/50">
                    <td className="py-4 px-4 text-gray-300">{formatDate(transaction.created_at)}</td>
                    <td className="py-4 px-4 text-white">
                      {transaction.description || (transaction.type === 'subscription' ? 'Subscription Payment' : 'Token Purchase')}
                    </td>
                    <td className="py-4 px-4 text-white">{formatCurrency(transaction.amount / 100)}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(transaction.status)}`}>
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
        
        <div className="mt-6 text-sm text-gray-400">
          <p>Note: Transaction history shows all payments and token purchases for your account.</p>
        </div>
      </div>
    </div>
  );
}

export default TransactionHistory;
