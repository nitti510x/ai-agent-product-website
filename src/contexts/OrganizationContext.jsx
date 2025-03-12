import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { apiUrl } from '../config/api';

const OrganizationContext = createContext();

export function OrganizationProvider({ children }) {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get the current user session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session?.user?.id) {
        throw new Error('User not authenticated');
      }
      
      const userId = sessionData.session.user.id;
      const email = sessionData.session.user.email;
      setUserEmail(email);
      
      // Use the apiUrl helper to get the correct API endpoint based on environment
      const endpoint = `${apiUrl()}/organizations/user-organizations`;
      
      console.log(`Fetching organizations from: ${endpoint}`);
      
      // Fetch organizations from the API endpoint
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ "user_id": userId })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch organizations: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Organizations data:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        setOrganizations(data);
        // Set the primary organization as selected by default
        const primaryOrg = data.find(org => org.is_primary === true);
        setSelectedOrg(primaryOrg || data[0]);
      } else {
        setOrganizations([]);
      }
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError(`Failed to load organizations: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const selectOrganization = (org) => {
    setSelectedOrg(org);
    // You could add additional logic here to switch context to the selected organization
  };

  const value = {
    organizations,
    selectedOrg,
    isLoading,
    error,
    userEmail,
    selectOrganization,
    fetchOrganizations
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  return useContext(OrganizationContext);
}

export default OrganizationContext;
