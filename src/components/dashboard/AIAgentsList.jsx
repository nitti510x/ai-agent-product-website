import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSettings, FiActivity, FiBarChart2, FiHelpCircle } from 'react-icons/fi';
import { RiSlackFill, RiImageLine, RiFileTextLine, RiLinkedinBoxFill, RiWordpressFill, RiInstagramLine, RiFacebookBoxFill, RiTwitterXFill } from 'react-icons/ri';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';
import { apiUrl } from '../../config/api';

function AIAgentsList() {
  // Define a consistent gradient matching the site style
  const mainGradient = 'from-emerald-400 to-blue-500';
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        console.log('Fetching agents from:', `${apiUrl()}/agents/active`);
        const response = await fetch(`${apiUrl()}/agents/active`, {
          method: 'GET',
          headers: { 'accept': 'application/json' }
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching agents: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Agents data received:', data);
        setAgents(data.agents || []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch agents:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchAgents();
  }, []);

  // Function to get the appropriate icon based on system_name
  const getAgentIcon = (systemName) => {
    switch (systemName) {
      case 'slack_app_agent':
        return <RiSlackFill className="w-8 h-8" />;
      case 'social_media_manager_agent':
        return <RiFacebookBoxFill className="w-8 h-8" />;
      case 'ai_content_manager_agent':
        return <RiFileTextLine className="w-8 h-8" />;
      case 'market_research_agent':
        return <FaRobot className="w-8 h-8" />;
      case 'content_writer_agent':
        return <RiFileTextLine className="w-8 h-8" />;
      case 'image_generator_agent':
        return <RiImageLine className="w-8 h-8" />;
      case 'echo_prompt_agent':
        return <FaRobot className="w-8 h-8" />;
      case 'workflow_helper_agent':
        return <FaRobot className="w-8 h-8" />;
      case 'linkedin_influencer_agent':
        return (
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="w-8 h-8" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.3362 18.339H15.6707V14.1622C15.6707 13.1662 15.6505 11.8845 14.2817 11.8845C12.892 11.8845 12.6797 12.9683 12.6797 14.0887V18.339H10.0142V9.75H12.5747V10.9207H12.6092C12.967 10.2457 13.837 9.53325 15.1367 9.53325C17.8375 9.53325 18.337 11.3108 18.337 13.6245V18.339H18.3362ZM7.00373 8.57475C6.14573 8.57475 5.45648 7.88025 5.45648 7.026C5.45648 6.1725 6.14648 5.47875 7.00373 5.47875C7.85873 5.47875 8.55173 6.1725 8.55173 7.026C8.55173 7.88025 7.85798 8.57475 7.00373 8.57475ZM8.34023 18.339H5.66723V9.75H8.34023V18.339ZM19.6697 3H4.32923C3.59498 3 3.00098 3.5805 3.00098 4.29675V19.7033C3.00098 20.4202 3.59498 21 4.32923 21H19.6675C20.401 21 21.001 20.4202 21.001 19.7033V4.29675C21.001 3.5805 20.401 3 19.6675 3H19.6697Z"></path>
          </svg>
        );
      default:
        return <FaRobot className="w-8 h-8" />;
    }
  };

  // Simplified function to check if an agent is included in the user's current plan
  // For now, assume all agents are available to the user
  const isAgentInUserPlan = (agent) => {
    // For demonstration, let's assume all agents except X Marketer are available
    // We'll implement proper subscription checks in the next step
    return agent.system_name !== 'twitter_marketer_agent';
  };

  // Function to get the appropriate setup status indicator
  const getSetupStatusIndicator = (status, agentStatus, isDisabled) => {
    // Special case for disabled agents (like X Marketer)
    if (isDisabled) {
      return (
        <div className="absolute top-3 right-3 group">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <div className="absolute right-0 mt-2 px-3 py-1 bg-dark-card/90 backdrop-blur-sm rounded-lg text-xs text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 shadow-lg border border-white/5">
            Premium agent - requires upgrade
          </div>
        </div>
      );
    }
    
    switch (status) {
      case 'operational':
        return (
          <div className="absolute top-3 right-3 group">
            <div className="w-3.5 h-3.5 bg-emerald-400 rounded-full shadow-glow-sm" />
            <div className="absolute right-0 mt-2 px-3 py-1 bg-dark-card/90 backdrop-blur-sm rounded-lg text-xs text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 shadow-lg border border-white/5">
              Agent is operational
            </div>
          </div>
        );
      case 'pending':
        return (
          <div className="absolute top-3 right-3 group">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-red-500 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute right-0 mt-2 px-3 py-1 bg-dark-card/90 backdrop-blur-sm rounded-lg text-xs text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 shadow-lg border border-white/5">
              Setup in progress
            </div>
          </div>
        );
      case 'not-started':
      default:
        return (
          <div className="absolute top-3 right-3 group">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-yellow-500 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
            </div>
            <div className="absolute right-0 mt-2 px-3 py-1 bg-dark-card/90 backdrop-blur-sm rounded-lg text-xs text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 shadow-lg border border-white/5">
              Setup required
            </div>
          </div>
        );
    }
  };

  // Function to open Slack app
  const openSlackApp = () => {
    window.open('https://slack.com/apps', '_blank');
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Your AI Assistants</h1>
        <p className="text-gray-400 mb-8">Loading agents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Your AI Assistants</h1>
        <p className="text-red-400 mb-8">Error loading agents: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Your AI Assistants</h1>
          <p className="text-gray-400">Manage and monitor your active AI integrations</p>
        </div>
        
        {/* Slack App Button - Now on the right side */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); openSlackApp(); }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-glow-md"
        >
          <span className="mr-2">Run in Slack</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.8 122.8" width="18" height="18">
            <path d="M25.8,77.6c0,7.1-5.8,12.9-12.9,12.9S0,84.7,0,77.6s5.8-12.9,12.9-12.9h12.9V77.6z" fill="#E01E5A"></path>
            <path d="M32.3,77.6c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v32.3c0,7.1-5.8,12.9-12.9,12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#E01E5A"></path>
            <path d="M45.2,25.8c-7.1,0-12.9-5.8-12.9-12.9S38.1,0,45.2,0s12.9,5.8,12.9,12.9v12.9H45.2z" fill="#36C5F0"></path>
            <path d="M45.2,32.3c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9H12.9C5.8,58.1,0,52.3,0,45.2s5.8-12.9,12.9-12.9H45.2z" fill="#36C5F0"></path>
            <path d="M97,45.2c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9H97V45.2z" fill="#2EB67D"></path>
            <path d="M90.5,45.2c0,7.1-5.8,12.9-12.9,12.9s-12.9-5.8-12.9-12.9V12.9C64.7,5.8,70.5,0,77.6,0s12.9,5.8,12.9,12.9V45.2z" fill="#2EB67D"></path>
            <path d="M77.6,97c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9s-12.9-5.8-12.9-12.9V97H77.6z" fill="#ECB22E"></path>
            <path d="M77.6,90.5c-7.1,0-12.9-5.8-12.9-12.9s5.8-12.9,12.9-12.9h32.3c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9H77.6z" fill="#ECB22E"></path>
          </svg>
        </a>
      </div>

      {/* Agents grid - 3 across for better spacing and readability */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          // Determine if the agent is available in the user's plan
          const isDisabled = !isAgentInUserPlan(agent);
          // For demo purposes, set a default setup status
          const setupStatus = isDisabled ? 'not-started' : 'operational';
          
          return (
            <div
              key={agent.id}
              className={`bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden ${!isDisabled ? 'hover:border-emerald-400/30' : 'opacity-70'} transition-all duration-300 relative shadow-md hover:shadow-lg`}
            >
              {getSetupStatusIndicator(setupStatus, 'active', isDisabled)}
              
              {/* Agent header with icon */}
              <div className="flex items-center p-4 pb-3 border-b border-white/5">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-dark-card to-dark-lighter flex items-center justify-center ${isDisabled ? 'text-gray-500' : 'text-emerald-400'} mr-3`}>
                  {getAgentIcon(agent.system_name)}
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm">
                    {agent.name}
                  </h3>
                  <p className="text-gray-400 text-xs">{agent.blurb}</p>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="p-4 pt-3 flex flex-col gap-2">
                <div className="flex justify-between gap-2">
                  <Link
                    to={`/dashboard/activity/${agent.system_name}`}
                    className="flex items-center justify-center px-3 py-2 rounded-lg bg-dark-lighter hover:bg-gray-800 text-white hover:text-emerald-400 transition-all duration-300 text-xs flex-1 border border-gray-700/40 hover:border-emerald-400/30"
                  >
                    <FiActivity className="w-3.5 h-3.5 mr-1.5" />
                    Logs
                  </Link>
                  <Link
                    to={`/dashboard/usage/${agent.system_name}`}
                    className="flex items-center justify-center px-3 py-2 rounded-lg bg-dark-lighter hover:bg-gray-800 text-white hover:text-emerald-400 transition-all duration-300 text-xs flex-1 border border-gray-700/40 hover:border-emerald-400/30"
                  >
                    <FiBarChart2 className="w-3.5 h-3.5 mr-1.5" />
                    Usage
                  </Link>
                </div>
                <Link
                  to={`/dashboard/settings/${agent.system_name}`}
                  className="flex items-center justify-center px-3 py-2 rounded-lg bg-dark-lighter hover:bg-gray-800 text-white hover:text-emerald-400 transition-all duration-300 text-xs w-full border border-gray-700/40 hover:border-emerald-400/30"
                >
                  <FiSettings className="w-3.5 h-3.5 mr-1.5" />
                  Configure
                </Link>
                
                {/* Always show Setup Guide link for all agents */}
                <Link
                  to={`/dashboard/setup/${agent.system_name}`}
                  className="flex items-center mt-2 text-gray-400 hover:text-blue-400 transition-colors text-xs justify-center"
                >
                  <FiHelpCircle className="w-3.5 h-3.5 mr-1.5" />
                  Setup Guide
                </Link>
                
                {isDisabled && (
                  <Link
                    to="/dashboard/billing"
                    className="flex items-center px-3 py-2 mt-1 text-purple-300 hover:text-purple-200 transition-colors text-xs w-full justify-center bg-purple-900/20 border border-purple-500/20 rounded-lg"
                  >
                    <FaRobot className="w-3.5 h-3.5 mr-1.5" />
                    Upgrade Plan to Access
                  </Link>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Example of a disabled agent (X Marketer) */}
        <div
          className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden opacity-70 transition-all duration-300 relative shadow-md hover:shadow-lg"
        >
          {getSetupStatusIndicator('not-started', 'inactive', true)}
          
          {/* Agent header with icon */}
          <div className="flex items-center p-4 pb-3 border-b border-white/5">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-dark-card to-dark-lighter flex items-center justify-center text-gray-500 mr-3">
              <RiTwitterXFill className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-medium text-white text-sm">
                X Marketer
              </h3>
              <p className="text-gray-400 text-xs">Schedule and post content to X (Twitter)</p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="p-4 pt-3 flex flex-col gap-2">
            <div className="flex justify-between gap-2">
              <Link
                to={`/dashboard/activity/twitter`}
                className="flex items-center justify-center px-3 py-2 rounded-lg bg-dark-lighter hover:bg-gray-800 text-white hover:text-emerald-400 transition-all duration-300 text-xs flex-1 border border-gray-700/40 hover:border-emerald-400/30"
              >
                <FiActivity className="w-3.5 h-3.5 mr-1.5" />
                Logs
              </Link>
              <Link
                to={`/dashboard/usage/twitter`}
                className="flex items-center justify-center px-3 py-2 rounded-lg bg-dark-lighter hover:bg-gray-800 text-white hover:text-emerald-400 transition-all duration-300 text-xs flex-1 border border-gray-700/40 hover:border-emerald-400/30"
              >
                <FiBarChart2 className="w-3.5 h-3.5 mr-1.5" />
                Usage
              </Link>
            </div>
            <Link
              to={`/dashboard/settings/twitter`}
              className="flex items-center justify-center px-3 py-2 rounded-lg bg-dark-lighter hover:bg-gray-800 text-white hover:text-emerald-400 transition-all duration-300 text-xs w-full border border-gray-700/40 hover:border-emerald-400/30"
            >
              <FiSettings className="w-3.5 h-3.5 mr-1.5" />
              Configure
            </Link>
            
            <Link
              to="/dashboard/billing"
              className="flex items-center px-3 py-2 mt-1 text-purple-300 hover:text-purple-200 transition-colors text-xs w-full justify-center bg-purple-900/20 border border-purple-500/20 rounded-lg"
            >
              <FaRobot className="w-3.5 h-3.5 mr-1.5" />
              Upgrade Plan to Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAgentsList;