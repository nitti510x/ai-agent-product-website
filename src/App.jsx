import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AuthUI from './components/auth/Auth';
import EnhancedAuth from './components/auth/EnhancedAuth';
import UpdatePassword from './components/auth/UpdatePassword';
import EnhancedUpdatePassword from './components/auth/EnhancedUpdatePassword';
import RedirectHandler from './components/auth/RedirectHandler';
import ChatBot from './components/chat/ChatBot';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { NotificationProvider } from './contexts/NotificationContext';
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
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Routes>
          <ChatBot />
        </Router>
      </NotificationProvider>
    </SubscriptionProvider>
  );
}

export default App;