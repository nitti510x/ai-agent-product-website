import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiPlus, FiEdit2, FiTrash2, FiPause, FiPlay } from 'react-icons/fi';
import PageHeader from '../PageHeader';
import ConfirmationModal from '../content/ConfirmationModal';
import CampaignEditModal from './CampaignEditModal';

// Mock data for campaigns based on the database schema
const mockCampaigns = [
  {
    id: 'camp-001',
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    slack_channel_id: 'C04QWERTY1',
    user_org_id: '550e8400-e29b-41d4-a716-446655440001',
    user_email_id: 'marketing@mediaboltai.co',
    campaign_name: 'Summer Product Launch',
    campaign_start_date: '2025-05-01',
    campaign_end_date: '2025-06-30',
    posting_time_utc: '14:00:00',
    posting_frequency: 'daily',
    text_prompt: 'Create engaging content about our summer product line focusing on benefits and features',
    do_not_generate_image: false,
    image_prompt: 'Modern product photography with summer vibes, bright colors, beach setting',
    post_to_facebook: true,
    post_to_instagram: true,
    post_to_linkedin: true,
    post_to_threads: false,
    post_to_tiktok: false,
    post_to_x: true,
    is_paused: false,
    deleted_at: null,
    created_at: '2025-04-15T09:30:00Z'
  },
  {
    id: 'camp-002',
    uuid: '550e8400-e29b-41d4-a716-446655440002',
    slack_channel_id: 'C04QWERTY2',
    user_org_id: '550e8400-e29b-41d4-a716-446655440001',
    user_email_id: 'marketing@mediaboltai.co',
    campaign_name: 'Weekly Tech Tips',
    campaign_start_date: '2025-04-01',
    campaign_end_date: '2025-12-31',
    posting_time_utc: '16:30:00',
    posting_frequency: 'weekly',
    text_prompt: 'Share useful tech tips and tricks that help users be more productive with our software',
    do_not_generate_image: true,
    image_prompt: '',
    post_to_facebook: false,
    post_to_instagram: false,
    post_to_linkedin: true,
    post_to_threads: false,
    post_to_tiktok: false,
    post_to_x: true,
    is_paused: false,
    deleted_at: null,
    created_at: '2025-03-25T11:15:00Z'
  },
  {
    id: 'camp-003',
    uuid: '550e8400-e29b-41d4-a716-446655440003',
    slack_channel_id: 'C04QWERTY3',
    user_org_id: '550e8400-e29b-41d4-a716-446655440001',
    user_email_id: 'content@mediaboltai.co',
    campaign_name: 'AI Industry News',
    campaign_start_date: '2025-03-15',
    campaign_end_date: '2025-09-15',
    posting_time_utc: '09:00:00',
    posting_frequency: 'twice-weekly',
    text_prompt: 'Share the latest AI industry news and developments with insights on how they impact businesses',
    do_not_generate_image: false,
    image_prompt: 'Futuristic AI visualization, professional, corporate style, blue tones',
    post_to_facebook: true,
    post_to_instagram: false,
    post_to_linkedin: true,
    post_to_threads: true,
    post_to_tiktok: false,
    post_to_x: true,
    is_paused: true,
    deleted_at: null,
    created_at: '2025-03-10T14:45:00Z'
  },
  {
    id: 'camp-004',
    uuid: '550e8400-e29b-41d4-a716-446655440004',
    slack_channel_id: 'C04QWERTY4',
    user_org_id: '550e8400-e29b-41d4-a716-446655440001',
    user_email_id: 'events@mediaboltai.co',
    campaign_name: 'Webinar Promotion',
    campaign_start_date: '2025-05-10',
    campaign_end_date: '2025-05-24',
    posting_time_utc: '11:00:00',
    posting_frequency: 'daily',
    text_prompt: 'Promote our upcoming webinar on AI content strategies with compelling reasons to attend',
    do_not_generate_image: false,
    image_prompt: 'Professional webinar promotional graphics with speaker photos and event details',
    post_to_facebook: true,
    post_to_instagram: true,
    post_to_linkedin: true,
    post_to_threads: true,
    post_to_tiktok: true,
    post_to_x: true,
    is_paused: false,
    deleted_at: null,
    created_at: '2025-04-20T10:00:00Z'
  }
];

