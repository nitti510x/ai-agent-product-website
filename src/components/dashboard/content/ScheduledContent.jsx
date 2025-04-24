import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiPlus } from 'react-icons/fi';
import ContentTable from './ContentTable';
import ContentViewModal from './ContentViewModal';
import ConfirmationModal from './ConfirmationModal';
import PageHeader from '../PageHeader';

// Mock data for scheduled content
const mockScheduledContent = [
  {
    id: 'sched-001',
    text: "We're thrilled to announce our upcoming webinar: 'Mastering AI-Powered Content Creation' on May 15th at 2 PM EST. Learn how to leverage our platform to create engaging content across all your channels. Register now at geniusos.co/webinar",
    images: ['https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8d2ViaW5hcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'],
    videos: [],
    platforms: ['LinkedIn', 'Twitter', 'Facebook', 'YouTube'],
    status: 'scheduled',
    scheduled_at: '2025-05-01T14:00:00Z',
    scheduled_by: 'events@geniusos.co'
  },
  {
    id: 'sched-002',
    text: "New blog post: '10 Ways AI is Transforming Content Marketing in 2025'. Discover how leading brands are leveraging AI to create more engaging content and drive better results. Read now at geniusos.co/blog",
    images: ['https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YmxvZyUyMHBvc3R8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60'],
    videos: [],
    platforms: ['Twitter', 'LinkedIn', 'YouTube'],
    status: 'scheduled',
    scheduled_at: '2025-04-30T10:30:00Z',
    scheduled_by: 'marketing@geniusos.co'
  },
  {
    id: 'sched-003',
    text: "Introducing our new AI-powered image generation feature! Create stunning visuals for your social media posts with just a text prompt. Watch our demo video to see how it works.",
    images: ['https://images.unsplash.com/photo-1617791160505-6f00504e3519?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWklMjBhcnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60'],
    videos: ['https://example.com/videos/image-generator-demo.mp4'],
    platforms: ['Instagram', 'Facebook', 'YouTube'],
    status: 'scheduled',
    scheduled_at: '2025-04-28T13:15:00Z',
    scheduled_by: 'product@geniusos.co'
  },
  {
    id: 'sched-004',
    text: "Case study: How TechCorp increased their social media engagement by 250% using GeniusOS. Learn their strategy and see how you can apply it to your business.",
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2FzZSUyMHN0dWR5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60'],
    videos: [],
    platforms: ['LinkedIn', 'Twitter', 'Facebook', 'YouTube'],
    status: 'scheduled',
    scheduled_at: '2025-04-26T09:00:00Z',
    scheduled_by: 'marketing@geniusos.co'
  }
];

const ScheduledContent = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');
  const [viewContent, setViewContent] = useState(null);
  const [cancelConfirmation, setCancelConfirmation] = useState({ isOpen: false, content: null });
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, content: null });

  // Simulate API call to fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setContent(mockScheduledContent);
      } catch (error) {
        console.error('Error fetching scheduled content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter content based on search term and platform
  const filteredContent = content.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.rag_text_prompt && item.rag_text_prompt.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPlatform = filterPlatform === '' || 
      (item.platforms && item.platforms.some(p => p.toLowerCase() === filterPlatform.toLowerCase()));
    
    return matchesSearch && matchesPlatform;
  });

  // Handle view content
  const handleViewContent = (content) => {
    setViewContent(content);
  };

  // Handle edit content
  const handleEditContent = (content) => {
    // In a real app, this would navigate to an edit page or open an edit modal
    console.log('Edit content:', content);
    alert('Edit functionality will be implemented with the backend API');
  };

  // Handle cancel confirmation
  const handleCancelConfirmation = (content) => {
    setCancelConfirmation({ isOpen: true, content });
  };

  // Handle cancel scheduled content
  const handleCancelScheduled = () => {
    // In a real app, this would make an API call to cancel the scheduled post
    // and move it back to drafts
    const cancelledItem = cancelConfirmation.content;
    
    // Remove from scheduled content
    setContent(prevContent => prevContent.filter(item => item.id !== cancelledItem.id));
    setCancelConfirmation({ isOpen: false, content: null });
    
    // Show success message (would use a toast in a real app)
    console.log('Scheduled content cancelled and moved to drafts');
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (content) => {
    setDeleteConfirmation({ isOpen: true, content });
  };

  // Handle delete content
  const handleDeleteContent = () => {
    // In a real app, this would make an API call
    setContent(prevContent => prevContent.filter(item => item.id !== deleteConfirmation.content.id));
    setDeleteConfirmation({ isOpen: false, content: null });
    // Show success message (would use a toast in a real app)
    console.log('Content deleted successfully');
  };

  // Get unique platforms for filter
  const platforms = [...new Set(content.flatMap(item => item.platforms || []))];

  return (
    <div>
      <PageHeader 
        title="Scheduled Posts" 
        description="Manage your upcoming content calendar and optimize posting times for maximum audience engagement."
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
              placeholder="Search scheduled content..."
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
              <span>Schedule New</span>
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="bg-[#1A1E23] rounded-xl border border-gray-700/40 p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-400 border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Loading scheduled content...</p>
        </div>
      ) : (
        <div className="bg-[#1A1E23] rounded-xl border border-gray-700/40 overflow-hidden">
          <ContentTable 
            data={filteredContent}
            contentType="scheduled"
            onView={handleViewContent}
            onEdit={handleEditContent}
            onCancel={handleCancelConfirmation}
            onDelete={handleDeleteConfirmation}
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
      
      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={cancelConfirmation.isOpen}
        onClose={() => setCancelConfirmation({ isOpen: false, content: null })}
        onConfirm={handleCancelScheduled}
        title="Cancel Scheduled Post"
        message="Are you sure you want to cancel this scheduled post? It will be moved back to drafts."
        confirmText="Cancel Post"
        type="warning"
      />
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, content: null })}
        onConfirm={handleDeleteContent}
        title="Delete Scheduled Content"
        message="Are you sure you want to delete this scheduled content? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default ScheduledContent;
