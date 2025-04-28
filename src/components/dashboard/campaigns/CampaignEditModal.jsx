import React, { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiClock, FiRepeat, FiMessageSquare, FiImage, FiShare2 } from 'react-icons/fi';
import { 
  RiLinkedinFill, 
  RiTwitterXFill, 
  RiFacebookFill, 
  RiInstagramFill, 
  RiTiktokFill, 
  RiThreadsFill 
} from 'react-icons/ri';

const CampaignEditModal = ({ isOpen, campaign, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    campaign_name: '',
    campaign_start_date: '',
    campaign_end_date: '',
    posting_time_utc: '',
    posting_frequency: 'daily',
    text_prompt: '',
    do_not_generate_image: false,
    image_prompt: '',
    post_to_facebook: false,
    post_to_instagram: false,
    post_to_linkedin: false,
    post_to_threads: false,
    post_to_tiktok: false,
    post_to_x: false,
  });

  // Initialize form with campaign data if editing
  useEffect(() => {
    if (campaign) {
      setFormData({
        campaign_name: campaign.campaign_name || '',
        campaign_start_date: campaign.campaign_start_date || '',
        campaign_end_date: campaign.campaign_end_date || '',
        posting_time_utc: campaign.posting_time_utc ? campaign.posting_time_utc.substring(0, 5) : '',
        posting_frequency: campaign.posting_frequency || 'daily',
        text_prompt: campaign.text_prompt || '',
        do_not_generate_image: campaign.do_not_generate_image || false,
        image_prompt: campaign.image_prompt || '',
        post_to_facebook: campaign.post_to_facebook || false,
        post_to_instagram: campaign.post_to_instagram || false,
        post_to_linkedin: campaign.post_to_linkedin || false,
        post_to_threads: campaign.post_to_threads || false,
        post_to_tiktok: campaign.post_to_tiktok || false,
        post_to_x: campaign.post_to_x || false,
      });
    } else {
      // Default values for new campaign
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      
      setFormData({
        campaign_name: '',
        campaign_start_date: formatDateForInput(tomorrow),
        campaign_end_date: formatDateForInput(endDate),
        posting_time_utc: '09:00',
        posting_frequency: 'daily',
        text_prompt: '',
        do_not_generate_image: false,
        image_prompt: '',
        post_to_facebook: false,
        post_to_instagram: false,
        post_to_linkedin: true, // Default to LinkedIn
        post_to_threads: false,
        post_to_tiktok: false,
        post_to_x: true, // Default to X
      });
    }
  }, [campaign]);

  // Format date for input field
  const formatDateForInput = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.campaign_name || !formData.campaign_start_date || !formData.campaign_end_date || 
        !formData.posting_time_utc || !formData.posting_frequency || !formData.text_prompt) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Check if at least one platform is selected
    if (!formData.post_to_facebook && !formData.post_to_instagram && !formData.post_to_linkedin && 
        !formData.post_to_threads && !formData.post_to_tiktok && !formData.post_to_x) {
      alert('Please select at least one platform');
      return;
    }
    
    // Check if image prompt is provided when image generation is enabled
    if (!formData.do_not_generate_image && !formData.image_prompt) {
      alert('Please provide an image prompt or disable image generation');
      return;
    }
    
    // Save campaign
    onSave({
      ...formData,
      id: campaign ? campaign.id : `camp-${Date.now()}`,
      uuid: campaign ? campaign.uuid : crypto.randomUUID(),
      slack_channel_id: campaign ? campaign.slack_channel_id : `C04QWERTY${Math.floor(Math.random() * 1000)}`,
      user_org_id: campaign ? campaign.user_org_id : '550e8400-e29b-41d4-a716-446655440001',
      user_email_id: campaign ? campaign.user_email_id : 'marketing@mediaboltai.co',
      posting_time_utc: `${formData.posting_time_utc}:00`,
      is_paused: campaign ? campaign.is_paused : false,
      deleted_at: null,
      created_at: campaign ? campaign.created_at : new Date().toISOString()
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-[#1A1E23] rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-700/40">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700/40">
            <h3 className="text-xl font-medium text-white">
              {campaign ? 'Edit Campaign' : 'Create New Campaign'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Campaign Name */}
              <div className="col-span-2">
                <label htmlFor="campaign_name" className="block text-sm font-medium text-gray-300 mb-1">
                  Campaign Name*
                </label>
                <input
                  type="text"
                  id="campaign_name"
                  name="campaign_name"
                  value={formData.campaign_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#111418] border border-gray-700/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g. Summer Product Launch"
                  required
                />
              </div>

              {/* Campaign Duration */}
              <div>
                <label htmlFor="campaign_start_date" className="block text-sm font-medium text-gray-300 mb-1">
                  <FiCalendar className="inline mr-1" /> Start Date*
                </label>
                <input
                  type="date"
                  id="campaign_start_date"
                  name="campaign_start_date"
                  value={formData.campaign_start_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#111418] border border-gray-700/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="campaign_end_date" className="block text-sm font-medium text-gray-300 mb-1">
                  <FiCalendar className="inline mr-1" /> End Date*
                </label>
                <input
                  type="date"
                  id="campaign_end_date"
                  name="campaign_end_date"
                  value={formData.campaign_end_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#111418] border border-gray-700/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              {/* Posting Schedule */}
              <div>
                <label htmlFor="posting_frequency" className="block text-sm font-medium text-gray-300 mb-1">
                  <FiRepeat className="inline mr-1" /> Posting Frequency*
                </label>
                <select
                  id="posting_frequency"
                  name="posting_frequency"
                  value={formData.posting_frequency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#111418] border border-gray-700/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="twice-weekly">Twice Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label htmlFor="posting_time_utc" className="block text-sm font-medium text-gray-300 mb-1">
                  <FiClock className="inline mr-1" /> Posting Time (UTC)*
                </label>
                <input
                  type="time"
                  id="posting_time_utc"
                  name="posting_time_utc"
                  value={formData.posting_time_utc}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#111418] border border-gray-700/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              {/* Content Generation */}
              <div className="col-span-2">
                <label htmlFor="text_prompt" className="block text-sm font-medium text-gray-300 mb-1">
                  <FiMessageSquare className="inline mr-1" /> Text Prompt*
                </label>
                <textarea
                  id="text_prompt"
                  name="text_prompt"
                  value={formData.text_prompt}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 bg-[#111418] border border-gray-700/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Describe what kind of content you want to generate..."
                  required
                ></textarea>
              </div>

              {/* Image Generation */}
              <div className="col-span-2">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="do_not_generate_image"
                    name="do_not_generate_image"
                    checked={formData.do_not_generate_image}
                    onChange={handleChange}
                    className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-gray-600 rounded bg-gray-700"
                  />
                  <label htmlFor="do_not_generate_image" className="ml-2 block text-sm text-gray-300">
                    Do not generate images for this campaign
                  </label>
                </div>

                {!formData.do_not_generate_image && (
                  <div>
                    <label htmlFor="image_prompt" className="block text-sm font-medium text-gray-300 mb-1">
                      <FiImage className="inline mr-1" /> Image Prompt*
                    </label>
                    <textarea
                      id="image_prompt"
                      name="image_prompt"
                      value={formData.image_prompt}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-3 py-2 bg-[#111418] border border-gray-700/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Describe the images you want to generate..."
                      required={!formData.do_not_generate_image}
                    ></textarea>
                  </div>
                )}
              </div>

              {/* Platform Selection */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FiShare2 className="inline mr-1" /> Platforms*
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-700/40 bg-[#111418]">
                    <input
                      type="checkbox"
                      id="post_to_linkedin"
                      name="post_to_linkedin"
                      checked={formData.post_to_linkedin}
                      onChange={handleChange}
                      className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-gray-600 rounded bg-gray-700"
                    />
                    <label htmlFor="post_to_linkedin" className="flex items-center text-sm text-gray-300">
                      <RiLinkedinFill className="mr-1" /> LinkedIn
                    </label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-700/40 bg-[#111418]">
                    <input
                      type="checkbox"
                      id="post_to_x"
                      name="post_to_x"
                      checked={formData.post_to_x}
                      onChange={handleChange}
                      className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-gray-600 rounded bg-gray-700"
                    />
                    <label htmlFor="post_to_x" className="flex items-center text-sm text-gray-300">
                      <RiTwitterXFill className="mr-1" /> X (Twitter)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-700/40 bg-[#111418]">
                    <input
                      type="checkbox"
                      id="post_to_facebook"
                      name="post_to_facebook"
                      checked={formData.post_to_facebook}
                      onChange={handleChange}
                      className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-gray-600 rounded bg-gray-700"
                    />
                    <label htmlFor="post_to_facebook" className="flex items-center text-sm text-gray-300">
                      <RiFacebookFill className="mr-1" /> Facebook
                    </label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-700/40 bg-[#111418]">
                    <input
                      type="checkbox"
                      id="post_to_instagram"
                      name="post_to_instagram"
                      checked={formData.post_to_instagram}
                      onChange={handleChange}
                      className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-gray-600 rounded bg-gray-700"
                    />
                    <label htmlFor="post_to_instagram" className="flex items-center text-sm text-gray-300">
                      <RiInstagramFill className="mr-1" /> Instagram
                    </label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-700/40 bg-[#111418]">
                    <input
                      type="checkbox"
                      id="post_to_threads"
                      name="post_to_threads"
                      checked={formData.post_to_threads}
                      onChange={handleChange}
                      className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-gray-600 rounded bg-gray-700"
                    />
                    <label htmlFor="post_to_threads" className="flex items-center text-sm text-gray-300">
                      <RiThreadsFill className="mr-1" /> Threads
                    </label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-700/40 bg-[#111418]">
                    <input
                      type="checkbox"
                      id="post_to_tiktok"
                      name="post_to_tiktok"
                      checked={formData.post_to_tiktok}
                      onChange={handleChange}
                      className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-gray-600 rounded bg-gray-700"
                    />
                    <label htmlFor="post_to_tiktok" className="flex items-center text-sm text-gray-300">
                      <RiTiktokFill className="mr-1" /> TikTok
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 border-t border-gray-700/40 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700/40 rounded-lg text-gray-300 hover:bg-gray-600/60 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/30 transition-colors"
              >
                {campaign ? 'Update Campaign' : 'Create Campaign'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CampaignEditModal;
