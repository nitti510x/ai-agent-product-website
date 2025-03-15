import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiClock, FiMessageCircle, FiUser, FiSend, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa6';
import { BiBot } from 'react-icons/bi';
import { useOrganization } from '../../contexts/OrganizationContext';
import { apiUrl } from '../../config/api';

function AgentLogs() {
  const { agentId } = useParams();
  const { selectedOrg, userEmail } = useOrganization();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);

  // Get agent name and system name based on ID
  const getAgentInfo = () => {
    const agents = {
      'support': { name: 'Slack App', systemName: 'slack_app_agent' },
      'team': { name: 'Image Creator', systemName: 'image_creator_agent' },
      'analytics': { name: 'Copy Creator', systemName: 'copy_creator_agent' }
    };
    return agents[agentId] || { name: 'AI Agent', systemName: '' };
  };

  const agentInfo = getAgentInfo();

  useEffect(() => {
    if (selectedOrg && userEmail) {
      fetchLogs();
    }
  }, [selectedOrg, userEmail, agentId]);

  const fetchLogs = async () => {
    if (!selectedOrg || !userEmail) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Use the apiUrl helper to get the correct API endpoint based on environment
      const endpoint = `${apiUrl()}/logs/read-logs`;
      
      console.log(`Fetching logs from: ${endpoint}`);
      
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
      
      // Filter logs by agent system name
      const filteredLogs = Array.isArray(data) ? data.filter(log => log.agent_system_name === agentInfo.systemName) : [];
      
      // Sort logs by ID in descending order (newest first)
      const sortedLogs = [...filteredLogs].sort((a, b) => b.id - a.id);
      
      setLogs(sortedLogs);
      
      // Select the first log by default if available
      if (sortedLogs.length > 0 && !selectedLog) {
        setSelectedLog(sortedLogs[0].id);
      }
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

  // Get truncated prompt from log details
  const getTruncatedPrompt = (log) => {
    if (!log.log_detail) return 'No message';
    
    try {
      const detailObj = typeof log.log_detail === 'string' ? JSON.parse(log.log_detail) : log.log_detail;
      if (detailObj.prompt) {
        // Truncate prompt to 30 characters and add ellipsis if longer
        return detailObj.prompt.length > 30 
          ? `${detailObj.prompt.substring(0, 30)}...` 
          : detailObj.prompt;
      }
      return 'No message';
    } catch (err) {
      return 'No message';
    }
  };

  // Render JSON data in a formatted way
  const renderJsonContent = (jsonData) => {
    if (!jsonData) return null;
    
    try {
      // If it's already an object, use it directly
      let dataObj = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      // For response logs, filter out input_tokens from the JSON data
      if (selectedLog) {
        const selectedLogObj = logs.find(log => log.id === selectedLog);
        if (selectedLogObj && selectedLogObj.log_type === 'response') {
          // Create a new object without input_tokens
          if (typeof dataObj === 'object') {
            // Remove input_tokens from the top level
            if ('input_tokens' in dataObj) {
              const { input_tokens, ...filteredData } = dataObj;
              dataObj = filteredData;
            }
            
            // Also check if input_tokens exists as a property of any nested objects
            Object.keys(dataObj).forEach(key => {
              if (typeof dataObj[key] === 'object' && dataObj[key] !== null && 'input_tokens' in dataObj[key]) {
                const { input_tokens, ...filteredNestedData } = dataObj[key];
                dataObj[key] = filteredNestedData;
              }
            });
          }
        }
      }
      
      return (
        <div className="bg-dark-lighter/50 p-3 rounded-lg border border-white/5 overflow-auto max-h-[400px]">
          <pre className="text-sm text-white whitespace-pre-wrap">
            {JSON.stringify(dataObj, null, 2)}
          </pre>
        </div>
      );
    } catch (err) {
      // If it's not valid JSON, display as plain text
      return (
        <div className="bg-dark-lighter/50 p-3 rounded-lg border border-white/5">
          <p className="text-sm text-white whitespace-pre-wrap">{jsonData}</p>
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-t-2 border-emerald-500 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-400 text-center mb-4">
          <FiAlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
        <button 
          onClick={fetchLogs}
          className="flex items-center px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
        >
          <FiRefreshCw className="mr-2" />
          Retry
        </button>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-400 mb-4">No logs found for this agent</p>
        <button 
          onClick={fetchLogs}
          className="flex items-center px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
        >
          <FiRefreshCw className="mr-2" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Logs List */}
      <div className="lg:col-span-1">
        <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md">
          <div className="border-b border-white/5 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <FiMessageCircle className="text-emerald-400 mr-2" />
              <h2 className="font-medium text-white text-sm">Recent Logs</h2>
            </div>
            <button 
              onClick={fetchLogs}
              className="text-gray-400 hover:text-white transition-colors"
              title="Refresh logs"
            >
              <FiRefreshCw className="h-4 w-4" />
            </button>
          </div>
          <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
            {logs.map((log) => {
              const logType = log.log_type || 'activity';
              const typeInfo = getLogTypeInfo(logType);
              return (
                <div 
                  key={log.id}
                  className={`p-4 cursor-pointer transition-colors hover:bg-white/5 ${selectedLog === log.id ? 'bg-white/5' : ''}`}
                  onClick={() => setSelectedLog(log.id)}
                >
                  <div className="flex items-start">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${typeInfo.color} mr-3 flex-shrink-0`}>
                      {typeInfo.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-white truncate">{typeInfo.label}</p>
                        <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{formatTimestamp(log.created_at)}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {logType === 'request' ? getTruncatedPrompt(log) : 'No message'}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <FiUser className="w-3 h-3 mr-1" />
                        <span className="truncate">{log.user_email_id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Log Details */}
      <div className="lg:col-span-2">
        {selectedLog ? (
          <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md h-full">
            {logs.filter(log => log.id === selectedLog).map((log) => {
              const logType = log.log_type || 'activity';
              const typeInfo = getLogTypeInfo(logType);
              return (
                <div key={log.id} className="h-full flex flex-col">
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
                        <p className="text-sm text-white">{formatTimestamp(log.created_at)}</p>
                      </div>
                      <div className="bg-dark-lighter/50 p-3 rounded-lg border border-white/5">
                        <p className="text-xs text-gray-400 mb-1">Agent</p>
                        <p className="text-sm text-white">{agentInfo.name}</p>
                      </div>
                      <div className="bg-dark-lighter/50 p-3 rounded-lg border border-white/5">
                        <p className="text-xs text-gray-400 mb-1">Caller Agent</p>
                        <p className="text-sm text-white">{log.agent_system_name || 'N/A'}</p>
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
            })}
          </div>
        ) : (
          <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md h-64 flex items-center justify-center">
            <p className="text-gray-400">Select a log to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AgentLogs;
