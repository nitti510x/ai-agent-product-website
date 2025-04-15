import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiActivity, FiBarChart2, FiSettings, FiFileText,
  FiUsers, FiCreditCard, FiDollarSign, FiClock,
  FiHelpCircle, FiMessageSquare, FiAlertCircle, FiUser,
  FiLock, FiSliders, FiUserPlus, FiList, FiShoppingCart, FiTrendingUp, FiLayout,
  FiBell, FiCheckCircle, FiStar
} from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot, FaBrain, FaWandMagicSparkles } from 'react-icons/fa6';
import { RiSlackFill, RiImageLine, RiFileTextLine, RiLinkedinBoxFill, RiWordpressFill, RiInstagramLine, RiFacebookBoxFill, RiTwitterXFill, RiSearchLine, RiFlowChart, RiPulseLine, RiQuillPenLine } from 'react-icons/ri';
import { useNotifications } from '../../contexts/NotificationContext';
import { debugSupabaseAuth } from '../../utils/debugHelper';
import OrganizationDropdown from './OrganizationDropdown';
import { apiUrl } from '../../config/api';
import { useOrganization } from '../../contexts/OrganizationContext';

function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const { unreadCount } = useNotifications();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getPlanName } = useOrganization();
  
  // Fetch agents from API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(`${apiUrl()}/agents/active`, {
          method: 'GET',
          headers: { 'accept': 'application/json' }
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching agents: ${response.status}`);
        }
        
        const data = await response.json();
        setAgents(data.agents || []);
      } catch (err) {
        console.error('Failed to fetch agents:', err);
        // Fallback to default agents if API fails
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAgents();
  }, []);
  
  // Function to get the appropriate icon based on system_name
  const getAgentIcon = (systemName) => {
    switch (systemName) {
      case 'slack_app_agent':
        return <RiSlackFill className="mr-2" />;
      case 'social_media_manager_agent':
        return <RiPulseLine className="mr-2" />;
      case 'ai_content_manager_agent':
        return <FaBrain className="mr-2" />;
      case 'market_research_agent':
        return <RiSearchLine className="mr-2" />;
      case 'content_writer_agent':
        return <RiQuillPenLine className="mr-2" />;
      case 'image_generator_agent':
        return <RiImageLine className="mr-2" />;
      case 'echo_prompt_agent':
        return <FaWandMagicSparkles className="mr-2" />;
      case 'workflow_helper_agent':
        return <RiFlowChart className="mr-2" />;
      case 'linkedin_influencer_agent':
        return <RiLinkedinBoxFill className="mr-2" />;
      case 'facebook_influencer_agent':
        return <RiFacebookBoxFill className="mr-2" />;
      case 'instagram_influencer_agent':
        return <RiInstagramLine className="mr-2" />;
      case 'twitter_marketer_agent':
        return <RiTwitterXFill className="mr-2" />;
      case 'wordpress_blogger_agent':
        return <RiWordpressFill className="mr-2" />;
      default:
        return <FaRobot className="mr-2" />;
    }
  };
  
  // Function to get the star color based on plan name
  const getPlanStarColor = () => {
    const planName = getPlanName().toLowerCase();
    if (planName.includes('pro')) return 'text-purple-400';
    if (planName.includes('business')) return 'text-blue-400';
    return 'text-[#f6e05e]'; // Default gold for starter/basic plans
  };
  
  // Function to get the background style for the plan badge
  const getPlanBadgeStyle = () => {
    const planName = getPlanName().toLowerCase();
    if (planName.includes('pro')) {
      return 'bg-gradient-to-r from-[#1a1f25] to-[#231a2e] border-b border-purple-400/30';
    } else if (planName.includes('business')) {
      return 'bg-gradient-to-r from-[#1a1f25] to-[#1e2a3a] border-b border-blue-400/30';
    } else {
      return 'bg-gradient-to-r from-[#1a1f25] to-[#25231a] border-b border-[#f6e05e]/30';
    }
  };
  
  // Function to get the text color for the plan name
  const getPlanTextColor = () => {
    const planName = getPlanName().toLowerCase();
    if (planName.includes('pro')) return 'text-purple-400';
    if (planName.includes('business')) return 'text-blue-400';
    return 'text-[#f6e05e]'; // Default gold for starter/basic plans
  };
  
  // Determine active section based on URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard/tokens')) {
      setActiveSection('tokens');
    } else if (path.includes('/dashboard/billing')) {
      setActiveSection('billing');
    } else if (path.includes('/dashboard/help')) {
      setActiveSection('help');
    } else if (path.includes('/dashboard/account')) {
      setActiveSection('account');
    } else if (path.includes('/dashboard/notifications')) {
      setActiveSection('notifications');
    } else {
      setActiveSection('dashboard');
    }
  }, [location.pathname]);
  
  // Dashboard section menu items
  const dashboardMenuItems = [
    {
      path: '/dashboard',
      label: 'Overview',
      icon: <FiHome className="mr-2" />
    },
    {
      path: '/dashboard/activity',
      label: 'Recent Activity',
      icon: <FiActivity className="mr-2" />
    },
    {
      path: '/dashboard/usage',
      label: 'Overall Usage',
      icon: <FiBarChart2 className="mr-2" />
    },
    {
      path: '/dashboard/quicksetup',
      label: 'Quick Setup',
      icon: <FiSettings className="mr-2" />
    }
  ];
  
  // Token management section menu items
  const tokenMenuItems = [
    {
      path: '/dashboard/tokens',
      label: 'Token Balance',
      icon: <FaRobot className="mr-2" />
    },
    {
      path: '/dashboard/tokens/purchase',
      label: 'Purchase Tokens',
      icon: <FiShoppingCart className="mr-2" />
    },
    {
      path: '/dashboard/tokens/history',
      label: 'Usage History',
      icon: <FiClock className="mr-2" />
    },
    {
      path: '/dashboard/tokens/settings',
      label: 'Token Settings',
      icon: <FiSettings className="mr-2" />
    }
  ];
  
  // Billing section menu items
  const billingMenuItems = [
    {
      path: '/dashboard/billing/payment',
      label: 'Payment Methods',
      icon: <FiDollarSign className="mr-2" />
    },
    {
      path: '/dashboard/billing/transactions',
      label: 'Transaction History',
      icon: <FiList className="mr-2" />
    },
    {
      path: '/dashboard/billing/invoices',
      label: 'Invoices',
      icon: <FiFileText className="mr-2" />
    },
    {
      path: '/dashboard/billing',
      label: 'Subscription Plans',
      icon: <FiCreditCard className="mr-2" />
    }
  ];
  
  // Help section menu items
  const helpMenuItems = [
    {
      path: '/dashboard/help',
      label: 'Documentation',
      icon: <FiHelpCircle className="mr-2" />
    },
    {
      path: '/dashboard/help/faqs',
      label: 'FAQs',
      icon: <FiMessageSquare className="mr-2" />
    },
    {
      path: '/dashboard/help/support',
      label: 'Contact Support',
      icon: <FiMessageSquare className="mr-2" />
    },
    {
      path: '/dashboard/help/status',
      label: 'System Status',
      icon: <FiAlertCircle className="mr-2" />
    }
  ];
  
  // Account section menu items
  const accountMenuItems = [
    {
      path: '/dashboard/account',
      label: 'Profile',
      icon: <FiUser className="mr-2" />
    },
    {
      path: '/dashboard/account/organization',
      label: 'Organization',
      icon: <FiLayout className="mr-2" />
    },
    {
      path: '/dashboard/account/security',
      label: 'Security',
      icon: <FiLock className="mr-2" />
    },
    {
      path: '/dashboard/account/team',
      label: 'Team Members',
      icon: <FiUsers className="mr-2" />
    }
  ];
  
  // Notifications section menu items
  const notificationsMenuItems = [
    {
      path: '/dashboard/notifications',
      label: 'All Notifications',
      icon: <FiBell className="mr-2" />
    },
    {
      path: '/dashboard/notifications?filter=unread',
      label: 'Unread',
      icon: <FiAlertCircle className="mr-2" />
    },
    {
      path: '/dashboard/notifications?filter=pending',
      label: 'Pending Approval',
      icon: <FiClock className="mr-2" />
    },
    {
      path: '/dashboard/notifications?filter=completed',
      label: 'Completed',
      icon: <FiCheckCircle className="mr-2" />
    },
    {
      path: '/dashboard/notifications?filter=alerts',
      label: 'Alerts',
      icon: <FiAlertCircle className="mr-2" />
    }
  ];
  
  // Determine which menu items to show based on active section
  const getActiveMenuItems = () => {
    switch (activeSection) {
      case 'tokens':
        return tokenMenuItems;
      case 'billing':
        return billingMenuItems;
      case 'help':
        return helpMenuItems;
      case 'account':
        return accountMenuItems;
      case 'notifications':
        return notificationsMenuItems;
      default:
        return dashboardMenuItems;
    }
  };
  
  // Get the current active tab from URL path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/activity/')) return 'activity';
    if (path.includes('/usage/')) return 'usage';
    if (path.includes('/setup/')) return 'setup';
    return 'settings'; // Default tab
  };
  
  // Get the current active tab to preserve when switching agents
  const activeTab = getActiveTab();

  return (
    <div className="flex flex-col min-h-screen bg-[#111418]">
      <div className="flex-grow flex flex-col">
        <div className="container mx-auto px-8 pb-4 max-w-[1440px] page-content flex-grow">
          <div className="flex flex-col md:flex-row gap-4 pb-0">
            <div className="w-full md:w-64 shrink-0">
              {/* Contextual Section Menu */}
              <div className="bg-[#1F242B] rounded-2xl shadow-2xl border border-white/5 p-4">
                <h2 className="text-xl font-bold text-white mb-4 px-2">
                  {activeSection === 'account' ? 'My Account' : activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                </h2>
                
                {/* Organization Dropdown - Show on dashboard and notifications sections */}
                {(activeSection === 'dashboard' || activeSection === 'notifications') && (
                  <div className="px-2 py-4">
                    <div className="flex justify-center mb-1.5">
                      <OrganizationDropdown />
                    </div>
                    <div className={`w-full px-3 py-1 text-xs font-medium ${getPlanBadgeStyle()} rounded-md`}>
                      <div className="flex items-center justify-center">
                        <FiStar className={`mr-1.5 ${getPlanStarColor()}`} />
                        <span className={`${getPlanTextColor()}`}>{getPlanName()} Plan</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <nav>
                  <ul className="space-y-1">
                    {/* Section-specific menu items */}
                    {getActiveMenuItems().map((item, index) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                              isActive
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'text-gray-300 hover:bg-black/20 hover:text-white'
                            }`}
                          >
                            {item.icon}
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                    
                    {/* Only show AI Agents section at the bottom when in Dashboard section */}
                    {activeSection === 'dashboard' && (
                      <>
                        <li className="border-t border-white/5 my-3"></li>
                        <li className="text-emerald-400 text-xs uppercase font-bold px-3 py-2">AI Agents</li>
                        {loading ? (
                          <li className="text-gray-400 text-xs px-3 py-2">Loading agents...</li>
                        ) : agents.length > 0 ? (
                          agents.map((agent) => {
                            // Check if current path contains this agent's system_name
                            const isActive = location.pathname.includes(`/${agent.system_name}`);
                            
                            // Generate the correct path based on the current active tab
                            let targetPath = `/dashboard/settings/${agent.system_name}`; // Default to settings path
                            if (activeTab === 'activity' && isActive) {
                              targetPath = `/dashboard/activity/${agent.system_name}`;
                            } else if (activeTab === 'usage' && isActive) {
                              targetPath = `/dashboard/usage/${agent.system_name}`;
                            } else if (activeTab === 'setup' && isActive) {
                              targetPath = `/dashboard/setup/${agent.system_name}`;
                            } else if (!isActive && location.pathname.includes('/activity/')) {
                              targetPath = `/dashboard/activity/${agent.system_name}`;
                            } else if (!isActive && location.pathname.includes('/usage/')) {
                              targetPath = `/dashboard/usage/${agent.system_name}`;
                            } else if (!isActive && location.pathname.includes('/setup/')) {
                              targetPath = `/dashboard/setup/${agent.system_name}`;
                            }
                            
                            return (
                              <li key={agent.id}>
                                <Link
                                  to={targetPath}
                                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                                    isActive
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : 'text-gray-300 hover:bg-black/20 hover:text-white'
                                  }`}
                                >
                                  {getAgentIcon(agent.system_name)}
                                  {agent.name}
                                </Link>
                              </li>
                            );
                          })
                        ) : (
                          // Fallback to default agents if API returns empty
                          <>
                            <li>
                              <Link
                                to="/dashboard/settings/slack_app_agent"
                                className="flex items-center px-3 py-2 rounded-lg transition-colors text-gray-300 hover:bg-black/20 hover:text-white"
                              >
                                <RiSlackFill className="mr-2" />
                                Slack App
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/dashboard/settings/image_generator_agent"
                                className="flex items-center px-3 py-2 rounded-lg transition-colors text-gray-300 hover:bg-black/20 hover:text-white"
                              >
                                <RiImageLine className="mr-2" />
                                Image Creator
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/dashboard/settings/content_writer_agent"
                                className="flex items-center px-3 py-2 rounded-lg transition-colors text-gray-300 hover:bg-black/20 hover:text-white"
                              >
                                <RiFileTextLine className="mr-2" />
                                Copy Creator
                              </Link>
                            </li>
                          </>
                        )}
                      </>
                    )}
                  </ul>
                </nav>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="pl-2">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dashboard Footer */}
      <footer className="border-t border-gray-700/40 bg-[#1A1E23] w-full mt-16">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex flex-wrap items-center justify-between pt-4 pb-4 px-2">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-xs">Powered by geniusOS <FaRobot className="inline ml-1" /> 2025</span>
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
    </div>
  );
}

export default DashboardLayout;
