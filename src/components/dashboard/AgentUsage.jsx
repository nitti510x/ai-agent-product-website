import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

function AgentUsage() {
  const { agentId } = useParams();
  const navigate = useNavigate();

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

  const usageData = {
    totalMessages: 1234,
    totalTokens: 45678,
    averageResponseTime: '1.2s',
    activeChannels: 5,
    monthlyStats: [
      { month: 'Jan', messages: 300 },
      { month: 'Feb', messages: 450 },
      { month: 'Mar', messages: 600 },
      { month: 'Apr', messages: 550 },
    ]
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
            <h1 className="text-3xl font-bold text-gray-100">Agent Usage Statistics</h1>
            <p className="text-gray-400 mt-1">{getAgentName()}</p>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-dark-lighter p-6 rounded-xl border border-dark-card">
          <h2 className="text-xl font-bold text-gray-100 mb-4">Overview</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400">Total Messages</p>
              <p className="text-2xl font-bold text-gray-100">{usageData.totalMessages}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Tokens Used</p>
              <p className="text-2xl font-bold text-gray-100">{usageData.totalTokens}</p>
            </div>
            <div>
              <p className="text-gray-400">Average Response Time</p>
              <p className="text-2xl font-bold text-gray-100">{usageData.averageResponseTime}</p>
            </div>
            <div>
              <p className="text-gray-400">Active Channels</p>
              <p className="text-2xl font-bold text-gray-100">{usageData.activeChannels}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-lighter p-6 rounded-xl border border-dark-card">
          <h2 className="text-xl font-bold text-gray-100 mb-4">Monthly Usage</h2>
          <div className="h-64 flex items-end justify-between">
            {usageData.monthlyStats.map((stat) => (
              <div key={stat.month} className="flex flex-col items-center">
                <div 
                  className="w-16 bg-primary rounded-t-lg"
                  style={{ height: `${(stat.messages / 600) * 200}px` }}
                ></div>
                <p className="mt-2 text-gray-400">{stat.month}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentUsage;