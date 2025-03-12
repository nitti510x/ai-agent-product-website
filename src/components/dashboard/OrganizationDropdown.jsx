import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiUsers, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useOrganization } from '../../contexts/OrganizationContext';

function OrganizationDropdown() {
  const { 
    organizations, 
    selectedOrg, 
    isLoading, 
    error, 
    selectOrganization, 
    fetchOrganizations 
  } = useOrganization();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Add event listener to handle clicks outside the dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    // Attach the event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectOrganization = (org) => {
    selectOrganization(org);
    setIsOpen(false);
  };

  const retryFetch = () => {
    fetchOrganizations();
  };

  if (isLoading) {
    return (
      <div className="flex items-center text-gray-400 text-sm">
        <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-emerald-500 rounded-full"></div>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-sm flex flex-col">
        <div className="flex items-center">
          <FiAlertCircle className="mr-2" />
          {error}
        </div>
        <button 
          onClick={retryFetch}
          className="mt-2 text-xs text-emerald-400 hover:text-emerald-300"
        >
          Retry
        </button>
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="text-gray-400 text-sm flex items-center">
        <FiUsers className="mr-2" />
        No organizations found
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 bg-[#1F242B] hover:bg-[#252A31] text-white px-3 py-2 rounded-lg transition-colors"
      >
        <FiUsers className="text-emerald-400" />
        <span className="max-w-[150px] truncate">{selectedOrg?.org_name || 'Select Organization'}</span>
        <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-[#1F242B] border border-gray-700 rounded-lg shadow-xl z-50">
          <ul className="py-1">
            {organizations.map((org) => (
              <li key={org.id}>
                <button
                  onClick={() => handleSelectOrganization(org)}
                  className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-[#252A31] text-gray-200"
                >
                  <div className="flex items-center">
                    <span className="truncate">{org.org_name}</span>
                    {org.is_primary && (
                      <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                  {selectedOrg?.id === org.id && (
                    <FiCheck className="text-emerald-400" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default OrganizationDropdown;