const CampaignsContent = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'paused'
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, campaign: null });
  const [pauseConfirmation, setPauseConfirmation] = useState({ isOpen: false, campaign: null, action: '' });
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Simulate API call to fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setCampaigns(mockCampaigns);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter campaigns based on search term and status
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = searchTerm === '' || 
      campaign.campaign_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.text_prompt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && !campaign.is_paused) ||
      (filterStatus === 'paused' && campaign.is_paused);
    
    return matchesSearch && matchesStatus;
  });

  // Handle edit campaign
  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setEditModalOpen(true);
  };

  // Handle save campaign
  const handleSaveCampaign = (campaignData) => {
    if (selectedCampaign) {
      // Update existing campaign
      setCampaigns(prevCampaigns => 
        prevCampaigns.map(item => 
          item.id === campaignData.id ? campaignData : item
        )
      );
      console.log('Campaign updated successfully');
    } else {
      // Add new campaign
      setCampaigns(prevCampaigns => [...prevCampaigns, campaignData]);
      console.log('Campaign created successfully');
    }
    
    setEditModalOpen(false);
    setSelectedCampaign(null);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (campaign) => {
    setDeleteConfirmation({ isOpen: true, campaign });
  };

  // Handle delete campaign
  const handleDeleteCampaign = () => {
    // In a real app, this would make an API call
    setCampaigns(prevCampaigns => 
      prevCampaigns.filter(item => item.id !== deleteConfirmation.campaign.id)
    );
    setDeleteConfirmation({ isOpen: false, campaign: null });
    // Show success message (would use a toast in a real app)
    console.log('Campaign deleted successfully');
  };

  // Handle pause/resume confirmation
  const handlePauseResumeConfirmation = (campaign, action) => {
    setPauseConfirmation({ isOpen: true, campaign, action });
  };

  // Handle pause/resume campaign
  const handlePauseResumeCampaign = () => {
    // In a real app, this would make an API call
    setCampaigns(prevCampaigns => 
      prevCampaigns.map(item => 
        item.id === pauseConfirmation.campaign.id 
          ? { ...item, is_paused: pauseConfirmation.action === 'pause' } 
          : item
      )
    );
    setPauseConfirmation({ isOpen: false, campaign: null, action: '' });
    // Show success message (would use a toast in a real app)
    console.log(`Campaign ${pauseConfirmation.action === 'pause' ? 'paused' : 'resumed'} successfully`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get platforms as an array
  const getPlatforms = (campaign) => {
    const platforms = [];
    if (campaign.post_to_facebook) platforms.push('Facebook');
    if (campaign.post_to_instagram) platforms.push('Instagram');
    if (campaign.post_to_linkedin) platforms.push('LinkedIn');
    if (campaign.post_to_threads) platforms.push('Threads');
    if (campaign.post_to_tiktok) platforms.push('TikTok');
    if (campaign.post_to_x) platforms.push('X');
    return platforms;
  };

  return (
    <div>
      <PageHeader 
        title="Campaigns" 
        description="Manage your automated content campaigns across multiple platforms."
      />
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 bg-[#111418] border border-gray-700/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <select
                className="appearance-none block w-full px-3 py-2 bg-[#111418] border border-gray-700/40 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 pr-8"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Campaigns</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <FiFilter size={16} />
              </div>
            </div>
            
            <button
              className="flex items-center px-4 py-2 bg-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/30 transition-colors"
              onClick={() => handleEditCampaign(null)} // null means new campaign
            >
              <FiPlus className="mr-2" />
              <span>New Campaign</span>
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="bg-[#1A1E23] rounded-xl border border-gray-700/40 p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-400 border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Loading campaigns...</p>
        </div>
      ) : (
        <div className="bg-[#1A1E23] rounded-xl border border-gray-700/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-[#1A1E23] text-gray-400 border-b border-gray-700/40">
                <tr>
                  <th scope="col" className="px-6 py-3">Campaign Name</th>
                  <th scope="col" className="px-6 py-3">Duration</th>
                  <th scope="col" className="px-6 py-3">Frequency</th>
                  <th scope="col" className="px-6 py-3">Platforms</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.length > 0 ? (
                  filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-gray-700/40 bg-[#1A1E23] hover:bg-black/20">
                      <td className="px-6 py-4 font-medium text-white">
                        {campaign.campaign_name}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {formatDate(campaign.campaign_start_date)} - {formatDate(campaign.campaign_end_date)}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {campaign.posting_frequency.charAt(0).toUpperCase() + campaign.posting_frequency.slice(1)} at {campaign.posting_time_utc.substring(0, 5)} UTC
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {getPlatforms(campaign).map((platform, idx) => (
                            <span 
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs border border-gray-600/40 bg-[#1A1E23] text-gray-300"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          campaign.is_paused 
                            ? 'bg-amber-500/20 text-amber-400' 
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {campaign.is_paused ? 'Paused' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditCampaign(campaign)}
                            className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 hover:text-blue-300 transition-colors"
                            title="Edit Campaign"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          
                          <button
                            onClick={() => handlePauseResumeConfirmation(
                              campaign, 
                              campaign.is_paused ? 'resume' : 'pause'
                            )}
                            className={`p-1.5 rounded-lg ${
                              campaign.is_paused 
                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 hover:text-emerald-300' 
                                : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/40 hover:text-amber-300'
                            } transition-colors`}
                            title={campaign.is_paused ? 'Resume Campaign' : 'Pause Campaign'}
                          >
                            {campaign.is_paused ? <FiPlay size={16} /> : <FiPause size={16} />}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteConfirmation(campaign)}
                            className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-300 transition-colors"
                            title="Delete Campaign"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b border-gray-700/40 bg-[#1A1E23]">
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      No campaigns found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, campaign: null })}
        onConfirm={handleDeleteCampaign}
        title="Delete Campaign"
        message="Are you sure you want to delete this campaign? All scheduled posts will be canceled and this action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
      
      {/* Pause/Resume Confirmation Modal */}
      <ConfirmationModal
        isOpen={pauseConfirmation.isOpen}
        onClose={() => setPauseConfirmation({ isOpen: false, campaign: null, action: '' })}
        onConfirm={handlePauseResumeCampaign}
        title={`${pauseConfirmation.action === 'pause' ? 'Pause' : 'Resume'} Campaign`}
        message={
          pauseConfirmation.action === 'pause'
            ? "Are you sure you want to pause this campaign? No new posts will be created until you resume it."
            : "Are you sure you want to resume this campaign? Scheduled posts will start being created again."
        }
        confirmText={pauseConfirmation.action === 'pause' ? 'Pause' : 'Resume'}
        type={pauseConfirmation.action === 'pause' ? 'warning' : 'success'}
      />

      {/* Campaign Edit Modal */}
      <CampaignEditModal
        isOpen={editModalOpen}
        campaign={selectedCampaign}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedCampaign(null);
        }}
        onSave={handleSaveCampaign}
      />
    </div>
  );
};

export default CampaignsContent;
