import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Create a global storage access safety wrapper
if (typeof window !== 'undefined') {
  // Safely handle storage access errors
  const originalGetItem = Storage.prototype.getItem;
  const originalSetItem = Storage.prototype.setItem;
  const originalRemoveItem = Storage.prototype.removeItem;

  Storage.prototype.getItem = function(key) {
    try {
      return originalGetItem.call(this, key);
    } catch (e) {
      console.warn('Storage access error prevented:', e);
      return null;
    }
  };

  Storage.prototype.setItem = function(key, value) {
    try {
      return originalSetItem.call(this, key, value);
    } catch (e) {
      console.warn('Storage write error prevented:', e);
    }
  };

  Storage.prototype.removeItem = function(key) {
    try {
      return originalRemoveItem.call(this, key);
    } catch (e) {
      console.warn('Storage remove error prevented:', e);
    }
  };
  
  // Check if the current path requires authentication
  const requiresAuth = () => {
    const path = window.location.pathname;
    return path.startsWith('/dashboard') || 
           path.startsWith('/auth/callback') || 
           path === '/login' ||
           path.startsWith('/checkout');
  };
  
  // Only initialize payment methods if we're on an authenticated route
  if (requiresAuth()) {
    // Dynamically import to avoid loading on landing page
    import('./utils/edgeFunctions.js').then(module => {
      try {
        // Initialize payment methods only when needed
        module.initializeUserPaymentMethods().catch(error => {
          console.error('Error initializing payment methods:', error);
        });
      } catch (error) {
        console.error('Error importing payment methods module:', error);
      }
    }).catch(error => {
      console.error('Error dynamically importing edge functions:', error);
    });
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)