import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiSave, FiArrowLeft, FiCreditCard } from 'react-icons/fi';

function Profile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'Demo User',
    email: 'demo@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div>
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-400 hover:text-primary transition-colors mr-4"
        >
          <FiArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-100">Profile Settings</h1>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-dark-lighter p-6 rounded-xl border border-dark-card">
          <h2 className="text-xl font-bold text-gray-100 mb-6">Basic Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-dark border border-dark-card rounded-lg pl-10 pr-4 py-2 text-gray-100 focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-dark border border-dark-card rounded-lg pl-10 pr-4 py-2 text-gray-100 focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center w-full bg-primary hover:bg-primary-hover text-dark font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-glow"
            >
              <FiSave className="mr-2" />
              Save Changes
            </button>
          </form>
        </div>

        {/* Password Change */}
        <div className="bg-dark-lighter p-6 rounded-xl border border-dark-card">
          <h2 className="text-xl font-bold text-gray-100 mb-6">Change Password</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Current Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full bg-dark border border-dark-card rounded-lg pl-10 pr-4 py-2 text-gray-100 focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                New Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full bg-dark border border-dark-card rounded-lg pl-10 pr-4 py-2 text-gray-100 focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-dark border border-dark-card rounded-lg pl-10 pr-4 py-2 text-gray-100 focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center w-full bg-primary hover:bg-primary-hover text-dark font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-glow"
            >
              <FiSave className="mr-2" />
              Update Password
            </button>
          </form>
        </div>
      </div>

      {/* Subscription Management Link */}
      <div className="mt-8">
        <Link
          to="/dashboard/subscription"
          className="flex items-center text-gray-400 hover:text-secondary transition-colors"
        >
          <FiCreditCard className="mr-2" />
          Manage Subscription
        </Link>
      </div>
    </div>
  );
}

export default Profile;
