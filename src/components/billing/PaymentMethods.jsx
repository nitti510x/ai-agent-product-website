import React, { useState, useEffect } from 'react';
import { FiPlus, FiCheck, FiAlertTriangle, FiCreditCard, FiTrash2 } from 'react-icons/fi';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '../../config/supabase';
import stripePromise from '../../config/stripe';
import { stripeCustomers, stripePaymentMethods } from '../../utils/edgeFunctions';

// Add Card Form component using Stripe Elements
function AddCardForm({ onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const cardElementOptions = {
    style: {
      base: {
        color: '#ffffff',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#8c9eb8'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    },
    hidePostalCode: true
  };
  
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
      
      // Create payment method with Stripe
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: { name }
      });
      
      if (stripeError) {
        throw stripeError;
      }
      
      // Check if user already has a Stripe customer
      let customerData = await stripeCustomers.get(user.id);
      
      // If not, create a new customer
      if (!customerData || !customerData.stripe_customer_id) {
        customerData = await stripeCustomers.create({
          userId: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email
        });
      }
      
      // Attach payment method to customer
      await stripePaymentMethods.attach({
        userId: user.id,
        paymentMethodId: paymentMethod.id
      });
      
      // Clear form
      elements.getElement(CardElement).clear();
      setName('');
      
      // Notify parent component
      onSuccess();
    } catch (error) {
      console.error('Error adding payment method:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-card p-6 rounded-lg shadow-lg mb-6 border border-dark-card/30">
      <h3 className="text-xl font-semibold mb-4 text-white">Add Payment Method</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Name on Card</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
            placeholder="John Doe"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Card Details</label>
          <div className="p-3 bg-gray-700 border border-gray-500 rounded focus-within:border-primary transition-colors">
            <CardElement options={cardElementOptions} />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="flex items-center text-gray-300">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="mr-2 h-4 w-4 accent-primary"
            />
            Set as default payment method
          </label>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded flex items-center">
            <FiAlertTriangle className="text-red-500 mr-2" />
            <span className="text-red-500">{error}</span>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-hover rounded text-dark font-semibold flex items-center"
            disabled={loading || !stripe}
          >
            {loading ? 'Processing...' : 'Add Card'}
          </button>
        </div>
      </form>
    </div>
  );
}

function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Authenticated user:', user);
        if (user) {
          setUser(user);
          fetchPaymentMethods(user.id);
        } else {
          // For development without authentication, use a mock user ID
          console.log('No authenticated user found, using mock user ID for development');
          setUser({ id: 'mock-user-id' });
          fetchPaymentMethods('mock-user-id');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to authenticate user');
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchPaymentMethods = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching payment methods for user: ${userId}`);
      
      // Use a timeout to handle network issues
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        const data = await stripePaymentMethods.list(userId);
        clearTimeout(timeoutId);
        
        console.log('Payment methods:', data);
        setPaymentMethods(data || []);
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out. Server may be unavailable.');
        }
        throw fetchError;
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      
      // Handle network errors more gracefully
      if (error.message === 'Failed to fetch') {
        setError('Failed to connect to the server. Please check if the API server is running.');
      } else {
        setError(`Failed to load payment methods: ${error.message}`);
      }
      
      setLoading(false);
      
      // In development, show mock data if the server is unreachable
      if (error.message === 'Failed to fetch' || error.message.includes('timed out')) {
        console.log('Using mock data due to server connection issue');
        setPaymentMethods([
          {
            id: 'pm_mock_fallback_1',
            type: 'card',
            card: {
              brand: 'visa',
              last4: '4242',
              exp_month: 12,
              exp_year: 2025
            },
            is_default: true
          },
          {
            id: 'pm_mock_fallback_2',
            type: 'card',
            card: {
              brand: 'mastercard',
              last4: '5555',
              exp_month: 10,
              exp_year: 2024
            },
            is_default: false
          }
        ]);
      }
    }
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    setSuccessMessage('Payment method added successfully');
    
    // Refresh payment methods
    if (user) {
      fetchPaymentMethods(user.id);
    }
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleSetDefault = async (paymentMethodId) => {
    try {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      // Set as default
      await stripePaymentMethods.attach({
        userId: user.id,
        paymentMethodId: paymentMethodId
      });
      
      setSuccessMessage('Default payment method updated');
      
      // Refresh payment methods
      fetchPaymentMethods(user.id);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error setting default payment method:', error);
      setError(error.message || 'Failed to update default payment method');
      setLoading(false);
    }
  };
  
  const handleDeletePaymentMethod = async (paymentMethodId) => {
    try {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      // Delete payment method
      await stripePaymentMethods.detach(paymentMethodId, user.id);
      
      setSuccessMessage('Payment method deleted successfully');
      
      // Refresh payment methods
      fetchPaymentMethods(user.id);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error deleting payment method:', error);
      setError(error.message || 'Failed to delete payment method');
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 bg-dark-card rounded-lg shadow-xl border border-dark-card/30">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Payment Methods</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-primary hover:bg-primary-hover rounded text-dark font-semibold"
          disabled={showAddForm}
        >
          <FiPlus className="mr-2" />
          Add Payment Method
        </button>
      </div>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-900/20 border border-green-500/50 rounded flex items-center">
          <FiCheck className="text-green-500 mr-2" />
          <span className="text-green-500">{successMessage}</span>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded flex items-center">
          <FiAlertTriangle className="text-red-500 mr-2" />
          <span className="text-red-500">{error}</span>
        </div>
      )}
      
      {showAddForm && (
        <Elements stripe={stripePromise}>
          <AddCardForm 
            onSuccess={handleAddSuccess} 
            onCancel={() => setShowAddForm(false)} 
          />
        </Elements>
      )}
      
      {loading && !showAddForm ? (
        <div className="flex justify-center items-center p-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : paymentMethods.length > 0 ? (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex justify-between items-center p-4 bg-dark-card rounded-lg border border-dark-card/30">
              <div className="flex items-center">
                <FiCreditCard className="text-gray-400 mr-3 text-xl" />
                <div>
                  <p className="text-white">
                    {method.card?.brand ? (method.card.brand.charAt(0).toUpperCase() + method.card.brand.slice(1)) : 'Card'} •••• {method.card?.last4 || '****'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Expires {method.card?.exp_month || '**'}/{method.card?.exp_year ? method.card.exp_year.toString().slice(-2) : '**'}
                    {method.is_default && (
                      <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs">
                        Default
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!method.is_default && (
                  <button 
                    onClick={() => handleSetDefault(method.id)}
                    className="text-primary hover:text-primary-hover text-sm"
                    disabled={loading}
                  >
                    Set as Default
                  </button>
                )}
                <button 
                  onClick={() => handleDeletePaymentMethod(method.id)}
                  className="text-red-400 hover:text-red-300"
                  disabled={loading}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-dark-card p-6 rounded-lg text-center border border-dark-card/30">
          <p className="text-gray-400">No payment methods found</p>
          <p className="text-gray-500 text-sm mt-2">
            Add a payment method to subscribe to a plan or purchase tokens
          </p>
        </div>
      )}
    </div>
  );
}

export default PaymentMethods;
