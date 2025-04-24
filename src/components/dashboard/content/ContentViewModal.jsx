import React from 'react';
import { FiX, FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';

const ContentViewModal = ({ content, onClose }) => {
  if (!content) return null;

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#1A1E23] rounded-xl shadow-xl border border-gray-700/40">
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-[#1A1E23] border-b border-gray-700/40">
          <h3 className="text-lg font-medium text-white">Content Details</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-700/40 text-gray-300 hover:bg-gray-600/60 hover:text-white transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Main Content */}
          <div className="mb-6">
            <h4 className="text-sm uppercase text-gray-400 mb-2">Content</h4>
            <p className="text-white text-lg whitespace-pre-wrap">{content.text}</p>
          </div>
          
          {/* Images */}
          {content.images && content.images.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm uppercase text-gray-400 mb-2">Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {content.images.map((image, idx) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`Content image ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Videos */}
          {content.videos && content.videos.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm uppercase text-gray-400 mb-2">Videos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.videos.map((video, idx) => (
                  <div key={idx} className="aspect-video rounded-lg overflow-hidden">
                    <video 
                      src={video} 
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Platforms */}
          {content.platforms && content.platforms.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm uppercase text-gray-400 mb-2">Platforms</h4>
              <div className="flex flex-wrap gap-2">
                {content.platforms.map((platform, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1.5 text-sm rounded-full bg-gray-700/40 text-gray-300"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* URL */}
          {content.url && (
            <div className="mb-6">
              <h4 className="text-sm uppercase text-gray-400 mb-2">URL</h4>
              <a 
                href={content.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline break-all"
              >
                {content.url}
              </a>
            </div>
          )}
          
          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {/* Timestamps */}
            <div className="space-y-3">
              {content.scheduled_at && (
                <div className="flex items-center">
                  <FiCalendar className="mr-2 text-gray-400" />
                  <span className="text-gray-400">Scheduled for:</span>
                  <span className="ml-2 text-white">{formatDate(content.scheduled_at)}</span>
                </div>
              )}
              
              {content.published_at && (
                <div className="flex items-center">
                  <FiCalendar className="mr-2 text-gray-400" />
                  <span className="text-gray-400">Published on:</span>
                  <span className="ml-2 text-white">{formatDate(content.published_at)}</span>
                </div>
              )}
            </div>
            
            {/* User Info */}
            <div className="space-y-3">
              {content.updated_by_agent && (
                <div className="flex items-center">
                  <FiUser className="mr-2 text-gray-400" />
                  <span className="text-gray-400">Created by agent:</span>
                  <span className="ml-2 text-white">{content.updated_by_agent}</span>
                </div>
              )}
              
              {content.updated_by_user && (
                <div className="flex items-center">
                  <FiUser className="mr-2 text-gray-400" />
                  <span className="text-gray-400">Created by user:</span>
                  <span className="ml-2 text-white">{content.updated_by_user}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentViewModal;
