import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiAlertTriangle, FiCreditCard, FiArrowRight, FiLock, FiZap, FiStar, FiTrendingUp, FiMail, FiInfo } from 'react-icons/fi';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { supabase } from '../../config/supabase';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Auth } from '@supabase/auth-ui-react'; 
import stripePromise from '../../config/stripe';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { selectedPlan, isFreeTrialSelected, clearPlanSelection } = useSubscription();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState(''); 
  const [animateFeatures, setAnimateFeatures] = useState(false);
  const [existingUserStatus, setExistingUserStatus] = useState(null); 
  const [isEmailVerified, setIsEmailVerified] = useState(false); 

  useEffect(() => {
    setTimeout(() => setAnimateFeatures(true), 300);
  }, []);

  useEffect(() => {
    if (!selectedPlan && !isFreeTrialSelected) {
      navigate('/');
    }
  }, [selectedPlan, isFreeTrialSelected, navigate]);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const checkExistingUser = async (email) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, 
        }
      });

      if (userError && userError.message !== "User already registered") {
        return { exists: false };
      }

      const { data: subscriptions, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id || '')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1);

      if (subError) throw subError;

      if (subscriptions && subscriptions.length > 0) {
        const currentPlan = subscriptions[0].plan;
        const currentPlanPrice = subscriptions[0].amount;
        
        if (selectedPlan) {
          if (currentPlan === selectedPlan.name) {
            return { 
              exists: true, 
              hasActiveSubscription: true, 
              canUpgrade: false,
              message: `You already have an active ${currentPlan} subscription.`
            };
          } else if (currentPlanPrice < selectedPlan.price) {
            return { 
              exists: true, 
              hasActiveSubscription: true, 
              canUpgrade: true,
              message: `You're upgrading from ${currentPlan} to ${selectedPlan.name}.`
            };
          } else {
            return { 
              exists: true, 
              hasActiveSubscription: true, 
              canUpgrade: false,
              canDowngrade: true,
              message: `You're downgrading from ${currentPlan} to ${selectedPlan.name}. Some features may no longer be available.`
            };
          }
        }
      }
      
      return { 
        exists: true, 
        hasActiveSubscription: false,
        message: "You already have an account. We'll add this subscription to your existing account."
      };
    } catch (err) {
      console.error('Error checking existing user:', err);
      return { exists: false };
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const userStatus = await checkExistingUser(email);
      setExistingUserStatus(userStatus);
      setIsEmailVerified(true);
      
      if (userStatus.exists && userStatus.hasActiveSubscription && !userStatus.canUpgrade) {
        setError(userStatus.message);
      }
    } catch (err) {
      console.error('Error verifying email:', err);
      setError('Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating account:', err);
      throw err;
    }
  };

  const processPayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error('Error creating payment method:', error);
      throw error;
    }

    return paymentMethod;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      if (!isFreeTrialSelected) {
        await processPayment();
      }
      
      if (existingUserStatus?.exists) {
        setSuccess(true);
        
        setTimeout(() => {
          clearPlanSelection();
          navigate('/checkout-success', { 
            state: { 
              email, 
              isFreeTrialSelected, 
              planName: selectedPlan?.name,
              isExistingUser: true
            } 
          });
        }, 2000);
        
        return;
      }
      
      const generatedPassword = generatePassword();
      setPassword(generatedPassword);
      
      await createAccount(email, generatedPassword);
      
      setSuccess(true);
      
      setTimeout(() => {
        clearPlanSelection();
        navigate('/checkout-success', { 
          state: { 
            email, 
            isFreeTrialSelected, 
            planName: selectedPlan?.name,
            isNewUser: true
          } 
        });
      }, 2000);
    } catch (err) {
      console.error('Error during checkout:', err);
      setError(err.message || 'Failed to process your request. Please try again.');
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
              ? 'Your 14-day free trial has been activated. Check your email for login instructions.'
              : `Your ${selectedPlan?.name} plan has been activated. Check your email for login instructions.`
            }
          </p>
        </div>
        <div className="text-center">
          <p className="text-text-muted mb-4">Redirecting you to the confirmation page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 rounded-xl border border-dark-card bg-dark shadow-2xl relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="absolute top-10 right-10 text-xl animate-bounce" style={{animationDuration: '3s'}}>✨</div>
      <div className="absolute bottom-10 left-10 text-xl animate-bounce" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}>✨</div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-full mr-4">
            <FiZap className="w-6 h-6 text-dark" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            {isFreeTrialSelected ? 'Unlock Your Free Trial' : `Subscribe to ${selectedPlan?.name}`}
          </h2>
        </div>
        
        <p className="text-center text-gray-300 mb-8">
          You're just one step away from transforming your social media strategy with AI.
        </p>
        
        {error && (
          <div className="p-4 mb-6 bg-red-900/30 border border-red-700 rounded-lg flex items-start">
            <FiAlertTriangle className="text-red-500 w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
          </div>
        )}
        
        {existingUserStatus?.exists && existingUserStatus.message && !error && (
          <div className="p-4 mb-6 bg-blue-900/30 border border-blue-700 rounded-lg flex items-start">
            <FiInfo className="text-blue-500 w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-blue-400">{existingUserStatus.message}</p>
          </div>
        )}
        
        {!isEmailVerified ? (
          <form onSubmit={handleVerifyEmail} className="space-y-6">
            <div className="transition-all duration-300 transform hover:scale-[1.02]">
              <label htmlFor="email" className="block text-gray-400 mb-2 flex items-center">
                <FiMail className="mr-2 text-primary" /> Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-lighter border-2 border-dark-card focus:border-primary rounded-lg p-3 text-white transition-all duration-300"
                placeholder="name@example.com"
                required
              />
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-dark font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Continue <FiArrowRight className="ml-2" />
                  </span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCheckout} className="space-y-6">
            {!isFreeTrialSelected && (
              <div className="transition-all duration-300 transform hover:scale-[1.02]">
                <label className="block text-gray-400 mb-2 flex items-center">
                  <FiCreditCard className="mr-2 text-secondary" /> Payment information
                </label>
                <div className="p-4 bg-dark-lighter border-2 border-dark-card focus-within:border-secondary rounded-lg">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#FFFFFF',
                          '::placeholder': {
                            color: '#94A3B8',
                          },
                          iconColor: '#2AC4FF',
                        },
                        invalid: {
                          color: '#EF4444',
                        },
                      },
                      hidePostalCode: false, // Show postal code field for address verification
                    }}
                  />
                </div>
              </div>
            )}
            
            <div className="p-6 bg-gradient-to-br from-dark-card to-dark-card/50 rounded-xl border border-dark-card/80 transform transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl text-white flex items-center">
                  {isFreeTrialSelected ? (
                    <>
                      <FiStar className="text-primary mr-2" /> Free Trial (14 Days)
                    </>
                  ) : (
                    <>
                      <FiStar className="text-primary mr-2" /> {selectedPlan?.name} - ${selectedPlan?.price}/mo
                    </>
                  )}
                </h3>
                {!isFreeTrialSelected && (
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold">
                    Best Value
                  </span>
                )}
              </div>
              
              <ul className="space-y-3">
                {(isFreeTrialSelected ? [
                  "Full access to all features",
                  "No credit card required",
                  "Automatic expiration after 14 days"
                ] : selectedPlan?.features).map((feature, index) => (
                  <li 
                    key={index} 
                    className={`flex items-start text-gray-300 transition-all duration-500 transform ${
                      animateFeatures ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="bg-gradient-to-r from-primary to-secondary p-1 rounded-full mr-3 mt-0.5 flex-shrink-0">
                      <FiCheck className="text-dark w-4 h-4" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              {!isFreeTrialSelected && (
                <div className="mt-4 p-3 bg-secondary/10 rounded-lg border border-secondary/30 flex items-center">
                  <FiTrendingUp className="text-secondary w-5 h-5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-300">
                    <span className="font-bold">Pro tip:</span> Users on this plan see an average 3.5x ROI within 30 days!
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex items-center mb-6 p-3 bg-dark-lighter rounded-lg border border-dark-card">
              <FiLock className="text-primary w-5 h-5 mr-3 flex-shrink-0" />
              <p className="text-gray-400 text-sm">
                Your information is secure. We'll create an account for you and send login details to your email.
              </p>
            </div>
            
            <button
              type="submit"
              disabled={loading || (!stripe && !isFreeTrialSelected)}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-dark font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-glow flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  {isFreeTrialSelected ? 'Start Your Free Trial Now' : 'Subscribe & Transform Your Social Media'} <FiArrowRight className="ml-2" />
                </>
              )}
            </button>
            
            <div className="text-center text-gray-500 text-sm">
              By subscribing, you agree to our Terms of Service and Privacy Policy
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-dark-lighter py-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary/5 rounded-full filter blur-3xl animate-pulse" style={{animationDuration: '7s'}}></div>
      </div>
      
      <div className="max-w-4xl mx-auto mb-12 text-center relative z-10">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          One Step to AI-Powered Success
        </h1>
        <p className="text-gray-300 text-xl max-w-2xl mx-auto">
          Join thousands of marketers who have revolutionized their social media strategy with our AI platform.
        </p>
      </div>
      
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
      
      <div className="max-w-4xl mx-auto mt-12 grid grid-cols-3 gap-6 relative z-10">
        <div className="text-center p-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-3">
            <FiZap className="text-primary w-6 h-6" />
          </div>
          <h3 className="font-bold text-white mb-1">Lightning Fast Setup</h3>
          <p className="text-gray-400 text-sm">Be up and running in less than 2 minutes</p>
        </div>
        
        <div className="text-center p-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/20 mb-3">
            <FiStar className="text-secondary w-6 h-6" />
          </div>
          <h3 className="font-bold text-white mb-1">30-Day Guarantee</h3>
          <p className="text-gray-400 text-sm">Love it or get a full refund, no questions asked</p>
        </div>
        
        <div className="text-center p-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-3">
            <FiTrendingUp className="text-primary w-6 h-6" />
          </div>
          <h3 className="font-bold text-white mb-1">3.5x Average ROI</h3>
          <p className="text-gray-400 text-sm">Our customers see real results within 30 days</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
