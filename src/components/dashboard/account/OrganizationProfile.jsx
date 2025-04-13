import React, { useState, useEffect } from 'react';
import { FiSave, FiAlertCircle, FiBriefcase, FiPenTool, FiTarget, FiCheckCircle, FiGlobe, FiTag, FiMessageSquare, FiAward, FiUsers, FiPackage, FiLayers } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';

function OrganizationProfile() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [organization, setOrganization] = useState({
    org_name: '',
    org_slogan: '',
    org_industry_niche: '',
    org_location: '',
    org_website_url: '',
    org_email: '',
    org_phone: '',
    org_hashtags: '',
    org_post_cta: '',
    org_core_brand_values: '',
    org_mission_statement: '',
    org_unique_selling_prop: '',
    org_brand_voice: '',
    org_target_audience: '',
    org_primary_services: '',
    org_top_selling: '',
    org_brand_colors: '',
  });

  useEffect(() => {
    getOrganizationProfile();
  }, []);

  const getOrganizationProfile = async () => {
    try {
      // Get the organization ID - for now using a hardcoded ID
      const organizationId = 'a1ff3780-5716-49ef-86f6-720c925041b0';
      
      // Call the local API endpoint
      const response = await fetch(`http://127.0.0.1:49615/organizations/${organizationId}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load organization profile: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data) {
        setOrganization({
          org_name: data.org_name || '',
          org_slogan: data.org_slogan || '',
          org_industry_niche: data.org_industry_niche || '',
          org_location: data.org_location || '',
          org_website_url: data.org_website_url || '',
          org_email: data.org_email || '',
          org_phone: data.org_phone || '',
          org_hashtags: data.org_hashtags || '',
          org_post_cta: data.org_post_cta || '',
          org_core_brand_values: data.org_core_brand_values || '',
          org_mission_statement: data.org_mission_statement || '',
          org_unique_selling_prop: data.org_unique_selling_prop || '',
          org_brand_voice: data.org_brand_voice || '',
          org_target_audience: data.org_target_audience || '',
          org_primary_services: data.org_primary_services || '',
          org_top_selling: data.org_top_selling || '',
          org_brand_colors: data.org_brand_colors || '',
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
      
      // Get the organization ID - for now using a hardcoded ID
      const organizationId = 'a1ff3780-5716-49ef-86f6-720c925041b0';
      
      // Call the local API endpoint
      const response = await fetch(`http://127.0.0.1:49615/organizations/${organizationId}`, {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          org_name: organization.org_name,
          org_slogan: organization.org_slogan,
          org_industry_niche: organization.org_industry_niche,
          org_location: organization.org_location,
          org_website_url: organization.org_website_url,
          org_email: organization.org_email,
          org_phone: organization.org_phone,
          org_hashtags: organization.org_hashtags,
          org_post_cta: organization.org_post_cta,
          org_core_brand_values: organization.org_core_brand_values,
          org_mission_statement: organization.org_mission_statement,
          org_unique_selling_prop: organization.org_unique_selling_prop,
          org_brand_voice: organization.org_brand_voice,
          org_target_audience: organization.org_target_audience,
          org_primary_services: organization.org_primary_services,
          org_top_selling: organization.org_top_selling,
          org_brand_colors: organization.org_brand_colors,
          updated_at: new Date(),
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update organization profile: ${response.status} ${response.statusText}`);
      }
      
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
          <h2 className="text-xl font-bold text-white">Organization Profile</h2>
          <p className="text-gray-400 mt-1">Manage your organization's details and branding information</p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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

      <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-gray-800/30 p-6">
        <div className="space-y-6">
          <form onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Organization Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_name">
                    Organization Name
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiBriefcase className="text-emerald-400" />
                    </div>
                    <input
                      type="text"
                      className="pl-10 w-full bg-[#1E2228] border-2 border-[#2f3946] focus:border-emerald-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_name"
                      name="org_name"
                      value={organization.org_name}
                      onChange={handleChange}
                      placeholder="Your organization's name"
                    />
                  </div>
                </div>

                {/* Organization Slogan */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_slogan">
                    Slogan/Tagline
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiTag className="text-emerald-400" />
                    </div>
                    <input
                      type="text"
                      className="pl-10 w-full bg-[#1E2228] border-2 border-[#2f3946] focus:border-emerald-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_slogan"
                      name="org_slogan"
                      value={organization.org_slogan}
                      onChange={handleChange}
                      placeholder="Your organization's slogan or tagline"
                    />
                  </div>
                </div>

                {/* Industry Niche */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_industry_niche">
                    Industry
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPenTool className="text-emerald-400" />
                    </div>
                    <input
                      type="text"
                      className="pl-10 w-full bg-[#1E2228] border-2 border-[#2f3946] focus:border-emerald-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_industry_niche"
                      name="org_industry_niche"
                      value={organization.org_industry_niche}
                      onChange={handleChange}
                      placeholder="e.g., IT and Business Process Outsourcing (BPO)"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_location">
                    Location
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiGlobe className="text-emerald-400" />
                    </div>
                    <input
                      type="text"
                      className="pl-10 w-full bg-[#1E2228] border-2 border-[#2f3946] focus:border-emerald-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_location"
                      name="org_location"
                      value={organization.org_location}
                      onChange={handleChange}
                      placeholder="City, State, Country"
                    />
                  </div>
                </div>

                {/* Website URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_website_url">
                    Website URL
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiGlobe className="text-emerald-400" />
                    </div>
                    <input
                      type="url"
                      className="pl-10 w-full bg-[#1E2228] border-2 border-[#2f3946] focus:border-emerald-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_website_url"
                      name="org_website_url"
                      value={organization.org_website_url}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_email">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMessageSquare className="text-emerald-400" />
                    </div>
                    <input
                      type="email"
                      className="pl-10 w-full bg-[#1E2228] border-2 border-[#2f3946] focus:border-emerald-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_email"
                      name="org_email"
                      value={organization.org_email}
                      onChange={handleChange}
                      placeholder="yourorganization@email.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_phone">
                    Phone
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMessageSquare className="text-emerald-400" />
                    </div>
                    <input
                      type="tel"
                      className="pl-10 w-full bg-[#1E2228] border-2 border-[#2f3946] focus:border-emerald-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_phone"
                      name="org_phone"
                      value={organization.org_phone}
                      onChange={handleChange}
                      placeholder="+1 (123) 456-7890"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Identity Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Brand Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Core Brand Values */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_core_brand_values">
                    Core Brand Values
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiAward className="text-emerald-400" />
                    </div>
                    <textarea
                      className="pl-10 w-full bg-[#1E2228] border-2 border-[#2f3946] focus:border-emerald-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_core_brand_values"
                      name="org_core_brand_values"
                      value={organization.org_core_brand_values}
                      onChange={handleChange}
                      rows="3"
                      placeholder="What are the core values of your brand?"
                    ></textarea>
                  </div>
                </div>

                {/* Brand Voice */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_brand_voice">
                    Brand Voice
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMessageSquare className="text-emerald-400" />
                    </div>
                    <textarea
                      className="pl-10 w-full bg-[#1E2228] border-2 border-[#2f3946] focus:border-emerald-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_brand_voice"
                      name="org_brand_voice"
                      value={organization.org_brand_voice}
                      onChange={handleChange}
                      rows="3"
                      placeholder="How would you describe your brand's tone? (e.g., Professional, Friendly, Authoritative)"
                    ></textarea>
                  </div>
                </div>

                {/* Mission Statement */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_mission_statement">
                    Mission Statement
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiTarget className="text-emerald-400" />
                    </div>
                    <textarea
                      className="pl-10 w-full bg-[#1E2228] border-2 border-[#2f3946] focus:border-emerald-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_mission_statement"
                      name="org_mission_statement"
                      value={organization.org_mission_statement}
                      onChange={handleChange}
                      rows="3"
                      placeholder="What is your organization's mission?"
                    ></textarea>
                  </div>
                </div>

                {/* Unique Selling Proposition */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_unique_selling_prop">
                    Unique Selling Proposition
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiTarget className="text-emerald-400" />
                    </div>
                    <textarea
                      className="pl-10 w-full bg-[#1E2228] border-2 border-[#2f3946] focus:border-emerald-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_unique_selling_prop"
                      name="org_unique_selling_prop"
                      value={organization.org_unique_selling_prop}
                      onChange={handleChange}
                      rows="3"
                      placeholder="What sets your organization apart from others?"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Market & Services Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Market & Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_target_audience">
                    Target Audience
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUsers className="text-emerald-400" />
                    </div>
                    <textarea
                      className="pl-10 w-full bg-[#1E2228] border-2 border-[#2f3946] focus:border-emerald-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
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
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_primary_services">
                    Primary Services/Products
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPackage className="text-emerald-400" />
                    </div>
                    <textarea
                      className="pl-10 w-full bg-[#1E2228] border-2 border-[#2f3946] focus:border-emerald-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_primary_services"
                      name="org_primary_services"
                      value={organization.org_primary_services}
                      onChange={handleChange}
                      rows="3"
                      placeholder="What are your main services or products?"
                    ></textarea>
                  </div>
                </div>

                {/* Top Selling */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_top_selling">
                    Top Selling
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLayers className="text-emerald-400" />
                    </div>
                    <textarea
                      className="pl-10 w-full bg-[#1E2228] border-2 border-[#2f3946] focus:border-emerald-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_top_selling"
                      name="org_top_selling"
                      value={organization.org_top_selling}
                      onChange={handleChange}
                      rows="3"
                      placeholder="What are your top selling services or products?"
                    ></textarea>
                  </div>
                </div>

                {/* Hashtags */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_hashtags">
                    Hashtags
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiTag className="text-emerald-400" />
                    </div>
                    <textarea
                      className="pl-10 w-full bg-[#1E2228] border-2 border-[#2f3946] focus:border-emerald-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_hashtags"
                      name="org_hashtags"
                      value={organization.org_hashtags}
                      onChange={handleChange}
                      rows="3"
                      placeholder="What hashtags does your organization use?"
                    ></textarea>
                  </div>
                </div>

                {/* Post CTA */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_post_cta">
                    Post CTA
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiTarget className="text-emerald-400" />
                    </div>
                    <textarea
                      className="pl-10 w-full bg-[#1E2228] border-2 border-[#2f3946] focus:border-emerald-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_post_cta"
                      name="org_post_cta"
                      value={organization.org_post_cta}
                      onChange={handleChange}
                      rows="3"
                      placeholder="What is the call-to-action for your posts?"
                    ></textarea>
                  </div>
                </div>

                {/* Brand Colors */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="org_brand_colors">
                    Brand Colors
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <FiTag className="text-emerald-400" />
                    </div>
                    <textarea
                      className="pl-10 w-full bg-[#1E2228] border-2 border-[#2f3946] focus:border-emerald-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300"
                      id="org_brand_colors"
                      name="org_brand_colors"
                      value={organization.org_brand_colors}
                      onChange={handleChange}
                      rows="3"
                      placeholder="What are your organization's brand colors?"
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
