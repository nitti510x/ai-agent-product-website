import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiMessageSquare, FiCpu, FiPower, FiArrowLeft } from 'react-icons/fi';

function OverallUsage() {
  const navigate = useNavigate();
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
    <div>
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-400 hover:text-primary transition-colors mr-4"
        >
          <FiArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-100">Overall Usage Dashboard</h1>
      </div>
      
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { icon: <FiMessageSquare />, label: 'Total Requests', value: usageStats.totalRequests.toLocaleString() },
          { icon: <FiUsers />, label: 'Active Agents', value: usageStats.activeAgents },
          { icon: <FiPower />, label: 'Inactive Agents', value: usageStats.inactiveAgents },
          { icon: <FiCpu />, label: 'Total Tokens Used', value: usageStats.totalTokensUsed },
        ].map((metric, index) => (
          <div key={index} className="bg-dark-lighter p-6 rounded-xl border border-dark-card hover:shadow-glow transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-dark rounded-lg flex items-center justify-center text-primary">
                {metric.icon}
              </div>
              <h3 className="ml-3 text-gray-400">{metric.label}</h3>
            </div>
            <p className="text-2xl font-bold text-gray-100">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Monthly Usage Graph */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-dark-lighter p-6 rounded-xl border border-dark-card">
          <h2 className="text-xl font-bold text-gray-100 mb-6">Monthly Usage Trends</h2>
          <div className="h-64 flex items-end justify-between">
            {usageStats.monthlyUsage.map((month) => (
              <div key={month.month} className="flex flex-col items-center">
                <div 
                  className="w-16 bg-gradient-to-t from-primary/50 to-secondary/50 rounded-t-lg"
                  style={{ height: `${(month.requests / 5400) * 200}px` }}
                ></div>
                <p className="mt-2 text-gray-400">{month.month}</p>
                <p className="text-sm text-gray-400">{month.requests.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Request Type Distribution */}
        <div className="bg-dark-lighter p-6 rounded-xl border border-dark-card">
          <h2 className="text-xl font-bold text-gray-100 mb-6">Request Type Distribution</h2>
          <div className="space-y-4">
            {usageStats.requestTypes.map((type) => (
              <div key={type.type}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">{type.type}</span>
                  <span className="text-gray-400">{type.percentage}%</span>
                </div>
                <div className="h-2 bg-dark rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{ width: `${type.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Agents */}
      <div className="bg-dark-lighter p-6 rounded-xl border border-dark-card">
        <h2 className="text-xl font-bold text-gray-100 mb-6">Top Performing Agents</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-dark-card">
                <th className="pb-4 text-gray-400">Agent Name</th>
                <th className="pb-4 text-gray-400">Total Requests</th>
                <th className="pb-4 text-gray-400">Avg Response Time</th>
                <th className="pb-4 text-gray-400">Usage</th>
              </tr>
            </thead>
            <tbody>
              {usageStats.topAgents.map((agent) => (
                <tr key={agent.name} className="border-b border-dark-card">
                  <td className="py-4 text-gray-100">{agent.name}</td>
                  <td className="py-4 text-gray-100">{agent.requests.toLocaleString()}</td>
                  <td className="py-4 text-gray-100">{agent.responseTime}</td>
                  <td className="py-4">
                    <div className="w-full bg-dark rounded-full h-2">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
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