import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSupabase } from '../../contexts/SupabaseContext';

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useSupabase();
  const location = useLocation();

  if (loading) {
    // Show loading spinner or skeleton
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!session) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;