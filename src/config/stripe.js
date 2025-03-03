import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
// In production, this should be an environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_test_key');

export default stripePromise;
