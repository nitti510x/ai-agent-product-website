import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiCheck, FiAlertTriangle, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import { supabase } from '../../config/supabase.js';
import { subscriptionService } from '../../config/postgres.js';

function Subscription() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    // Get the current user
    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          await getSubscription(user.id);
          await getPlans();
        }
      } catch (error) {
        console.error('Error getting current user:', error);
        setError('Failed to load user information');
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  const getSubscription = async (userId) => {
    try {
      // Use the subscription service to get the user's subscription
      const userSubscription = await subscriptionService.getUserSubscription(userId);
      setSubscription(userSubscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // No subscription is not an error
    }
  };

  const getPlans = async () => {
    try {
      // Use the subscription service to get available plans
      const availablePlans = await subscriptionService.getPlans();
      setPlans(availablePlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setError('Failed to load subscription plans');
    }
  };

  const subscribeToPlan = async (planId) => {
    if (!user) return;
    
    // Log the user ID to ensure we're using the correct one
    console.log('User ID for subscription:', user.id);
    
    setSelectedPlan(plans.find(p => p.id === planId));
    setShowConfirmation(true);
  };

  const confirmSubscription = async () => {
    if (!user || !selectedPlan) return;
    
    try {
      setLoading(true);
      
      // In a real application, you would integrate with a payment processor here
      // For this example, we'll simulate a successful subscription
      
      const now = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription
      
      // Ensure we're using the main Supabase user ID (not from identities)
      const subscriptionData = {
        user_id: user.id, // This is the main Supabase user ID
        plan_id: selectedPlan.id,
        status: 'active',
        current_period_start: now,
        current_period_end: endDate,
        cancel_at_period_end: false,
        metadata: {
          user_email: user.email,
          user_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          subscription_created_at: now.toISOString()
        }
      };
      
      console.log('Creating subscription with data:', subscriptionData);
      
      // Use the subscription service to create a subscription
      const newSubscription = await subscriptionService.createSubscription(subscriptionData);
      
      setSubscription(newSubscription);
      setShowConfirmation(false);
      alert('Successfully subscribed to plan!');
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      setError('Failed to subscribe to plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    if (!subscription) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the subscription service to cancel the subscription
      await subscriptionService.cancelSubscription(subscription.id);
      
      // Update the local subscription state
      setSubscription({
        ...subscription,
        cancel_at_period_end: true
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error canceling subscription:', error);
      setError('Failed to cancel subscription');
      setLoading(false);
    }
  };

  const reactivateSubscription = async () => {
    if (!subscription) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the subscription service to reactivate the subscription
      const updatedSubscription = await subscriptionService.reactivateSubscription(subscription.id);
      
      // Update the local subscription state
      setSubscription({
        ...subscription,
        cancel_at_period_end: false
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      setError('Failed to reactivate subscription');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-8">
        <div className="bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] h-8 w-1 rounded-full mr-3"></div>
        <h1 className="text-3xl font-bold text-white">Subscription Management</h1>
      </div>

      {error && (
        <div className="mb-8 bg-red-900/20 border border-red-500/50 text-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <FiAlertTriangle className="mr-2" size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Current Subscription */}
      <div className="mb-12 bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Current Subscription</h2>
        
        {subscription ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-lg font-semibold text-white">
                  {plans.find(p => p.id === subscription.plan_id)?.name || subscription.plan_id}
                </span>
                <span className="ml-3 px-2 py-1 text-xs rounded-full bg-green-900/20 text-green-500">
                  {subscription.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">
                  Current period ends on {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
                {subscription.cancel_at_period_end && (
                  <p className="text-yellow-500 text-sm mt-1">
                    Your subscription will be canceled at the end of the billing period
                  </p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Current Plan:</span> {subscription.plan_id}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Status:</span> {subscription.status}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Renewal Date:</span> {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
              {subscription.cancel_at_period_end && (
                <p className="text-yellow-500 flex items-center mt-4">
                  <FiAlertTriangle className="mr-2" />
                  Your subscription will not renew after the current period ends.
                </p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to="/dashboard/tokens"
                className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary hover:text-primary-hover rounded-lg transition-colors flex items-center"
              >
                <FiDollarSign className="mr-2" />
                Manage Tokens
              </Link>
              
              {!subscription.cancel_at_period_end ? (
                <button
                  onClick={cancelSubscription}
                  disabled={loading}
                  className="px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                >
                  Cancel Subscription
                </button>
              ) : (
                <button
                  onClick={reactivateSubscription}
                  disabled={loading}
                  className="px-4 py-2 bg-green-900/20 hover:bg-green-900/30 text-green-400 hover:text-green-300 rounded-lg transition-colors"
                >
                  Reactivate Subscription
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-lg font-semibold text-white">
                  Free Trial Plan
                </span>
                <span className="ml-3 px-2 py-1 text-xs rounded-full bg-blue-900/20 text-blue-500">
                  active
                </span>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">
                  14-day trial period
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Current Plan:</span> Free Trial
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Features:</span>
              </p>
              <ul className="ml-6 space-y-1">
                <li className="text-gray-400 flex items-center">
                  <FiCheck className="mr-2 text-primary" />
                  50 credits
                </li>
                <li className="text-gray-400 flex items-center">
                  <FiCheck className="mr-2 text-primary" />
                  1 AI Agent
                </li>
                <li className="text-gray-400 flex items-center">
                  <FiCheck className="mr-2 text-primary" />
                  Slack Access
                </li>
              </ul>
            </div>
            
            <p className="text-gray-400">
              Upgrade to a paid plan below to get more features and credits.
            </p>
          </div>
        )}
      </div>

      {/* Available Plans */}
      <h2 className="text-2xl font-bold text-white mb-6">Available Plans</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-gray-400 mb-4">{plan.description}</p>
            
            <div className="mb-4">
              <span className="text-3xl font-bold text-white">${typeof plan.price === 'number' ? plan.price.toFixed(2) : plan.price}</span>
              <span className="text-gray-400">/{plan.interval}</span>
            </div>
            
            <div className="flex-grow mb-6">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Features:</h4>
              <ul className="space-y-2">
                {plan.features && Object.entries(plan.features.feature_limits || {}).map(([key, value]) => (
                  <li key={key} className="flex items-center text-gray-400">
                    <FiCheck className="mr-2 text-primary" />
                    <span className="capitalize">{key.replace('_', ' ')}: {value}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button
              onClick={() => subscribeToPlan(plan.id)}
              disabled={loading || (subscription && subscription.plan_id === plan.id && !subscription.cancel_at_period_end)}
              className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center ${
                subscription && subscription.plan_id === plan.id && !subscription.cancel_at_period_end
                  ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-hover text-dark hover:shadow-glow transition-all duration-300'
              }`}
            >
              <FiCreditCard className="mr-2" />
              {subscription && subscription.plan_id === plan.id && !subscription.cancel_at_period_end
                ? 'Current Plan'
                : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>

      {/* Subscription Confirmation Modal */}
      {showConfirmation && selectedPlan && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Subscription</h3>
            <p className="text-gray-400 mb-6">
              You are about to subscribe to the <span className="text-white font-semibold">{selectedPlan.name}</span> plan for ${typeof selectedPlan.price === 'number' ? selectedPlan.price.toFixed(2) : selectedPlan.price}/{selectedPlan.interval}.
            </p>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubscription}
                disabled={loading}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-dark rounded-lg transition-colors"
              >
                {loading ? 'Processing...' : 'Confirm Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscription;