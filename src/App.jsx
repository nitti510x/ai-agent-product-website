import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AuthUI from './components/auth/Auth';
import UpdatePassword from './components/auth/UpdatePassword';
import RedirectHandler from './components/auth/RedirectHandler';
import ChatBot from './components/chat/ChatBot';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import CheckoutPage from './components/checkout/CheckoutPage';
import CheckoutSuccess from './components/checkout/CheckoutSuccess';

function App() {
  return (
    <SubscriptionProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/login" element={<AuthUI />} />
          <Route path="/auth">
            <Route path="sign-in" element={<AuthUI />} />
            <Route path="sign-up" element={<AuthUI />} />
            <Route path="forgot-password" element={<AuthUI />} />
            <Route path="update-password" element={<UpdatePassword />} />
            <Route path="reset-password" element={<UpdatePassword />} />
          </Route>
          <Route path="/auth/callback" element={<RedirectHandler />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
        <ChatBot />
      </Router>
    </SubscriptionProvider>
  );
}

export default App;