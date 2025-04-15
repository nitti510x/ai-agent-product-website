import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { FiCheck, FiX, FiAlertCircle, FiSettings, FiActivity, FiBarChart2, FiHelpCircle, FiArrowLeft } from 'react-icons/fi';
import { apiUrl } from '../../config/api';

function SetupGuide() {
  const navigate = useNavigate();
  const { agentId } = useParams();
  const [agentName, setAgentName] = useState('AI Agent');
  const [loading, setLoading] = useState(true);
  const [setupSteps, setSetupSteps] = useState([]);

  // Fetch agent details from API
  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        const response = await fetch(`${apiUrl()}/agents/active`, {
          method: 'GET',
          headers: { 'accept': 'application/json' }
        });
        
        if (response.ok) {
          const data = await response.json();
          const agent = data.agents.find(a => a.system_name === agentId);
          
          if (agent) {
            setAgentName(agent.name);
          } else {
            // Fallback to legacy mapping if agent not found in API
            setAgentName(getLegacyAgentName());
          }
        } else {
          // Fallback to legacy mapping if API call fails
          setAgentName(getLegacyAgentName());
        }
        
        // Set up the steps for this agent
        setSetupSteps(getSetupStepsForAgent(agentId));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching agent details:', error);
        // Fallback to legacy mapping if API call fails
        setAgentName(getLegacyAgentName());
        setSetupSteps(getSetupStepsForAgent(agentId));
        setLoading(false);
      }
    };
    
    fetchAgentDetails();
  }, [agentId]);

  // Get agent name based on ID (legacy mapping)
  const getLegacyAgentName = () => {
    const agents = {
      'support': 'Slack App',
      'team': 'Image Creator',
      'analytics': 'Copy Creator',
      'metrics': 'LinkedIn Poster',
      'wordpress': 'WordPress Blogger',
      'slack_app_agent': 'Slack App',
      'social_media_manager_agent': 'Social Media Manager',
      'ai_content_manager_agent': 'AI Content Manager',
      'market_research_agent': 'Market Research',
      'content_writer_agent': 'Content Writer',
      'image_generator_agent': 'Image Generator',
      'echo_prompt_agent': 'ECHO Prompt',
      'workflow_helper_agent': 'Workflow Helper',
      'linkedin_influencer_agent': 'LinkedIn Influencer'
    };
    return agents[agentId] || 'AI Agent';
  };

  // Get setup steps based on agent ID
  const getSetupStepsForAgent = (id) => {
    // Legacy setup steps
    const legacySetupSteps = {
      'support': [
        {
          title: 'Connect to Slack',
          description: 'Allow geniusOS AIForce to access your Slack workspace',
          status: 'completed',
          action: 'Connect Slack',
          actionUrl: '#'
        },
        {
          title: 'Configure Channels',
          description: 'Select which channels the support bot should monitor',
          status: 'pending',
          action: 'Configure',
          actionUrl: '#'
        }
      ],
      'team': [
        {
          title: 'Connect to Slack',
          description: 'Allow geniusOS AIForce to access your Slack workspace',
          status: 'completed',
          action: 'Connect Slack',
          actionUrl: '#'
        },
        {
          title: 'LinkedIn Authorization',
          description: 'Grant permission to post updates on LinkedIn',
          status: 'pending',
          action: 'Connect LinkedIn',
          actionUrl: 'https://api.linkedin.com/v2/oauth2/authorization'
        },
        {
          title: 'Team Calendar Access',
          description: 'Allow access to team calendar for scheduling',
          status: 'not-started',
          action: 'Connect Calendar',
          actionUrl: '#'
        }
      ],
      'analytics': [
        {
          title: 'Data Source Connection',
          description: 'Connect your data sources for analysis',
          status: 'not-started',
          action: 'Connect Sources',
          actionUrl: '#'
        },
        {
          title: 'Configure Metrics',
          description: 'Select which metrics to track and analyze',
          status: 'not-started',
          action: 'Configure',
          actionUrl: '#'
        }
      ],
      'metrics': [
        {
          title: 'Performance Data Access',
          description: 'Connect to your team performance data sources',
          status: 'not-started',
          action: 'Connect Data',
          actionUrl: '#'
        },
        {
          title: 'Reporting Schedule',
          description: 'Set up automated reporting schedule',
          status: 'not-started',
          action: 'Configure',
          actionUrl: '#'
        }
      ]
    };
    
    // New dynamic setup steps for all agents
    const dynamicSetupSteps = {
      'slack_app_agent': [
        {
          title: 'Connect to Slack',
          description: 'Allow geniusOS to access your Slack workspace',
          status: 'pending',
          action: 'Connect Slack',
          actionUrl: '#'
        },
        {
          title: 'Configure Channels',
          description: 'Select which channels the Slack bot should monitor',
          status: 'not-started',
          action: 'Configure',
          actionUrl: '#'
        },
        {
          title: 'Set Up Notifications',
          description: 'Configure how and when you want to receive notifications',
          status: 'not-started',
          action: 'Configure',
          actionUrl: '#'
        }
      ],
      'social_media_manager_agent': [
        {
          title: 'Connect Social Accounts',
          description: 'Connect your social media accounts to enable posting',
          status: 'pending',
          action: 'Connect Accounts',
          actionUrl: '#'
        },
        {
          title: 'Content Calendar',
          description: 'Set up your content calendar and posting schedule',
          status: 'not-started',
          action: 'Configure Calendar',
          actionUrl: '#'
        },
        {
          title: 'Audience Targeting',
          description: 'Configure audience targeting settings for your posts',
          status: 'not-started',
          action: 'Configure',
          actionUrl: '#'
        }
      ],
      'ai_content_manager_agent': [
        {
          title: 'Connect Content Sources',
          description: 'Connect your content repositories and platforms',
          status: 'pending',
          action: 'Connect Sources',
          actionUrl: '#'
        },
        {
          title: 'Content Guidelines',
          description: 'Set up your content guidelines and brand voice',
          status: 'not-started',
          action: 'Configure',
          actionUrl: '#'
        }
      ],
      'market_research_agent': [
        {
          title: 'Data Sources',
          description: 'Connect to market data sources and APIs',
          status: 'pending',
          action: 'Connect Sources',
          actionUrl: '#'
        },
        {
          title: 'Research Parameters',
          description: 'Define your research parameters and focus areas',
          status: 'not-started',
          action: 'Configure',
          actionUrl: '#'
        }
      ],
      'content_writer_agent': [
        {
          title: 'Writing Style',
          description: 'Configure your preferred writing style and tone',
          status: 'pending',
          action: 'Configure Style',
          actionUrl: '#'
        },
        {
          title: 'Content Types',
          description: 'Select the types of content you want to generate',
          status: 'not-started',
          action: 'Configure',
          actionUrl: '#'
        }
      ],
      'image_generator_agent': [
        {
          title: 'Style Preferences',
          description: 'Set up your preferred image styles and themes',
          status: 'pending',
          action: 'Configure Style',
          actionUrl: '#'
        },
        {
          title: 'Output Settings',
          description: 'Configure image resolution and format settings',
          status: 'not-started',
          action: 'Configure',
          actionUrl: '#'
        }
      ],
      'echo_prompt_agent': [
        {
          title: 'Prompt Library',
          description: 'Set up your prompt library and templates',
          status: 'pending',
          action: 'Configure Library',
          actionUrl: '#'
        },
        {
          title: 'Response Settings',
          description: 'Configure how responses should be formatted',
          status: 'not-started',
          action: 'Configure',
          actionUrl: '#'
        }
      ],
      'workflow_helper_agent': [
        {
          title: 'Workflow Integration',
          description: 'Connect to your workflow tools and platforms',
          status: 'pending',
          action: 'Connect Tools',
          actionUrl: '#'
        },
        {
          title: 'Automation Rules',
          description: 'Configure automation rules and triggers',
          status: 'not-started',
          action: 'Configure',
          actionUrl: '#'
        }
      ],
      'linkedin_influencer_agent': [
        {
          title: 'LinkedIn Authorization',
          description: 'Grant permission to post updates on LinkedIn',
          status: 'pending',
          action: 'Connect LinkedIn',
          actionUrl: '#'
        },
        {
          title: 'Content Strategy',
          description: 'Define your LinkedIn content strategy and posting schedule',
          status: 'not-started',
          action: 'Configure Strategy',
          actionUrl: '#'
        },
        {
          title: 'Audience Targeting',
          description: 'Configure audience targeting for your LinkedIn posts',
          status: 'not-started',
          action: 'Configure',
          actionUrl: '#'
        }
      ]
    };
    
    // First try to get steps from dynamic mapping
    if (dynamicSetupSteps[id]) {
      return dynamicSetupSteps[id];
    }
    
    // Then try legacy mapping
    if (legacySetupSteps[id]) {
      return legacySetupSteps[id];
    }
    
    // Default generic steps if no specific steps found
    return [
      {
        title: 'Agent Configuration',
        description: 'Configure basic settings for this AI agent',
        status: 'pending',
        action: 'Configure',
        actionUrl: `#`
      },
      {
        title: 'Integration Setup',
        description: 'Connect this agent to your existing tools and platforms',
        status: 'not-started',
        action: 'Connect',
        actionUrl: '#'
      },
      {
        title: 'Permissions',
        description: 'Set up permissions and access controls for this agent',
        status: 'not-started',
        action: 'Configure',
        actionUrl: '#'
      }
    ];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FiCheck className="w-6 h-6 text-primary" />;
      case 'pending':
        return <FiAlertCircle className="w-6 h-6 text-yellow-500" />;
      default:
        return <FiX className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'border-primary bg-primary/10';
      case 'pending':
        return 'border-yellow-500 bg-yellow-500/10';
      default:
        return 'border-dark-card';
    }
  };

  const location = useLocation();
  const currentPath = location.pathname;
  
  // Determine active tab based on URL path
  const getActiveTab = () => {
    if (currentPath.includes('/settings/')) return 'settings';
    if (currentPath.includes('/activity/')) return 'logs';
    if (currentPath.includes('/usage/')) return 'usage';
    if (currentPath.includes('/setup/')) return 'setup';
    return 'setup'; // Default tab for this component
  };
  
  const activeTab = getActiveTab();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">{loading ? 'Loading...' : agentName}</h2>
          <p className="text-gray-400 text-sm mt-1">Configure and monitor your AI assistant</p>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-700/40 mb-6">
        <Link 
          to={`/dashboard/settings/${agentId}`}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'settings' 
            ? 'text-emerald-400 border-b-2 border-emerald-400' 
            : 'text-gray-400 hover:text-white'}`}
        >
          <div className="flex items-center">
            <FiSettings className="mr-2" />
            Settings
          </div>
        </Link>
        <Link 
          to={`/dashboard/activity/${agentId}`}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'logs' 
            ? 'text-emerald-400 border-b-2 border-emerald-400' 
            : 'text-gray-400 hover:text-white'}`}
        >
          <div className="flex items-center">
            <FiActivity className="mr-2" />
            Logs
          </div>
        </Link>
        <Link 
          to={`/dashboard/usage/${agentId}`}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'usage' 
            ? 'text-emerald-400 border-b-2 border-emerald-400' 
            : 'text-gray-400 hover:text-white'}`}
        >
          <div className="flex items-center">
            <FiBarChart2 className="mr-2" />
            Usage
          </div>
        </Link>
        <Link 
          to={`/dashboard/setup/${agentId}`}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'setup' 
            ? 'text-emerald-400 border-b-2 border-emerald-400' 
            : 'text-gray-400 hover:text-white'}`}
        >
          <div className="flex items-center">
            <FiHelpCircle className="mr-2" />
            Setup Guide
          </div>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-gray-400">Loading setup guide...</div>
        </div>
      ) : (
        <div className="max-w-3xl">
          <div className="bg-dark-lighter p-6 rounded-xl border border-dark-card mb-8">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Getting Started</h2>
            <p className="text-gray-400">
              Follow these steps to set up your AI agent. Each step needs to be completed
              for the agent to function properly. Some steps may require authorization
              from third-party services.
            </p>
          </div>

          <div className="space-y-6">
            {setupSteps.map((step, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border ${getStatusClass(step.status)} transition-all duration-300`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <div className="mr-4">
                      {getStatusIcon(step.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-100 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 mb-4">{step.description}</p>
                      {step.status !== 'completed' && (
                        <a
                          href={step.actionUrl}
                          className="inline-flex items-center px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-dark font-semibold transition-all duration-300 hover:shadow-glow"
                        >
                          {step.action}
                        </a>
                      )}
                    </div>
                  </div>
                  {step.status === 'completed' && (
                    <span className="text-primary text-sm">Completed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SetupGuide;