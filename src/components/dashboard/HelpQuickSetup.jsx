import React from 'react';
import { FiPlay, FiSettings, FiSlack, FiGlobe, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa6';
import PageHeader from './PageHeader';

function HelpQuickSetup() {
  // Setup steps
  const setupSteps = [
    {
      id: 1,
      title: 'Choose Your AI Assistant',
      description: 'Select the right AI assistant for your needs from our pre-configured options.',
      icon: <FaRobot className="text-emerald-400 w-6 h-6" />,
      details: [
        'Navigate to the AI Agents section in your dashboard',
        'Browse through the available assistant templates',
        'Select an assistant that matches your use case',
        'Click "Create" to add it to your workspace'
      ]
    },
    {
      id: 2,
      title: 'Configure Your Assistant',
      description: 'Customize your AI assistant to match your brand and specific requirements.',
      icon: <FiSettings className="text-emerald-400 w-6 h-6" />,
      details: [
        'Set a name and description for your assistant',
        'Configure the assistant\'s personality and tone',
        'Add custom knowledge and instructions',
        'Set up response templates and fallback messages'
      ]
    },
    {
      id: 3,
      title: 'Connect to Your Platforms',
      description: 'Integrate your assistant with the platforms where you need AI support.',
      icon: <FiSlack className="text-emerald-400 w-6 h-6" />,
      details: [
        'Go to the Integrations tab in your assistant settings',
        'Select the platforms you want to connect (Slack, WordPress, etc.)',
        'Follow the step-by-step integration instructions',
        'Authorize the connections and set access permissions'
      ]
    },
    {
      id: 4,
      title: 'Test Your Assistant',
      description: 'Verify that your assistant is working correctly before deploying it.',
      icon: <FiPlay className="text-emerald-400 w-6 h-6" />,
      details: [
        'Use the test console in the assistant settings',
        'Try different types of queries and requests',
        'Check that responses match your expectations',
        'Make adjustments to improve performance if needed'
      ]
    },
    {
      id: 5,
      title: 'Deploy and Monitor',
      description: 'Launch your assistant and track its performance over time.',
      icon: <FiGlobe className="text-emerald-400 w-6 h-6" />,
      details: [
        'Set your assistant to "Active" status',
        'Share access links or instructions with your team',
        'Monitor usage statistics and performance metrics',
        'Collect feedback and make ongoing improvements'
      ]
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Quick Setup Guide"
        description="Get started with GeniusOS in just a few simple steps"
      />

      {/* Setup Steps */}
      <div className="space-y-6 mb-8">
        {setupSteps.map((step, index) => (
          <div key={step.id} className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6">
            <div className="flex items-start">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-900/30 border border-emerald-700/30 mr-4 flex-shrink-0">
                {step.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-2xl font-bold text-white mr-2">Step {step.id}: {step.title}</h3>
                </div>
                <p className="text-gray-400 mb-4">{step.description}</p>
                
                <div className="bg-dark-card/50 rounded-lg p-4">
                  <h4 className="text-white font-bold mb-3">How to do it:</h4>
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <FiCheckCircle className="text-emerald-400 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-400">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Tutorial */}
      <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6 mb-8">
        <div className="flex items-center mb-6">
          <FiPlay className="text-emerald-400 w-6 h-6 mr-3" />
          <h3 className="text-2xl font-bold text-white">Video Tutorial</h3>
        </div>
        
        <div className="aspect-video bg-dark-card/50 rounded-lg flex items-center justify-center mb-4">
          <div className="text-center p-8">
            <FiPlay className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <p className="text-white font-bold text-lg mb-2">Getting Started with GeniusOS</p>
            <p className="text-gray-400">A comprehensive guide to setting up and using your AI assistants</p>
          </div>
        </div>
        
        <a 
          href="#" 
          className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          View more tutorials
        </a>
      </div>

      {/* Need Help? */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-700/30 rounded-2xl p-6 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Need Personalized Help?</h3>
        <p className="text-gray-400 mb-4">
          Our team can guide you through the setup process or help you customize your assistants for specific use cases.
        </p>
        <a 
          href="/dashboard/help/support" 
          className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
        >
          <FiMessageSquare className="mr-2" />
          Contact Support
        </a>
      </div>
    </div>
  );
}

export default HelpQuickSetup;
