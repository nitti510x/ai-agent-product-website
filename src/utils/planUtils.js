import { apiUrl } from '../config/api';

/**
 * Fetches all active subscription plans with their features
 * @returns {Promise<Array>} Array of plan objects with features
 */
export const fetchSubscriptionPlans = async () => {
  try {
    // Get API URL based on environment
    const baseUrl = apiUrl();
    
    // Fetch plans from the API (which connects to Railway PostgreSQL)
    const response = await fetch(`${baseUrl}/api/plans`);
    
    if (!response.ok) {
      throw new Error(`Error fetching plans: ${response.statusText}`);
    }
    
    const plans = await response.json();
    
    // Parse the features JSON if it's stored as a string
    return plans.map(plan => ({
      ...plan,
      features: typeof plan.features === 'string' 
        ? JSON.parse(plan.features) 
        : plan.features
    }));
  } catch (error) {
    console.error('Error in fetchSubscriptionPlans:', error);
    return [];
  }
};

/**
 * Formats the price for display
 * @param {number} amount - The price amount in cents
 * @param {string} currency - The currency code
 * @returns {string} Formatted price string
 */
export const formatPrice = (amount, currency = 'usd') => {
  // For custom pricing (amount = 0)
  if (amount === 0) {
    return 'Custom Pricing';
  }
  
  // Convert cents to dollars
  const dollars = amount / 100;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(dollars);
};

/**
 * Gets the appropriate icon component for a feature
 * @param {string} iconName - The name of the icon
 * @returns {string} The icon component name from your icon library
 */
export const getFeatureIcon = (iconName) => {
  // Map the icon names to your actual icon components
  const iconMap = {
    assistant: 'FiUser',
    social: 'FiGlobe',
    analytics: 'FiBarChart2',
    team: 'FiUsers',
    support: 'FiHeadphones',
    generation: 'FiCpu',
    template: 'FiFileText',
    api: 'FiCode',
    integration: 'FiLink',
    sla: 'FiShield',
    account: 'FiUserCheck',
    feature: 'FiStar'
  };
  
  return iconMap[iconName] || 'FiCheck';
};

/**
 * Renders the features list as HTML
 * @param {Array} features - Array of feature objects
 * @returns {string} HTML string for the features list
 */
export const renderFeaturesHTML = (features) => {
  if (!features || !Array.isArray(features)) return '';
  
  return features.map(feature => `
    <div class="feature-item">
      <span class="feature-icon">${getFeatureIcon(feature.icon)}</span>
      <span class="feature-text">${feature.text}</span>
    </div>
  `).join('');
};

/**
 * Renders the features list as Markdown
 * @param {Array} features - Array of feature objects
 * @returns {string} Markdown string for the features list
 */
export const renderFeaturesMarkdown = (features) => {
  if (!features || !Array.isArray(features)) return '';
  
  return features.map(feature => `- ${feature.text}`).join('\n');
};
