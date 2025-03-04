import React from 'react';
import { Link } from 'react-router-dom';
import { FiSettings, FiActivity, FiBarChart2, FiHelpCircle } from 'react-icons/fi';
import { RiSlackFill, RiImageLine, RiFileTextLine, RiLinkedinBoxFill, RiWordpressFill, RiInstagramLine, RiFacebookBoxFill, RiTwitterXFill } from 'react-icons/ri';

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
      setupStatus: 'not-started',
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
      status: 'inactive',
      setupStatus: 'not-started',
      type: 'facebook'
    },
    {
      id: 'twitter',
      name: "X Marketer",
      description: "Schedule and post content to X (Twitter)",
      icon: <RiTwitterXFill className="w-8 h-8" />,
      status: 'inactive',
      setupStatus: 'not-started',
      type: 'twitter'
    }
  ];

  const getSetupStatusIndicator = (status, agentStatus) => {
    switch (status) {
      case 'operational':
        return (
          <div className="absolute top-3 right-3 group">
            <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-glow-sm" />
            <div className="absolute right-0 mt-2 px-3 py-1 bg-dark-card/90 backdrop-blur-sm rounded-lg text-xs text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 shadow-lg border border-white/5">
              Agent is operational
            </div>
          </div>
        );
      case 'pending':
        return (
          <div className="absolute top-3 right-3 group">
            <div className="w-3 h-3 rounded-full border-2 border-yellow-500 flex items-center justify-center">
              <span className="text-yellow-500 text-[8px] font-bold">!</span>
            </div>
            <div className="absolute right-0 mt-2 px-3 py-1 bg-dark-card/90 backdrop-blur-sm rounded-lg text-xs text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 shadow-lg border border-white/5">
              Setup in progress
            </div>
          </div>
        );
      default:
        return (
          <div className="absolute top-3 right-3 group">
            <div className={`w-3 h-3 rounded-full ${agentStatus === 'inactive' ? 'bg-yellow-500' : 'border-2 border-red-500 flex items-center justify-center'}`}>
              {agentStatus !== 'inactive' && <span className="text-red-500 text-[8px] font-bold">!</span>}
            </div>
            <div className="absolute right-0 mt-2 px-3 py-1 bg-dark-card/90 backdrop-blur-sm rounded-lg text-xs text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 shadow-lg border border-white/5">
              {agentStatus === 'inactive' ? 'Agent is inactive' : 'Setup required'}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with gradient underline */}
      <div className="relative mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">AI Assistants</h1>
            <p className="text-gray-400 text-sm mt-1">Your active AI integrations</p>
          </div>
          <Link
            to="/dashboard/usage"
            className="px-4 py-2 bg-dark-card/80 border border-emerald-400/20 text-emerald-400 rounded-lg hover:bg-dark-card hover:border-emerald-400/40 transition-all duration-300 text-sm font-medium flex items-center"
          >
            <FiBarChart2 className="mr-2" />
            View Overall Usage
          </Link>
        </div>
        <div className="h-0.5 w-full bg-gradient-to-r from-emerald-400/20 to-blue-500/20 mt-4"></div>
      </div>

      {/* Agents grid - 4 across */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden hover:border-emerald-400/30 transition-all duration-300 relative shadow-md hover:shadow-lg"
          >
            {getSetupStatusIndicator(agent.setupStatus, agent.status)}
            
            {/* Agent header with icon */}
            <div className="flex items-center p-4 border-b border-white/5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-dark-card to-dark-lighter flex items-center justify-center text-emerald-400 mr-3">
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
            <div className="p-3 flex flex-wrap gap-2">
              <Link
                to={`/dashboard/activity/${agent.id}`}
                className="flex items-center px-3 py-1.5 rounded-lg bg-dark-lighter hover:bg-dark-card text-gray-400 hover:text-emerald-400 transition-all duration-300 text-xs"
              >
                <FiActivity className="w-3.5 h-3.5 mr-1.5" />
                Logs
              </Link>
              <Link
                to={`/dashboard/usage/${agent.id}`}
                className="flex items-center px-3 py-1.5 rounded-lg bg-dark-lighter hover:bg-dark-card text-gray-400 hover:text-emerald-400 transition-all duration-300 text-xs"
              >
                <FiBarChart2 className="w-3.5 h-3.5 mr-1.5" />
                Usage
              </Link>
              <Link
                to={`/dashboard/settings/${agent.id}`}
                className="flex items-center px-3 py-1.5 rounded-lg bg-dark-lighter hover:bg-dark-card text-gray-400 hover:text-emerald-400 transition-all duration-300 text-xs"
              >
                <FiSettings className="w-3.5 h-3.5 mr-1.5" />
                Configure
              </Link>
              
              {agent.setupStatus !== 'operational' && (
                <Link
                  to={`/dashboard/setup/${agent.id}`}
                  className="flex items-center px-3 py-1.5 mt-2 text-gray-400 hover:text-blue-400 transition-colors text-xs w-full justify-center bg-dark-lighter/50 rounded-lg"
                >
                  <FiHelpCircle className="w-3.5 h-3.5 mr-1.5" />
                  Setup Guide
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