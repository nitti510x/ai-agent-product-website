import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { FiCheck, FiX, FiAlertTriangle, FiCreditCard } from 'react-icons/fi';

function SubscriptionManager() {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      // Call the backend API to get subscription
      const { data, error } = await supabase.from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // No subscription is not an error
      if (error.code !== 'PGRST116') {
        setError('Failed to load subscription information');
      }
    }
  };

  const getPlans = async () => {
    try {
      // Call the backend API to get available plans
      const { data, error } = await supabase.from('plans')
        .select('*')
        .eq('active', true)
        .order('price', { ascending: true });
      
      if (error) throw error;
      setPlans(data || []);
      
      // Filter out free and enterprise plans
      const filtered = data.filter(plan => 
        plan.name.toLowerCase() !== 'free' && 
        plan.name.toLowerCase() !== 'enterprise'
      );
      setFilteredPlans(filtered);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setError('Failed to load subscription plans');
    }
  };

  const subscribeToPlan = async (planId) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // In a real application, you would integrate with a payment processor here
      // For this example, we'll simulate a successful subscription
      
      const now = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription
      
      const subscriptionData = {
        user_id: user.id,
        plan_id: planId,
        status: 'active',
        current_period_start: now.toISOString(),
        current_period_end: endDate.toISOString(),
        cancel_at_period_end: false,
        metadata: {}
      };
      
      // Insert the new subscription
      const { data, error } = await supabase.from('subscriptions').insert(subscriptionData).select().single();
      
      if (error) throw error;
      
      setSubscription(data);
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
      
      // Update the subscription to cancel at period end
      const { data, error } = await supabase.from('subscriptions')
        .update({ cancel_at_period_end: true })
        .eq('id', subscription.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setSubscription(data);
      alert('Your subscription will be canceled at the end of the billing period.');
    } catch (error) {
      console.error('Error canceling subscription:', error);
      setError('Failed to cancel subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="max-w-md w-full p-8 bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30">
          <div className="text-center">
            <FiAlertTriangle className="mx-auto text-yellow-500" size={48} />
            <h2 className="mt-4 text-2xl font-bold text-white">Authentication Required</h2>
            <p className="mt-2 text-gray-400">Please sign in to manage your subscription.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] text-transparent bg-clip-text">
            Subscription Management
          </h1>
          <p className="mt-2 text-gray-400">
            Manage your subscription and billing information
          </p>
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
              
              {!subscription.cancel_at_period_end && (
                <button
                  onClick={cancelSubscription}
                  disabled={loading}
                  className="mt-4 px-4 py-2 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-900/20 transition-colors"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-400">
              You don't have an active subscription. Choose a plan below to get started.
            </p>
          )}
        </div>

        {/* Available Plans */}
        <h2 className="text-2xl font-bold text-white mb-6">Available Plans</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 mb-4">{plan.description}</p>
              
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">${plan.price}</span>
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
        
        {/* Contact for custom plans */}
        <div className="mt-12 p-6 bg-dark-card rounded-xl border border-gray-700 text-center">
          <h3 className="text-xl font-bold text-white mb-3">Need a Custom Solution?</h3>
          <p className="text-gray-300 mb-4">
            Looking for Enterprise features or have specific requirements? Contact our team to discuss custom plans tailored to your needs.
          </p>
          <a 
            href="mailto:sales@geniusos.co" 
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Contact Sales
          </a>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionManager;
