import React, { useState } from 'react';
import { FiEye, FiEdit2, FiTrash2, FiClock, FiCalendar, FiX, FiExternalLink } from 'react-icons/fi';
import { format } from 'date-fns';
import { 
  RiLinkedinFill, 
  RiTwitterXFill, 
  RiFacebookFill, 
  RiInstagramFill, 
  RiYoutubeFill, 
  RiTiktokFill, 
  RiThreadsFill, 
  RiPinterestFill 
} from 'react-icons/ri';

const ContentTable = ({ 
  data, 
  contentType, // 'published', 'drafts', 'scheduled', or 'awaiting'
  onView, 
  onEdit, 
  onDelete, 
  onCancel,
  customActions
}) => {
  const [sortField, setSortField] = useState('text');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Function to truncate text
  const truncateText = (text, maxLength = 60) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  // Function to get platform badge color
  const getPlatformBadgeClass = (platform) => {
    // Use a consistent style for all platforms
    return 'border border-gray-600/40 bg-[#1A1E23] text-gray-300';
  };

  // Function to get platform icon
  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <RiLinkedinFill className="mr-1 text-gray-300" />;
      case 'twitter':
        return <RiTwitterXFill className="mr-1 text-white" />;
      case 'facebook':
        return <RiFacebookFill className="mr-1 text-gray-300" />;
      case 'instagram':
        return <RiInstagramFill className="mr-1 text-gray-300" />;
      case 'youtube':
        return <RiYoutubeFill className="mr-1 text-gray-300" />;
      case 'tiktok':
        return <RiTiktokFill className="mr-1 text-gray-300" />;
      case 'threads':
        return <RiThreadsFill className="mr-1 text-gray-300" />;
      case 'pinterest':
        return <RiPinterestFill className="mr-1 text-gray-300" />;
      default:
        return null;
    }
  };

  // Function to get mock platform link
  const getPlatformLink = (platform, contentId) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return `https://linkedin.com/post/${contentId}`;
      case 'twitter':
        return `https://twitter.com/status/${contentId}`;
      case 'facebook':
        return `https://facebook.com/post/${contentId}`;
      case 'instagram':
        return `https://instagram.com/p/${contentId}`;
      case 'youtube':
        return `https://youtube.com/watch?v=${contentId}`;
      case 'tiktok':
        return `https://tiktok.com/@geniusos/video/${contentId}`;
      case 'threads':
        return `https://threads.net/p/${contentId}`;
      case 'pinterest':
        return `https://pinterest.com/pin/${contentId}`;
      default:
        return '#';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-[#1A1E23] text-gray-400 border-b border-gray-700/40">
          <tr>
            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('text')}>
              Content
              {sortField === 'text' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
            <th scope="col" className="px-6 py-3">
              Platforms
            </th>
            {contentType === 'scheduled' && (
              <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('scheduled_at')}>
                Scheduled For
                {sortField === 'scheduled_at' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            )}
            {contentType === 'published' && (
              <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('published_at')}>
                Published On
                {sortField === 'published_at' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            )}
            {contentType === 'published' && (
              <th scope="col" className="px-6 py-3">
                Links
              </th>
            )}
            {(contentType === 'drafts' || contentType === 'awaiting') && (
              <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('updated_at')}>
                Last Updated
                {sortField === 'updated_at' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            )}
            <th scope="col" className="px-6 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((item) => (
              <tr 
                key={item.id} 
                className="border-b border-gray-700/40 bg-[#1A1E23] hover:bg-[#1E2329]"
              >
                <td className="px-6 py-4">
                  <div className="flex items-start">
                    {item.images && item.images.length > 0 && (
                      <div className="mr-3 flex-shrink-0">
                        <img 
                          src={item.images[0]} 
                          alt="Content thumbnail" 
                          className="w-12 h-12 rounded-md object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-white">{truncateText(item.text)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {item.platforms && item.platforms.map((platform, idx) => (
                      <span 
                        key={idx} 
                        className={`px-2.5 py-1 text-xs rounded-full flex items-center ${getPlatformBadgeClass(platform)}`}
                      >
                        {getPlatformIcon(platform)}
                        {platform}
                      </span>
                    ))}
                  </div>
                </td>
                {contentType === 'scheduled' && (
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2 text-gray-400" />
                      <span className="text-gray-300">{formatDate(item.scheduled_at)}</span>
                    </div>
                  </td>
                )}
                {contentType === 'published' && (
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2 text-gray-400" />
                      <span className="text-gray-300">{formatDate(item.published_at)}</span>
                    </div>
                  </td>
                )}
                {contentType === 'published' && (
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {item.platforms && item.platforms.map((platform, idx) => (
                        <a 
                          key={idx}
                          href={getPlatformLink(platform, item.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs hover:opacity-80 transition-all ${getPlatformBadgeClass(platform)}`}
                        >
                          {getPlatformIcon(platform)}
                          <FiExternalLink className="ml-1" size={12} />
                        </a>
                      ))}
                    </div>
                  </td>
                )}
                {(contentType === 'drafts' || contentType === 'awaiting') && (
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FiClock className="mr-2 text-gray-400" />
                      <span className="text-gray-300">{formatDate(item.updated_at)}</span>
                    </div>
                  </td>
                )}
                <td className="px-6 py-4 text-right">
                  {customActions ? (
                    customActions(item)
                  ) : (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onView(item)}
                        className="p-1.5 rounded-lg bg-gray-700/40 text-gray-300 hover:bg-gray-600/60 hover:text-white transition-colors"
                        title="View"
                      >
                        <FiEye size={16} />
                      </button>
                      
                      {contentType !== 'published' && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 hover:text-blue-300 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                      )}
                      
                      {contentType === 'scheduled' && (
                        <button
                          onClick={() => onCancel(item)}
                          className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/40 hover:text-amber-300 transition-colors"
                          title="Cancel"
                        >
                          <FiX size={16} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-300 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr className="border-b border-gray-700/40 bg-[#1A1E23]">
              <td colSpan={contentType === 'published' ? 5 : (contentType === 'scheduled' || contentType === 'drafts' || contentType === 'awaiting' ? 4 : 3)} className="px-6 py-8 text-center text-gray-400">
                No content found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ContentTable;
