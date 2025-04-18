import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSettings, FiActivity, FiBarChart2, FiHelpCircle } from 'react-icons/fi';
import { RiSlackFill, RiImageLine, RiFileTextLine, RiLinkedinBoxFill, RiWordpressFill, RiInstagramLine, RiFacebookBoxFill, RiTwitterXFill, RiSearchLine, RiFlowChart, RiRobot2Line, RiPulseLine, RiQuillPenLine, RiLayoutGridFill, RiAiGenerate, RiMagicLine, RiSparkling2Line } from 'react-icons/ri';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot, FaBrain, FaWandMagicSparkles } from 'react-icons/fa6';
import { apiUrl } from '../../config/api';
import { useOrganization } from '../../contexts/OrganizationContext';
import PageHeader from './PageHeader';

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
        <div className="absolute top-3 right-3 flex items-center z-20">
          <IoDiamond className="text-purple-400 w-4 h-4 mr-1" />
          <span className="text-xs text-purple-300">Premium</span>
        </div>
      );
    }
    
    switch (status) {
      case 'operational':
        return (
          <div className="absolute top-3 right-3 z-20 flex items-center">
            <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-lg ring-2 ring-emerald-500/50"></div>
          </div>
        );
      case 'pending':
        return (
          <div className="absolute top-3 right-3 z-20 flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-lg ring-2 ring-yellow-500/50"></div>
          </div>
        );
      default:
        return (
          <div className="absolute top-3 right-3 z-20 flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-400 shadow-lg ring-2 ring-red-500/50"></div>
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
          className="px-4 py-2 bg-[#1A1E23] hover:bg-black/30 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Your AI Marketing Team"
        description="Manage your AI agents' tasks and performance"
        actions={
          <div className="flex items-center gap-6">
            <Link 
              to="/dashboard/help/quicksetup" 
              className="flex items-center gap-2 text-white hover:text-gray-200 transition-all duration-300 group"
            >
              <FiSettings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500" />
              <span className="text-sm">Quick Setup Guide</span>
            </Link>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); openSlackApp(); }}
              className="flex items-center px-6 py-2 bg-[#4A154B] hover:bg-[#611f64] text-white font-medium rounded-lg border border-purple-300/20 transition-all duration-300 shadow-sm hover:shadow-purple-500/20 hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet" width="20" height="20" style={{ marginRight: '8px' }} alt="Slack Logo">
                <title>Slack Logo</title>
                <path d="M22,12 a6,6 0 1 1 6,-6 v6z M22,16 a6,6 0 0 1 0,12 h-16 a6,6 0 1 1 0,-12" fill="#36C5F0"></path>
                <path d="M48,22 a6,6 0 1 1 6,6 h-6z M32,6 a6,6 0 1 1 12,0v16a6,6 0 0 1 -12,0z" fill="#2EB67D"></path>
                <path d="M38,48 a6,6 0 1 1 -6,6 v-6z M54,32 a6,6 0 0 1 0,12 h-16 a6,6 0 1 1 0,-12" fill="#ECB22E"></path>
                <path d="M12,38 a6,6 0 1 1 -6,-6 h6z M16,38 a6,6 0 1 1 12,0v16a6,6 0 0 1 -12,0z" fill="#E01E5A"></path>
              </svg>
              <span>Run in Slack</span>
            </a>
          </div>
        }
      />
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-lg mb-6">
          Error loading agents: {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-[#1A1E23] border border-gray-700/40 rounded-xl overflow-hidden shadow-md animate-pulse">
                <div className="p-6">
                  <div className="h-6 w-24 bg-gray-700/50 rounded mb-4"></div>
                  <div className="h-4 w-full bg-gray-700/30 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-700/30 rounded"></div>
                </div>
              </div>
            ))}
          </div>
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
              // Force all agents to show as operational for now
              const setupStatus = 'operational';
              
              return (
                <div 
                  key={agent.system_name} 
                  className={`bg-[#1A1E23] border border-gray-700/40 rounded-xl overflow-hidden shadow-md relative ${
                    isDisabled ? 'opacity-75' : ''
                  }`}
                >
                  {getSetupStatusIndicator(setupStatus, 'active', isDisabled)}
                  
                  {/* Agent header with icon */}
                  <div className="flex items-center p-4 pb-3 border-b border-gray-800/30">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-[#111418] to-[#1E2328] flex items-center justify-center ${isDisabled ? 'text-gray-500' : 'text-emerald-400'} mr-3`}>
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
                            className="flex items-center justify-center px-3 py-2 rounded-lg bg-[#111418] hover:bg-black/30 text-white hover:text-emerald-400 transition-all duration-300 text-xs flex-1 border border-gray-800/40 hover:border-emerald-400/30"
                          >
                            <FiActivity className="mr-1" />
                            Activity
                          </Link>
                          <Link
                            to={`/dashboard/usage/${agent.system_name}`}
                            className="flex items-center justify-center px-3 py-2 rounded-lg bg-[#111418] hover:bg-black/30 text-white hover:text-emerald-400 transition-all duration-300 text-xs flex-1 border border-gray-800/40 hover:border-emerald-400/30"
                          >
                            <FiBarChart2 className="mr-1" />
                            Usage
                          </Link>
                        </div>
                        <Link
                          to={`/dashboard/settings/${agent.system_name}`}
                          className="flex items-center justify-center px-3 py-2 rounded-lg bg-[#111418] hover:bg-black/30 text-white hover:text-emerald-400 transition-all duration-300 text-xs w-full border border-gray-800/40 hover:border-emerald-400/30"
                        >
                          <FiSettings className="mr-1" />
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
                        className="flex items-center justify-center px-3 py-2 rounded-lg bg-[#111418] hover:bg-black/30 text-white hover:text-emerald-400 transition-all duration-300 text-xs w-full border border-gray-800/40 hover:border-emerald-400/30"
                      >
                        <FiHelpCircle className="mr-1" />
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