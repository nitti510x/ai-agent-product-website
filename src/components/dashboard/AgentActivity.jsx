import React, { useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { FiClock, FiMessageCircle, FiUser, FiSend, FiAlertCircle, FiSettings, FiActivity, FiBarChart2, FiHelpCircle, FiArrowLeft } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa6';
import { BiBot } from 'react-icons/bi';

function AgentActivity() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [selectedActivity, setSelectedActivity] = useState(null);

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

  // Sample activities data
  const activities = [
    {
      id: 1,
      timestamp: '2023-08-10T14:30:00Z',
      type: 'response',
      channel: 'support',
      request: {
        prompt: 'How do I reset my password?',
        context: {
          channel: '#support',
          user: 'user123',
          thread: 'thread_abc123'
        }
      },
      response: 'To reset your password, please follow these steps:\n\n1. Go to the login page\n2. Click on "Forgot Password"\n3. Enter your email address\n4. Follow the instructions sent to your email\n\nIf you encounter any issues, please let me know and I\'ll assist you further.',
      processingTime: '1.2s',
      tokensUsed: 256
    },
    {
      id: 2,
      timestamp: '2023-08-10T13:45:00Z',
      type: 'request',
      channel: 'general',
      request: {
        prompt: 'Can you summarize the meeting notes from yesterday?',
        context: {
          channel: '#general',
          user: 'manager456',
          thread: null
        }
      },
      response: null,
      processingTime: null,
      tokensUsed: null
    },
    {
      id: 3,
      timestamp: '2023-08-10T12:30:00Z',
      type: 'error',
      channel: 'product',
      request: {
        prompt: 'Generate a product roadmap for Q3',
        context: {
          channel: '#product',
          user: 'pm789',
          thread: 'thread_xyz789'
        }
      },
      response: 'Error: Unable to process request due to API rate limiting. Please try again later.',
      processingTime: '0.3s',
      tokensUsed: 0
    }
  ];

  // Format timestamp to readable format
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get activity type icon and color
  const getActivityTypeInfo = (type) => {
    switch (type) {
      case 'request':
        return { 
          icon: <FiSend className="w-4 h-4" />, 
          color: 'bg-blue-500/20 text-blue-400',
          label: 'User Request'
        };
      case 'response':
        return { 
          icon: <BiBot className="w-4 h-4" />, 
          color: 'bg-emerald-500/20 text-emerald-400',
          label: 'AI Response'
        };
      case 'error':
        return { 
          icon: <FiAlertCircle className="w-4 h-4" />, 
          color: 'bg-red-500/20 text-red-400',
          label: 'Error'
        };
      default:
        return { 
          icon: <FiMessageCircle className="w-4 h-4" />, 
          color: 'bg-gray-500/20 text-gray-400',
          label: 'Activity'
        };
    }
  };

  const location = useLocation();
  const currentPath = location.pathname;
  
  // Determine active tab based on URL path
  const getActiveTab = () => {
    if (currentPath.includes('/settings/')) return 'settings';
    if (currentPath.includes('/activity/')) return 'logs';
    if (currentPath.includes('/usage/')) return 'usage';
    if (currentPath.includes('/setup/')) return 'setup';
    return 'logs'; // Default tab for this component
  };
  
  const activeTab = getActiveTab();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page title and action buttons */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">{getAgentName()}</h2>
          <p className="text-gray-400 text-sm mt-1">Configure and monitor your AI assistant</p>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-700/40 mb-6">
        <Link 
          to={`/dashboard/settings/${agentId}`}
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
          to={`/dashboard/activity/${agentId}`}
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
          to={`/dashboard/usage/${agentId}`}
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
          to={`/dashboard/setup/${agentId}`}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity List */}
        <div className="lg:col-span-1">
          <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md">
            <div className="border-b border-white/5 px-4 py-3 flex items-center">
              <FiMessageCircle className="text-emerald-400 mr-2" />
              <h2 className="font-medium text-white text-sm">Recent Activities</h2>
            </div>
            <div className="divide-y divide-white/5">
              {activities.map((activity) => {
                const typeInfo = getActivityTypeInfo(activity.type);
                return (
                  <div 
                    key={activity.id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-white/5 ${selectedActivity === activity.id ? 'bg-white/5' : ''}`}
                    onClick={() => setSelectedActivity(activity.id)}
                  >
                    <div className="flex items-start">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${typeInfo.color} mr-3 flex-shrink-0`}>
                        {typeInfo.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium text-white truncate">{typeInfo.label}</p>
                          <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{formatTimestamp(activity.timestamp)}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 truncate">
                          {activity.request.prompt}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <FiUser className="w-3 h-3 mr-1" />
                          <span className="truncate">{activity.request.context.user}</span>
                          <span className="mx-2">•</span>
                          <span className="truncate">#{activity.channel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Activity Details */}
        <div className="lg:col-span-2">
          {selectedActivity ? (
            <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md h-full">
              {activities.filter(a => a.id === selectedActivity).map((activity) => {
                const typeInfo = getActivityTypeInfo(activity.type);
                return (
                  <div key={activity.id} className="h-full flex flex-col">
                    <div className="border-b border-white/5 px-4 py-3 flex items-center">
                      <div className={`w-6 h-6 rounded-full ${typeInfo.color} flex items-center justify-center mr-2`}>
                        {typeInfo.icon}
                      </div>
                      <h2 className="font-medium text-white text-sm">{typeInfo.label} Details</h2>
                    </div>
                    
                    <div className="p-4 flex-1 overflow-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-dark-lighter/50 p-3 rounded-lg border border-white/5">
                          <p className="text-xs text-gray-400 mb-1">Timestamp</p>
                          <p className="text-sm text-white">{formatTimestamp(activity.timestamp)}</p>
                        </div>
                        <div className="bg-dark-lighter/50 p-3 rounded-lg border border-white/5">
                          <p className="text-xs text-gray-400 mb-1">Channel</p>
                          <p className="text-sm text-white">#{activity.channel}</p>
                        </div>
                        {activity.processingTime && (
                          <div className="bg-dark-lighter/50 p-3 rounded-lg border border-white/5">
                            <div className="flex items-center mb-1">
                              <FiClock className="text-emerald-400 w-3 h-3 mr-1" />
                              <p className="text-xs text-gray-400">Processing Time</p>
                            </div>
                            <p className="text-sm text-white">{activity.processingTime}</p>
                          </div>
                        )}
                        {activity.tokensUsed !== null && (
                          <div className="bg-dark-lighter/50 p-3 rounded-lg border border-white/5">
                            <div className="flex items-center mb-1">
                              <FaRobot className="text-blue-400 w-3 h-3 mr-1" />
                              <p className="text-xs text-gray-400">Tokens Used</p>
                            </div>
                            <p className="text-sm text-white">{activity.tokensUsed}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-white mb-2">User Request</h3>
                          <div className="bg-dark-lighter/50 p-3 rounded-lg border border-white/5">
                            <p className="text-sm text-white whitespace-pre-wrap">{activity.request.prompt}</p>
                          </div>
                        </div>
                        
                        {activity.response && (
                          <div>
                            <h3 className="text-sm font-medium text-white mb-2">AI Response</h3>
                            <div className="bg-dark-lighter/50 p-3 rounded-lg border border-white/5">
                              <p className="text-sm text-white whitespace-pre-wrap">{activity.response}</p>
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <h3 className="text-sm font-medium text-white mb-2">Context</h3>
                          <div className="bg-dark-lighter/50 p-3 rounded-lg border border-white/5">
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(activity.request.context).map(([key, value]) => (
                                <div key={key}>
                                  <p className="text-xs text-gray-400">{key}</p>
                                  <p className="text-sm text-white">{value || 'N/A'}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md h-full flex items-center justify-center p-8">
              <div className="text-center">
                <div className="bg-dark-lighter/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMessageCircle className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Select an Activity</h3>
                <p className="text-gray-400 text-sm max-w-md">
                  Choose an activity from the list to view detailed information about the interaction.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentActivity;