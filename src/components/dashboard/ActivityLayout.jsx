import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiActivity, FiBarChart2, FiSlack, FiImage, FiFileText, FiLinkedin, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import { RiWordpressFill } from 'react-icons/ri';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';
import { apiUrl } from '../../config/api';
import { useOrganization } from '../../contexts/OrganizationContext';

function ActivityLayout({ children }) {
  const location = useLocation();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedOrg } = useOrganization();
  
  useEffect(() => {
    // Fetch available agents from the API
    const fetchAgents = async () => {
      if (!selectedOrg) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl()}/agents/list`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            user_org_id: selectedOrg.id
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          setAgents(data.agents || []);
        } else {
          console.error('Failed to fetch agents');
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAgents();
  }, [selectedOrg]);
  
  // Map agent types to icons
  const getAgentIcon = (agent) => {
    const agentId = agent.id || '';
    const agentType = agent.type || '';
    
    if (agentId.includes('slack') || agentType.includes('slack')) {
      return <FiSlack className="mr-2" />;
    } else if (agentId.includes('image') || agentType.includes('image')) {
      return <FiImage className="mr-2" />;
    } else if (agentId.includes('copy') || agentType.includes('copy')) {
      return <FiFileText className="mr-2" />;
    } else if (agentId.includes('linkedin') || agentType.includes('linkedin')) {
      return <FiLinkedin className="mr-2" />;
    } else if (agentId.includes('facebook') || agentType.includes('facebook')) {
      return <FiFacebook className="mr-2" />;
    } else if (agentId.includes('instagram') || agentType.includes('instagram')) {
      return <FiInstagram className="mr-2" />;
    } else if (agentId.includes('twitter') || agentType.includes('twitter')) {
      return <FiTwitter className="mr-2" />;
    } else if (agentId.includes('wordpress') || agentType.includes('wordpress')) {
      return <RiWordpressFill className="mr-2" />;
    }
    
    // Default icon
    return <FiBarChart2 className="mr-2" />;
  };
  
  // Generate menu items dynamically
  const menuItems = [
    // Base items that are always present
    {
      path: '/dashboard/activity',
      label: 'All Activities',
      icon: <FiActivity className="mr-2" />
    },
    {
      path: '/dashboard/usage',
      label: 'Token Usage',
      icon: <FaRobot className="mr-2" />,
      isCredit: true
    }
  ];
  
  // Add agents to menu items if they exist
  if (agents && agents.length > 0) {
    agents.forEach((agent) => {
      if (!agent.id) return; // Skip if no ID
      
      menuItems.push({
        path: `/dashboard/activity/${agent.id}`,
        label: agent.display_name || agent.name || agent.id,
        icon: getAgentIcon(agent),
      });
    });
  }

  return (
    <>
      <div className="max-w-[1440px] mx-auto px-8 page-content">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-4">
              <h2 className="text-xl font-bold text-white mb-4 px-2">Activity</h2>
              <nav>
                <ul className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-primary/20 text-primary'
                              : 'text-gray-300 hover:bg-dark-card/70 hover:text-white'
                          }`}
                        >
                          {item.isCredit ? (
                            <FaRobot className={`mr-2 ${isActive ? 'text-primary' : ''}`} />
                          ) : (
                            item.icon
                          )}
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
          
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
      
      {/* Dashboard Footer */}
      <footer className="sticky bottom-0 border-t border-gray-700/40 bg-[#1A1E23] w-full mt-auto">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex flex-wrap items-center justify-between pt-4 pb-3 px-2">
            <div className="flex items-center space-x-2">
              <FaRobot className="text-primary" size={18} />
              <span className="text-white text-sm font-medium">geniusOS</span>
              <span className="text-gray-400 text-xs px-2"> {new Date().getFullYear()}</span>
            </div>
            
            <div className="flex items-center space-x-8 text-sm">
              <Link to="/terms" className="text-gray-300 hover:text-primary transition-colors">Terms</Link>
              <Link to="/privacy" className="text-gray-300 hover:text-primary transition-colors">Privacy</Link>
              <Link to="/security" className="text-gray-300 hover:text-primary transition-colors">Security</Link>
              <Link to="/help" className="text-gray-300 hover:text-primary transition-colors">Help</Link>
              <Link to="/status" className="text-gray-300 hover:text-primary transition-colors">Status</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default ActivityLayout;
