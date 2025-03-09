// Direct connection to external API - no local API dependencies
import { supabase } from '../config/supabase';

/**
 * Fetches all active subscription plans with their features
 * @returns {Promise<Array>} Array of plan objects with features
 */
export const fetchSubscriptionPlans = async () => {
  // Hardcoded plan data to use as fallback
  const fallbackPlans = [
    {
      "name": "Free Trial",
      "description": "Perfect for teams ready to revolutionize their social media strategy",
      "price": 0,
      "interval": "month",
      "features": [
        {
          "icon": "credit",
          "text": "50 credits (Enough for multiple posts)"
        },
        {
          "icon": "assistant",
          "text": "1 AI Agent (Link 1 social account)"
        },
        {
          "icon": "slack",
          "text": "Slack Access (For your workspace)"
        },
        {
          "icon": "content",
          "text": "Content Generation AI Agents"
        },
        {
          "icon": "social",
          "text": "Social Media AI Agents"
        },
        {
          "icon": "card",
          "text": "No credit card required"
        }
      ],
      "active": true,
      "id": "plan_free",
      "created_at": "2025-03-03T05:37:53.714089Z",
      "updated_at": "2025-03-03T05:37:53.714089Z"
    },
    {
      "name": "Enterprise",
      "description": "Tailored solutions for large organizations with custom requirements",
      "price": 0,
      "interval": "month",
      "features": [
        {
          "icon": "assistant",
          "text": "Unlimited AI Assistants"
        },
        {
          "icon": "social",
          "text": "All Social Platforms"
        },
        {
          "icon": "analytics",
          "text": "Enterprise Analytics"
        },
        {
          "icon": "integration",
          "text": "Custom Integrations"
        },
        {
          "icon": "account",
          "text": "Dedicated Account Manager"
        },
        {
          "icon": "generation",
          "text": "Unlimited AI Generations"
        },
        {
          "icon": "feature",
          "text": "Priority Feature Access"
        },
        {
          "icon": "sla",
          "text": "Custom SLA"
        }
      ],
      "active": true,
      "id": "plan_enterprise",
      "created_at": "2025-03-03T04:27:29.414342Z",
      "updated_at": "2025-03-03T05:37:55.517632Z"
    },
    {
      "name": "starter 1",
      "description": "Perfect for small teams getting started with AI marketing",
      "price": 15,
      "interval": "month",
      "features": [
        {
          "icon": "assistant",
          "text": "1 AI Marketing Assistant"
        },
        {
          "icon": "social",
          "text": "3 Social Media Platforms"
        },
        {
          "icon": "analytics",
          "text": "Basic Analytics"
        },
        {
          "icon": "team",
          "text": "5 Team Members"
        },
        {
          "icon": "support",
          "text": "Standard Support"
        },
        {
          "icon": "generation",
          "text": "1,000 AI Generations/mo"
        }
      ],
      "active": true,
      "id": "plan_starter",
      "created_at": "2025-03-03T04:27:28.109257Z",
      "updated_at": "2025-03-03T05:37:54.133527Z"
    },
    {
      "name": "Pro",
      "description": "Ideal for growing businesses scaling their marketing",
      "price": 30,
      "interval": "month",
      "features": [
        {
          "icon": "assistant",
          "text": "3 AI Marketing Assistants"
        },
        {
          "icon": "social",
          "text": "All Social Platforms"
        },
        {
          "icon": "analytics",
          "text": "Advanced Analytics"
        },
        {
          "icon": "team",
          "text": "15 Team Members"
        },
        {
          "icon": "support",
          "text": "Priority Support"
        },
        {
          "icon": "generation",
          "text": "5,000 AI Generations/mo"
        },
        {
          "icon": "template",
          "text": "Custom Templates"
        },
        {
          "icon": "api",
          "text": "API Access"
        }
      ],
      "active": true,
      "id": "plan_pro",
      "created_at": "2025-03-03T04:27:28.556477Z",
      "updated_at": "2025-03-03T05:37:54.595494Z"
    },
    {
      "name": "Business",
      "description": "Custom solutions for large organizations",
      "price": 79,
      "interval": "month",
      "features": [
        {
          "icon": "assistant",
          "text": "Unlimited AI Assistants"
        },
        {
          "icon": "social",
          "text": "All Social Platforms"
        },
        {
          "icon": "analytics",
          "text": "Enterprise Analytics"
        },
        {
          "icon": "team",
          "text": "Unlimited Team Members"
        },
        {
          "icon": "support",
          "text": "24/7 Dedicated Support"
        },
        {
          "icon": "generation",
          "text": "Unlimited AI Generations"
        },
        {
          "icon": "integration",
          "text": "Custom Integration"
        },
        {
          "icon": "sla",
          "text": "SLA Guarantee"
        }
      ],
      "active": true,
      "id": "plan_business",
      "created_at": "2025-03-03T04:27:28.984571Z",
      "updated_at": "2025-03-03T05:37:55.016438Z"
    }
  ];

  try {
    // First try to use the hardcoded data directly since we're having CORS issues
    console.log('Using hardcoded plans data due to CORS issues with external API');
    return fallbackPlans;

    // The code below is kept but commented out until CORS issues are resolved
    /*
    // Get the current user's JWT token for authentication
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    // Use the external operations API for plans with active_only parameter
    const externalApiUrl = 'https://agent.ops.geniusos.co/plans/?active_only=true';
    
    // Fetch plans from the external API with authentication
    const response = await fetch(externalApiUrl, {
      headers: {
        'accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    
    if (!response.ok) {
      console.warn(`API request failed with status ${response.status}: ${response.statusText}`);
      console.log('Falling back to hardcoded plan data');
      return fallbackPlans;
    }
    
    const plans = await response.json();
    console.log('Plans fetched successfully:', plans);
    
    // Ensure plans have the correct structure
    return plans.map(plan => ({
      ...plan,
      features: Array.isArray(plan.features) 
        ? plan.features 
        : typeof plan.features === 'object' && plan.features !== null
          ? Object.entries(plan.features).map(([key, value]) => ({
              icon: key.toLowerCase().includes('credit') ? 'credit' : 'feature',
              text: `${value} ${key}`
            }))
          : []
    }));
    */
  } catch (error) {
    console.error('Error in fetchSubscriptionPlans:', error);
    console.log('Falling back to hardcoded plans array due to error');
    return fallbackPlans;
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
    feature: 'FiStar',
    credit: 'FaRobot',
    slack: 'FiCode',
    content: 'FiFileText',
    card: 'FiCheck'
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
