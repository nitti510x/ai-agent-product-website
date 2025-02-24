import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SimpleLogin() {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('AIforce2025!');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demo purposes, just navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="bg-dark-lighter p-8 rounded-xl shadow-xl w-full max-w-md relative overflow-hidden">
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl -z-10"></div>
        <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          Welcome to IntellAgents
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark border border-dark-card rounded-lg px-4 py-2 text-gray-100 focus:border-primary focus:outline-none"
              placeholder="demo@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark border border-dark-card rounded-lg px-4 py-2 text-gray-100 focus:border-primary focus:outline-none"
              placeholder="AIforce2025!"
              required
            />
            <div className="mt-2 text-xs text-gray-400">
              Password requirements:
              <ul className="list-disc pl-10 space-y-1 mt-1">
                <li>At least 8 characters long</li>
                <li>Contains uppercase and lowercase letters</li>
                <li>Contains numbers</li>
                <li>Contains special characters</li>
              </ul>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover px-6 py-2 rounded-lg transition-colors text-dark font-semibold hover:shadow-glow"
          >
            Sign In
          </button>
          <p className="text-sm text-gray-400 text-center mt-4">
            Use the pre-filled credentials for testing
          </p>
        </form>
      </div>
    </div>
  );
}

export default SimpleLogin;