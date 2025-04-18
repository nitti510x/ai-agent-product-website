import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { stripeCustomers, stripePaymentMethods } from '../../utils/edgeFunctions';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FiPlus, FiCheck, FiAlertTriangle, FiCreditCard, FiTrash2, FiInfo } from 'react-icons/fi';
import PageHeader from '../dashboard/PageHeader';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Card input styles
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#ffffff',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
    },
  },
};

// Add Payment Method Form
function AddPaymentMethodForm({ onSuccess, onCancel }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setError("Stripe hasn't loaded yet. Please try again in a moment.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Create payment method
      console.log('Creating payment method...');
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });
      
      if (stripeError) {
        console.error('Stripe createPaymentMethod error:', stripeError);
        throw new Error(stripeError.message);
      }
      
      if (!paymentMethod || !paymentMethod.id) {
        throw new Error('Failed to create payment method. Please try again.');
      }
      
      console.log('Payment method created:', paymentMethod.id);
      
      // Attach payment method to customer
      try {
        console.log('Attaching payment method to customer...');
        await stripePaymentMethods.attach(paymentMethod.id);
        console.log('Payment method attached successfully');
        
        // Clear form and notify parent
        elements.getElement(CardElement).clear();
        onSuccess();
      } catch (attachError) {
        console.error('Error attaching payment method:', attachError);
        
        // Check if the error is from our API or from Stripe
        if (attachError.message.includes('API error')) {
          // Try to extract more details from the error message
          const errorDetails = attachError.message.includes('details') 
            ? attachError.message 
            : 'Failed to attach payment method to your account. Please try again.';
          
          throw new Error(errorDetails);
        } else if (attachError.message.includes('Failed to fetch')) {
          // Connection error - could be that the server is not running
          setUsingFallback(true);
          throw new Error('Connection error. The server may be offline, but your card has been validated. In a production environment, this would be saved.');
        } else {
          throw new Error(`Failed to attach payment method: ${attachError.message}`);
        }
      }
    } catch (error) {
      console.error('Error in payment method flow:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6 mb-8">
      <h3 className="text-xl font-bold text-white mb-4">Add Payment Method</h3>
      
      {usingFallback && import.meta.env.DEV && (
        <div className="mb-6 bg-blue-900/20 border border-blue-500/50 text-blue-200 p-4 rounded-lg">
          <div className="flex items-start">
            <FiInfo className="text-blue-500 mt-1 mr-3 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm">
                <strong>Development Mode:</strong> Using fallback implementation. Your card will be validated but not actually saved to Stripe.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-6 bg-red-900/20 border border-red-500/50 text-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <FiAlertTriangle className="mr-2" size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">Card Details</label>
          <div className="p-4 bg-dark/50 border border-gray-700 rounded-lg focus-within:border-primary transition-colors">
            <CardElement options={cardElementOptions} />
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Your card information is securely processed by Stripe.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-dark/50 hover:bg-dark/70 border border-gray-700 rounded-lg text-white transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 text-sm font-medium"
            disabled={!stripe || loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <FiCreditCard className="mr-2" />
                Add Card
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// Payment Method Card
function PaymentMethodCard({ paymentMethod, isDefault, onSetDefault, onDelete }) {
  const { card } = paymentMethod;
  const [loading, setLoading] = useState(false);
  
  const handleSetDefault = async () => {
    setLoading(true);
    try {
      await stripePaymentMethods.setDefault(paymentMethod.id);
      onSetDefault(paymentMethod.id);
    } catch (error) {
      console.error('Error setting default payment method:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to remove this payment method?')) {
      setLoading(true);
      try {
        await stripePaymentMethods.detach(paymentMethod.id);
        onDelete(paymentMethod.id);
      } catch (error) {
        console.error('Error removing payment method:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  return (
    <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6 hover:border-primary/30 transition-all duration-300">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-4 text-2xl">
            {card?.brand === 'visa' && <span className="text-blue-400">Visa</span>}
            {card?.brand === 'mastercard' && <span className="text-red-400">Mastercard</span>}
            {card?.brand === 'amex' && <span className="text-blue-300">Amex</span>}
            {card?.brand === 'discover' && <span className="text-yellow-400">Discover</span>}
            {!['visa', 'mastercard', 'amex', 'discover'].includes(card?.brand) && (
              <FiCreditCard className="text-gray-400" />
            )}
          </div>
          <div>
            <h5 className="text-white font-medium">
              {card?.brand?.charAt(0).toUpperCase() + card?.brand?.slice(1) || 'Card'} 
              ending in {card?.last4}
            </h5>
            <div className="flex items-center mt-1">
              <span className="text-gray-400 text-sm">
                Expires {card?.exp_month}/{card?.exp_year}
              </span>
              {isDefault && (
                <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs">
                  Default
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          {!isDefault && (
            <button
              className="mr-3 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary hover:text-primary-hover rounded-lg transition-colors flex items-center"
              onClick={handleSetDefault}
              disabled={loading}
            >
              <FiCheck className="mr-1.5" />
              Set as Default
            </button>
          )}
          <button
            className="px-3 py-1.5 bg-red-900/20 hover:bg-red-900/30 text-red-400 hover:text-red-300 rounded-lg transition-colors flex items-center"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-red-500 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <FiTrash2 className="mr-1.5" />
            )}
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [defaultPaymentMethodId, setDefaultPaymentMethodId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [user, setUser] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Auth session:', session ? 'Session exists' : 'No session');
        
        if (session) {
          const { data: { user } } = await supabase.auth.getUser();
          console.log('Authenticated user:', user);
          
          if (user) {
            setUser(user);
            fetchPaymentMethods();
          } else {
            console.error('Session exists but no user found');
            setError('User authentication error');
            setLoading(false);
          }
        } else {
          console.error('No active session found');
          setError('Please sign in to manage payment methods');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to authenticate user: ' + error.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First ensure we have a Stripe customer
      try {
        await stripeCustomers.create();
      } catch (customerError) {
        console.error('Error creating customer:', customerError);
        if (customerError.message.includes('Database setup incomplete')) {
          setError('Database setup is incomplete. Please contact support to set up the payment system.');
          setLoading(false);
          return;
        }
        
        // Check if we're using the fallback implementation
        if (import.meta.env.DEV && customerError.message.includes('Failed to fetch')) {
          setUsingFallback(true);
        }
        
        // Continue anyway, as the customer might already exist
      }
      
      // Then fetch payment methods
      try {
        const data = await stripePaymentMethods.list();
        console.log('Payment methods response:', data);
        
        // Check if we're using the fallback implementation
        if (import.meta.env.DEV && data.length > 0 && !data[0].hasOwnProperty('customer_id')) {
          setUsingFallback(true);
        }
        
        // Handle different response formats
        if (data && data.payment_methods) {
          // Format from local API server
          console.log('Using payment_methods from response:', data.payment_methods);
          setPaymentMethods(data.payment_methods);
          
          // Set default payment method if available
          if (data.default_payment_method) {
            console.log('Setting default payment method:', data.default_payment_method);
            setDefaultPaymentMethodId(data.default_payment_method);
          }
        } else if (Array.isArray(data)) {
          // Direct array format
          console.log('Using array data:', data);
          setPaymentMethods(data);
          
          // Find default payment method in array
          const defaultMethod = data.find(method => method.is_default);
          if (defaultMethod) {
            console.log('Found default payment method in array:', defaultMethod.id);
            setDefaultPaymentMethodId(defaultMethod.id);
          }
        } else if (data && typeof data === 'object') {
          // Handle case where data might be an object with data property
          console.log('Using data.data:', data.data);
          setPaymentMethods(data.data || []);
          
          // Check for default_payment_method in the response
          if (data.default_payment_method) {
            console.log('Setting default payment method from object:', data.default_payment_method);
            setDefaultPaymentMethodId(data.default_payment_method);
          } else {
            // Find default payment method in array
            const methods = data.data || [];
            const defaultMethod = methods.find(method => method.is_default);
            if (defaultMethod) {
              console.log('Found default payment method in data.data:', defaultMethod.id);
              setDefaultPaymentMethodId(defaultMethod.id);
            }
          }
        } else {
          console.warn('Unexpected payment methods data format:', data);
          setPaymentMethods([]);
        }
      } catch (paymentError) {
        console.error('Error fetching payment methods:', paymentError);
        if (paymentError.message.includes('Database setup incomplete')) {
          setError('Database setup is incomplete. Please contact support to set up the payment system.');
        } else if (paymentError.message.includes('body stream already read')) {
          // This is likely a transient error, retry once
          try {
            console.log('Retrying payment methods fetch after body stream error...');
            const retryData = await stripePaymentMethods.list();
            if (Array.isArray(retryData)) {
              setPaymentMethods(retryData);
              return;
            }
          } catch (retryError) {
            console.error('Error on retry:', retryError);
          }
          setError('Failed to load payment methods. Please refresh the page and try again.');
        } else {
          setError('Failed to load payment methods: ' + paymentError.message);
        }
      }
    } catch (error) {
      console.error('Error in fetchPaymentMethods:', error);
      setError('Failed to load payment methods: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    setSuccessMessage('Payment method added successfully');
    fetchPaymentMethods();
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleSetDefault = async (paymentMethodId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      console.log(`Setting payment method ${paymentMethodId} as default`);
      await stripePaymentMethods.setDefault(paymentMethodId);
      
      // Update the local state
      setDefaultPaymentMethodId(paymentMethodId);
      
      setSuccessMessage('Default payment method updated successfully');
      
      // Refresh payment methods
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error setting default payment method:', error);
      setError(`Failed to set default payment method: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      console.log(`Deleting payment method ${paymentMethodId}`);
      await stripePaymentMethods.detach(paymentMethodId);
      
      // Remove from local state
      setPaymentMethods(prevMethods => 
        prevMethods.filter(method => method.id !== paymentMethodId)
      );
      
      // If this was the default payment method, update the default
      if (defaultPaymentMethodId === paymentMethodId) {
        setDefaultPaymentMethodId(null);
      }
      
      setSuccessMessage('Payment method removed successfully');
      
      // Refresh payment methods
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      setError(`Failed to delete payment method: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user && !loading && error) {
    return (
      <div className="p-6">
        <div className="bg-dark-card p-6 rounded-lg shadow-lg border border-dark-card/30 w-full">
          <h2 className="text-xl font-bold text-white mb-4">Authentication Required</h2>
          <div className="p-3 bg-yellow-900/20 border border-yellow-500/50 rounded mb-4">
            <p className="text-yellow-500">{error}</p>
          </div>
          <hr className="border-gray-700 my-4" />
          <p className="text-gray-300">
            Please <a href="/login" className="text-primary hover:text-primary-hover">sign in</a> to manage your payment methods.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      <PageHeader 
        title="Payment Methods"
        description="Manage your payment methods for subscriptions and token purchases"
      />
      
      {successMessage && (
        <div className="mb-8 bg-green-900/20 border border-green-500/50 text-green-500 p-4 rounded-lg">
          <div className="flex items-center">
            <FiCheck className="mr-2" size={20} />
            <span>{successMessage}</span>
          </div>
        </div>
      )}
      
      {error && !loading && (
        <div className="mb-8 bg-red-900/20 border border-red-500/50 text-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <FiAlertTriangle className="mr-2" size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {usingFallback && import.meta.env.DEV && (
        <div className="mb-8 bg-blue-900/20 border border-blue-500/50 text-blue-200 p-4 rounded-lg">
          <div className="flex items-start">
            <FiInfo className="text-blue-500 mt-1 mr-3 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-lg">Development Mode</h3>
              <p className="text-sm">
                Using local storage to save payment methods. Your card information is being stored locally in your browser 
                and will persist across page refreshes. In production, this would be saved to Stripe.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {showAddForm ? (
            <Elements stripe={stripePromise}>
              <AddPaymentMethodForm 
                onSuccess={handleAddSuccess} 
                onCancel={() => setShowAddForm(false)} 
              />
            </Elements>
          ) : (
            <>
              {paymentMethods.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-300">Your saved payment methods</p>
                    <button 
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 text-sm font-medium"
                      onClick={() => setShowAddForm(true)}
                    >
                      <FiPlus className="mr-2" />
                      Add Payment Method
                    </button>
                  </div>
                  
                  {paymentMethods
                    .sort((a, b) => (b.is_default - a.is_default))
                    .map(method => (
                      <PaymentMethodCard 
                        key={method.id}
                        paymentMethod={method}
                        isDefault={method.id === defaultPaymentMethodId}
                        onSetDefault={() => handleSetDefault(method.id)}
                        onDelete={() => handleDeletePaymentMethod(method.id)}
                      />
                    ))
                  }
                </div>
              ) : (
                <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-8 text-center">
                  <FiCreditCard className="mx-auto text-4xl text-gray-500 mb-3" />
                  <p className="text-gray-300 mb-2">You don't have any payment methods yet.</p>
                  <p className="text-gray-500 text-sm mb-6">
                    Add a payment method to subscribe to a plan or purchase credits.
                  </p>
                  <button 
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 text-sm font-medium mx-auto"
                    onClick={() => setShowAddForm(true)}
                  >
                    <FiPlus className="mr-2" />
                    Add Payment Method
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default PaymentMethods;
