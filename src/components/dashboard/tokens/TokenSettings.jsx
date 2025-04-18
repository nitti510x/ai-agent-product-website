import React, { useState } from 'react';
import { FiSettings, FiAlertCircle, FiToggleLeft, FiToggleRight, FiBell } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';
import PageHeader from '../PageHeader';

function TokenSettings() {
  const [lowBalanceAlert, setLowBalanceAlert] = useState(true);
  const [usageReports, setUsageReports] = useState(true);
  const [autoRenew, setAutoRenew] = useState(false);
  const [lowBalanceThreshold, setLowBalanceThreshold] = useState(50);

  return (
    <div>
      <PageHeader 
        title="Token Settings"
        description="Manage your token preferences and notifications"
      />

      {/* Notification Settings */}
      <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6 mb-8">
        <div className="flex items-center mb-6">
          <FiBell className="text-primary mr-3 w-5 h-5" />
          <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Low Balance Alerts</h4>
              <p className="text-gray-400 text-sm mt-1">
                Receive notifications when your token balance falls below a threshold
              </p>
            </div>
            <button 
              onClick={() => setLowBalanceAlert(!lowBalanceAlert)}
              className="text-2xl"
            >
              {lowBalanceAlert ? (
                <FiToggleRight className="text-primary" />
              ) : (
                <FiToggleLeft className="text-gray-400" />
              )}
            </button>
          </div>

          {lowBalanceAlert && (
            <div className="pl-6 border-l-2 border-primary/30">
              <h4 className="text-white font-medium mb-2">Low Balance Threshold</h4>
              <div className="flex items-center">
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="10"
                  value={lowBalanceThreshold}
                  onChange={(e) => setLowBalanceThreshold(parseInt(e.target.value))}
                  className="w-64 mr-4 accent-primary"
                />
                <div className="flex items-center bg-dark-card/70 px-3 py-1 rounded-lg">
                  <span className="text-white font-medium">{lowBalanceThreshold}</span>
                  <FaRobot className="text-primary ml-1 w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Weekly Usage Reports</h4>
              <p className="text-gray-400 text-sm mt-1">
                Receive weekly email reports of your token usage
              </p>
            </div>
            <button 
              onClick={() => setUsageReports(!usageReports)}
              className="text-2xl"
            >
              {usageReports ? (
                <FiToggleRight className="text-primary" />
              ) : (
                <FiToggleLeft className="text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Token Management Settings */}
      <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6 mb-8">
        <div className="flex items-center mb-6">
          <FiSettings className="text-primary mr-3 w-5 h-5" />
          <h3 className="text-lg font-semibold text-white">Token Management</h3>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Auto-Renew Token Packs</h4>
              <p className="text-gray-400 text-sm mt-1">
                Automatically purchase new token packs when your balance is low
              </p>
            </div>
            <button 
              onClick={() => setAutoRenew(!autoRenew)}
              className="text-2xl"
            >
              {autoRenew ? (
                <FiToggleRight className="text-primary" />
              ) : (
                <FiToggleLeft className="text-gray-400" />
              )}
            </button>
          </div>

          {autoRenew && (
            <div className="pl-6 border-l-2 border-primary/30">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start">
                <FiAlertCircle className="text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  When enabled, we'll automatically purchase a new token pack using your default payment method when your balance falls below the threshold. You can change or disable this setting at any time.
                </p>
              </div>
            </div>
          )}

          <div className="border-t border-gray-700 pt-6">
            <h4 className="text-white font-medium mb-4">Default Token Pack for Auto-Renewal</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary/10 border-2 border-primary rounded-lg p-4 relative">
                <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full"></div>
                <h5 className="text-white font-medium">Pro Pack</h5>
                <div className="flex items-center mt-2">
                  <span className="text-gray-300">500</span>
                  <FaRobot className="text-primary ml-1 w-4 h-4" />
                  <span className="text-gray-400 ml-2">$45</span>
                </div>
              </div>
              
              <div className="bg-dark-card/70 border border-gray-700 rounded-lg p-4">
                <h5 className="text-white font-medium">Business Pack</h5>
                <div className="flex items-center mt-2">
                  <span className="text-gray-300">1000</span>
                  <FaRobot className="text-primary ml-1 w-4 h-4" />
                  <span className="text-gray-400 ml-2">$80</span>
                </div>
              </div>
              
              <div className="bg-dark-card/70 border border-gray-700 rounded-lg p-4">
                <h5 className="text-white font-medium">Enterprise Pack</h5>
                <div className="flex items-center mt-2">
                  <span className="text-gray-300">5000</span>
                  <FaRobot className="text-primary ml-1 w-4 h-4" />
                  <span className="text-gray-400 ml-2">$350</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Limits section has been removed */}
    </div>
  );
}

export default TokenSettings;
