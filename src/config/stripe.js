import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
// Only load Stripe in secure contexts or explicitly in development
const loadStripeInstance = () => {
  // Check if we're in a secure context (HTTPS) or in development
  const isDevelopment = import.meta.env.MODE === 'development';
  const isSecureContext = window.location.protocol === 'https:';
  
  // Only load Stripe in secure contexts or explicitly in development
  if (isSecureContext || isDevelopment) {
    return loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_test_key');
  }
  
  console.warn('Stripe is only loaded in secure contexts (HTTPS) or development environments');
  return null;
};

const stripePromise = typeof window !== 'undefined' ? loadStripeInstance() : null;

export default stripePromise;
