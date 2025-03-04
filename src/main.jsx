import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initializeUserPaymentMethods } from './utils/edgeFunctions'

// Initialize payment methods for test users with error handling
try {
  initializeUserPaymentMethods();
} catch (error) {
  console.error('Error initializing payment methods:', error);
  // Continue with app initialization even if this fails
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)