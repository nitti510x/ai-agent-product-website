import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const SubscriptionContext = createContext();

// Create a provider component
export const SubscriptionProvider = ({ children }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isFreeTrialSelected, setIsFreeTrialSelected] = useState(false);

  // Load from sessionStorage on initial render
  useEffect(() => {
    const storedPlan = sessionStorage.getItem('selectedPlan');
    const storedFreeTrial = sessionStorage.getItem('isFreeTrialSelected');
    
    if (storedPlan) {
      setSelectedPlan(JSON.parse(storedPlan));
    }
    
    if (storedFreeTrial) {
      setIsFreeTrialSelected(storedFreeTrial === 'true');
    }
  }, []);

  // Save to sessionStorage when state changes
  useEffect(() => {
    if (selectedPlan) {
      sessionStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
    }
    
    sessionStorage.setItem('isFreeTrialSelected', isFreeTrialSelected.toString());
  }, [selectedPlan, isFreeTrialSelected]);

  // Function to select a plan
  const selectPlan = (plan) => {
    setSelectedPlan(plan);
    setIsFreeTrialSelected(false);
  };

  // Function to select free trial
  const selectFreeTrial = () => {
    setSelectedPlan(null);
    setIsFreeTrialSelected(true);
  };

  // Function to clear selection
  const clearPlanSelection = () => {
    setSelectedPlan(null);
    setIsFreeTrialSelected(false);
    sessionStorage.removeItem('selectedPlan');
    sessionStorage.removeItem('isFreeTrialSelected');
  };

  return (
    <SubscriptionContext.Provider
      value={{
        selectedPlan,
        isFreeTrialSelected,
        selectPlan,
        selectFreeTrial,
        clearPlanSelection
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

// Custom hook to use the subscription context
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
