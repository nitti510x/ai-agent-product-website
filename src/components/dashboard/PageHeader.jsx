import React from 'react';

/**
 * PageHeader component that provides consistent styling for page titles and descriptions
 * This centralizes the header styling so it can be changed in one place
 */
function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {description && (
            <p className="text-gray-400 mt-2">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex space-x-2">
            {actions}
          </div>
        )}
      </div>
      <hr className="mt-6 border-t border-gray-700/40" />
    </div>
  );
}

export default PageHeader;
