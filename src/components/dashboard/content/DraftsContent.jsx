import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiEdit2, FiPlus } from 'react-icons/fi';
import ContentTable from './ContentTable';
import ContentViewModal from './ContentViewModal';
import ConfirmationModal from './ConfirmationModal';
import PageHeader from '../PageHeader';

// Mock data for draft content
const mockDraftContent = [
  {
    id: 'draft-001',
    text: "Working on a new blog post about how AI is transforming content creation in 2025. We'll cover the latest tools, techniques, and best practices. #AIContent #ContentStrategy",
    images: ['https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YWklMjBjb250ZW50fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60'],
    videos: [],
    platforms: ['LinkedIn', 'Twitter', 'Facebook', 'YouTube'],
    status: 'draft',
    updated_at: '2025-04-23T14:30:00Z',
    updated_by_agent: 'Content Writer Agent',
    updated_by_user: 'marketing@geniusos.co'
  },
  {
    id: 'draft-002',
    text: 'Sneak peek of our upcoming AI feature that will revolutionize how you create and manage social media campaigns! Stay tuned for the official announcement next week.',
    images: ['https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHNuZWFrJTIwcGVla3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'],
    videos: [],
    platforms: ['Instagram', 'Twitter', 'YouTube'],
    status: 'draft',
    updated_at: '2025-04-22T10:15:00Z',
    updated_by_agent: 'Social Media Manager Agent',
    updated_by_user: 'product@geniusos.co'
  },
  {
    id: 'draft-003',
    text: "We're excited to announce our partnership with TechCorp to bring advanced AI solutions to their marketing team. This collaboration will help them scale their content production by 5x while maintaining brand consistency.",
    images: ['https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Y29ycG9yYXRlJTIwcGFydG5lcnNoaXB8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60'],
    videos: [],
    platforms: ['LinkedIn', 'Facebook', 'YouTube'],
    status: 'draft',
    updated_at: '2025-04-21T16:45:00Z',
    updated_by_agent: 'Content Writer Agent',
    updated_by_user: 'partnerships@geniusos.co'
  },
  {
    id: 'draft-004',
    text: 'Join us for a live demo of our AI content generation platform next Thursday at 2 PM EST. See how our tool can create engaging content for multiple platforms in seconds!',
    images: ['https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8d2ViaW5hcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'],
    videos: [],
    platforms: ['Twitter', 'LinkedIn', 'Facebook', 'YouTube'],
    status: 'draft',
    updated_at: '2025-04-20T09:30:00Z',
    updated_by_agent: 'Campaign Manager Agent',
    updated_by_user: 'events@geniusos.co'
  }
];

const DraftsContent = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');
  const [viewContent, setViewContent] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, content: null });

  // Simulate API call to fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setContent(mockDraftContent);
      } catch (error) {
        console.error('Error fetching draft content:', error);
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
        title="Draft Posts" 
        description="Create and refine your content ideas before scheduling or submitting them for approval."
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
              placeholder="Search drafts..."
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
              <span>New Draft</span>
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="bg-[#1A1E23] rounded-xl border border-gray-700/40 p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-400 border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Loading draft content...</p>
        </div>
      ) : (
        <div className="bg-[#1A1E23] rounded-xl border border-gray-700/40 overflow-hidden">
          <ContentTable 
            data={filteredContent}
            contentType="drafts"
            onView={handleViewContent}
            onEdit={handleEditContent}
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
        title="Delete Draft Content"
        message="Are you sure you want to delete this draft? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default DraftsContent;
