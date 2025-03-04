import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initializeUserPaymentMethods } from './utils/edgeFunctions'

// Initialize payment methods for test users
initializeUserPaymentMethods();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)