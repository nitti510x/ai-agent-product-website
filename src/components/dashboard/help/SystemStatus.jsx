import React from 'react';
import { FiAlertCircle, FiCheck, FiClock, FiAlertTriangle } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';

function SystemStatus() {
  // Sample system status data
  const systemComponents = [
    {
      id: 'api',
      name: 'API Services',
      status: 'operational',
      uptime: '99.99%',
      lastIncident: null
    },
    {
      id: 'slack',
      name: 'Slack Integration',
      status: 'operational',
      uptime: '99.95%',
      lastIncident: '2025-02-15'
    },
    {
      id: 'image',
      name: 'Image Generation',
      status: 'operational',
      uptime: '99.98%',
      lastIncident: null
    },
    {
      id: 'copy',
      name: 'Copy Generation',
      status: 'operational',
      uptime: '99.97%',
      lastIncident: null
    },
    {
      id: 'billing',
      name: 'Billing System',
      status: 'operational',
      uptime: '100%',
      lastIncident: null
    },
    {
      id: 'tokens',
      name: 'Token Management',
      status: 'operational',
      uptime: '99.99%',
      lastIncident: null
    }
  ];

  // Sample recent incidents
  const recentIncidents = [
    {
      id: 1,
      date: '2025-02-15',
      component: 'Slack Integration',
      title: 'Slack Integration Degraded Performance',
      status: 'resolved',
      description: 'The Slack integration experienced degraded performance for approximately 45 minutes due to rate limiting from the Slack API. Our team implemented a fix to better handle rate limits.',
      updates: [
        {
          timestamp: '2025-02-15T14:30:00Z',
          message: 'Issue identified: Slack integration experiencing delays.'
        },
        {
          timestamp: '2025-02-15T14:45:00Z',
          message: 'Investigation: Rate limiting from Slack API identified as the cause.'
        },
        {
          timestamp: '2025-02-15T15:00:00Z',
          message: 'Fix deployed: Implemented improved rate limit handling.'
        },
        {
          timestamp: '2025-02-15T15:15:00Z',
          message: 'Resolved: Service fully restored and operating normally.'
        }
      ]
    }
  ];

  // Sample scheduled maintenance
  const scheduledMaintenance = [
    {
      id: 1,
      date: '2025-03-15',
      timeWindow: '2:00 AM - 4:00 AM PST',
      title: 'Database Optimization',
      description: 'We will be performing routine database maintenance to optimize performance. During this time, the system may experience brief periods of slowness or intermittent unavailability.',
      components: ['API Services', 'Token Management']
    }
  ];

  // Helper function to render status indicator
  const renderStatusIndicator = (status) => {
    switch (status) {
      case 'operational':
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
            <span className="text-emerald-400">Operational</span>
          </div>
        );
      case 'degraded':
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-yellow-400">Degraded</span>
          </div>
        );
      case 'outage':
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-red-400">Outage</span>
          </div>
        );
      case 'maintenance':
        return (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-blue-400">Maintenance</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Calculate overall system status
  const calculateOverallStatus = () => {
    if (systemComponents.some(comp => comp.status === 'outage')) {
      return 'outage';
    } else if (systemComponents.some(comp => comp.status === 'degraded')) {
      return 'degraded';
    } else {
      return 'operational';
    }
  };

  const overallStatus = calculateOverallStatus();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">System Status</h2>
          <p className="text-gray-400 text-sm mt-1">Current status of all system components</p>
        </div>
      </div>

      {/* Overall system status */}
      <div className={`bg-[#1A1E23] rounded-2xl shadow-2xl border ${
        overallStatus === 'operational' ? 'border-emerald-500/30' : 
        overallStatus === 'degraded' ? 'border-yellow-500/30' : 'border-red-500/30'
      } p-6 mb-8`}>
        <div className="flex items-center mb-4">
          {overallStatus === 'operational' ? (
            <FiCheck className="text-emerald-500 mr-3 w-6 h-6" />
          ) : overallStatus === 'degraded' ? (
            <FiAlertTriangle className="text-yellow-500 mr-3 w-6 h-6" />
          ) : (
            <FiAlertCircle className="text-red-500 mr-3 w-6 h-6" />
          )}
          <h3 className="text-lg font-semibold text-white">
            {overallStatus === 'operational' ? 'All Systems Operational' : 
             overallStatus === 'degraded' ? 'Some Systems Degraded' : 'System Outage Detected'}
          </h3>
        </div>
        <p className="text-gray-300">
          {overallStatus === 'operational' ? 
            'All services are running smoothly. There are no known issues at this time.' : 
            'We are currently experiencing issues with some of our services. Our team is working to resolve them as quickly as possible.'}
        </p>
        <div className="mt-4 text-gray-400 text-sm">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Component status table */}
      <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-6">Component Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="pb-3 font-medium">Component</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Uptime</th>
                <th className="pb-3 font-medium">Last Incident</th>
              </tr>
            </thead>
            <tbody>
              {systemComponents.map((component) => (
                <tr key={component.id} className="border-b border-gray-700/50 text-gray-300">
                  <td className="py-4">{component.name}</td>
                  <td className="py-4">{renderStatusIndicator(component.status)}</td>
                  <td className="py-4">{component.uptime}</td>
                  <td className="py-4">
                    {component.lastIncident ? (
                      <span className="text-gray-400">{component.lastIncident}</span>
                    ) : (
                      <span className="text-gray-500">None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent incidents */}
      <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6 mb-8">
        <div className="flex items-center mb-6">
          <FiAlertCircle className="text-primary mr-3 w-5 h-5" />
          <h3 className="text-lg font-semibold text-white">Recent Incidents</h3>
        </div>
        
        {recentIncidents.length > 0 ? (
          <div className="space-y-6">
            {recentIncidents.map((incident) => (
              <div key={incident.id} className="border-b border-gray-700 pb-6 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-medium">{incident.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    incident.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300' :
                    incident.status === 'investigating' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center text-gray-400 text-sm mb-3">
                  <span>{incident.date}</span>
                  <span className="mx-2">•</span>
                  <span>{incident.component}</span>
                </div>
                <p className="text-gray-300 mb-4">{incident.description}</p>
                
                <div className="space-y-3">
                  {incident.updates.map((update, index) => (
                    <div key={index} className="flex">
                      <div className="mr-3 flex flex-col items-center">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        {index < incident.updates.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-700"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-400 text-xs mb-1">
                          {new Date(update.timestamp).toLocaleString()}
                        </div>
                        <div className="text-gray-300">{update.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300">No incidents reported in the last 30 days.</p>
        )}
      </div>

      {/* Scheduled maintenance */}
      <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6">
        <div className="flex items-center mb-6">
          <FiClock className="text-primary mr-3 w-5 h-5" />
          <h3 className="text-lg font-semibold text-white">Scheduled Maintenance</h3>
        </div>
        
        {scheduledMaintenance.length > 0 ? (
          <div className="space-y-6">
            {scheduledMaintenance.map((maintenance) => (
              <div key={maintenance.id} className="border-b border-gray-700 pb-6 last:border-b-0 last:pb-0">
                <h4 className="text-white font-medium mb-2">{maintenance.title}</h4>
                <div className="flex items-center text-gray-400 text-sm mb-3">
                  <span>{maintenance.date}</span>
                  <span className="mx-2">•</span>
                  <span>{maintenance.timeWindow}</span>
                </div>
                <p className="text-gray-300 mb-3">{maintenance.description}</p>
                <div className="flex flex-wrap gap-2">
                  {maintenance.components.map((component, index) => (
                    <span key={index} className="bg-dark-card/70 border border-gray-700 rounded-full px-3 py-1 text-xs text-gray-300">
                      {component}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300">No scheduled maintenance at this time.</p>
        )}
      </div>
    </div>
  );
}

export default SystemStatus;
