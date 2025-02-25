import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

function SetupGuide() {
  const navigate = useNavigate();
  const { agentId } = useParams();

  // Get agent name based on ID
  const getAgentName = () => {
    const agents = {
      'support': 'Slack App',
      'team': 'Image Creator',
      'analytics': 'Copy Creator',
      'metrics': 'LinkedIn Poster',
      'wordpress': 'WordPress Blogger'
    };
    return agents[agentId] || 'AI Agent';
  };

  const setupSteps = {
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-400 hover:text-primary transition-colors mr-4"
          >
            <FiArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Setup Guide</h1>
            <p className="text-gray-400 mt-1">{getAgentName()}</p>
          </div>
        </div>
      </div>

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
          {setupSteps[agentId]?.map((step, index) => (
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
    </div>
  );
}

export default SetupGuide;
