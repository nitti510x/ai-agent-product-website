import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AuthUI from './components/auth/Auth';
import RedirectHandler from './components/auth/RedirectHandler';
import EnhancedAuth from './components/auth/EnhancedAuth';
import EnhancedUpdatePassword from './components/auth/EnhancedUpdatePassword';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { NotificationProvider } from './contexts/NotificationContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import ChatBot from './components/chat/ChatBot';
import CheckoutPage from './components/checkout/CheckoutPage';
import CheckoutSuccess from './components/checkout/CheckoutSuccess';
import './styles/auth-animations.css';

function App() {
  return (
    <SubscriptionProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout-success" element={<CheckoutSuccess />} />
            <Route path="/login" element={<EnhancedAuth />} />
            <Route path="/auth">
              <Route path="sign-in" element={<EnhancedAuth />} />
              <Route path="sign-up" element={<EnhancedAuth />} />
              <Route path="forgot-password" element={<EnhancedAuth />} />
              <Route path="update-password" element={<EnhancedUpdatePassword />} />
              <Route path="reset-password" element={<EnhancedUpdatePassword />} />
            </Route>
            <Route path="/auth/callback" element={<RedirectHandler />} />
            {/* We're temporarily allowing direct access to the dashboard for debugging */}
            <Route 
              path="/dashboard/*" 
              element={<Dashboard />} 
            />
          </Routes>
          <ChatBot />
        </Router>
      </NotificationProvider>
    </SubscriptionProvider>
  );
}

export default App;