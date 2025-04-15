import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { FiSave, FiSettings, FiSliders, FiMessageSquare, FiKey, FiCheckCircle, FiActivity, FiBarChart2, FiHelpCircle, FiX } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import OrganizationContext, { useOrganization } from '../../contexts/OrganizationContext';

function AgentSettings() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { selectedOrg: organization } = useOrganization();

  // Get agent name from the URL
  const getAgentName = () => {
    // Map agent IDs to display names
    const agentDisplayNames = {
      'slack-app': 'Slack App',
      'social-media-manager': 'Social Media Manager',
      'ai-content-manager': 'AI Content Manager',
      'market-research': 'Market Research',
      'content-writer': 'Content Writer',
      'image-generator': 'Image Generator',
      'echo-prompt': 'ECHO Prompt',
      'workflow-helper': 'Workflow Helper',
      'facebook-influencer': 'Facebook Influencer'
    };
    
    // Check if we have a direct mapping
    if (agentDisplayNames[agentId]) {
      return agentDisplayNames[agentId];
    }
    
    // If no direct mapping, format the ID nicely
    return agentId
      .replace(/_agent$/, '') // Remove _agent suffix if present
      .split(/[-_]/) // Split by dash or underscore
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' '); // Join with spaces
  };

  // Get system name for the agent - use the exact name from the URL
  const getSystemName = () => {
    // The agentId from useParams() is exactly what we need
    return agentId || '';
  };

  // Available AI models
  const [availableModels, setAvailableModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigLoading, setIsConfigLoading] = useState(true);

  // State for tracking API errors
  const [apiError, setApiError] = useState(false);

  // Default settings for the agent - initialize with empty values first
  const [settings, setSettings] = useState({
    name: '',
    apiKey: 'sk-••••••••••••••••••••••••••••••',
    model: '',
    backupModel: '',
    temperature: 0,
    maxTokens: 0,
    topP: 0,
    frequencyPenalty: 0,
    presencePenalty: 0,
    systemMessage: '',
    enabled: true
  });

  // Store original settings for comparison and cancel functionality
  const [originalSettings, setOriginalSettings] = useState(null);

  // Track if settings have been modified
  const [hasChanges, setHasChanges] = useState(false);

  // Force hide cancel button initially
  const [showCancelButton, setShowCancelButton] = useState(false);
  
  // Explicitly track if the form has been modified
  const [formModified, setFormModified] = useState(false);

  // Update the name once component is mounted
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      name: getAgentName()
    }));
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://db.api.geniusos.co/llm-models/');
        const models = response.data.models.sort((a, b) => a.sort_order - b.sort_order);
        
        const formattedModels = models.map(model => ({
          label: model.general_name,
          value: model.model
        }));
        
        setAvailableModels(formattedModels);
        
        // Update default models if they're not already set from agent settings
        if (settings.model === 'gpt-4o' && formattedModels.length > 0) {
          setSettings(prev => ({
            ...prev,
            model: formattedModels[0].value
          }));
        }
        
        if (settings.backupModel === 'claude-3-7-sonnet-20250219' && formattedModels.length > 1) {
          setSettings(prev => ({
            ...prev,
            backupModel: formattedModels[1].value
          }));
        }
      } catch (error) {
        console.error('Error fetching models:', error);
        toast.error('Failed to load available models');
        // Fallback models in case API fails
        setAvailableModels([
          { label: 'ChatGPT', value: 'gpt-4o' },
          { label: 'Claude', value: 'claude-3-7-sonnet-20250219' },
          { label: 'DeepSeek', value: 'deepseek-chat' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    const fetchAgentConfig = async () => {
      if (!organization?.id || !agentId) return;
      
      try {
        setIsConfigLoading(true);
        setApiError(false); // Reset error state when starting a new fetch
        const systemName = getSystemName();
        console.log(`Fetching config for agent: ${agentId}, system name: ${systemName}, org ID: ${organization.id}`);
        
        // Use the correct API endpoint with POST method
        const response = await axios.post('https://db.api.geniusos.co/agent-config/', {
          user_org_id: organization.id,
          system_name: systemName
        });
        
        const config = response.data;
        console.log('Fetched agent config:', config);
        
        // Only update settings if we got a valid response
        if (config) {
          setSettings(prev => ({
            ...prev,
            name: getAgentName(),
            model: config.llm_model_default || '',
            backupModel: config.llm_model_fallback || '',
            maxTokens: config.max_tokens || 0,
            temperature: config.temperature || 0,
            topP: config.top_p || 0,
            frequencyPenalty: config.frequency_penalty || 0,
            presencePenalty: config.presence_penalty || 0,
            systemMessage: config.system_message || ''
          }));
          setOriginalSettings({
            ...config,
            name: getAgentName(),
            model: config.llm_model_default || '',
            backupModel: config.llm_model_fallback || '',
            maxTokens: config.max_tokens || 0,
            temperature: config.temperature || 0,
            topP: config.top_p || 0,
            frequencyPenalty: config.frequency_penalty || 0,
            presencePenalty: config.presence_penalty || 0,
            systemMessage: config.system_message || ''
          });
        }
        
      } catch (error) {
        console.error('Error fetching agent configuration:', error);
        setApiError(true);
        toast.error('Failed to load agent configuration');
      } finally {
        setIsConfigLoading(false);
      }
    };
    
    fetchAgentConfig();
  }, [organization?.id, agentId]);

  useEffect(() => {
    if (originalSettings) {
      // Only check for changes if we have loaded the original settings
      const settingsChanged = JSON.stringify(settings) !== JSON.stringify(originalSettings);
      console.log('Settings changed:', settingsChanged);
      console.log('Original settings:', originalSettings);
      console.log('Current settings:', settings);
      setHasChanges(settingsChanged);
      setShowCancelButton(settingsChanged);
    } else {
      // If original settings aren't loaded yet, there are no changes
      setHasChanges(false);
      setShowCancelButton(false);
    }
  }, [settings, originalSettings]);

  // Reset hasChanges when agent ID changes
  useEffect(() => {
    // Reset change tracking when agent changes
    setHasChanges(false);
    setOriginalSettings(null);
  }, [agentId]);

  // Token options with descriptions
  const tokenOptions = [
    { value: 1024, label: 'Standard (1024)', description: 'Balanced option for most tasks with good results and lower cost' },
    { value: 2048, label: 'Enhanced (2048)', description: 'Better for complex responses with moderate cost increase' },
    { value: 4096, label: 'Maximum (4096)', description: 'Best for detailed, comprehensive responses where quality is critical' }
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
    setFormModified(true);
  };

  // Handle slider changes
  const handleSliderChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
    setFormModified(true);
  };

  // Handle cancel - reset to original values
  const handleCancel = () => {
    if (originalSettings) {
      setSettings(originalSettings);
      toast.info('Changes discarded');
      setFormModified(false);
    }
  };

  // Handle model change with validation to prevent selecting the same model for both dropdowns
  const handleModelChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'model' && value === settings.backupModel) {
      // If primary model is changed to match backup model, set backup to a different model
      const otherModels = availableModels.filter(model => model.value !== value);
      if (otherModels.length > 0) {
        setSettings({
          ...settings,
          model: value,
          backupModel: otherModels[0].value
        });
      }
    } else if (name === 'backupModel' && value === settings.model) {
      // If backup model is changed to match primary model, don't allow the change
      // Just keep the current backup model
    } else {
      // Normal case - models are different
      setSettings({
        ...settings,
        [name]: value
      });
    }
    setFormModified(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Only proceed if we have organization ID and agent ID
      if (organization?.id && agentId) {
        const systemName = getSystemName();
        console.log(`Saving config for agent: ${agentId}, system name: ${systemName}`);
        
        // Use the correct API endpoint with PUT method
        const response = await axios.put('https://db.api.geniusos.co/agent-config/', {
          user_org_id: organization.id,
          system_name: systemName,
          llm_model_default: settings.model,
          llm_model_fallback: settings.backupModel,
          max_tokens: parseInt(settings.maxTokens),
          temperature: parseFloat(settings.temperature),
          top_p: parseFloat(settings.topP),
          frequency_penalty: parseFloat(settings.frequencyPenalty),
          presence_penalty: parseFloat(settings.presencePenalty)
        });
        
        console.log('Updated agent config:', response.data);
        
        // Update local settings with the response data
        if (response.data) {
          setSettings(prev => ({
            ...prev,
            model: response.data.llm_model_default || prev.model,
            backupModel: response.data.llm_model_fallback || prev.backupModel,
            maxTokens: response.data.max_tokens || prev.maxTokens,
            temperature: response.data.temperature || prev.temperature,
            topP: response.data.top_p || prev.topP,
            frequencyPenalty: response.data.frequency_penalty || prev.frequencyPenalty,
            presencePenalty: response.data.presence_penalty || prev.presencePenalty,
            systemMessage: response.data.system_message || prev.systemMessage
          }));
          setOriginalSettings({
            ...response.data,
            name: getAgentName(),
            model: response.data.llm_model_default || '',
            backupModel: response.data.llm_model_fallback || '',
            maxTokens: response.data.max_tokens || 0,
            temperature: response.data.temperature || 0,
            topP: response.data.top_p || 0,
            frequencyPenalty: response.data.frequency_penalty || 0,
            presencePenalty: response.data.presence_penalty || 0,
            systemMessage: response.data.system_message || ''
          });
        }
        
        toast.success('Settings saved successfully');
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
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
    return 'settings'; // Default tab
  };
  
  const activeTab = getActiveTab();
  
  return (
    <div className="w-full">
      {/* Page title and action buttons */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">{getAgentName()}</h2>
          <p className="text-gray-400 text-sm mt-1">Configure and monitor your AI assistant</p>
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            form="agent-settings-form"
            disabled={isSaving || !formModified}
            className={`px-4 py-2 ${
              isSaving || !formModified
                ? 'bg-emerald-700/50 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500'
            } text-white rounded-lg flex items-center transition-colors`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Save Settings
              </>
            )}
          </button>
          {/* Only show cancel button if the form has been modified */}
          {formModified && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center transition-colors"
            >
              <FiX className="mr-2" />
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-700/40 mb-6">
        <Link
          to={`/dashboard/settings/${agentId}`}
          className={`px-4 py-3 text-sm font-medium border-b-2 ${
            location.pathname.includes('/settings/') && !location.pathname.includes('/logs') && !location.pathname.includes('/usage') && !location.pathname.includes('/setup-guide')
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
          } transition-colors`}
        >
          <div className="flex items-center">
            <FiSettings className="mr-2" />
            Settings
          </div>
        </Link>
        <Link
          to={`/dashboard/logs/${agentId}`}
          className={`px-4 py-3 text-sm font-medium border-b-2 ${
            location.pathname.includes('/logs')
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
          } transition-colors`}
        >
          <div className="flex items-center">
            <FiActivity className="mr-2" />
            Logs
          </div>
        </Link>
        <Link
          to={`/dashboard/usage/${agentId}`}
          className={`px-4 py-3 text-sm font-medium border-b-2 ${
            location.pathname.includes('/usage')
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
          } transition-colors`}
        >
          <div className="flex items-center">
            <FiBarChart2 className="mr-2" />
            Usage
          </div>
        </Link>
        <Link
          to={`/dashboard/setup-guide/${agentId}`}
          className={`px-4 py-3 text-sm font-medium border-b-2 ${
            location.pathname.includes('/setup-guide')
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
          } transition-colors`}
        >
          <div className="flex items-center">
            <FiHelpCircle className="mr-2" />
            Setup Guide
          </div>
        </Link>
      </div>

      {(isLoading || isConfigLoading) && (
        <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-white">Loading agent configuration...</span>
          </div>
        </div>
      )}

      {apiError && !isConfigLoading && (
        <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-white font-medium">Failed to load agent configuration</h3>
              <p className="text-gray-300 text-sm">Please check your connection and try again later.</p>
            </div>
          </div>
        </div>
      )}
      
      {!apiError && !isConfigLoading && (
        <form id="agent-settings-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Model Configuration */}
            <div className="space-y-6">
              {/* Model Configuration */}
              <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md h-full">
                <div className="border-b border-white/5 px-4 py-3 flex items-center">
                  <h2 className="font-medium text-white text-sm flex items-center">
                    <span className="text-emerald-400 mr-2">⚙️</span> Model Configuration
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        AI Model (default)
                      </label>
                      {isLoading ? (
                        <div className="w-full bg-[#1a1f25] border border-gray-700/40 rounded-lg px-3 py-2 text-gray-500 text-sm">
                          Loading models...
                        </div>
                      ) : (
                        <select
                          name="model"
                          value={settings.model}
                          onChange={handleModelChange}
                          className="w-full bg-[#1a1f25] border border-gray-700/40 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                        >
                          {availableModels.map(model => (
                            <option 
                              key={model.value} 
                              value={model.value}
                              disabled={model.value === settings.backupModel}
                            >
                              {model.label}
                            </option>
                          ))}
                        </select>
                      )}
                      <p className="mt-2 text-xs text-gray-500">Primary AI model used for all requests</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Backup AI Model
                      </label>
                      {isLoading ? (
                        <div className="w-full bg-[#1a1f25] border border-gray-700/40 rounded-lg px-3 py-2 text-gray-500 text-sm">
                          Loading models...
                        </div>
                      ) : (
                        <select
                          name="backupModel"
                          value={settings.backupModel}
                          onChange={handleModelChange}
                          className="w-full bg-[#1a1f25] border border-gray-700/40 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                        >
                          {availableModels.map(model => (
                            <option 
                              key={model.value} 
                              value={model.value}
                              disabled={model.value === settings.model}
                            >
                              {model.label}
                            </option>
                          ))}
                        </select>
                      )}
                      <p className="mt-2 text-xs text-gray-500">Fallback model used when primary is unavailable</p>
                    </div>
                
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Max Tokens
                      </label>
                      <select
                        name="maxTokens"
                        value={settings.maxTokens}
                        onChange={handleInputChange}
                        className="w-full bg-[#1a1f25] border border-gray-700/40 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                      >
                        {tokenOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-xs text-gray-500">
                        {tokenOptions.find(option => option.value === parseInt(settings.maxTokens))?.description || 'Select token limit for responses'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Generation Parameters */}
            <div className="space-y-6">
              {/* Generation Parameters */}
              <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md h-full">
                <div className="border-b border-white/5 px-4 py-3 flex items-center">
                  <h2 className="font-medium text-white text-sm flex items-center">
                    <span className="text-emerald-400 mr-2">⚙️</span> Generation Parameters
                  </h2>
                </div>
                <div className="p-6 space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-white">Temperature: {settings.temperature}</label>
                    </div>
                    <div className="relative pt-5">
                      <input
                        type="range"
                        name="temperature"
                        min="0"
                        max="1.4"
                        step="0.05"
                        value={settings.temperature}
                        onChange={(e) => handleSliderChange('temperature', parseFloat(e.target.value))}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-dark-card"
                      />
                      <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                        <span>Precise (0)</span>
                        <span>Balanced (0.7)</span>
                        <span>Creative (1.4)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-white">Top P: {settings.topP}</label>
                    </div>
                    <div className="relative pt-5">
                      <input
                        type="range"
                        name="topP"
                        min="0"
                        max="1"
                        step="0.05"
                        value={settings.topP}
                        onChange={(e) => handleSliderChange('topP', parseFloat(e.target.value))}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-dark-card"
                      />
                      <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                        <span>Focused (0)</span>
                        <span>Balanced (0.5)</span>
                        <span>Diverse (1)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-white">Frequency Penalty: {settings.frequencyPenalty}</label>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          name="frequencyPenalty"
                          min="0"
                          max="2"
                          step="0.1"
                          value={settings.frequencyPenalty}
                          onChange={(e) => handleSliderChange('frequencyPenalty', parseFloat(e.target.value))}
                          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-dark-card"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-white">Presence Penalty: {settings.presencePenalty}</label>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          name="presencePenalty"
                          min="0"
                          max="2"
                          step="0.1"
                          value={settings.presencePenalty}
                          onChange={(e) => handleSliderChange('presencePenalty', parseFloat(e.target.value))}
                          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-dark-card"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default AgentSettings;