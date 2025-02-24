import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SimpleLogin from './components/auth/SimpleLogin';
import ChatBot from './components/chat/ChatBot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SimpleLogin />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
      <ChatBot />
    </Router>
  );
}

export default App;