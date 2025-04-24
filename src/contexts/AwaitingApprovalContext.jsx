import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockAwaitingContent } from '../components/dashboard/content/AwaitingApprovalContent';

const AwaitingApprovalContext = createContext();

export const useAwaitingApproval = () => {
  return useContext(AwaitingApprovalContext);
};

export const AwaitingApprovalProvider = ({ children }) => {
  const [awaitingCount, setAwaitingCount] = useState(0);

  // Fetch awaiting approval count
  useEffect(() => {
    const fetchAwaitingCount = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use the mock data
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Set the count based on the mock data length
        setAwaitingCount(mockAwaitingContent.length);
      } catch (error) {
        console.error('Error fetching awaiting approval count:', error);
      }
    };

    fetchAwaitingCount();
    
    // Set up polling to check for new items (every 5 minutes)
    const intervalId = setInterval(fetchAwaitingCount, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const value = {
    awaitingCount,
    setAwaitingCount,
  };

  return (
    <AwaitingApprovalContext.Provider value={value}>
      {children}
    </AwaitingApprovalContext.Provider>
  );
};
