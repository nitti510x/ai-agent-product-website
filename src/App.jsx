import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CustomAuth from './components/auth/CustomAuth';
import UpdatePassword from './components/auth/UpdatePassword';
import ChatBot from './components/chat/ChatBot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<CustomAuth />} />
        <Route path="/auth">
          <Route path="sign-in" element={<CustomAuth />} />
          <Route path="sign-up" element={<CustomAuth />} />
          <Route path="forgot-password" element={<CustomAuth />} />
          <Route path="update-password" element={<UpdatePassword />} />
          <Route path="reset-password" element={<UpdatePassword />} />
        </Route>
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
      <ChatBot />
    </Router>
  );
}

export default App;