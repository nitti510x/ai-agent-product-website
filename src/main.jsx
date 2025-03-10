import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initializeUserPaymentMethods } from './utils/edgeFunctions'

// Initialize payment methods for test users with error handling
try {
  initializeUserPaymentMethods();
} catch (error) {
  console.error('Error initializing payment methods:', error);
  // Continue with app initialization even if this fails
}

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
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)