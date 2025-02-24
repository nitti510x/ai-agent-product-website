import React from 'react';
import { Link } from 'react-router-dom';
import { FiSettings, FiActivity, FiBarChart2, FiHelpCircle } from 'react-icons/fi';
import { RiSlackFill, RiImageLine, RiFileTextLine, RiLinkedinBoxFill, RiWordpressFill, RiInstagramLine, RiFacebookBoxFill, RiTwitterXFill } from 'react-icons/ri';

function AIAgentsList() {
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
          <div className="absolute top-4 right-4 group">
            <div className="w-4 h-4 bg-primary rounded-full" />
            <div className="absolute right-0 mt-2 px-3 py-1 bg-dark-card rounded-lg text-sm text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Agent is operational
            </div>
          </div>
        );
      case 'pending':
        return (
          <div className="absolute top-4 right-4 group">
            <div className="w-4 h-4 rounded-full border-2 border-yellow-500 flex items-center justify-center">
              <span className="text-yellow-500 text-[10px] font-bold">!</span>
            </div>
            <div className="absolute right-0 mt-2 px-3 py-1 bg-dark-card rounded-lg text-sm text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Setup in progress
            </div>
          </div>
        );
      default:
        return (
          <div className="absolute top-4 right-4 group">
            <div className={`w-4 h-4 rounded-full ${agentStatus === 'inactive' ? 'bg-yellow-500' : 'border-2 border-red-500 flex items-center justify-center'}`}>
              {agentStatus !== 'inactive' && <span className="text-red-500 text-[10px] font-bold">!</span>}
            </div>
            <div className="absolute right-0 mt-2 px-3 py-1 bg-dark-card rounded-lg text-sm text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {agentStatus === 'inactive' ? 'Agent is inactive' : 'Setup required'}
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">AI Assistants</h1>
          <p className="text-gray-400 mt-2">Your active AI integrations</p>
        </div>
        <Link
          to="/dashboard/usage"
          className="btn-primary hover:shadow-glow-strong transition-all duration-300"
        >
          View Overall Usage
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-dark-lighter p-6 rounded-xl border border-dark-card hover:border-primary transition-all duration-300 relative"
          >
            {getSetupStatusIndicator(agent.setupStatus, agent.status)}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-dark rounded-xl flex items-center justify-center mb-4 text-primary">
                {agent.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-2">
                {agent.name}
              </h3>
              <p className="text-gray-400 text-sm mb-6">{agent.description}</p>
              <div className="flex space-x-4">
                <Link
                  to={`/dashboard/activity/${agent.id}`}
                  className="flex items-center px-4 py-2 rounded-lg bg-dark hover:bg-dark-card text-gray-400 hover:text-primary transition-all duration-300 hover:shadow-glow"
                >
                  <FiActivity className="w-5 h-5 mr-2" />
                  Logs
                </Link>
                <Link
                  to={`/dashboard/usage/${agent.id}`}
                  className="flex items-center px-4 py-2 rounded-lg bg-dark hover:bg-dark-card text-gray-400 hover:text-primary transition-all duration-300 hover:shadow-glow"
                >
                  <FiBarChart2 className="w-5 h-5 mr-2" />
                  Usage
                </Link>
                <Link
                  to={`/dashboard/settings/${agent.id}`}
                  className="flex items-center px-4 py-2 rounded-lg bg-dark hover:bg-dark-card text-gray-400 hover:text-primary transition-all duration-300 hover:shadow-glow"
                >
                  <FiSettings className="w-5 h-5 mr-2" />
                  Configure
                </Link>
              </div>
              {agent.setupStatus !== 'operational' && (
                <Link
                  to={`/dashboard/setup/${agent.id}`}
                  className="flex items-center mt-4 text-gray-400 hover:text-secondary transition-colors"
                >
                  <FiHelpCircle className="w-5 h-5 mr-2" />
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