import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { FiClock, FiMessageCircle, FiUser, FiBarChart2, FiSettings, FiActivity, FiHelpCircle } from 'react-icons/fi';
import { apiUrl } from '../../config/api';

function AgentUsage({ agentId: propAgentId }) {
  const { agentId: paramAgentId } = useParams();
  const actualAgentId = propAgentId || paramAgentId;
  
  const [agentName, setAgentName] = useState('AI Agent');
  const [loading, setLoading] = useState(true);
  const [usageData, setUsageData] = useState({
    totalRequests: 0,
    totalTokens: 0,
    averageResponseTime: 0,
    dailyUsage: []
  });

  // Fetch agent details from API
  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        const response = await fetch(`${apiUrl()}/agents/active`, {
          method: 'GET',
          headers: { 'accept': 'application/json' }
        });
        
        if (response.ok) {
          const data = await response.json();
          const agent = data.agents.find(a => a.system_name === actualAgentId);
          
          if (agent) {
            setAgentName(agent.name);
          } else {
            // Fallback to legacy mapping if agent not found in API
            setAgentName(getLegacyAgentName());
          }
        } else {
          // Fallback to legacy mapping if API call fails
          setAgentName(getLegacyAgentName());
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching agent details:', error);
        // Fallback to legacy mapping if API call fails
        setAgentName(getLegacyAgentName());
        setLoading(false);
      }
    };
    
    fetchAgentDetails();
  }, [actualAgentId]);

  // Legacy agent name mapping for backward compatibility
  const getLegacyAgentName = () => {
    const agents = {
      'support': 'Slack App',
      'team': 'Image Creator',
      'analytics': 'Copy Creator',
      'metrics': 'LinkedIn Poster',
      'wordpress': 'WordPress Blogger',
      'slack_app_agent': 'Slack App',
      'social_media_manager_agent': 'Social Media Manager',
      'ai_content_manager_agent': 'AI Content Manager',
      'market_research_agent': 'Market Research',
      'content_writer_agent': 'Content Writer',
      'image_generator_agent': 'Image Generator',
      'echo_prompt_agent': 'ECHO Prompt',
      'workflow_helper_agent': 'Workflow Helper',
      'linkedin_influencer_agent': 'LinkedIn Influencer'
    };
    return agents[actualAgentId] || 'AI Agent';
  };

  // Fetch usage data
  useEffect(() => {
    // Simulated data for now
    const generateUsageData = () => {
      const today = new Date();
      const dailyUsage = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        dailyUsage.push({
          date: date.toISOString().split('T')[0],
          requests: Math.floor(Math.random() * 50) + 10,
          tokens: Math.floor(Math.random() * 10000) + 1000
        });
      }
      
      setUsageData({
        totalRequests: dailyUsage.reduce((sum, day) => sum + day.requests, 0),
        totalTokens: dailyUsage.reduce((sum, day) => sum + day.tokens, 0),
        averageResponseTime: Math.floor(Math.random() * 500) + 100,
        dailyUsage
      });
      
      setLoading(false);
    };
    
    // Simulate API call delay
    setTimeout(generateUsageData, 1000);
  }, [actualAgentId]);

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Find the max value for scaling the chart
  const maxTokens = Math.max(...usageData.dailyUsage.map(day => day.tokens));
  const maxRequests = Math.max(...usageData.dailyUsage.map(day => day.requests));

  // Determine active tab based on URL path
  const location = useLocation();
  const currentPath = location.pathname;
  
  const getActiveTab = () => {
    if (currentPath.includes('/settings/')) return 'settings';
    if (currentPath.includes('/activity/')) return 'logs';
    if (currentPath.includes('/usage/')) return 'usage';
    if (currentPath.includes('/setup/')) return 'setup';
    return 'usage'; // Default tab for this component
  };
  
  const activeTab = getActiveTab();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">{loading ? 'Loading...' : `${agentName}`}</h2>
          <p className="text-gray-400 text-sm mt-1">Configure and monitor your AI assistant</p>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-700/40 mb-6">
        <Link 
          to={`/dashboard/settings/${actualAgentId}`}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'settings' 
            ? 'text-emerald-400 border-b-2 border-emerald-400' 
            : 'text-gray-400 hover:text-white'}`}
        >
          <div className="flex items-center">
            <FiSettings className="mr-2" />
            Settings
          </div>
        </Link>
        <Link 
          to={`/dashboard/activity/${actualAgentId}`}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'logs' 
            ? 'text-emerald-400 border-b-2 border-emerald-400' 
            : 'text-gray-400 hover:text-white'}`}
        >
          <div className="flex items-center">
            <FiActivity className="mr-2" />
            Logs
          </div>
        </Link>
        <Link 
          to={`/dashboard/usage/${actualAgentId}`}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'usage' 
            ? 'text-emerald-400 border-b-2 border-emerald-400' 
            : 'text-gray-400 hover:text-white'}`}
        >
          <div className="flex items-center">
            <FiBarChart2 className="mr-2" />
            Usage
          </div>
        </Link>
        <Link 
          to={`/dashboard/setup/${actualAgentId}`}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'setup' 
            ? 'text-emerald-400 border-b-2 border-emerald-400' 
            : 'text-gray-400 hover:text-white'}`}
        >
          <div className="flex items-center">
            <FiHelpCircle className="mr-2" />
            Setup Guide
          </div>
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-gray-400">Loading usage data...</div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Usage Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md p-4">
              <div className="flex items-start">
                <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
                  <FiMessageCircle className="text-blue-400 w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Requests</p>
                  <p className="text-2xl font-bold text-white">{usageData.totalRequests}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md p-4">
              <div className="flex items-start">
                <div className="p-2 bg-emerald-500/20 rounded-lg mr-3">
                  <FiUser className="text-emerald-400 w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Tokens</p>
                  <p className="text-2xl font-bold text-white">{usageData.totalTokens.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md p-4">
              <div className="flex items-start">
                <div className="p-2 bg-purple-500/20 rounded-lg mr-3">
                  <FiClock className="text-purple-400 w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Avg. Response Time</p>
                  <p className="text-2xl font-bold text-white">{usageData.averageResponseTime} ms</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Usage Chart */}
          <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md p-6">
            <h3 className="text-lg font-medium text-white mb-6">7-Day Usage</h3>
            
            <div className="h-64">
              <div className="flex h-full">
                {usageData.dailyUsage.map((day, index) => (
                  <div key={day.date} className="flex-1 flex flex-col justify-end items-center">
                    {/* Tokens bar */}
                    <div 
                      className="w-6 bg-gradient-to-t from-emerald-500 to-blue-500 rounded-t-sm" 
                      style={{ 
                        height: `${(day.tokens / maxTokens) * 70}%`,
                        opacity: 0.8
                      }}
                    ></div>
                    
                    {/* Requests bar */}
                    <div 
                      className="w-3 bg-white/30 rounded-t-sm mt-1 mb-2" 
                      style={{ 
                        height: `${(day.requests / maxRequests) * 50}%`,
                      }}
                    ></div>
                    
                    <p className="text-xs text-gray-400">{formatDate(day.date)}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-4 space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gradient-to-t from-emerald-500 to-blue-500 rounded-sm mr-2"></div>
                <span className="text-xs text-gray-400">Tokens</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-white/30 rounded-sm mr-2"></div>
                <span className="text-xs text-gray-400">Requests</span>
              </div>
            </div>
          </div>
          
          {/* Detailed Stats Table */}
          <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md">
            <h3 className="text-lg font-medium text-white p-6 border-b border-white/5">Detailed Usage</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm">
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Requests</th>
                    <th className="px-6 py-3 font-medium">Tokens</th>
                    <th className="px-6 py-3 font-medium">Avg. Tokens/Request</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {usageData.dailyUsage.map((day) => (
                    <tr key={day.date} className="text-white">
                      <td className="px-6 py-4">{formatDate(day.date)}</td>
                      <td className="px-6 py-4">{day.requests}</td>
                      <td className="px-6 py-4">{day.tokens.toLocaleString()}</td>
                      <td className="px-6 py-4">{Math.round(day.tokens / day.requests)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentUsage;