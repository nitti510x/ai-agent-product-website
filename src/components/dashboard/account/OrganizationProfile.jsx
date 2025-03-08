import React, { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabase';
import { FiSave, FiAlertCircle } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';

function OrganizationProfile() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [organization, setOrganization] = useState({
    org_name: '',
    org_slogan: '',
    org_industry_niche: '',
    org_location: '',
    org_website_url: '',
    org_core_brand_values: '',
    org_mission_statement: '',
    org_unique_selling_prop: '',
    org_target_audience: '',
    org_primary_services: '',
    org_secondary_services: '',
    org_brand_colors: ''
  });

  // Fetch organization data on component mount
  useEffect(() => {
    fetchOrganizationData();
  }, []);

  const fetchOrganizationData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Get organization data for the current user
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
        throw error;
      }
      
      if (data) {
        setOrganization(data);
      }
      
    } catch (error) {
      console.error('Error fetching organization data:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load organization data. Please try again later.'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Check if organization record exists
      const { data: existingOrg, error: checkError } = await supabase
        .from('organizations')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      let result;
      
      if (existingOrg) {
        // Update existing record
        result = await supabase
          .from('organizations')
          .update(organization)
          .eq('id', existingOrg.id);
      } else {
        // Insert new record
        result = await supabase
          .from('organizations')
          .insert({
            ...organization,
            user_id: user.id
          });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      setMessage({
        type: 'success',
        text: 'Organization profile updated successfully!'
      });
      
    } catch (error) {
      console.error('Error saving organization data:', error);
      setMessage({
        type: 'error',
        text: 'Failed to save organization data. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Organization Profile</h1>
        <p className="text-gray-400 mt-1">Manage your organization's details and branding information</p>
      </div>
      
      <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Profile Details</h2>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 text-sm font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : (
            <>
              <FiSave className="mr-2" />
              Save Profile
            </>
          )}
        </button>
      </div>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.type === 'error' ? 'bg-red-900/20 text-red-500' : 'bg-green-900/20 text-green-500'
        }`}>
          <FiAlertCircle className="mr-2" />
          <span>{message.text}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Organization Name */}
          <div>
            <label className="block text-gray-200 font-medium mb-2" htmlFor="org_name">
              Organization Name *
            </label>
            <input
              id="org_name"
              name="org_name"
              type="text"
              value={organization.org_name}
              onChange={handleChange}
              required
              className="w-full bg-[#1a1a22] border border-gray-800 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 placeholder-gray-500"
              placeholder="Your organization name"
            />
          </div>
          
          {/* Organization Slogan */}
          <div>
            <label className="block text-gray-200 font-medium mb-2" htmlFor="org_slogan">
              Slogan / Tagline
            </label>
            <input
              id="org_slogan"
              name="org_slogan"
              type="text"
              value={organization.org_slogan}
              onChange={handleChange}
              className="w-full bg-[#1a1a22] border border-gray-800 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 placeholder-gray-500"
              placeholder="Your organization's slogan or tagline"
            />
          </div>
          
          {/* Industry/Niche */}
          <div>
            <label className="block text-gray-200 font-medium mb-2" htmlFor="org_industry_niche">
              Industry / Niche *
            </label>
            <input
              id="org_industry_niche"
              name="org_industry_niche"
              type="text"
              value={organization.org_industry_niche}
              onChange={handleChange}
              required
              className="w-full bg-[#1a1a22] border border-gray-800 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 placeholder-gray-500"
              placeholder="e.g., Technology, Healthcare, Education"
            />
          </div>
          
          {/* Location */}
          <div>
            <label className="block text-gray-200 font-medium mb-2" htmlFor="org_location">
              Location
            </label>
            <input
              id="org_location"
              name="org_location"
              type="text"
              value={organization.org_location}
              onChange={handleChange}
              className="w-full bg-[#1a1a22] border border-gray-800 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 placeholder-gray-500"
              placeholder="City, State, Country"
            />
          </div>
          
          {/* Website URL */}
          <div>
            <label className="block text-gray-200 font-medium mb-2" htmlFor="org_website_url">
              Website URL
            </label>
            <input
              id="org_website_url"
              name="org_website_url"
              type="url"
              value={organization.org_website_url}
              onChange={handleChange}
              className="w-full bg-[#1a1a22] border border-gray-800 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 placeholder-gray-500"
              placeholder="https://example.com"
            />
          </div>
          
          {/* Brand Colors */}
          <div>
            <label className="block text-gray-200 font-medium mb-2" htmlFor="org_brand_colors">
              Brand Colors
            </label>
            <input
              id="org_brand_colors"
              name="org_brand_colors"
              type="text"
              value={organization.org_brand_colors}
              onChange={handleChange}
              className="w-full bg-[#1a1a22] border border-gray-800 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 placeholder-gray-500"
              placeholder="e.g., #FF5733, #33FF57, #5733FF"
            />
          </div>
        </div>
        
        {/* Full width fields */}
        <div className="mt-6 space-y-6">
          {/* Core Brand Values */}
          <div>
            <label className="block text-gray-200 font-medium mb-2" htmlFor="org_core_brand_values">
              Core Brand Values
            </label>
            <textarea
              id="org_core_brand_values"
              name="org_core_brand_values"
              value={organization.org_core_brand_values}
              onChange={handleChange}
              rows="3"
              className="w-full bg-[#1a1a22] border border-gray-800 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 placeholder-gray-500"
              placeholder="What are your organization's core values? (e.g., Innovation, Sustainability, Customer-first)"
            ></textarea>
          </div>
          
          {/* Mission Statement */}
          <div>
            <label className="block text-gray-200 font-medium mb-2" htmlFor="org_mission_statement">
              Mission Statement
            </label>
            <textarea
              id="org_mission_statement"
              name="org_mission_statement"
              value={organization.org_mission_statement}
              onChange={handleChange}
              rows="3"
              className="w-full bg-[#1a1a22] border border-gray-800 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 placeholder-gray-500"
              placeholder="What is your organization's mission?"
            ></textarea>
          </div>
          
          {/* Unique Selling Proposition */}
          <div>
            <label className="block text-gray-200 font-medium mb-2" htmlFor="org_unique_selling_prop">
              Unique Selling Proposition
            </label>
            <textarea
              id="org_unique_selling_prop"
              name="org_unique_selling_prop"
              value={organization.org_unique_selling_prop}
              onChange={handleChange}
              rows="3"
              className="w-full bg-[#1a1a22] border border-gray-800 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 placeholder-gray-500"
              placeholder="What makes your organization unique?"
            ></textarea>
          </div>
          
          {/* Target Audience */}
          <div>
            <label className="block text-gray-200 font-medium mb-2" htmlFor="org_target_audience">
              Target Audience
            </label>
            <textarea
              id="org_target_audience"
              name="org_target_audience"
              value={organization.org_target_audience}
              onChange={handleChange}
              rows="3"
              className="w-full bg-[#1a1a22] border border-gray-800 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 placeholder-gray-500"
              placeholder="Who is your target audience? (e.g., Small businesses, Enterprise companies, Consumers aged 25-45)"
            ></textarea>
          </div>
          
          {/* Primary Services */}
          <div>
            <label className="block text-gray-200 font-medium mb-2" htmlFor="org_primary_services">
              Primary Services/Products
            </label>
            <textarea
              id="org_primary_services"
              name="org_primary_services"
              value={organization.org_primary_services}
              onChange={handleChange}
              rows="3"
              className="w-full bg-[#1a1a22] border border-gray-800 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 placeholder-gray-500"
              placeholder="What are your main services or products?"
            ></textarea>
          </div>
          
          {/* Secondary Services */}
          <div>
            <label className="block text-gray-200 font-medium mb-2" htmlFor="org_secondary_services">
              Secondary Services/Products
            </label>
            <textarea
              id="org_secondary_services"
              name="org_secondary_services"
              value={organization.org_secondary_services}
              onChange={handleChange}
              rows="3"
              className="w-full bg-[#1a1a22] border border-gray-800 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 placeholder-gray-500"
              placeholder="What additional services or products do you offer?"
            ></textarea>
          </div>
        </div>
        
        {/* Save button moved to the top */}
      </form>
    </div>
    </>
  );
}

export default OrganizationProfile;
