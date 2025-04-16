import React, { useState, useEffect } from 'react';
import { useOrganization } from '../../contexts/OrganizationContext';
import { FiImage, FiUpload, FiTrash2, FiDownload, FiExternalLink, FiSearch } from 'react-icons/fi';
import { RiImageAddLine } from 'react-icons/ri';

function MarketingImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const limit = 18; // 6 columns x 3 rows
  const { selectedOrg } = useOrganization();

  useEffect(() => {
    if (selectedOrg?.id) {
      fetchImages(0, true);
    }
  }, [selectedOrg]);

  const fetchImages = async (newOffset = 0, reset = false) => {
    if (!selectedOrg?.id) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        `https://db.api.geniusos.co/images/organization/${selectedOrg.id}?limit=${limit}&offset=${newOffset}`,
        {
          headers: {
            'accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching images: ${response.status}`);
      }

      const data = await response.json();
      
      // If we received fewer images than the limit, there are no more to load
      setHasMore(data.images.length === limit);
      
      // If reset is true, replace the images array, otherwise append
      setImages(reset ? data.images : [...images, ...data.images]);
      setOffset(newOffset);
    } catch (err) {
      console.error('Failed to fetch images:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    const newOffset = offset + limit;
    fetchImages(newOffset, false);
  };

  // Function to handle image download
  const handleDownload = (imageUrl) => {
    // For external images with CORS restrictions, we can't force a download
    // So we'll open it in a new tab and show instructions to the user
    window.open(imageUrl, '_blank');
    
    // Show a toast or alert with instructions
    alert('Right-click on the image and select "Save Image As..." to download.');
  };

  // Function to open image in new tab
  const handleOpenImage = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  // Function to delete an image
  const handleDeleteImage = async (imageId, imageUrl) => {
    if (!selectedOrg?.id) return;
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      setDeleteLoading(true);
      
      // Encode the image URL for the API call
      const encodedImageUrl = encodeURIComponent(imageUrl);
      
      const response = await fetch(
        `https://db.api.geniusos.co/images/?organization_id=${selectedOrg.id}&image_url=${encodedImageUrl}`,
        {
          method: 'DELETE',
          headers: {
            'accept': '*/*'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error deleting image: ${response.status}`);
      }

      // Remove the deleted image from the state
      setImages(images.filter(img => img.id !== imageId));
      
    } catch (err) {
      console.error('Failed to delete image:', err);
      alert(`Error deleting image: ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Marketing Images</h1>
        <p className="text-gray-400 mt-2">
          Browse and manage your organization's marketing assets. These images are generated by our AI agents and can be used in your marketing campaigns.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-lg mb-6">
          Error loading images: {error}
        </div>
      )}

      {loading && offset === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {[...Array(18)].map((_, index) => (
            <div key={index} className="bg-[#1F242B] rounded-lg overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-700"></div>
              <div className="p-3">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-[#1F242B] rounded-lg p-10 text-center">
              <FiImage className="text-gray-400 text-5xl mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Images Found</h3>
              <p className="text-gray-400 mb-6">No marketing images are available for your organization</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {images.map((image) => (
                <div key={image.id} className="bg-[#1F242B] rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-300 border border-transparent hover:border-emerald-500/30">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={image.image_url} 
                      alt="Marketing asset" 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <button 
                        className="p-2 bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors" 
                        title="Save Image"
                        onClick={() => handleDownload(image.image_url)}
                      >
                        <FiDownload className="text-white" />
                      </button>
                      <button 
                        className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors" 
                        title="View Image"
                        onClick={() => handleOpenImage(image.image_url)}
                      >
                        <FiExternalLink className="text-white" />
                      </button>
                      <button 
                        className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors" 
                        title="Delete"
                        onClick={() => handleDeleteImage(image.id, image.image_url)}
                        disabled={deleteLoading}
                      >
                        <FiTrash2 className="text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm truncate font-medium">
                      {image.image_url.split('/').pop().split('.')[0].replace(/-/g, ' ')}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {formatDate(image.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasMore && images.length > 0 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleShowMore}
                disabled={loading}
                className="px-6 py-2 bg-[#1F242B] hover:bg-[#2A303A] text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Show More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MarketingImages;
