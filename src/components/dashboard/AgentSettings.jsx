import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEye, FiEyeOff, FiSave, FiCheck, FiAlertCircle } from 'react-icons/fi';

function AgentSettings() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(1);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [defaultModel, setDefaultModel] = useState('deepseek-r1');
  const [fallbackModel, setFallbackModel] = useState('gpt-4');
  const [modelError, setModelError] = useState('');

  const models = [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
    { value: 'deepseek-r1', label: 'DeepSeek R1' }
  ];

  const handleModelChange = (type, value) => {
    if (type === 'default') {
      if (value === fallbackModel) {
        setModelError('Default and fallback models cannot be the same');
        return;
      }
      setDefaultModel(value);
    } else {
      if (value === defaultModel) {
        setModelError('Default and fallback models cannot be the same');
        return;
      }
      setFallbackModel(value);
    }
    setModelError('');
  };

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

  const handleSave = () => {
    if (modelError) return;
    
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      // Reset the saved state after 2 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    }, 1000);
  };

  // Get agent-specific credential fields
  const getCredentialFields = () => {
    switch (agentId) {
      case 'wordpress':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                WordPress Site URL
              </label>
              <input
                type="url"
                className="w-full bg-dark border border-dark-card rounded-lg px-4 py-2 text-gray-100"
                placeholder="https://your-site.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Username
              </label>
              <input
                type="text"
                className="w-full bg-dark border border-dark-card rounded-lg px-4 py-2 text-gray-100"
                placeholder="WordPress username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Application Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-dark border border-dark-card rounded-lg px-4 py-2 text-gray-100"
                  placeholder="WordPress application password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                WordPress REST API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  className="w-full bg-dark border border-dark-card rounded-lg px-4 py-2 text-gray-100"
                  placeholder="WordPress REST API key"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                >
                  {showApiKey ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </>
        );
      case 'support':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Slack Bot Token
            </label>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                className="w-full bg-dark border border-dark-card rounded-lg px-4 py-2 text-gray-100"
                placeholder="xoxb-your-token"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
              >
                {showApiKey ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        );
      case 'metrics':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              LinkedIn API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                className="w-full bg-dark border border-dark-card rounded-lg px-4 py-2 text-gray-100"
                placeholder="LinkedIn API key"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
              >
                {showApiKey ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                className="w-full bg-dark border border-dark-card rounded-lg px-4 py-2 text-gray-100"
                placeholder="Enter API key"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
              >
                {showApiKey ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-400 hover:text-primary transition-colors mr-4"
          >
            <FiArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Agent Settings</h1>
            <p className="text-gray-400 mt-1">{getAgentName()}</p>
          </div>
        </div>
        <button
          className={`flex items-center px-6 py-2 rounded-lg transition-all duration-300 font-semibold ${
            isSaved
              ? 'bg-green-500 hover:bg-green-600'
              : modelError 
                ? 'bg-dark-card text-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-hover hover:shadow-glow'
          } text-dark`}
          onClick={handleSave}
          disabled={isSaving || isSaved || modelError}
        >
          {isSaved ? (
            <>
              <FiCheck className="w-5 h-5 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <FiSave className="w-5 h-5 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </>
          )}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Left Panel - Basic Settings */}
        <div className="bg-dark-lighter p-6 rounded-xl border border-dark-card">
          <div className="space-y-6">
            {/* Model Settings */}
            <div>
              <h2 className="text-xl font-bold text-gray-100 mb-4">Model Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    AI Model (default)
                  </label>
                  <select 
                    className="w-full bg-dark border border-dark-card rounded-lg px-4 py-2 text-gray-100"
                    value={defaultModel}
                    onChange={(e) => handleModelChange('default', e.target.value)}
                  >
                    {models.map(model => (
                      <option 
                        key={model.value} 
                        value={model.value}
                        disabled={model.value === fallbackModel}
                      >
                        {model.label} {model.value === fallbackModel ? '(Selected as Fallback)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Fallback Model
                  </label>
                  <select 
                    className="w-full bg-dark border border-dark-card rounded-lg px-4 py-2 text-gray-100"
                    value={fallbackModel}
                    onChange={(e) => handleModelChange('fallback', e.target.value)}
                  >
                    {models.map(model => (
                      <option 
                        key={model.value} 
                        value={model.value}
                        disabled={model.value === defaultModel}
                      >
                        {model.label} {model.value === defaultModel ? '(Selected as Default)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                {modelError && (
                  <div className="flex items-center text-red-500 text-sm">
                    <FiAlertCircle className="w-4 h-4 mr-2" />
                    {modelError}
                  </div>
                )}
              </div>
            </div>

            {/* Generation Parameters */}
            <div>
              <h2 className="text-xl font-bold text-gray-100 mb-4">Generation Parameters</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-400">
                      Temperature
                    </label>
                    <span className="text-sm text-gray-400">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-400">
                      Top P
                    </label>
                    <span className="text-sm text-gray-400">{topP}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={topP}
                    onChange={(e) => setTopP(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Max Tokens
                  </label>
                  <select className="w-full bg-dark border border-dark-card rounded-lg px-4 py-2 text-gray-100">
                    <option value="1024">1024 tokens</option>
                    <option value="2048">2048 tokens</option>
                    <option value="4096">4096 tokens</option>
                    <option value="8192">8192 tokens</option>
                  </select>
                </div>
              </div>
            </div>

            {/* System Message */}
            <div>
              <h2 className="text-xl font-bold text-gray-100 mb-4">Behavior Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    System Message
                  </label>
                  <textarea
                    className="w-full bg-dark border border-dark-card rounded-lg px-4 py-2 text-gray-100"
                    placeholder="Define the AI's behavior and role"
                    rows="3"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Credentials & Keys */}
        <div className="bg-dark-lighter p-6 rounded-xl border border-dark-card self-start">
          <h2 className="text-xl font-bold text-gray-100 mb-4">Credentials & API Keys</h2>
          <div className="space-y-6">
            {getCredentialFields()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentSettings;