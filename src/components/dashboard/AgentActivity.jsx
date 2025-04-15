import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { FiClock, FiMessageCircle, FiUser, FiSend, FiAlertCircle, FiSettings, FiActivity, FiBarChart2, FiHelpCircle, FiArrowLeft } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa6';
import { BiBot } from 'react-icons/bi';
import AgentLogs from './AgentLogs';
import { apiUrl } from '../../config/api';

function AgentActivity() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [agentName, setAgentName] = useState('AI Agent');
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error('Error fetching agent details:', error);
        // Fallback to legacy mapping if API call fails
        setAgentName(getLegacyAgentName());
      } finally {
        setLoading(false);
      }
    };
    
    fetchAgentDetails();
  }, [agentId]);

  // Legacy agent name mapping for backward compatibility
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

  const location = useLocation();
  const currentPath = location.pathname;
  
  // Determine active tab based on URL path
  const getActiveTab = () => {
    if (currentPath.includes('/settings/')) return 'settings';
    if (currentPath.includes('/activity/')) return 'logs';
    if (currentPath.includes('/usage/')) return 'usage';
    if (currentPath.includes('/setup/')) return 'setup';
    return 'logs'; // Default tab for this component
  };
  
  const activeTab = getActiveTab();

  return (
    <div className="w-full p-0">
      {/* Page title and action buttons */}
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

      {/* Content based on active tab */}
      {activeTab === 'logs' && <AgentLogs agentId={agentId} />}
      
      {/* Other tabs content would go here */}
    </div>
  );
}

export default AgentActivity;