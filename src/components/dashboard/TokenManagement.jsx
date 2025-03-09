import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiCreditCard, FiClock } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';
import { supabase } from '../../config/supabase';
import { agentService } from '../../services/agentService';
import { formatDistanceToNow } from 'date-fns';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripePromise from '../../config/stripe';

// Stripe payment form component
const StripePaymentForm = ({ amount, tokenAmount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Check if user already has a Stripe customer ID
      let customerResponse = await fetch(`/api/stripe/customers?userId=${user.id}`);
      let customerData = await customerResponse.json();
      
      // If not, create a new customer
      if (!customerData || !customerData.customerId) {
        const createResponse = await fetch('/api/stripe/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: user.user_metadata?.full_name || user.email,
            metadata: { user_id: user.id }
          })
        });
        customerData = await createResponse.json();
      }

      // Create a payment intent
      const paymentResponse = await fetch('/api/stripe/payment-intents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customerData.customerId,
          amount: amount * 100, // Convert to cents
          metadata: {
            type: 'token_purchase',
            user_id: user.id,
            token_amount: tokenAmount
          }
        })
      });

      const paymentData = await paymentResponse.json();

      // Confirm the payment
      const { error: paymentError } = await stripe.confirmCardPayment(paymentData.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.user_metadata?.full_name || user.email,
          },
        },
      });

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      // Payment succeeded
      onSuccess();
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Card input styles for Stripe Elements
  const cardElementOptions = {
    style: {
      base: {
        color: '#ffffff',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    },
    hidePostalCode: true
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Card Details</label>
        <div className="p-3 bg-gray-700 border border-gray-600 rounded">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-900/50 border border-red-500 rounded flex items-center">
          <FiAlertTriangle className="text-red-500 mr-2" />
          <span className="text-red-100">{error}</span>
        </div>
      )}

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-dark rounded-lg transition-colors flex items-center"
          disabled={loading || !stripe}
        >
          {loading ? 'Processing...' : 'Complete Purchase'}
        </button>
      </div>
    </form>
  );
};

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
        const tokens = await agentService.getUserTokens(user.id);
        setTokenData(tokens);
        
        // Get token packages
        const tokenPackages = await agentService.getTokenPackages();
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

  const handlePaymentSuccess = async () => {
    try {
      // Refresh token data
      const updatedTokens = await agentService.getUserTokens(user.id);
      setTokenData(updatedTokens);
      
      setSuccess(`Successfully purchased ${selectedPackage.token_amount} tokens!`);
      setShowConfirmation(false);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (error) {
      console.error('Error updating token data:', error);
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
      {/* Current Token Balance */}
      <div className="mb-12 bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Your Token Balance</h2>
        
        <div className="flex items-center mb-6">
          <span className="text-4xl font-bold text-primary mr-3">
            {tokenData?.tokens?.balance || 0}
          </span>
          <span className="text-gray-400"><FaRobot className="inline mr-1" /> tokens remaining</span>
        </div>
        
        {/* Token panels in 50/50 layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Plan Credits Panel */}
          <div className="bg-dark-card/50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-300 font-medium">Plan Tokens</div>
              <div className="text-gray-400 text-sm">
                {tokenData?.subscription?.features?.feature_limits?.tokens || 0} tokens per billing cycle
              </div>
            </div>
            
            {/* Calculate used plan tokens */}
            {(() => {
              const planLimit = tokenData?.subscription?.features?.feature_limits?.tokens || 0;
              
              // Get total token usage from transactions
              const totalUsed = tokenData?.transactions
                ? tokenData.transactions
                    .filter(t => t.transaction_type === 'usage')
                    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                : 0;
                
              // Calculate plan usage
              const planUsed = Math.min(totalUsed, planLimit);
              const planRemaining = Math.max(0, planLimit - planUsed);
              const planPercentage = planLimit > 0 ? Math.min(100, (planUsed / planLimit) * 100) : 0;
              
              return (
                <>
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="text-gray-400">{planRemaining} of {planLimit} remaining</span>
                    <span className="text-gray-400">{planPercentage.toFixed(0)}% used</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                      style={{ width: `${planPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Resets at the end of your billing cycle on {new Date(tokenData?.subscription?.current_period_end).toLocaleDateString()}
                  </p>
                </>
              );
            })()}
          </div>
          
          {/* Token Pack Credits Panel */}
          <div className="bg-dark-card/50 rounded-xl p-4">
            {(() => {
              // Get total tokens from packs
              const totalFromPacks = tokenData?.transactions
                ? tokenData.transactions
                    .filter(t => t.transaction_type === 'purchase')
                    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                : 0;
                
              if (totalFromPacks > 0) {
                const planLimit = tokenData?.subscription?.features?.feature_limits?.tokens || 0;
                
                // Get total token usage from transactions
                const totalUsed = tokenData?.transactions
                  ? tokenData.transactions
                      .filter(t => t.transaction_type === 'usage')
                      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                  : 0;
                  
                // Calculate pack usage
                const packUsed = Math.max(0, totalUsed - planLimit);
                const packRemaining = Math.max(0, totalFromPacks - packUsed);
                const packPercentage = totalFromPacks > 0 ? Math.min(100, (packUsed / totalFromPacks) * 100) : 0;
                
                return (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-gray-300 font-medium">Token Pack Tokens</div>
                      <div className="text-gray-400 text-sm">
                        {totalFromPacks} additional tokens purchased
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span className="text-gray-400">{packRemaining} of {totalFromPacks} remaining</span>
                      <span className="text-gray-400">{packPercentage.toFixed(0)}% used</span>
                    </div>
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-yellow-500 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${packPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-sm">
                      These tokens do not expire with your billing cycle
                    </p>
                  </>
                );
              }
              return (
                <div className="flex flex-col justify-center items-center h-full text-center">
                  <div className="text-gray-300 font-medium mb-2">Token Pack Tokens</div>
                  <p className="text-gray-400 text-sm mb-2">
                    You haven't purchased any additional token packs yet
                  </p>
                  <button
                    onClick={() => document.getElementById('token-packages').scrollIntoView({ behavior: 'smooth' })}
                    className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm transition-colors"
                  >
                    Purchase Token Packs
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
        
        <p className="text-gray-300 mb-4">
          Your {tokenData?.subscription?.plan_id} plan includes {tokenData?.subscription?.features?.feature_limits?.tokens} <FaRobot className="inline mx-1" /> tokens per billing cycle.
        </p>
        
        {tokenData?.tokens?.balance < 100 && (
          <div className="bg-yellow-900/20 border border-yellow-500/50 text-yellow-500 p-3 rounded-lg">
            <div className="flex items-center">
              <FiAlertTriangle className="mr-2" size={20} />
              <span>Your <FaRobot className="inline mx-1" /> token balance is running low! Consider purchasing more <FaRobot className="inline mx-1" /> tokens below.</span>
            </div>
          </div>
        )}
      </div>

      {/* Available Token Packages */}
      <div className="bg-dark-card rounded-xl shadow-lg border border-dark-card/30 overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <p className="text-gray-400 text-sm">
            Purchase additional token packs to extend your usage beyond your plan limits
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 p-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-dark-card/50 rounded-2xl shadow-lg border border-dark-card/30 p-6 flex flex-col hover:border-primary/50 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
              <p className="text-gray-400 mb-4">{pkg.description}</p>
              
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">${pkg.price}</span>
              </div>
              
              <div className="flex-grow mb-6">
                <div className="flex items-center text-gray-300 mb-2">
                  <FaRobot className="mr-2 text-primary" />
                  <span>{pkg.token_amount} <FaRobot className="inline mx-1" /> tokens</span>
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
      </div>

      {/* Purchase Confirmation Modal */}
      {showConfirmation && selectedPackage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Complete Your Purchase</h3>
            <p className="text-gray-400 mb-6">
              You are purchasing <span className="text-white font-semibold">{selectedPackage.token_amount} <FaRobot className="inline mx-1" /> tokens</span> for ${selectedPackage.price}.
            </p>
            
            <Elements stripe={stripePromise}>
              <StripePaymentForm 
                amount={selectedPackage.price}
                tokenAmount={selectedPackage.token_amount}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowConfirmation(false)}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenManagement;
