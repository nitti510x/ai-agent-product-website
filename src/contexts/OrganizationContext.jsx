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
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (selectedOrg && selectedOrg.id) {
      fetchSubscription(selectedOrg.id);
      // Store selected organization in localStorage when it changes
      localStorage.setItem('selectedOrganization', JSON.stringify(selectedOrg));
    }
  }, [selectedOrg]);

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
      
      // Use the correct API endpoint format for fetching organizations by user ID
      const endpoint = `${apiUrl()}/organizations/user/${userId}`;
      
      console.log(`Fetching organizations from: ${endpoint}`);
      
      // Fetch organizations from the API endpoint
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch organizations: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Organizations data:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        // Sort organizations by is_primary (primary organizations first)
        const sortedOrgs = [...data].sort((a, b) => {
          if (a.is_primary === b.is_primary) return 0;
          return a.is_primary ? -1 : 1; // Primary orgs first
        });
        
        setOrganizations(sortedOrgs);
        
        // Try to get the previously selected organization from localStorage
        const savedOrgString = localStorage.getItem('selectedOrganization');
        let savedOrg = null;
        
        if (savedOrgString) {
          try {
            savedOrg = JSON.parse(savedOrgString);
            // Verify that the saved org still exists in the current list
            const orgExists = sortedOrgs.some(org => org.id === savedOrg.id);
            if (!orgExists) {
              savedOrg = null;
            }
          } catch (e) {
            console.error('Error parsing saved organization:', e);
            savedOrg = null;
          }
        }
        
        // Set the selected organization: saved org > primary org > first org
        if (savedOrg) {
          // Find the full org object from the current list
          const currentOrgData = sortedOrgs.find(org => org.id === savedOrg.id);
          setSelectedOrg(currentOrgData);
        } else {
          // Fall back to primary or first org
          const primaryOrg = sortedOrgs.find(org => org.is_primary === true);
          setSelectedOrg(primaryOrg || sortedOrgs[0]);
        }
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

  const fetchSubscription = async (orgId) => {
    console.log('Fetching subscription for orgId:', orgId);
    try {
      const response = await fetch(`https://db.api.geniusos.co/subscriptions/organization/${orgId}`, {
        headers: {
          'Accept': 'application/json',
          // Add any necessary authentication headers here
        }
      });
      const data = await response.json();
      console.log('Fetched subscription data:', data);
      setSubscription(data);
      // Store subscription data in local storage for global access
      localStorage.setItem('subscriptionData', JSON.stringify(data));
      localStorage.setItem('subscriptionOrgId', orgId);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const selectOrganization = (org) => {
    setSelectedOrg(org);
    console.log('Organization selected:', org);
    // You could add additional logic here to switch context to the selected organization
  };

  const getPlanName = () => {
    if (!subscription) return 'Loading Plan...';
    // If subscription is the API response
    if (subscription.plan && subscription.plan.name) return subscription.plan.name.replace('Annual', '').trim();
    // If subscription is just the plan object
    if (subscription.name) return subscription.name.replace('Annual', '').trim();
    return 'Unknown Plan';
  };

  // Plan color mapping - centralized configuration for plan colors
  const planColorConfig = {
    starter: {
      badge: 'bg-amber-500/20 border border-amber-500/30',
      star: 'text-amber-400',
      text: 'text-amber-400'
    },
    pro: {
      badge: 'bg-purple-500/20 border border-purple-500/30',
      star: 'text-purple-400',
      text: 'text-purple-400'
    },
    business: {
      badge: 'bg-blue-500/20 border border-blue-500/30',
      star: 'text-blue-400',
      text: 'text-blue-400'
    },
    enterprise: {
      badge: 'bg-emerald-500/20 border border-emerald-500/30',
      star: 'text-emerald-400',
      text: 'text-emerald-400'
    },
    default: {
      badge: 'bg-gray-500/20 border border-gray-500/30',
      star: 'text-gray-400',
      text: 'text-gray-400'
    }
  };

  // Get plan type from plan name
  const getPlanType = () => {
    const planName = getPlanName().toLowerCase();
    if (planName.includes('starter')) return 'starter';
    if (planName.includes('pro')) return 'pro';
    if (planName.includes('business')) return 'business';
    if (planName.includes('enterprise')) return 'enterprise';
    return 'default';
  };

  // Get plan badge style based on plan name
  const getPlanBadgeStyle = () => {
    return planColorConfig[getPlanType()].badge;
  };

  // Get plan star color based on plan name
  const getPlanStarColor = () => {
    return planColorConfig[getPlanType()].star;
  };

  // Get plan text color based on plan name
  const getPlanTextColor = () => {
    return planColorConfig[getPlanType()].text;
  };

  // Function to determine if an agent is available in the user's plan
  const isAgentInUserPlan = (agent) => {
    const currentPlan = getPlanName().toLowerCase();
    if (currentPlan.includes('pro')) {
      return agent.in_pro_plan === true;
    } else if (currentPlan.includes('business')) {
      return agent.in_business_plan === true;
    } else {
      // Default to starter plan
      return agent.in_starter_plan === true;
    }
  };

  const value = {
    organizations,
    selectedOrg,
    isLoading,
    error,
    userEmail,
    subscription,
    selectOrganization,
    fetchOrganizations,
    getPlanName,
    getPlanType,
    getPlanStarColor,
    getPlanBadgeStyle,
    getPlanTextColor,
    isAgentInUserPlan,
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
