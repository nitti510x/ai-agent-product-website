import React, { useState } from 'react';
import { FiSettings, FiCheckCircle, FiCreditCard, FiSlack, FiImage, FiFileText, FiArrowRight } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

function QuickSetup() {
  const [completedSteps, setCompletedSteps] = useState({
    profile: true,
    subscription: true,
    tokens: false,
    agents: false
  });

  // Calculate progress percentage
  const totalSteps = Object.keys(completedSteps).length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercentage = Math.round((completedCount / totalSteps) * 100);

  // Setup steps data
  const setupSteps = [
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Set up your profile information and preferences',
      icon: <FiSettings className="w-6 h-6" />,
      path: '/dashboard/account/profile',
      completed: completedSteps.profile
    },
    {
      id: 'subscription',
      title: 'Choose a Subscription Plan',
      description: 'Select a subscription plan that fits your needs',
      icon: <FiCreditCard className="w-6 h-6" />,
      path: '/dashboard/subscription',
      completed: completedSteps.subscription
    },
    {
      id: 'tokens',
      title: 'Purchase Tokens',
      description: 'Buy tokens to use with our AI agents',
      icon: <FaRobot className="w-6 h-6" />,
      path: '/dashboard/tokens/purchase',
      completed: completedSteps.tokens
    },
    {
      id: 'agents',
      title: 'Configure Your First AI Agent',
      description: 'Set up and configure your first AI agent',
      icon: <FiSlack className="w-6 h-6" />,
      path: '/dashboard/slack',
      completed: completedSteps.agents
    }
  ];

  // Available AI agents
  const availableAgents = [
    {
      id: 'slack',
      name: 'Slack App',
      description: 'Integrate AI assistance directly into your Slack workspace',
      icon: <FiSlack className="w-8 h-8" />,
      path: '/dashboard/slack',
      tokenCost: 500
    },
    {
      id: 'image',
      name: 'Image Creator',
      description: 'Generate custom images using AI technology',
      icon: <FiImage className="w-8 h-8" />,
      path: '/dashboard/image',
      tokenCost: 1000
    },
    {
      id: 'copy',
      name: 'Copy Creator',
      description: 'Create marketing copy, blog posts, and more with AI',
      icon: <FiFileText className="w-8 h-8" />,
      path: '/dashboard/copy',
      tokenCost: 750
    }
  ];

  // Mark a step as completed
  const markAsCompleted = (stepId) => {
    setCompletedSteps({
      ...completedSteps,
      [stepId]: true
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Quick Setup</h2>
          <p className="text-gray-400 text-sm mt-1">Complete these steps to get started with our platform</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6 mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-white">Setup Progress</h3>
          <span className="text-primary font-medium">{progressPercentage}% Complete</span>
        </div>
        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-in-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="mt-2 text-gray-400 text-sm">
          {completedCount} of {totalSteps} steps completed
        </div>
      </div>

      {/* Setup Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {setupSteps.map((step) => (
          <div 
            key={step.id}
            className={`bg-dark-card rounded-2xl shadow-2xl border ${
              step.completed ? 'border-primary/30' : 'border-dark-card/30'
            } p-6 transition-all duration-300 hover:border-primary/50`}
          >
            <div className="flex items-start">
              <div className={`p-3 rounded-lg mr-4 ${
                step.completed ? 'bg-primary/20 text-primary' : 'bg-gray-700/50 text-gray-400'
              }`}>
                {step.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  {step.completed && (
                    <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full flex items-center">
                      <FiCheckCircle className="mr-1" />
                      Completed
                    </span>
                  )}
                </div>
                <p className="text-gray-400 mb-4">{step.description}</p>
                <Link
                  to={step.path}
                  className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                    step.completed 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-primary hover:bg-primary/80 text-black font-medium'
                  }`}
                >
                  {step.completed ? 'View Details' : 'Complete Step'}
                  <FiArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Agents */}
      <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Recommended AI Agents</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableAgents.map((agent) => (
            <div key={agent.id} className="bg-dark-card/70 border border-gray-700 rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-dark-card/70 rounded-full mb-4 text-primary">
                  {agent.icon}
                </div>
                <h4 className="text-white font-medium mb-2">{agent.name}</h4>
                <p className="text-gray-400 text-sm mb-4">{agent.description}</p>
                <div className="text-gray-300 mb-4 flex items-center">
                  <FaRobot className="text-primary mr-1" />
                  <span>{agent.tokenCost} tokens</span>
                </div>
                <Link
                  to={agent.path}
                  className="w-full bg-primary hover:bg-primary/80 text-black font-medium py-2 rounded-lg transition-colors flex items-center justify-center"
                >
                  Set Up Now
                  <FiArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuickSetup;
