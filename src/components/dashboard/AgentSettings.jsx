import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiSettings, FiSliders, FiMessageSquare, FiKey, FiCheckCircle } from 'react-icons/fi';

function AgentSettings() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Available AI models
  const availableModels = [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'claude-2', label: 'Claude 2' },
    { value: 'claude-instant', label: 'Claude Instant' }
  ];

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

  // Sample agent settings data
  const [settings, setSettings] = useState({
    name: getAgentName(),
    apiKey: 'sk-••••••••••••••••••••••••••••••',
    model: 'gpt-4',
    backupModel: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    systemMessage: 'You are a helpful assistant that provides accurate and concise information.',
    enabled: true
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
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
  };

  // Handle range input change
  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: parseFloat(value)
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  // Get credential fields based on agent type
  const getCredentialFields = () => {
    switch (agentId) {
      case 'support':
        return (
          <div className="bg-dark-lighter/50 p-4 rounded-lg border border-white/5">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Slack Bot Token
            </label>
            <input
              type="text"
              name="apiKey"
              value={settings.apiKey}
              onChange={handleChange}
              className="w-full bg-dark-card border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              placeholder="xoxb-your-token"
            />
            <p className="mt-2 text-xs text-gray-500">
              Your Slack Bot Token can be found in the Slack API dashboard under "OAuth & Permissions"
            </p>
          </div>
        );
      case 'wordpress':
        return (
          <div className="space-y-4">
            <div className="bg-dark-lighter/50 p-4 rounded-lg border border-white/5">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                WordPress Site URL
              </label>
              <input
                type="url"
                name="siteUrl"
                value="https://example.com"
                onChange={handleChange}
                className="w-full bg-dark-card border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="https://your-site.com"
              />
            </div>
            <div className="bg-dark-lighter/50 p-4 rounded-lg border border-white/5">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                WordPress API Key
              </label>
              <input
                type="password"
                name="apiKey"
                value={settings.apiKey}
                onChange={handleChange}
                className="w-full bg-dark-card border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="Enter your WordPress API Key"
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-dark-lighter/50 p-4 rounded-lg border border-white/5">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              name="apiKey"
              value={settings.apiKey}
              onChange={handleChange}
              className="w-full bg-dark-card border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              placeholder="sk-..."
            />
            <p className="mt-2 text-xs text-gray-500">
              Your API key is stored securely and never shared with third parties
            </p>
          </div>
        );
    }
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
            <h1 className="text-2xl font-bold text-white">Agent Settings</h1>
            <p className="text-gray-400 text-sm mt-1">{getAgentName()}</p>
          </div>
        </div>
        <div className="h-0.5 w-full bg-gradient-to-r from-emerald-400/20 to-blue-500/20 mt-4"></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Agent Status */}
            <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md">
              <div className="border-b border-white/5 px-4 py-3 flex items-center">
                <FiSettings className="text-emerald-400 mr-2" />
                <h2 className="font-medium text-white text-sm">Agent Status</h2>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white">Enable Agent</label>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                    <input
                      type="checkbox"
                      name="enabled"
                      checked={settings.enabled}
                      onChange={handleChange}
                      className="opacity-0 w-0 h-0"
                      id="toggle"
                    />
                    <label
                      htmlFor="toggle"
                      className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                        settings.enabled ? 'bg-emerald-500' : 'bg-gray-700'
                      }`}
                    >
                      <span
                        className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                          settings.enabled ? 'transform translate-x-6' : ''
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-400">
                  {settings.enabled
                    ? 'Agent is currently active and will respond to requests'
                    : 'Agent is disabled and will not respond to any requests'}
                </p>
              </div>
            </div>

            {/* API Credentials */}
            <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md">
              <div className="border-b border-white/5 px-4 py-3 flex items-center">
                <FiKey className="text-emerald-400 mr-2" />
                <h2 className="font-medium text-white text-sm">API Credentials</h2>
              </div>
              <div className="p-4 space-y-4">
                {getCredentialFields()}
              </div>
            </div>
          </div>

          {/* Middle and Right Columns - Model Settings and System Message */}
          <div className="lg:col-span-2 space-y-6">
            {/* Model Configuration */}
            <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md">
              <div className="border-b border-white/5 px-4 py-3 flex items-center">
                <FiSliders className="text-emerald-400 mr-2" />
                <h2 className="font-medium text-white text-sm">Model Configuration</h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-dark-lighter/50 p-4 rounded-lg border border-white/5">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      AI Model (default)
                    </label>
                    <select
                      name="model"
                      value={settings.model}
                      onChange={handleModelChange}
                      className="w-full bg-dark-card border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                    <p className="mt-2 text-xs text-gray-500">
                      Primary AI model used for all requests
                    </p>
                  </div>
                  
                  <div className="bg-dark-lighter/50 p-4 rounded-lg border border-white/5">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Backup AI Model
                    </label>
                    <select
                      name="backupModel"
                      value={settings.backupModel}
                      onChange={handleModelChange}
                      className="w-full bg-dark-card border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                    <p className="mt-2 text-xs text-gray-500">
                      Fallback model used when primary is unavailable
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div className="bg-dark-lighter/50 p-4 rounded-lg border border-white/5">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Max Tokens
                    </label>
                    <input
                      type="number"
                      name="maxTokens"
                      value={settings.maxTokens}
                      onChange={handleChange}
                      min="1"
                      max="8192"
                      className="w-full bg-dark-card border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Generation Parameters */}
            <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md">
              <div className="border-b border-white/5 px-4 py-3 flex items-center">
                <FiSliders className="text-emerald-400 mr-2" />
                <h2 className="font-medium text-white text-sm">Generation Parameters</h2>
              </div>
              <div className="p-4 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-white">Temperature: {settings.temperature}</label>
                    <span className="text-xs text-gray-400">Controls randomness</span>
                  </div>
                  <input
                    type="range"
                    name="temperature"
                    min="0"
                    max="2"
                    step="0.1"
                    value={settings.temperature}
                    onChange={handleRangeChange}
                    className="w-full h-2 bg-dark-lighter rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Precise (0)</span>
                    <span>Balanced (1)</span>
                    <span>Creative (2)</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-white">Top P: {settings.topP}</label>
                    <span className="text-xs text-gray-400">Controls diversity</span>
                  </div>
                  <input
                    type="range"
                    name="topP"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.topP}
                    onChange={handleRangeChange}
                    className="w-full h-2 bg-dark-lighter rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Focused (0)</span>
                    <span>Balanced (0.5)</span>
                    <span>Diverse (1)</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-white">Frequency Penalty: {settings.frequencyPenalty}</label>
                    </div>
                    <input
                      type="range"
                      name="frequencyPenalty"
                      min="0"
                      max="2"
                      step="0.1"
                      value={settings.frequencyPenalty}
                      onChange={handleRangeChange}
                      className="w-full h-2 bg-dark-lighter rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-white">Presence Penalty: {settings.presencePenalty}</label>
                    </div>
                    <input
                      type="range"
                      name="presencePenalty"
                      min="0"
                      max="2"
                      step="0.1"
                      value={settings.presencePenalty}
                      onChange={handleRangeChange}
                      className="w-full h-2 bg-dark-lighter rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* System Message */}
            <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md">
              <div className="border-b border-white/5 px-4 py-3 flex items-center">
                <FiMessageSquare className="text-emerald-400 mr-2" />
                <h2 className="font-medium text-white text-sm">System Message</h2>
              </div>
              <div className="p-4">
                <textarea
                  name="systemMessage"
                  value={settings.systemMessage}
                  onChange={handleChange}
                  rows="6"
                  className="w-full bg-dark-lighter/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Enter system message to define the AI's behavior..."
                ></textarea>
                <p className="mt-2 text-xs text-gray-500">
                  The system message helps set the behavior of the AI assistant. For example, you can specify the AI's role, knowledge limitations, or response style.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isSaving 
                ? 'bg-gray-700 text-gray-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600'
            }`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <FiCheckCircle className="mr-2" />
                Saved!
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AgentSettings;