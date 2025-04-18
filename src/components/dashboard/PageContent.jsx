import React from 'react';

/**
 * PageContent component that provides consistent padding and layout for all dashboard pages
 * This centralizes the layout structure so it can be changed in one place
 */
function PageContent({ children }) {
  return (
    <div className="p-6">
      {children}
    </div>
  );
}

export default PageContent;
