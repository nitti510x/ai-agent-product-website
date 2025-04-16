import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSettings, FiActivity, FiBarChart2, FiHelpCircle } from 'react-icons/fi';
import { RiSlackFill, RiImageLine, RiFileTextLine, RiLinkedinBoxFill, RiWordpressFill, RiInstagramLine, RiFacebookBoxFill, RiTwitterXFill, RiSearchLine, RiFlowChart, RiRobot2Line, RiPulseLine, RiQuillPenLine, RiLayoutGridFill, RiAiGenerate, RiMagicLine, RiSparkling2Line } from 'react-icons/ri';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot, FaBrain, FaWandMagicSparkles } from 'react-icons/fa6';
import { apiUrl } from '../../config/api';
import { useOrganization } from '../../contexts/OrganizationContext';

function AIAgentsList() {
  // Define a consistent gradient matching the site style
  const mainGradient = 'from-emerald-400 to-blue-500';
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { subscription, getPlanName } = useOrganization();

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
        
        // Filter out background agents
        const filteredAgents = (data.agents || []).filter(agent => !agent.is_background_agent);
        console.log('Filtered agents (excluding background agents):', filteredAgents);
        
        setAgents(filteredAgents);
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
        return <RiPulseLine className="w-8 h-8" />;
      case 'ai_content_manager_agent':
        return <FaBrain className="w-8 h-8" />;
      case 'market_research_agent':
        return <RiSearchLine className="w-8 h-8" />;
      case 'content_writer_agent':
        return <RiQuillPenLine className="w-8 h-8" />;
      case 'image_generator_agent':
        return <RiImageLine className="w-8 h-8" />;
      case 'echo_prompt_agent':
        return <FaWandMagicSparkles className="w-8 h-8" />;
      case 'workflow_helper_agent':
        return <RiFlowChart className="w-8 h-8" />;
      case 'linkedin_influencer_agent':
        return <RiLinkedinBoxFill className="w-8 h-8" />;
      case 'facebook_influencer_agent':
        return <RiFacebookBoxFill className="w-8 h-8" />;
      case 'instagram_influencer_agent':
        return <RiInstagramLine className="w-8 h-8" />;
      case 'twitter_marketer_agent':
        return <RiTwitterXFill className="w-8 h-8" />;
      case 'wordpress_blogger_agent':
        return <RiWordpressFill className="w-8 h-8" />;
      default:
        return <FaRobot className="w-8 h-8" />;
    }
  };

  // Function to determine if an agent is available in the user's plan
  const isAgentInUserPlan = (agent) => {
    const currentPlan = getPlanName().toLowerCase();
    
    if (currentPlan.includes('pro')) {
      return agent.in_pro_plan === true;
    } else if (currentPlan.includes('business')) {
      return agent.in_business_plan === true;
    } else {
      // Default to starter plan
      return agent.in_starter_plan === true;
    }
  };

  // Function to get the setup status indicator
  const getSetupStatusIndicator = (status, operationalStatus, isDisabled) => {
    if (isDisabled) {
      return (
        <div className="absolute top-3 right-3 flex items-center">
          <IoDiamond className="text-purple-400 w-4 h-4 mr-1" />
          <span className="text-xs text-purple-300">Premium</span>
        </div>
      );
    }
    
    switch (status) {
      case 'operational':
        return (
          <div className="absolute top-3 right-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-glow-sm"></div>
          </div>
        );
      case 'pending':
        return (
          <div className="absolute top-3 right-3">
            <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-glow-sm"></div>
          </div>
        );
      default:
        return (
          <div className="absolute top-3 right-3">
            <div className="w-2 h-2 rounded-full bg-gray-400 shadow-glow-sm"></div>
          </div>
        );
    }
  };

  // Function to open Slack app
  const openSlackApp = () => {
    window.open('https://slack.com/app', '_blank');
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-400 mb-4">Error loading agents: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-dark-card hover:bg-dark-lighter text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Your AI Assistants</h1>
          <p className="text-gray-400 mt-1">Track your AI assistants' usage and performance</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/dashboard/help/quicksetup" 
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <FiSettings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
            <span className="font-medium">Quick Setup Guide</span>
          </Link>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); openSlackApp(); }}
            className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:shadow-xl transition-all duration-300 shadow-lg"
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
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-lg mb-6">
          Error loading agents: {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md animate-pulse">
              <div className="p-4 pb-3 border-b border-white/5 flex items-center">
                <div className="w-10 h-10 rounded-lg bg-dark-lighter mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-dark-lighter rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-dark-lighter rounded w-1/2"></div>
                </div>
              </div>
              <div className="p-4 pt-3">
                <div className="flex justify-between gap-2 mb-2">
                  <div className="h-8 bg-dark-lighter rounded flex-1"></div>
                  <div className="h-8 bg-dark-lighter rounded flex-1"></div>
                </div>
                <div className="h-8 bg-dark-lighter rounded w-full"></div>
              </div>
            </div>
          ))
        ) : agents.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <FaRobot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No agents available</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              There are no AI agents available for your current plan. 
              Upgrade your subscription to access our AI assistant tools.
            </p>
            <Link 
              to="/dashboard/account/billing"
              className="inline-flex items-center px-4 py-2 mt-4 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white transition-all duration-300 text-sm hover:shadow-glow"
            >
              <IoDiamond className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Link>
          </div>
        ) : (
          <>
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
                    {isDisabled ? (
                      // Show upgrade button for agents not in the current plan
                      <Link
                        to="/dashboard/account/billing"
                        className="flex items-center justify-center px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white transition-all duration-300 text-xs w-full border border-purple-400/30 hover:shadow-glow"
                      >
                        <IoDiamond className="w-3.5 h-3.5 mr-1.5" />
                        Upgrade Plan to Access
                      </Link>
                    ) : (
                      // Show normal action buttons for available agents
                      <>
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
                      </>
                    )}
                    
                    {/* Always show Setup Guide link for all agents */}
                    {isDisabled ? (
                      <Link
                        to={`/dashboard/agents/${agent.system_name}`}
                        className="flex items-center mt-2 text-purple-400 hover:text-purple-300 transition-colors text-xs justify-center"
                      >
                        <FiHelpCircle className="w-3.5 h-3.5 mr-1.5" />
                        Learn More
                      </Link>
                    ) : (
                      <Link
                        to={`/dashboard/setup/${agent.system_name}`}
                        className="flex items-center mt-2 text-gray-400 hover:text-blue-400 transition-colors text-xs justify-center"
                      >
                        <FiHelpCircle className="w-3.5 h-3.5 mr-1.5" />
                        Setup Guide
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default AIAgentsList;