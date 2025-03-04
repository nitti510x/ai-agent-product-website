import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiMessageSquare, FiCpu, FiPower, FiArrowLeft, FiBarChart2 } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';

function OverallUsage() {
  const navigate = useNavigate();
  
  // Define a consistent gradient matching the site style
  const mainGradient = 'from-emerald-400 to-blue-500';
  
  const usageStats = {
    totalRequests: 15234,
    activeAgents: 4,
    inactiveAgents: 2,
    totalTokensUsed: '1.2M',
    monthlyUsage: [
      { month: 'Jan', requests: 2500 },
      { month: 'Feb', requests: 3200 },
      { month: 'Mar', requests: 4100 },
      { month: 'Apr', requests: 5400 },
    ],
    topAgents: [
      { name: 'Customer Support Bot', requests: 6234, responseTime: '0.8s' },
      { name: 'Team Assistant', requests: 4521, responseTime: '1.1s' },
      { name: 'Data Analyzer', requests: 2845, responseTime: '2.3s' },
      { name: 'Performance Tracker', requests: 1634, responseTime: '1.5s' },
    ],
    requestTypes: [
      { type: 'Customer Support', percentage: 40 },
      { type: 'Team Coordination', percentage: 30 },
      { type: 'Data Analysis', percentage: 20 },
      { type: 'Performance Tracking', percentage: 10 },
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
            <h1 className="text-2xl font-bold text-white">Overall Usage Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Analytics and performance metrics for all your AI assistants</p>
          </div>
        </div>
        <div className="h-0.5 w-full bg-gradient-to-r from-emerald-400/20 to-blue-500/20 mt-4"></div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { 
            icon: <FiMessageSquare className="w-5 h-5" />, 
            label: 'Total Requests', 
            value: usageStats.totalRequests.toLocaleString(),
            color: 'text-emerald-400'
          },
          { 
            icon: <FiUsers className="w-5 h-5" />, 
            label: 'Active Agents', 
            value: usageStats.activeAgents,
            color: 'text-emerald-400'
          },
          { 
            icon: <FiPower className="w-5 h-5" />, 
            label: 'Inactive Agents', 
            value: usageStats.inactiveAgents,
            color: 'text-yellow-400'
          },
          { 
            icon: <IoDiamond className="w-5 h-5" />, 
            label: 'Total Tokens Used', 
            value: usageStats.totalTokensUsed,
            color: 'text-blue-400'
          },
        ].map((metric, index) => (
          <div 
            key={index} 
            className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-xs mb-1">{metric.label}</p>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-dark-card to-dark-lighter flex items-center justify-center ${metric.color}`}>
                {metric.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Usage Graph and Request Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Monthly Usage Graph */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md">
          <div className="border-b border-white/5 px-4 py-3 flex items-center">
            <FiBarChart2 className="text-emerald-400 mr-2" />
            <h2 className="font-medium text-white text-sm">Monthly Usage Trends</h2>
          </div>
          <div className="p-4">
            <div className="h-64 flex items-end justify-between">
              {usageStats.monthlyUsage.map((month) => (
                <div key={month.month} className="flex flex-col items-center">
                  <div 
                    className="w-16 bg-gradient-to-t from-emerald-400/30 to-blue-500/30 rounded-t-lg relative group"
                    style={{ height: `${(month.requests / 5400) * 200}px` }}
                  >
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-400 to-blue-500"></div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-dark-card/90 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {month.requests.toLocaleString()}
                    </div>
                  </div>
                  <p className="mt-2 text-gray-400 text-xs">{month.month}</p>
                  <p className="text-xs text-gray-500">{month.requests.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Request Type Distribution */}
        <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md">
          <div className="border-b border-white/5 px-4 py-3 flex items-center">
            <FiBarChart2 className="text-emerald-400 mr-2" />
            <h2 className="font-medium text-white text-sm">Request Type Distribution</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {usageStats.requestTypes.map((type) => (
                <div key={type.type}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300 text-sm">{type.type}</span>
                    <span className="text-gray-400 text-sm">{type.percentage}%</span>
                  </div>
                  <div className="h-2 bg-dark-lighter rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full"
                      style={{ width: `${type.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Agents */}
      <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md">
        <div className="border-b border-white/5 px-4 py-3 flex items-center">
          <FiUsers className="text-emerald-400 mr-2" />
          <h2 className="font-medium text-white text-sm">Top Performing Agents</h2>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-3 text-gray-400 text-xs font-medium">Agent Name</th>
                <th className="pb-3 text-gray-400 text-xs font-medium">Total Requests</th>
                <th className="pb-3 text-gray-400 text-xs font-medium">Avg Response Time</th>
                <th className="pb-3 text-gray-400 text-xs font-medium">Usage</th>
              </tr>
            </thead>
            <tbody>
              {usageStats.topAgents.map((agent, index) => (
                <tr 
                  key={agent.name} 
                  className={index !== usageStats.topAgents.length - 1 ? "border-b border-white/5" : ""}
                >
                  <td className="py-3 text-white text-sm">{agent.name}</td>
                  <td className="py-3 text-white text-sm">{agent.requests.toLocaleString()}</td>
                  <td className="py-3 text-white text-sm">{agent.responseTime}</td>
                  <td className="py-3">
                    <div className="w-full bg-dark-lighter rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full"
                        style={{ width: `${(agent.requests / usageStats.totalRequests) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OverallUsage;