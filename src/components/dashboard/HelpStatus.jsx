import React from 'react';
import { FiActivity, FiServer, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import PageHeader from './PageHeader';

function HelpStatus() {
  // Sample system status data
  const systemStatus = [
    { name: 'API Services', status: 'operational', uptime: '99.98%' },
    { name: 'Authentication', status: 'operational', uptime: '100%' },
    { name: 'Database', status: 'operational', uptime: '99.95%' },
    { name: 'AI Processing', status: 'operational', uptime: '99.92%' },
    { name: 'Web Application', status: 'operational', uptime: '99.99%' }
  ];

  return (
    <div>
      <PageHeader 
        title="System Status"
        description="Check the current status of all GeniusOS services and components"
      />

      {/* Status Overview */}
      <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6 mb-8">
        <div className="flex items-center mb-6">
          <FiServer className="text-emerald-400 w-6 h-6 mr-3" />
          <h3 className="text-2xl font-bold text-white">Current Status</h3>
        </div>
        
        <div className="flex items-center justify-between bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <FiCheckCircle className="text-emerald-400 w-5 h-5 mr-2" />
            <span className="text-white font-medium">All Systems Operational</span>
          </div>
          <span className="text-gray-400">Last updated: {new Date().toLocaleString()}</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="pb-2 font-bold">Service</th>
                <th className="pb-2 font-bold">Status</th>
                <th className="pb-2 font-bold">Uptime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {systemStatus.map((service, index) => (
                <tr key={index} className="text-white">
                  <td className="py-4">{service.name}</td>
                  <td className="py-4">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                      <span className="capitalize">{service.status}</span>
                    </span>
                  </td>
                  <td className="py-4">{service.uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Incident History */}
      <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6">
        <div className="flex items-center mb-6">
          <FiActivity className="text-emerald-400 w-6 h-6 mr-3" />
          <h3 className="text-2xl font-bold text-white">Recent Incidents</h3>
        </div>
        
        <div className="space-y-4">
          <div className="border-b border-gray-700 pb-4">
            <div className="flex items-center mb-2">
              <FiAlertTriangle className="text-amber-400 w-4 h-4 mr-2" />
              <h4 className="text-white font-bold">Minor API Latency</h4>
              <span className="ml-auto text-gray-400 text-sm">April 12, 2025</span>
            </div>
            <p className="text-gray-400">
              We experienced increased latency in our API services due to higher than normal traffic. The issue was resolved within 15 minutes with no service interruption.
            </p>
          </div>
          
          <div className="border-b border-gray-700 pb-4">
            <div className="flex items-center mb-2">
              <FiAlertTriangle className="text-amber-400 w-4 h-4 mr-2" />
              <h4 className="text-white font-bold">Scheduled Maintenance</h4>
              <span className="ml-auto text-gray-400 text-sm">March 28, 2025</span>
            </div>
            <p className="text-gray-400">
              Scheduled database maintenance was performed to improve system performance. The maintenance was completed successfully with minimal downtime.
            </p>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <FiAlertTriangle className="text-red-400 w-4 h-4 mr-2" />
              <h4 className="text-white font-bold">Authentication Service Disruption</h4>
              <span className="ml-auto text-gray-400 text-sm">February 15, 2025</span>
            </div>
            <p className="text-gray-400">
              Our authentication service experienced a brief outage due to an issue with our third-party provider. The issue was resolved within 30 minutes and all services were restored to normal operation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpStatus;
