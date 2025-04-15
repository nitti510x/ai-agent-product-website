import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPageContent from './LandingPageContent';

// This wrapper component handles the navigation logic
function LandingPageWrapper() {
  const navigate = useNavigate();
  
  return <LandingPageContent navigate={navigate} />;
}

export default LandingPageWrapper;
