import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBarChart2, FiMessageCircle, FiClock, FiUsers } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';

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
    <div className="max-w-7xl mx-auto">
      {/* Header with gradient underline */}
      <div className="relative mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-400 hover:text-emerald-400 transition-colors mr-4"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Agent Usage Statistics</h1>
            <p className="text-gray-400 text-sm mt-1">{getAgentName()}</p>
          </div>
        </div>
        <div className="h-0.5 w-full bg-gradient-to-r from-emerald-400/20 to-blue-500/20 mt-4"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Overview Panel */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md">
          <div className="border-b border-white/5 px-4 py-3 flex items-center">
            <FiBarChart2 className="text-emerald-400 mr-2" />
            <h2 className="font-medium text-white text-sm">Overview</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-lighter/50 p-4 rounded-lg border border-white/5">
                <div className="flex items-center mb-1">
                  <FiMessageCircle className="text-emerald-400 w-4 h-4 mr-2" />
                  <p className="text-xs text-gray-400">Total Messages</p>
                </div>
                <p className="text-2xl font-bold text-white">{usageData.totalMessages.toLocaleString()}</p>
              </div>
              
              <div className="bg-dark-lighter/50 p-4 rounded-lg border border-white/5">
                <div className="flex items-center mb-1">
                  <IoDiamond className="text-blue-400 w-4 h-4 mr-2" />
                  <p className="text-xs text-gray-400">Total Tokens Used</p>
                </div>
                <p className="text-2xl font-bold text-white">{usageData.totalTokens.toLocaleString()}</p>
              </div>
              
              <div className="bg-dark-lighter/50 p-4 rounded-lg border border-white/5">
                <div className="flex items-center mb-1">
                  <FiClock className="text-emerald-400 w-4 h-4 mr-2" />
                  <p className="text-xs text-gray-400">Average Response Time</p>
                </div>
                <p className="text-2xl font-bold text-white">{usageData.averageResponseTime}</p>
              </div>
              
              <div className="bg-dark-lighter/50 p-4 rounded-lg border border-white/5">
                <div className="flex items-center mb-1">
                  <FiUsers className="text-blue-400 w-4 h-4 mr-2" />
                  <p className="text-xs text-gray-400">Active Channels</p>
                </div>
                <p className="text-2xl font-bold text-white">{usageData.activeChannels}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Usage Chart */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md">
          <div className="border-b border-white/5 px-4 py-3 flex items-center">
            <FiBarChart2 className="text-emerald-400 mr-2" />
            <h2 className="font-medium text-white text-sm">Monthly Usage</h2>
          </div>
          <div className="p-4">
            <div className="h-64 flex items-end justify-between">
              {usageData.monthlyStats.map((stat) => (
                <div key={stat.month} className="flex flex-col items-center">
                  <div 
                    className="w-16 bg-gradient-to-t from-emerald-400/30 to-blue-500/30 rounded-t-lg relative group"
                    style={{ height: `${(stat.messages / 600) * 200}px` }}
                  >
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-400 to-blue-500"></div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-dark-card/90 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {stat.messages.toLocaleString()}
                    </div>
                  </div>
                  <p className="mt-2 text-gray-400 text-xs">{stat.month}</p>
                  <p className="text-xs text-gray-500">{stat.messages.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Additional Usage Metrics Panel - Could be expanded in the future */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md lg:col-span-2">
          <div className="border-b border-white/5 px-4 py-3 flex items-center">
            <FiBarChart2 className="text-emerald-400 mr-2" />
            <h2 className="font-medium text-white text-sm">Usage Breakdown</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white">Token Usage by Day</h3>
                <div className="h-1.5 bg-dark-lighter rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">0</span>
                  <span className="text-emerald-400 font-medium">29,690 tokens today</span>
                  <span className="text-gray-400">50,000</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white">Response Time Trend</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span className="text-xs text-gray-400">Avg: 1.2s</span>
                  <div className="w-2 h-2 rounded-full bg-blue-400 ml-4"></div>
                  <span className="text-xs text-gray-400">Peak: 3.5s</span>
                  <div className="w-2 h-2 rounded-full bg-yellow-400 ml-4"></div>
                  <span className="text-xs text-gray-400">Min: 0.6s</span>
                </div>
                <div className="h-1.5 bg-dark-lighter rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-400 via-emerald-400 to-blue-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentUsage;