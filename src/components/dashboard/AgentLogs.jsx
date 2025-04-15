import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiClock, FiMessageCircle, FiUser, FiSend, FiAlertCircle, FiRefreshCw, FiX } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa6';
import { BiBot } from 'react-icons/bi';
import { useOrganization } from '../../contexts/OrganizationContext';
import { apiUrl } from '../../config/api';

function AgentLogs({ agentId: propAgentId }) {
  const { agentId: paramAgentId } = useParams();
  const actualAgentId = propAgentId || paramAgentId;
  
  const { selectedOrg, userEmail } = useOrganization();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null); // Initialize selectedLog as null to ensure the instructional panel shows by default
  const [agentInfo, setAgentInfo] = useState({ name: 'AI Agent', systemName: '' });

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
            setAgentInfo({
              name: agent.name,
              systemName: agent.system_name
            });
          } else {
            // Fallback to legacy mapping if agent not found in API
            setAgentInfo(getLegacyAgentInfo());
          }
        } else {
          // Fallback to legacy mapping if API call fails
          setAgentInfo(getLegacyAgentInfo());
        }
      } catch (error) {
        console.error('Error fetching agent details:', error);
        // Fallback to legacy mapping if API call fails
        setAgentInfo(getLegacyAgentInfo());
      }
    };
    
    fetchAgentDetails();
  }, [actualAgentId]);

  // Legacy agent info mapping for backward compatibility
  const getLegacyAgentInfo = () => {
    const agents = {
      'support': { name: 'Slack App', systemName: 'slack_app_agent' },
      'team': { name: 'Image Creator', systemName: 'image_creator_agent' },
      'analytics': { name: 'Copy Creator', systemName: 'copy_creator_agent' },
      'slack_app_agent': { name: 'Slack App', systemName: 'slack_app_agent' },
      'social_media_manager_agent': { name: 'Social Media Manager', systemName: 'social_media_manager_agent' },
      'ai_content_manager_agent': { name: 'AI Content Manager', systemName: 'ai_content_manager_agent' },
      'market_research_agent': { name: 'Market Research', systemName: 'market_research_agent' },
      'content_writer_agent': { name: 'Content Writer', systemName: 'content_writer_agent' },
      'image_generator_agent': { name: 'Image Generator', systemName: 'image_generator_agent' },
      'echo_prompt_agent': { name: 'ECHO Prompt', systemName: 'echo_prompt_agent' },
      'workflow_helper_agent': { name: 'Workflow Helper', systemName: 'workflow_helper_agent' },
      'linkedin_influencer_agent': { name: 'LinkedIn Influencer', systemName: 'linkedin_influencer_agent' }
    };
    
    return agents[actualAgentId] || { name: 'AI Agent', systemName: actualAgentId || '' };
  };

  useEffect(() => {
    if (selectedOrg && userEmail) {
      fetchLogs();
    }
  }, [selectedOrg, userEmail, actualAgentId, agentInfo]);

  const fetchLogs = async () => {
    if (!selectedOrg || !userEmail) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Use the apiUrl helper to get the correct API endpoint based on environment
      const endpoint = `${apiUrl()}/logs/read-logs`;
      
      console.log(`Fetching logs from: ${endpoint} for agent: ${agentInfo.systemName || actualAgentId}`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          "user_org_id": selectedOrg.id,
          "user_email_id": userEmail
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Logs data:', data);
      
      // Filter logs by agent system name - use either the system name from agentInfo or the actualAgentId
      const systemNameToFilter = agentInfo.systemName || actualAgentId;
      const filteredLogs = Array.isArray(data) 
        ? data.filter(log => log.agent_system_name === systemNameToFilter)
        : [];
      
      console.log(`Filtered logs for ${systemNameToFilter}:`, filteredLogs.length);
      
      // Sort logs by ID in descending order (newest first)
      const sortedLogs = [...filteredLogs].sort((a, b) => b.id - a.id);
      
      setLogs(sortedLogs);
      
      // Don't auto-select the first log anymore
      // if (sortedLogs.length > 0 && !selectedLog) {
      //   setSelectedLog(sortedLogs[0].id);
      // }
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(`Failed to load logs: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Format timestamp to readable format
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get log type icon and color
  const getLogTypeInfo = (type) => {
    switch (type) {
      case 'request':
        return { 
          icon: <FiSend className="w-4 h-4" />, 
          color: 'bg-blue-500/20 text-blue-400',
          label: 'Request'
        };
      case 'response':
        return { 
          icon: <FaRobot className="w-4 h-4" />, 
          color: 'bg-emerald-500/20 text-emerald-400',
          label: 'Response'
        };
      case 'error':
        return { 
          icon: <FiAlertCircle className="w-4 h-4" />, 
          color: 'bg-red-500/20 text-red-400',
          label: 'Error'
        };
      default:
        return { 
          icon: <BiBot className="w-4 h-4" />, 
          color: 'bg-gray-500/20 text-gray-400',
          label: 'Info'
        };
    }
  };

  // Get truncated prompt from log details
  const getTruncatedPrompt = (log) => {
    try {
      if (!log.log_detail) return 'No details available';
      
      if (typeof log.log_detail === 'string') {
        try {
          const parsed = JSON.parse(log.log_detail);
          if (parsed.message) return parsed.message.substring(0, 50) + '...';
          if (parsed.title) return parsed.title.substring(0, 50) + '...';
          return 'Log details available';
        } catch (e) {
          return log.log_detail.substring(0, 50) + '...';
        }
      }
      
      if (log.log_detail.message) return log.log_detail.message.substring(0, 50) + '...';
      if (log.log_detail.title) return log.log_detail.title.substring(0, 50) + '...';
      if (log.log_detail.source_api) return `API: ${log.log_detail.source_api}`;
      
      return 'Log details available';
    } catch (error) {
      return 'Error parsing log details';
    }
  };

  // Group logs by pair_id
  const groupLogsByPairId = () => {
    // Create a map to group logs by pair_id
    const pairMap = new Map();
    
    // First pass: organize logs by pair_id
    logs.forEach(log => {
      if (!log.pair_id) {
        // Handle logs without pair_id (standalone logs)
        pairMap.set(log.id, { 
          id: log.id,
          timestamp: log.created_at,
          standalone: true,
          log: log 
        });
      } else if (pairMap.has(log.pair_id)) {
        // Add to existing pair
        const pair = pairMap.get(log.pair_id);
        if (log.log_type === 'request') {
          pair.request = log;
        } else if (log.log_type === 'response') {
          pair.response = log;
        } else if (log.log_type === 'error') {
          pair.error = log;
        }
      } else {
        // Create new pair
        const pair = { 
          id: log.pair_id,
          timestamp: log.created_at,
          standalone: false
        };
        
        if (log.log_type === 'request') {
          pair.request = log;
        } else if (log.log_type === 'response') {
          pair.response = log;
        } else if (log.log_type === 'error') {
          pair.error = log;
        }
        
        pairMap.set(log.pair_id, pair);
      }
    });
    
    // Convert map to array and sort by timestamp (newest first)
    return Array.from(pairMap.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // Render JSON data in a formatted way
  const renderJsonContent = (jsonData) => {
    if (!jsonData) return <p className="text-gray-400 text-sm">No data available</p>;
    
    try {
      // Parse the JSON if it's a string
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      // Function to recursively render JSON
      const renderJson = (obj, indent = 0) => {
        if (obj === null) return <span className="text-gray-400">null</span>;
        
        if (typeof obj === 'object') {
          if (Array.isArray(obj)) {
            return (
              <div style={{ marginLeft: `${indent * 16}px` }}>
                {obj.map((item, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-blue-400">{index}: </span>
                    {renderJson(item, indent + 1)}
                  </div>
                ))}
              </div>
            );
          } else {
            return (
              <div style={{ marginLeft: `${indent * 16}px` }}>
                {Object.entries(obj).map(([key, value]) => (
                  <div key={key} className="mb-1">
                    <span className="text-emerald-400">{key}: </span>
                    {renderJson(value, indent + 1)}
                  </div>
                ))}
              </div>
            );
          }
        } else if (typeof obj === 'string') {
          return <span className="text-yellow-300">"{obj}"</span>;
        } else {
          return <span className="text-purple-300">{String(obj)}</span>;
        }
      };
      
      return (
        <div className="bg-dark-lighter/50 p-3 rounded-lg border border-white/5 overflow-auto max-h-96">
          <pre className="text-xs text-white font-mono">
            {renderJson(data)}
          </pre>
        </div>
      );
    } catch (e) {
      console.error('Error rendering JSON:', e);
      return (
        <div className="bg-dark-lighter/50 p-3 rounded-lg border border-white/5">
          <pre className="text-xs text-white font-mono whitespace-pre-wrap">
            {String(jsonData)}
          </pre>
        </div>
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">Activity Logs</h3>
        <button 
          onClick={fetchLogs}
          className="flex items-center text-sm text-gray-300 hover:text-emerald-400 transition-colors"
        >
          <FiRefreshCw className="mr-1" />
          Refresh
        </button>
      </div>
      
      {isLoading ? (
        <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md h-64 flex items-center justify-center">
          <p className="text-gray-400">Loading logs...</p>
        </div>
      ) : error ? (
        <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md h-64 flex items-center justify-center">
          <p className="text-red-400">{error}</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md h-64 flex items-center justify-center">
            <p className="text-gray-400">No logs found for this agent</p>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md flex flex-col h-full">
              <div className="flex flex-col items-center justify-center p-8 h-full">
                <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 p-6 rounded-full mb-4">
                  <FiMessageCircle size={48} className="text-emerald-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No Logs Available</h3>
                <p className="text-gray-400 text-center max-w-md mb-4">
                  This agent doesn't have any activity logs yet. Once the agent is used, logs will appear here.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                  <div className="bg-dark-lighter/30 border border-white/5 rounded-lg p-4 flex items-center">
                    <div className="p-2 rounded-md bg-blue-500/20 text-blue-400 mr-3">
                      <FiSend size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Request Logs</h4>
                      <p className="text-xs text-gray-400">View user inputs and prompts</p>
                    </div>
                  </div>
                  <div className="bg-dark-lighter/30 border border-white/5 rounded-lg p-4 flex items-center">
                    <div className="p-2 rounded-md bg-emerald-500/20 text-emerald-400 mr-3">
                      <FaRobot size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Response Logs</h4>
                      <p className="text-xs text-gray-400">View AI outputs and results</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md">
            <div className="p-4 border-b border-white/5">
              <h4 className="text-sm font-medium text-white">Recent Activity</h4>
            </div>
            <div className="overflow-auto max-h-[600px] p-2">
              {groupLogsByPairId().map(pair => {
                if (pair.standalone) {
                  // Handle standalone logs (no pair)
                  const log = pair.log;
                  const logType = log.log_type || 'info';
                  const typeInfo = getLogTypeInfo(logType);
                  
                  return (
                    <button
                      key={log.id}
                      onClick={() => setSelectedLog(log.id)}
                      className={`w-full text-left p-3 mb-2 rounded-lg border ${selectedLog === log.id ? 'bg-dark-lighter/70 border-emerald-500/30' : 'border-white/5 hover:bg-dark-lighter/50 hover:border-white/10'} transition-all duration-200`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-gray-500 flex items-center">
                          <FiClock className="w-3 h-3 mr-1" />
                          {formatTimestamp(log.created_at)}
                        </span>
                        <div className="flex items-center">
                          <div className={`p-1 rounded-md ${typeInfo.color} mr-1.5`}>
                            {typeInfo.icon}
                          </div>
                          <span className="text-xs text-white font-medium">
                            {typeInfo.label}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {log.input_tokens !== undefined && (
                          <span className="text-[10px] text-emerald-400 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shadow-sm">
                            <FaRobot className="w-2.5 h-2.5 mr-1" />
                            {log.input_tokens} Tokens
                          </span>
                        )}
                        <div className="flex items-center">
                          {log.user_email_id && (
                            <span className="text-[10px] text-blue-400">
                              {log.user_email_id}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                } else {
                  // Handle request-response pairs
                  const request = pair.request;
                  const response = pair.response;
                  const error = pair.error;
                  
                  // If we only have a request (no response or error yet)
                  if (request && !response && !error) {
                    const typeInfo = getLogTypeInfo('request');
                    
                    return (
                      <button
                        key={request.id}
                        onClick={() => setSelectedLog(request.id)}
                        className={`w-full text-left p-3 mb-2 rounded-lg border ${selectedLog === request.id ? 'bg-dark-lighter/70 border-emerald-500/30' : 'border-white/5 hover:bg-dark-lighter/50 hover:border-white/10'} transition-all duration-200`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-gray-500 flex items-center">
                            <FiClock className="w-3 h-3 mr-1" />
                            {formatTimestamp(pair.timestamp)}
                          </span>
                          <div className="flex items-center">
                            <div className={`p-1 rounded-md ${typeInfo.color} mr-1.5`}>
                              {typeInfo.icon}
                            </div>
                            <span className="text-xs text-white font-medium">
                              Request
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          {request.input_tokens && (
                            <span className="text-[10px] text-emerald-400 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shadow-sm">
                              <FaRobot className="w-2.5 h-2.5 mr-1" />
                              {request.input_tokens} Tokens
                            </span>
                          )}
                          <div className="flex items-center">
                            {request.user_email_id && (
                              <span className="text-[10px] text-blue-400 mr-2">
                                {request.user_email_id}
                              </span>
                            )}
                            {request.agent_system_name && (
                              <span className="text-[10px] text-gray-400">
                                {request.agent_system_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  }
                  
                  // If we only have a response or error (no request)
                  if (!request && (response || error)) {
                    const log = response || error;
                    const logType = log.log_type || 'info';
                    const typeInfo = getLogTypeInfo(logType);
                    
                    return (
                      <button
                        key={log.id}
                        onClick={() => setSelectedLog(log.id)}
                        className={`w-full text-left p-3 mb-2 rounded-lg border ${selectedLog === log.id ? 'bg-dark-lighter/70 border-emerald-500/30' : 'border-white/5 hover:bg-dark-lighter/50 hover:border-white/10'} transition-all duration-200`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-gray-500 flex items-center">
                            <FiClock className="w-3 h-3 mr-1" />
                            {formatTimestamp(pair.timestamp)}
                          </span>
                          <div className="flex items-center">
                            <div className={`p-1 rounded-md ${typeInfo.color} mr-1.5`}>
                              {typeInfo.icon}
                            </div>
                            <span className="text-xs text-white font-medium">
                              {typeInfo.label}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          {log.input_tokens !== undefined && (
                            <span className="text-[10px] text-emerald-400 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shadow-sm">
                              <FaRobot className="w-2.5 h-2.5 mr-1" />
                              {log.input_tokens} Tokens
                            </span>
                          )}
                          <div className="flex items-center">
                            {log.user_email_id && (
                              <span className="text-[10px] text-blue-400">
                                {log.user_email_id}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  }
                  
                  // Handle request with error (no successful response)
                  if (request && error && !response) {
                    const requestInfo = getLogTypeInfo('request');
                    const errorInfo = getLogTypeInfo('error');
                    
                    return (
                      <div
                        key={pair.id}
                        className={`w-full text-left p-3 mb-2 rounded-lg border ${selectedLog === request.id || selectedLog === error.id ? 'bg-dark-lighter/70 border-emerald-500/30' : 'border-white/5 hover:bg-dark-lighter/50 hover:border-white/10'} transition-all duration-200`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-gray-500 flex items-center">
                            <FiClock className="w-3 h-3 mr-1" />
                            {formatTimestamp(pair.timestamp)}
                          </span>
                          <div className="flex space-x-2">
                            {/* Request button */}
                            <button
                              onClick={() => setSelectedLog(request.id)}
                              className={`text-left px-2 py-1 rounded-lg ${selectedLog === request.id ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-dark-lighter/30 hover:bg-dark-lighter/50 border border-white/5 hover:border-blue-500/20'} transition-all duration-200`}
                            >
                              <div className="flex items-center">
                                <div className={`p-1 rounded-md ${requestInfo.color} mr-1.5`}>
                                  {requestInfo.icon}
                                </div>
                                <span className="text-xs text-white font-medium">
                                  Request
                                </span>
                              </div>
                            </button>
                            
                            {/* Error button */}
                            <button
                              onClick={() => setSelectedLog(error.id)}
                              className={`text-left px-2 py-1 rounded-lg ${selectedLog === error.id ? 'bg-red-500/20 border border-red-500/30' : 'bg-dark-lighter/30 hover:bg-dark-lighter/50 border border-white/5 hover:border-red-500/20'} transition-all duration-200`}
                            >
                              <div className="flex items-center">
                                <div className={`p-1 rounded-md ${errorInfo.color} mr-1.5`}>
                                  {errorInfo.icon}
                                </div>
                                <span className="text-xs text-red-400 font-medium">
                                  Error
                                </span>
                              </div>
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-emerald-400 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shadow-sm">
                            <FaRobot className="w-2.5 h-2.5 mr-1" />
                            {(request.input_tokens || 0) + (error.output_tokens || 0)} Tokens
                          </span>
                          <div className="flex items-center">
                            {request.user_email_id && (
                              <span className="text-[10px] text-blue-400">
                                {request.user_email_id}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  // Both request and response exist, show them in a 50/50 split
                  if (request && response) {
                    const requestInfo = getLogTypeInfo('request');
                    const responseInfo = getLogTypeInfo('response');
                    
                    return (
                      <div
                        key={pair.id}
                        className={`w-full text-left p-3 mb-2 rounded-lg border ${selectedLog === request.id || selectedLog === response.id ? 'bg-dark-lighter/70 border-emerald-500/30' : 'border-white/5 hover:bg-dark-lighter/50 hover:border-white/10'} transition-all duration-200`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-gray-500 flex items-center">
                            <FiClock className="w-3 h-3 mr-1" />
                            {formatTimestamp(pair.timestamp)}
                          </span>
                          <div className="flex space-x-2">
                            {/* Request button */}
                            <button
                              onClick={() => setSelectedLog(request.id)}
                              className={`text-left px-2 py-1 rounded-lg ${selectedLog === request.id ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-dark-lighter/30 hover:bg-dark-lighter/50 border border-white/5 hover:border-blue-500/20'} transition-all duration-200`}
                            >
                              <div className="flex items-center">
                                <div className={`p-1 rounded-md ${requestInfo.color} mr-1.5`}>
                                  {requestInfo.icon}
                                </div>
                                <span className="text-xs text-white font-medium">
                                  Request
                                </span>
                              </div>
                            </button>
                            
                            {/* Response button */}
                            <button
                              onClick={() => setSelectedLog(response.id)}
                              className={`text-left px-2 py-1 rounded-lg ${selectedLog === response.id ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-dark-lighter/30 hover:bg-dark-lighter/50 border border-white/5 hover:border-emerald-500/20'} transition-all duration-200`}
                            >
                              <div className="flex items-center">
                                <div className={`p-1 rounded-md ${responseInfo.color} mr-1.5`}>
                                  {responseInfo.icon}
                                </div>
                                <span className="text-xs text-white font-medium">
                                  Response
                                </span>
                              </div>
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-emerald-400 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shadow-sm">
                            <FaRobot className="w-2.5 h-2.5 mr-1" />
                            {(request.input_tokens || 0) + (response.output_tokens || 0)} Tokens
                          </span>
                          <div className="flex items-center">
                            {request.user_email_id && (
                              <span className="text-[10px] text-blue-400">
                                {request.user_email_id}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                }
              })}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {selectedLog ? (
              logs.filter(log => log.id === selectedLog).map(log => {
                const logType = log.log_type || 'info';
                const typeInfo = getLogTypeInfo(logType);
                
                return (
                  <div key={log.id} className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md flex flex-col h-full">
                    <div className="p-4 border-b border-white/5 flex items-center">
                      <div className={`p-2 rounded-md ${typeInfo.color} mr-3`}>
                        {typeInfo.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white">{typeInfo.label}</h4>
                        <p className="text-xs text-gray-400">{formatTimestamp(log.created_at)}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedLog(null)}
                        className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                    
                    <div className="p-4 flex-1 overflow-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-dark-lighter/50 p-3 rounded-lg border border-white/5">
                          <p className="text-xs text-gray-400 mb-1">Timestamp</p>
                          <p className="text-sm text-white">{formatTimestamp(log.created_at)}</p>
                        </div>
                        <div className="bg-dark-lighter/50 p-3 rounded-lg border border-white/5">
                          <p className="text-xs text-gray-400 mb-1">Caller Agent</p>
                          <p className="text-sm text-white">{agentInfo.name}</p>
                        </div>
                        <div className="bg-dark-lighter/50 p-3 rounded-lg border border-white/5">
                          <p className="text-xs text-gray-400 mb-1">User Email</p>
                          <p className="text-sm text-white">{log.user_email_id || 'N/A'}</p>
                        </div>
                        {logType === 'response' && (
                          <div className="bg-dark-lighter/50 p-3 rounded-lg border border-white/5">
                            <div className="flex items-center mb-1">
                              <FaRobot className="text-emerald-400 w-3 h-3 mr-1" />
                              <p className="text-xs text-gray-400">Output Tokens</p>
                            </div>
                            <p className="text-sm text-white">{log.output_tokens || ''}</p>
                          </div>
                        )}
                        {logType === 'request' && log.input_tokens && (
                          <div className="bg-dark-lighter/50 p-3 rounded-lg border border-white/5">
                            <div className="flex items-center mb-1">
                              <FiSend className="text-blue-400 w-3 h-3 mr-1" />
                              <p className="text-xs text-gray-400">Input Tokens</p>
                            </div>
                            <p className="text-sm text-white">{log.input_tokens}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {/* Additional metadata if available */}
                        {log.pair_id && (
                          <div>
                            <h3 className="text-sm font-medium text-white mb-2">Metadata</h3>
                            <div className="bg-dark-lighter/50 p-3 rounded-lg border border-white/5">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <p className="text-xs text-gray-400">Pair ID</p>
                                  <p className="text-sm text-white">{log.pair_id}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Model</p>
                                  <p className="text-sm text-white">{log.model_name || 'N/A'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Log Details */}
                        <div>
                          <h3 className="text-sm font-medium text-white mb-2">Log Details</h3>
                          {renderJsonContent(log.log_detail)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md flex flex-col h-full">
                <div className="flex flex-col items-center justify-center p-8 h-full">
                  <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 p-6 rounded-full mb-4">
                    <FiMessageCircle size={48} className="text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Select a Log</h3>
                  <p className="text-gray-400 text-center max-w-md mb-4">
                    Click on any request or response from the activity list to view detailed information.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                    <div className="bg-dark-lighter/30 border border-white/5 rounded-lg p-4 flex items-center">
                      <div className="p-2 rounded-md bg-blue-500/20 text-blue-400 mr-3">
                        <FiSend size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">Request Details</h4>
                        <p className="text-xs text-gray-400">View input parameters and tokens</p>
                      </div>
                    </div>
                    <div className="bg-dark-lighter/30 border border-white/5 rounded-lg p-4 flex items-center">
                      <div className="p-2 rounded-md bg-emerald-500/20 text-emerald-400 mr-3">
                        <FaRobot size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">Response Details</h4>
                        <p className="text-xs text-gray-400">View AI outputs and results</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentLogs;
