import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiPlus } from 'react-icons/fi';
import ContentTable from './ContentTable';
import ContentViewModal from './ContentViewModal';
import ConfirmationModal from './ConfirmationModal';
import PageHeader from '../PageHeader';

// Mock data for published content
const mockPublishedContent = [
  {
    id: 'pub-001',
    text: 'Excited to announce our new AI-powered content generation platform! Create engaging content for all your social media channels in seconds. #AIContent #ContentCreation',
    images: ['https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YWklMjBjb250ZW50fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60'],
    videos: [],
    platforms: ['LinkedIn', 'Twitter', 'Facebook'],
    published_at: '2025-04-20T10:30:00Z',
    published_by: 'marketing@geniusos.co'
  },
  {
    id: 'pub-002',
    text: 'Check out our latest case study: How Company X increased their social media engagement by 300% using our AI tools. Read more at geniusos.co/case-studies',
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2FzZSUyMHN0dWR5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60'],
    videos: [],
    platforms: ['LinkedIn', 'Facebook', 'YouTube'],
    published_at: '2025-04-18T14:15:00Z',
    published_by: 'marketing@geniusos.co'
  },
  {
    id: 'pub-003',
    text: 'Our AI can now generate content in 12 different languages! Expand your global reach with GeniusOS. #AITranslation #GlobalMarketing',
    images: [],
    videos: ['https://example.com/videos/ai-translation-demo.mp4'],
    platforms: ['Twitter', 'Instagram', 'YouTube'],
    published_at: '2025-04-15T09:45:00Z',
    published_by: 'marketing@geniusos.co'
  },
  {
    id: 'pub-004',
    text: 'Join our webinar next Tuesday to learn how to leverage AI for your content strategy. Register now at geniusos.co/webinar',
    images: ['https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8d2ViaW5hcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'],
    videos: [],
    platforms: ['LinkedIn', 'Facebook', 'Twitter', 'YouTube'],
    published_at: '2025-04-12T11:00:00Z',
    published_by: 'events@geniusos.co'
  }
];

const PublishedContent = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');
  const [viewContent, setViewContent] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, content: null });
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  // Simulate API call to fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setContent(mockPublishedContent);
      } catch (error) {
        console.error('Error fetching published content:', error);
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
      <PageHeader title="Published Posts" />
      
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
          <p className="mt-4 text-gray-400">Loading published content...</p>
        </div>
      ) : (
        <div className="bg-[#1A1E23] rounded-xl border border-gray-700/40 overflow-hidden">
          <ContentTable 
            data={filteredContent}
            contentType="published"
            onView={handleViewContent}
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
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, content: null })}
        onConfirm={handleDeleteContent}
        title="Delete Published Content"
        message="Are you sure you want to delete this published content? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default PublishedContent;
