import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiPlus, FiEye, FiCheck, FiX } from 'react-icons/fi';
import ContentTable from './ContentTable';
import ContentViewModal from './ContentViewModal';
import ConfirmationModal from './ConfirmationModal';
import PageHeader from '../PageHeader';

// Mock data for content awaiting approval
export const mockAwaitingContent = [
  {
    id: 'await-001',
    text: 'Our AI-powered content generation platform now supports 5 new languages! Expand your global reach with content in French, German, Spanish, Italian, and Portuguese. #AIContent #GlobalMarketing',
    images: ['https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Z2xvYmFsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60'],
    videos: [],
    platforms: ['Twitter', 'LinkedIn', 'Facebook', 'YouTube'],
    status: 'awaiting_approval',
    updated_at: '2025-04-24T08:30:00Z',
    updated_by_agent: 'Content Writer Agent',
    updated_by_user: 'marketing@geniusos.co'
  },
  {
    id: 'await-002',
    text: 'Join our free webinar next Thursday at 2 PM EST to learn how AI can transform your content marketing strategy. Reserve your spot now at geniusos.co/webinar',
    images: ['https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHdlYmluYXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60'],
    videos: [],
    platforms: ['LinkedIn', 'Facebook', 'YouTube'],
    status: 'awaiting_approval',
    updated_at: '2025-04-24T10:15:00Z',
    updated_by_agent: 'Campaign Manager Agent',
    updated_by_user: 'events@geniusos.co'
  },
  {
    id: 'await-003',
    text: 'We\'ve just released a major update to our AI image generation tool! Now you can create stunning visuals with better resolution, more style options, and improved prompt understanding. Try it today! #AIArt #DesignTools',
    images: [
      'https://images.unsplash.com/photo-1617791160505-6f00504e3519?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWklMjBhcnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YWklMjBhcnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60'
    ],
    videos: [],
    platforms: ['Instagram', 'Twitter', 'YouTube'],
    status: 'awaiting_approval',
    updated_at: '2025-04-24T11:45:00Z',
    updated_by_agent: 'Image Generator Agent',
    updated_by_user: 'product@geniusos.co'
  },
  {
    id: 'await-004',
    text: 'Looking for a better way to manage your social media content? GeniusOS helps you create, schedule, and analyze your posts across all platforms from one dashboard. Start your free trial today!',
    images: ['https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c29jaWFsJTIwbWVkaWF8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60'],
    videos: [],
    platforms: ['Facebook', 'LinkedIn', 'YouTube'],
    status: 'awaiting_approval',
    updated_at: '2025-04-24T13:20:00Z',
    updated_by_agent: 'Social Media Manager Agent',
    updated_by_user: 'marketing@geniusos.co'
  }
];

const AwaitingApprovalContent = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');
  const [viewContent, setViewContent] = useState(null);
  const [approveConfirmation, setApproveConfirmation] = useState({ isOpen: false, content: null });
  const [rejectConfirmation, setRejectConfirmation] = useState({ isOpen: false, content: null });

  // Simulate API call to fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setContent(mockAwaitingContent);
      } catch (error) {
        console.error('Error fetching content awaiting approval:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter content based on search term and platform
  const filteredContent = content.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = filterPlatform === '' || 
      (item.platforms && item.platforms.some(p => p.toLowerCase() === filterPlatform.toLowerCase()));
    
    return matchesSearch && matchesPlatform;
  });

  // Handle view content
  const handleViewContent = (content) => {
    setViewContent(content);
  };

  // Handle approve confirmation
  const handleApproveConfirmation = (content) => {
    setApproveConfirmation({ isOpen: true, content });
  };

  // Handle approve content
  const handleApproveContent = () => {
    // In a real app, this would make an API call to approve the content
    setContent(prevContent => prevContent.filter(item => item.id !== approveConfirmation.content.id));
    setApproveConfirmation({ isOpen: false, content: null });
    // Show success message (would use a toast in a real app)
    console.log('Content approved successfully');
  };

  // Handle reject confirmation
  const handleRejectConfirmation = (content) => {
    setRejectConfirmation({ isOpen: true, content });
  };

  // Handle reject content
  const handleRejectContent = () => {
    // In a real app, this would make an API call to reject the content
    setContent(prevContent => prevContent.filter(item => item.id !== rejectConfirmation.content.id));
    setRejectConfirmation({ isOpen: false, content: null });
    // Show success message (would use a toast in a real app)
    console.log('Content rejected successfully');
  };

  // Get unique platforms for filter
  const platforms = [...new Set(content.flatMap(item => item.platforms || []))];

  // Custom action buttons for awaiting approval content
  const renderActionButtons = (item) => (
    <div className="flex justify-end space-x-2">
      <button
        onClick={() => handleViewContent(item)}
        className="p-1.5 rounded-lg bg-gray-700/40 text-gray-300 hover:bg-gray-600/60 hover:text-white transition-colors"
        title="View"
      >
        <FiEye size={16} />
      </button>
      
      <button
        onClick={() => handleApproveConfirmation(item)}
        className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 hover:text-emerald-300 transition-colors"
        title="Approve"
      >
        <FiCheck size={16} />
      </button>
      
      <button
        onClick={() => handleRejectConfirmation(item)}
        className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-300 transition-colors"
        title="Reject"
      >
        <FiX size={16} />
      </button>
    </div>
  );

  return (
    <div>
      <PageHeader 
        title="Awaiting Approval" 
        description="Review and moderate AI-generated content before it goes live across your social media channels."
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
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <select
                className="appearance-none block w-full px-3 py-2 bg-[#111418] border border-gray-700/40 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 pr-8"
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
              >
                <option value="">All Platforms</option>
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <FiFilter size={16} />
              </div>
            </div>
            
            <button
              className="flex items-center px-4 py-2 bg-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/30 transition-colors"
            >
              <FiPlus className="mr-2" />
              <span>Create New</span>
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="bg-[#1A1E23] rounded-xl border border-gray-700/40 p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-400 border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Loading content awaiting approval...</p>
        </div>
      ) : (
        <div className="bg-[#1A1E23] rounded-xl border border-gray-700/40 overflow-hidden">
          <ContentTable 
            data={filteredContent}
            contentType="awaiting"
            onView={handleViewContent}
            onEdit={() => {}}
            onDelete={handleRejectConfirmation}
            onCancel={handleApproveConfirmation}
            customActions={renderActionButtons}
          />
        </div>
      )}
      
      {/* Content View Modal */}
      {viewContent && (
        <ContentViewModal 
          content={viewContent} 
          onClose={() => setViewContent(null)} 
        />
      )}
      
      {/* Approve Confirmation Modal */}
      <ConfirmationModal
        isOpen={approveConfirmation.isOpen}
        onClose={() => setApproveConfirmation({ isOpen: false, content: null })}
        onConfirm={handleApproveContent}
        title="Approve Content"
        message="Are you sure you want to approve this content? It will be scheduled or published according to its settings."
        confirmText="Approve"
        type="info"
      />
      
      {/* Reject Confirmation Modal */}
      <ConfirmationModal
        isOpen={rejectConfirmation.isOpen}
        onClose={() => setRejectConfirmation({ isOpen: false, content: null })}
        onConfirm={handleRejectContent}
        title="Reject Content"
        message="Are you sure you want to reject this content? It will be moved back to drafts for revision."
        confirmText="Reject"
        type="warning"
      />
    </div>
  );
};

export default AwaitingApprovalContent;
