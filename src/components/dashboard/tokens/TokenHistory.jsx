import React from 'react';
import { FiClock, FiDownload, FiFilter } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';
import PageHeader from '../PageHeader';

function TokenHistory() {
  // Sample usage history data
  const usageHistory = [
    {
      id: 1,
      date: '2025-03-08',
      time: '10:23 AM',
      agent: 'Slack App',
      action: 'Message Generation',
      tokens_used: 15,
      source: 'Plan'
    },
    {
      id: 2,
      date: '2025-03-07',
      time: '03:45 PM',
      agent: 'Image Creator',
      action: 'Image Generation',
      tokens_used: 50,
      source: 'Plan'
    },
    {
      id: 3,
      date: '2025-03-07',
      time: '01:12 PM',
      agent: 'Copy Creator',
      action: 'Content Creation',
      tokens_used: 25,
      source: 'Plan'
    },
    {
      id: 4,
      date: '2025-03-06',
      time: '11:30 AM',
      agent: 'Slack App',
      action: 'Message Generation',
      tokens_used: 10,
      source: 'Plan'
    },
    {
      id: 5,
      date: '2025-03-05',
      time: '09:15 AM',
      agent: 'Image Creator',
      action: 'Image Generation',
      tokens_used: 100,
      source: 'Token Pack'
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Token Usage History"
        description="Track your token consumption over time"
        actions={
          <div className="flex space-x-2">
            <button className="bg-dark-card hover:bg-dark-card/70 text-gray-300 px-3 py-2 rounded-lg flex items-center">
              <FiFilter className="mr-2" />
              Filter
            </button>
            <button className="bg-dark-card hover:bg-dark-card/70 text-gray-300 px-3 py-2 rounded-lg flex items-center">
              <FiDownload className="mr-2" />
              Export
            </button>
          </div>
        }
      />

      {/* Usage summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6">
          <p className="text-gray-400 font-medium mb-2">Total Tokens Used (This Month)</p>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-white">200</span>
            <FaRobot className="text-primary ml-2" />
          </div>
        </div>
        <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6">
          <p className="text-gray-400 font-medium mb-2">Plan Tokens Used</p>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-white">100</span>
            <FaRobot className="text-primary ml-2" />
            <span className="text-gray-400 ml-2">/ 500</span>
          </div>
        </div>
        <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6">
          <p className="text-gray-400 font-medium mb-2">Token Pack Tokens Used</p>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-white">100</span>
            <FaRobot className="text-primary ml-2" />
            <span className="text-gray-400 ml-2">/ 1000</span>
          </div>
        </div>
      </div>

      {/* Usage history table */}
      <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6">
        <div className="flex items-center mb-6">
          <FiClock className="text-primary mr-3 w-5 h-5" />
          <h3 className="text-lg font-semibold text-white">Recent Token Usage</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="pb-3 font-medium">Date & Time</th>
                <th className="pb-3 font-medium">Agent</th>
                <th className="pb-3 font-medium">Action</th>
                <th className="pb-3 font-medium">Tokens</th>
                <th className="pb-3 font-medium">Source</th>
              </tr>
            </thead>
            <tbody>
              {usageHistory.map((item) => (
                <tr key={item.id} className="border-b border-gray-700/50 text-gray-300">
                  <td className="py-4">
                    <div>{item.date}</div>
                    <div className="text-gray-500 text-sm">{item.time}</div>
                  </td>
                  <td className="py-4">{item.agent}</td>
                  <td className="py-4">{item.action}</td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <span>{item.tokens_used}</span>
                      <FaRobot className="text-primary ml-1 w-4 h-4" />
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.source === 'Plan' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {item.source}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-center">
          <button className="text-primary hover:text-primary/80 transition-colors">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
}

export default TokenHistory;
