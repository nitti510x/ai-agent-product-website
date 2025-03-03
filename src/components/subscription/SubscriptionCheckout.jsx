import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiAlertTriangle, FiCreditCard, FiArrowRight } from 'react-icons/fi';
import { useSubscription } from '../../contexts/SubscriptionContext';
import PaymentMethods from '../billing/PaymentMethods';

const SubscriptionCheckout = () => {
  const navigate = useNavigate();
  const { selectedPlan, isFreeTrialSelected, clearPlanSelection } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Redirect if no plan is selected
  useEffect(() => {
    if (!selectedPlan && !isFreeTrialSelected) {
      navigate('/dashboard');
    }
  }, [selectedPlan, isFreeTrialSelected, navigate]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would make an API call to create the subscription
      // For now, we'll just simulate a successful checkout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      
      // Clear the plan selection
      setTimeout(() => {
        clearPlanSelection();
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error during checkout:', err);
      setError('Failed to process your subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFreeTrial = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would make an API call to create the free trial
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      
      // Clear the plan selection
      setTimeout(() => {
        clearPlanSelection();
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error activating free trial:', err);
      setError('Failed to activate your free trial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto p-8 rounded-xl border border-primary bg-dark shadow-glow">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <FiCheck className="text-primary w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            {isFreeTrialSelected ? 'Free Trial Activated!' : 'Subscription Confirmed!'}
          </h2>
          <p className="text-text-muted">
            {isFreeTrialSelected 
              ? 'Your 14-day free trial has been activated. Enjoy exploring our platform!'
              : `Your ${selectedPlan?.name} plan has been activated. Thank you for your subscription!`
            }
          </p>
        </div>
        <div className="text-center">
          <p className="text-text-muted mb-4">Redirecting you to the dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {isFreeTrialSelected ? (
        <div className="p-8 rounded-xl border border-primary bg-dark shadow-glow mb-8">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Activate Your Free Trial</h2>
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2 text-gray-100">Free Trial (14 Days)</h3>
            <p className="text-text-muted mb-4">Experience all the features of our platform with no commitment.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                "50 credits (Enough for multiple posts)",
                "1 AI Agent (Link 1 social account)",
                "Slack Access (For your workspace)",
                "Content Generation AI Agents",
                "Social Media AI Agents",
                "No credit card required"
              ].map((feature, index) => (
                <div key={index} className="flex items-center text-gray-300">
                  <div className="bg-primary/20 p-1 rounded-full mr-2">
                    <FiCheck className="text-primary w-4 h-4" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <button
              onClick={handleFreeTrial}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-dark hover:shadow-glow-strong py-3 px-6 rounded-lg transition-all duration-300 font-bold text-lg flex items-center justify-center"
            >
              {loading ? 'Activating...' : 'Activate Free Trial'}
              {!loading && <FiArrowRight className="ml-2" />}
            </button>
          </div>
        </div>
      ) : selectedPlan ? (
        <>
          <div className="p-8 rounded-xl border border-primary bg-dark shadow-glow mb-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Complete Your Subscription</h2>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2 text-gray-100">{selectedPlan.name} Plan</h3>
              <div className="text-2xl font-bold mb-2 bg-gradient-text bg-clip-text text-transparent">
                ${selectedPlan.price}<span className="text-sm text-text-muted">/{selectedPlan.interval || 'mo'}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {selectedPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-300">
                    <div className="bg-primary/20 p-1 rounded-full mr-2">
                      <FiCheck className="text-primary w-4 h-4" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-8 rounded-xl border border-dark-card bg-dark mb-8">
            <h3 className="text-xl font-bold text-gray-100 mb-4">
              <FiCreditCard className="inline-block mr-2" />
              Payment Method
            </h3>
            <PaymentMethods />
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="bg-primary hover:bg-primary-hover text-dark hover:shadow-glow-strong py-3 px-6 rounded-lg transition-all duration-300 font-bold text-lg flex items-center"
            >
              {loading ? 'Processing...' : 'Complete Subscription'}
              {!loading && <FiArrowRight className="ml-2" />}
            </button>
          </div>
        </>
      ) : null}
      
      {error && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded flex items-center">
          <FiAlertTriangle className="text-red-500 mr-2 flex-shrink-0" />
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionCheckout;
