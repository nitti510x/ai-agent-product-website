import React, { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabase';
import { FiSave, FiAlertCircle, FiBriefcase, FiPenTool, FiTarget, FiCheckCircle, FiGlobe, FiTag, FiMessageSquare, FiAward, FiUsers, FiPackage, FiLayers } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';

function OrganizationProfile() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [organization, setOrganization] = useState({
    org_name: '',
    org_slogan: '',
    org_industry: '',
    org_location: '',
    org_website_url: '',
    org_brand_values: '',
    org_brand_voice: '',
    org_brand_messaging: '',
    org_target_audience: '',
    org_primary_services: '',
    org_secondary_services: '',
  });

  useEffect(() => {
    getOrganizationProfile();
  }, []);

  const getOrganizationProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user logged in');
      
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setOrganization({
          org_name: data.org_name || '',
          org_slogan: data.org_slogan || '',
          org_industry: data.org_industry || '',
          org_location: data.org_location || '',
          org_website_url: data.org_website_url || '',
          org_brand_values: data.org_brand_values || '',
          org_brand_voice: data.org_brand_voice || '',
          org_brand_messaging: data.org_brand_messaging || '',
          org_target_audience: data.org_target_audience || '',
          org_primary_services: data.org_primary_services || '',
          org_secondary_services: data.org_secondary_services || '',
        });
      }
    } catch (error) {
      console.error('Error fetching organization profile:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load organization profile. Please try again later.'
      });
    }
  };

  const updateOrganizationProfile = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user logged in');
      
      const { error } = await supabase
        .from('organizations')
        .update({
          org_name: organization.org_name,
          org_slogan: organization.org_slogan,
          org_industry: organization.org_industry,
          org_location: organization.org_location,
          org_website_url: organization.org_website_url,
          org_brand_values: organization.org_brand_values,
          org_brand_voice: organization.org_brand_voice,
          org_brand_messaging: organization.org_brand_messaging,
          org_target_audience: organization.org_target_audience,
          org_primary_services: organization.org_primary_services,
          org_secondary_services: organization.org_secondary_services,
          updated_at: new Date(),
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setMessage({
        type: 'success',
        text: 'Organization profile updated successfully!'
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Error updating organization profile:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update organization profile. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrganization(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateOrganizationProfile();
  };

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Organization Profile</h1>
          <p className="text-gray-400 mt-1">Manage your organization's details and branding information</p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <FiSave className="mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Message display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-xl flex items-start ${message.type === 'error' ? 'bg-red-900/30 text-red-200 border border-red-700' : 'bg-emerald-900/30 text-emerald-200 border border-emerald-700'}`}>
          <div className="mr-3 mt-0.5">
            <FiAlertCircle className={message.type === 'error' ? 'text-red-400' : 'text-emerald-400'} />
          </div>
          <div>
            <p>{message.text}</p>
          </div>
        </div>
      )}

      <div className="bg-[#1d2127] rounded-2xl shadow-2xl border border-gray-800/30 p-6">
        <div className="space-y-6">
          <form onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                {/* Organization Name */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_name">
                    Organization Name
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiBriefcase className="text-emerald-400" />
                    </div>
                    <input
                      type="text"
                      className="pl-10 w-full bg-transparent border-2 border-[#2f3946] focus:border-[#2AC4FF] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_name"
                      name="org_name"
                      value={organization.org_name}
                      onChange={handleChange}
                      placeholder="Your organization's name"
                    />
                  </div>
                </div>

                {/* Organization Slogan */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_slogan">
                    Slogan/Tagline
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiTag className="text-emerald-400" />
                    </div>
                    <input
                      type="text"
                      className="pl-10 w-full bg-transparent border-2 border-[#2f3946] focus:border-[#2AC4FF] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_slogan"
                      name="org_slogan"
                      value={organization.org_slogan}
                      onChange={handleChange}
                      placeholder="Your organization's slogan or tagline"
                    />
                  </div>
                </div>

                {/* Industry */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_industry">
                    Industry
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPenTool className="text-emerald-400" />
                    </div>
                    <input
                      type="text"
                      className="pl-10 w-full bg-transparent border-2 border-[#2f3946] focus:border-[#2AC4FF] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_industry"
                      name="org_industry"
                      value={organization.org_industry}
                      onChange={handleChange}
                      placeholder="e.g., Technology, Healthcare, Education"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_location">
                    Location
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiGlobe className="text-emerald-400" />
                    </div>
                    <input
                      type="text"
                      className="pl-10 w-full bg-transparent border-2 border-[#2f3946] focus:border-[#2AC4FF] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_location"
                      name="org_location"
                      value={organization.org_location}
                      onChange={handleChange}
                      placeholder="City, State, Country"
                    />
                  </div>
                </div>

                {/* Website URL */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_website_url">
                    Website URL
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiGlobe className="text-emerald-400" />
                    </div>
                    <input
                      type="url"
                      className="pl-10 w-full bg-transparent border-2 border-[#2f3946] focus:border-[#2AC4FF] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_website_url"
                      name="org_website_url"
                      value={organization.org_website_url}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
                </div>
              </div>
            </div>

            {/* Brand Identity Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Brand Identity</h3>
              <div className="space-y-6">
                {/* Brand Values */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_brand_values">
                    Brand Values
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiAward className="text-emerald-400" />
                    </div>
                    <textarea
                      className="pl-10 w-full bg-transparent border-2 border-[#2f3946] focus:border-[#2AC4FF] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_brand_values"
                      name="org_brand_values"
                      value={organization.org_brand_values}
                      onChange={handleChange}
                      rows="3"
                      placeholder="What values does your brand stand for? (e.g., Innovation, Sustainability, Inclusivity)"
                    ></textarea>
                  </div>
                </div>

                {/* Brand Voice */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_brand_voice">
                    Brand Voice
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMessageSquare className="text-emerald-400" />
                    </div>
                    <textarea
                      className="pl-10 w-full bg-transparent border-2 border-[#2f3946] focus:border-[#2AC4FF] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_brand_voice"
                      name="org_brand_voice"
                      value={organization.org_brand_voice}
                      onChange={handleChange}
                      rows="3"
                      placeholder="How would you describe your brand's tone? (e.g., Professional, Friendly, Authoritative)"
                    ></textarea>
                  </div>
                </div>

                {/* Brand Messaging */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_brand_messaging">
                    Brand Messaging
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiTarget className="text-emerald-400" />
                    </div>
                    <textarea
                      className="pl-10 w-full bg-transparent border-2 border-[#2f3946] focus:border-[#2AC4FF] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_brand_messaging"
                      name="org_brand_messaging"
                      value={organization.org_brand_messaging}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Key messages your brand communicates (e.g., We make technology accessible to everyone)"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Market & Services Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Market & Services</h3>
              <div className="space-y-6">
                {/* Target Audience */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_target_audience">
                    Target Audience
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUsers className="text-emerald-400" />
                    </div>
                    <textarea
                      className="pl-10 w-full bg-transparent border-2 border-[#2f3946] focus:border-[#2AC4FF] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_target_audience"
                      name="org_target_audience"
                      value={organization.org_target_audience}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Who is your target audience? (e.g., Small businesses, Enterprise companies, Consumers aged 25-45)"
                    ></textarea>
                  </div>
                </div>
                
                {/* Primary Services */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_primary_services">
                    Primary Services/Products
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPackage className="text-emerald-400" />
                    </div>
                    <textarea
                      className="pl-10 w-full bg-transparent border-2 border-[#2f3946] focus:border-[#2AC4FF] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_primary_services"
                      name="org_primary_services"
                      value={organization.org_primary_services}
                      onChange={handleChange}
                      rows="3"
                      placeholder="What are your main services or products?"
                    ></textarea>
                  </div>
                </div>
                
                {/* Secondary Services */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_secondary_services">
                    Secondary Services/Products
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLayers className="text-emerald-400" />
                    </div>
                    <textarea
                      className="pl-10 w-full bg-transparent border-2 border-[#2f3946] focus:border-[#2AC4FF] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_secondary_services"
                      name="org_secondary_services"
                      value={organization.org_secondary_services}
                      onChange={handleChange}
                      rows="3"
                      placeholder="What additional services or products do you offer?"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </form>
          
          {/* Credits */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center text-gray-500 text-xs">
              <FaRobot className="mr-1 text-emerald-400" />
              <span>Powered by geniusOS</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrganizationProfile;
