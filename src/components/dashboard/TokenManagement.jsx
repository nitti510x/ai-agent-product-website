import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDollarSign, FiAlertTriangle, FiCreditCard, FiClock } from 'react-icons/fi';
import { supabase } from '../../config/supabase';
import { subscriptionService } from '../../config/postgres';
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

  const handlePaymentSuccess = async () => {
    try {
      // Refresh token data
      const updatedTokens = await subscriptionService.getUserTokens(user.id);
      setTokenData(updatedTokens);
      
      setSuccess(`Successfully purchased ${selectedPackage.token_amount} credits!`);
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
            <span>You must have an active subscription to purchase credits. Please subscribe to a plan first.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-8">
        <div className="bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] h-8 w-1 rounded-full mr-3"></div>
        <h1 className="text-3xl font-bold text-white">Credit Management</h1>
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
            <FiDollarSign className="mr-2" />
            <span>{success}</span>
          </div>
        </div>
      )}

      {/* Current Token Balance */}
      <div className="mb-12 bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Your Credit Balance</h2>
        
        <div className="flex items-center mb-6">
          <span className="text-4xl font-bold text-primary mr-3">
            {tokenData?.tokens?.balance || 0}
          </span>
          <span className="text-gray-400">credits remaining</span>
        </div>
        
        <p className="text-gray-300 mb-4">
          Your {tokenData?.subscription?.plan_id} plan includes {tokenData?.subscription?.features?.feature_limits?.tokens} credits per billing cycle.
        </p>
        
        {tokenData?.tokens?.balance < 100 && (
          <div className="bg-yellow-900/20 border border-yellow-500/50 text-yellow-500 p-4 rounded-lg mt-4">
            <div className="flex items-center">
              <FiAlertTriangle className="mr-2" size={20} />
              <span>Your credit balance is running low! Consider purchasing more credits below.</span>
            </div>
          </div>
        )}
      </div>

      {/* Available Token Packages */}
      <h2 className="text-2xl font-bold text-white mb-6">Purchase Additional Credits</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6 flex flex-col hover:border-primary/50 transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
            <p className="text-gray-400 mb-4">{pkg.description}</p>
            
            <div className="mb-4">
              <span className="text-3xl font-bold text-white">${pkg.price}</span>
            </div>
            
            <div className="flex-grow mb-6">
              <div className="flex items-center text-gray-300 mb-2">
                <FiDollarSign className="mr-2 text-primary" />
                <span>{pkg.token_amount} credits</span>
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

      {/* Purchase Confirmation Modal */}
      {showConfirmation && selectedPackage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Complete Your Purchase</h3>
            <p className="text-gray-400 mb-6">
              You are purchasing <span className="text-white font-semibold">{selectedPackage.token_amount} credits</span> for ${selectedPackage.price}.
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
