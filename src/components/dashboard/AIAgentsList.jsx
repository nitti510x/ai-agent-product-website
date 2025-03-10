import React from 'react';
import { Link } from 'react-router-dom';
import { FiSettings, FiActivity, FiBarChart2, FiHelpCircle } from 'react-icons/fi';
import { RiSlackFill, RiImageLine, RiFileTextLine, RiLinkedinBoxFill, RiWordpressFill, RiInstagramLine, RiFacebookBoxFill, RiTwitterXFill } from 'react-icons/ri';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';

function AIAgentsList() {
  // Define a consistent gradient matching the site style
  const mainGradient = 'from-emerald-400 to-blue-500';

  const agents = [
    {
      id: 'support',
      name: "IntellAgent Slack App",
      description: "AI-powered Slack integration assistant",
      icon: <RiSlackFill className="w-8 h-8" />,
      status: 'active',
      setupStatus: 'operational',
      type: 'support'
    },
    {
      id: 'team',
      name: "Image Creator",
      description: "Generate and edit images with AI",
      icon: <RiImageLine className="w-8 h-8" />,
      status: 'inactive',
      setupStatus: 'pending',
      type: 'team'
    },
    {
      id: 'analytics',
      name: "Copy Creator",
      description: "Generate engaging content and copy",
      icon: <RiFileTextLine className="w-8 h-8" />,
      status: 'inactive',
      setupStatus: 'pending',
      type: 'analytics'
    },
    {
      id: 'metrics',
      name: "LinkedIn Marketer",
      description: "Schedule and post content to LinkedIn",
      icon: <RiLinkedinBoxFill className="w-8 h-8" />,
      status: 'active',
      setupStatus: 'operational',
      type: 'metrics'
    },
    {
      id: 'wordpress',
      name: "WordPress Blogger",
      description: "Create and manage WordPress blog content",
      icon: <RiWordpressFill className="w-8 h-8" />,
      status: 'active',
      setupStatus: 'operational',
      type: 'wordpress'
    },
    {
      id: 'instagram',
      name: "Instagram Marketer",
      description: "Schedule and post content to Instagram",
      icon: <RiInstagramLine className="w-8 h-8" />,
      status: 'inactive',
      setupStatus: 'not-started',
      type: 'instagram'
    },
    {
      id: 'facebook',
      name: "Facebook Marketer",
      description: "Schedule and post content to Facebook",
      icon: <RiFacebookBoxFill className="w-8 h-8" />,
      status: 'active',
      setupStatus: 'operational',
      type: 'facebook'
    },
    {
      id: 'twitter',
      name: "X Marketer",
      description: "Schedule and post content to X (Twitter)",
      icon: <RiTwitterXFill className="w-8 h-8" />,
      status: 'inactive',
      setupStatus: 'not-started',
      type: 'twitter',
      disabled: true,
      upgradeRequired: true
    }
  ];

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
              <span className="text-red-500 text-[9px] font-bold">!</span>
            </div>
            <div className="absolute right-0 mt-2 px-3 py-1 bg-dark-card/90 backdrop-blur-sm rounded-lg text-xs text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 shadow-lg border border-white/5">
              Setup in progress
            </div>
          </div>
        );
      default:
        return (
          <div className="absolute top-3 right-3 group">
            <div className={`w-3.5 h-3.5 rounded-full ${agentStatus === 'inactive' ? 'bg-yellow-500' : 'border-2 border-red-500 flex items-center justify-center'}`}>
              {agentStatus !== 'inactive' && <span className="text-red-500 text-[9px] font-bold">!</span>}
            </div>
            <div className="absolute right-0 mt-2 px-3 py-1 bg-dark-card/90 backdrop-blur-sm rounded-lg text-xs text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 shadow-lg border border-white/5">
              {agentStatus === 'inactive' ? 'Agent is inactive' : 'Setup required'}
            </div>
          </div>
        );
    }
  };

  // Function to open Slack app
  const openSlackApp = () => {
    // Try to open Slack app with deep link to the user's organization
    window.open('slack://open', '_blank');
    
    // Fallback to web version if app doesn't open
    setTimeout(() => {
      window.open('https://app.slack.com/client', '_blank');
    }, 1000);
  };

  return (
    <div>
      {/* Page title */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Your AI Assistants</h2>
          <p className="text-gray-400 text-sm mt-1">Manage and monitor your active AI integrations</p>
        </div>
        <a
          href="https://app.slack.com/client"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2 px-4 bg-[#F7F7F7] hover:bg-gray-100 text-gray-800 rounded-lg transition-colors duration-300 font-bold"
        >
          Run in Slack
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet" width="20" height="20" alt="Slack Logo">
            <title>Slack Logo</title>
            <path d="M22,12 a6,6 0 1 1 6,-6 v6z M22,16 a6,6 0 0 1 0,12 h-16 a6,6 0 1 1 0,-12" fill="#36C5F0"></path>
            <path d="M48,22 a6,6 0 1 1 6,6 h-6z M32,6 a6,6 0 1 1 12,0v16a6,6 0 0 1 -12,0z" fill="#2EB67D"></path>
            <path d="M38,48 a6,6 0 1 1 -6,6 v-6z M54,32 a6,6 0 0 1 0,12 h-16 a6,6 0 1 1 0,-12" fill="#ECB22E"></path>
            <path d="M12,38 a6,6 0 1 1 -6,-6 h6z M16,38 a6,6 0 1 1 12,0v16a6,6 0 0 1 -12,0z" fill="#E01E5A"></path>
          </svg>
        </a>
      </div>

      {/* Agents grid - 3 across for better spacing and readability */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden ${!agent.disabled ? 'hover:border-emerald-400/30' : 'opacity-70'} transition-all duration-300 relative shadow-md hover:shadow-lg`}
          >
            {getSetupStatusIndicator(agent.setupStatus, agent.status, agent.disabled)}
            
            {/* Agent header with icon */}
            <div className="flex items-center p-4 pb-3 border-b border-white/5">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-dark-card to-dark-lighter flex items-center justify-center ${agent.disabled ? 'text-gray-500' : 'text-emerald-400'} mr-3`}>
                {agent.icon}
              </div>
              <div>
                <h3 className="font-medium text-white text-sm">
                  {agent.name}
                </h3>
                <p className="text-gray-400 text-xs">{agent.description}</p>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="p-4 pt-3 flex flex-col gap-2">
              <div className="flex justify-between gap-2">
                <Link
                  to={`/dashboard/activity/${agent.id}`}
                  className="flex items-center justify-center px-3 py-2 rounded-lg bg-dark-lighter hover:bg-gray-800 text-white hover:text-emerald-400 transition-all duration-300 text-xs flex-1 border border-gray-700/40 hover:border-emerald-400/30"
                >
                  <FiActivity className="w-3.5 h-3.5 mr-1.5" />
                  Logs
                </Link>
                <Link
                  to={`/dashboard/usage/${agent.id}`}
                  className="flex items-center justify-center px-3 py-2 rounded-lg bg-dark-lighter hover:bg-gray-800 text-white hover:text-emerald-400 transition-all duration-300 text-xs flex-1 border border-gray-700/40 hover:border-emerald-400/30"
                >
                  <FiBarChart2 className="w-3.5 h-3.5 mr-1.5" />
                  Usage
                </Link>
              </div>
              <Link
                to={`/dashboard/settings/${agent.id}`}
                className="flex items-center justify-center px-3 py-2 rounded-lg bg-dark-lighter hover:bg-gray-800 text-white hover:text-emerald-400 transition-all duration-300 text-xs w-full border border-gray-700/40 hover:border-emerald-400/30"
              >
                <FiSettings className="w-3.5 h-3.5 mr-1.5" />
                Configure
              </Link>
              
              {agent.setupStatus !== 'operational' && !agent.upgradeRequired && (
                <Link
                  to={`/dashboard/setup/${agent.id}`}
                  className="flex items-center mt-2 text-gray-400 hover:text-blue-400 transition-colors text-xs justify-center"
                >
                  <FiHelpCircle className="w-3.5 h-3.5 mr-1.5" />
                  Setup Guide
                </Link>
              )}
              
              {agent.upgradeRequired && (
                <Link
                  to="/dashboard/account/plans"
                  className="flex items-center px-3 py-2 mt-1 text-purple-300 hover:text-purple-200 transition-colors text-xs w-full justify-center bg-purple-900/20 border border-purple-500/20 rounded-lg"
                >
                  <FaRobot className="w-3.5 h-3.5 mr-1.5" />
                  Upgrade Plan to Access
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AIAgentsList;