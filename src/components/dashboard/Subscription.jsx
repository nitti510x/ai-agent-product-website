import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiCheck, FiAlertTriangle, FiCreditCard, FiDollarSign, FiInfo } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { supabase } from '../../config/supabase.js';
import { agentService } from '../../services/agentService.js';
import { apiService } from '../../services/apiService.js';
import { useOrganization } from '../../contexts/OrganizationContext';
import PageHeader from './PageHeader';

function Subscription() {
  console.log("Subscription component rendering");
  const navigate = useNavigate();
  const { subscription, selectedOrg, getPlanName } = useOrganization();
  const [user, setUser] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const currentPlanName = getPlanName();

  useEffect(() => {
    // Get the current user and plans
    const initialize = async () => {
      try {
        // Get plans first to ensure something displays even if auth fails
        await getPlans();
        
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error getting current user:', error);
          setError('Authentication error. Please try logging in again.');
          setLoading(false);
          return;
        }
        
        if (data && data.user) {
          setUser(data.user);
        } else {
          setError('No authenticated user found. Please log in.');
        }
      } catch (error) {
        console.error('Error in initialization:', error);
        setError('Failed to load user information. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const getPlans = async () => {
    try {
      // Use the agent service to get available plans
      console.log('Fetching plans from agent API...');
      const availablePlans = await agentService.getPlans();
      console.log('Plans received:', availablePlans);
      
      if (!availablePlans || !Array.isArray(availablePlans)) {
        console.error('Invalid plans data received:', availablePlans);
        setError('Failed to load subscription plans: Invalid data format');
        setPlans([]);
        return;
      }
      
      // Sort plans by price (free plans first, then ascending by price)
      const sortedPlans = [...availablePlans].sort((a, b) => {
        // Put free plans first
        if (a.price === 0 && b.price !== 0) return -1;
        if (a.price !== 0 && b.price === 0) return 1;
        // Then sort by price
        return a.price - b.price;
      });
      
      setPlans(sortedPlans);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching plans:', error);
      setError(`Failed to load subscription plans: ${error.message}`);
      setPlans([]); // Ensure plans is an empty array, not undefined
    }
  };

  const subscribeToPlan = async (planId) => {
    if (!user) return;
    
    // Prevent subscribing to free trial if user already has a subscription history
    const selectedPlan = plans.find(p => p.id === planId);
    if (selectedPlan && selectedPlan.name.toLowerCase() === 'free trial' && subscription) {
      setError('Free trial is only available for new users. Please select a different plan.');
      return;
    }
    
    // Log the user ID to ensure we're using the correct one
    console.log('User ID for subscription:', user.id);
    
    setSelectedPlan(selectedPlan);
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
      
      // Subscription is now handled directly by the external API
      // We no longer need to create subscriptions locally
      window.location.href = `https://agent.ops.geniusos.co/subscribe?plan=${selectedPlan.id}&user_id=${user.id}`;
      
      return; // Early return as we're redirecting
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      setError('Failed to subscribe to plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      // Call the api service to cancel the subscription
      await apiService.cancelSubscription(subscription.id);
      
      // Update the subscription in state
      // Removed the update of subscription state as it's now handled by the OrganizationContext
    } catch (error) {
      console.error('Error canceling subscription:', error);
      // toast.error('Failed to cancel subscription. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setIsReactivating(true);
    try {
      // Call the api service to reactivate the subscription
      const updatedSubscription = await apiService.reactivateSubscription(subscription.id);
      
      // Update the subscription in state
      // Removed the update of subscription state as it's now handled by the OrganizationContext
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      // toast.error('Failed to reactivate subscription. Please try again.');
    } finally {
      setIsReactivating(false);
    }
  };

  const handleSelectPlan = (planId) => {
    subscribeToPlan(planId);
  };

  const getFilteredPlans = () => {
    if (!plans || !Array.isArray(plans) || plans.length === 0) {
      return [];
    }
    
    // Only show paid plans (Starter, Pro, Business)
    // Exclude free trial and enterprise (enterprise is shown separately below)
    return plans.filter(plan => {
      // Ensure plan has all required properties
      if (!plan || typeof plan !== 'object' || !plan.name) {
        console.warn('Invalid plan object found:', plan);
        return false;
      }
      
      const planName = String(plan.name).toLowerCase();
      return planName !== 'free trial' && 
             planName !== 'enterprise' &&
             plan.price !== null && 
             plan.price > 0;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Subscription"
        description="Manage your subscription plan and billing details"
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400">
          <div className="flex items-start">
            <FiAlertTriangle className="mt-0.5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Current Subscription Information */}
      {subscription && (
        <div className="mb-8 p-6 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center">
                <IoDiamond className="text-emerald-400 mr-2" />
                Current Plan: <span className="ml-2 text-emerald-400">{currentPlanName}</span>
              </h2>
              
              <div className="mt-3 text-gray-300">
                {subscription.current_period_end && (
                  <p className="flex items-center text-sm">
                    <FiInfo className="mr-2 text-gray-400" />
                    {subscription.cancel_at_period_end 
                      ? `Your subscription will end on ${new Date(subscription.current_period_end * 1000).toLocaleDateString()}`
                      : `Next billing date: ${new Date(subscription.current_period_end * 1000).toLocaleDateString()}`
                    }
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              {subscription.cancel_at_period_end ? (
                <button
                  onClick={handleReactivateSubscription}
                  disabled={isReactivating}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-medium rounded-lg transition-colors"
                >
                  {isReactivating ? 'Processing...' : 'Reactivate Subscription'}
                </button>
              ) : (
                <button
                  onClick={handleCancelSubscription}
                  disabled={isCancelling}
                  className="px-4 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {isCancelling ? 'Processing...' : 'Cancel Subscription'}
                </button>
              )}
              
              <Link
                to="/dashboard/billing/payment"
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-black font-medium rounded-lg transition-colors flex items-center"
              >
                <FiCreditCard className="mr-2" />
                Payment Methods
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Available Plans */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Available Plans</h2>
        <p className="text-gray-400 mb-6">Choose the plan that works best for you and your team</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {getFilteredPlans().map((plan) => (
          <div 
            key={plan.id} 
            className={`bg-dark-lighter p-6 rounded-xl flex flex-col transition-all duration-300 ${
              subscription && subscription.plan_id === plan.id 
                ? 'border-2 border-primary relative' 
                : 'hover:border-gray-700 border border-transparent'
            }`}
          >
            {subscription && subscription.plan_id === plan.id && (
              <div className="absolute -top-3 -right-3 bg-primary text-dark text-xs font-bold px-3 py-1 rounded-full">
                Current Plan
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-gray-400">{plan.description}</p>
            </div>
            
            <div className="mb-6">
              {plan.price !== null ? (
                <>
                  <span className="text-3xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400 ml-1">/month</span>
                </>
              ) : (
                <span className="text-xl font-bold text-white">Custom Pricing</span>
              )}
            </div>
            
            <div className="flex-grow mb-6">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Features:</h4>
              <ul className="space-y-2">
                {plan.features ? (
                  Array.isArray(plan.features) ? (
                    // Handle features as an array of objects with icon and text properties (new API format)
                    plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FiCheck className="text-primary mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-300">
                          {typeof feature === 'object' && feature.text ? 
                            feature.text : 
                            (typeof feature === 'string' ? feature : JSON.stringify(feature))}
                        </span>
                      </li>
                    ))
                  ) : typeof plan.features === 'object' ? (
                    // Handle feature_limits object if it exists
                    plan.features.feature_limits ? (
                      Object.entries(plan.features.feature_limits).map(([key, value], index) => (
                        <li key={index} className="flex items-start">
                          <FiCheck className="text-primary mt-1 mr-2 flex-shrink-0" />
                          <span className="text-gray-300">
                            <span className="capitalize">{key.replace(/_/g, ' ') === 'tokens' ? 'credits' : key.replace(/_/g, ' ')}:</span> {value}
                          </span>
                        </li>
                      ))
                    ) : (
                      // Handle features as a flat object
                      Object.entries(plan.features).map(([key, value], index) => (
                        <li key={index} className="flex items-start">
                          <FiCheck className="text-primary mt-1 mr-2 flex-shrink-0" />
                          <span className="text-gray-300">
                            <span className="capitalize">{key.replace(/_/g, ' ') === 'tokens' ? 'credits' : key.replace(/_/g, ' ')}:</span> {' '}
                            {typeof value === 'object' ? JSON.stringify(value) : value}
                          </span>
                        </li>
                      ))
                    )
                  ) : (
                    // Handle features as a string
                    <li className="flex items-start">
                      <FiCheck className="text-primary mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">{plan.features}</span>
                    </li>
                  )
                ) : (
                  <li className="text-gray-400">No features listed</li>
                )}
              </ul>
            </div>
            
            {subscription && subscription.plan_id === plan.id ? (
              <button
                disabled
                className="w-full py-2 bg-primary/20 text-primary font-medium rounded-lg flex items-center justify-center"
              >
                <FiCheck className="mr-2" />
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loading}
                className="w-full py-2 bg-primary hover:bg-primary-hover text-black font-medium rounded-lg transition-colors flex items-center justify-center"
              >
                <FiCreditCard className="mr-2" />
                {loading && selectedPlan === plan.id ? 'Processing...' : 'Select Plan'}
              </button>
            )}
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
          className="inline-flex items-center px-6 py-3 bg-primary text-black font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          Contact Sales
        </a>
      </div>

      {/* Subscription Confirmation Modal */}
      {showConfirmation && selectedPlan && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Subscription</h3>
            <p className="text-gray-400 mb-6">
              You are about to subscribe to the <span className="text-white font-semibold">{selectedPlan.name}</span> plan for ${selectedPlan.price}/month.
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
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-black rounded-lg transition-colors"
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