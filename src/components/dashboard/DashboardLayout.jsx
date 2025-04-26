import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiActivity, FiBarChart2, FiSettings, FiFileText,
  FiUsers, FiCreditCard, FiDollarSign, FiClock,
  FiHelpCircle, FiMessageSquare, FiAlertCircle, FiUser,
  FiLock, FiSliders, FiUserPlus, FiList, FiShoppingCart, FiTrendingUp, FiLayout,
  FiBell, FiCheckCircle, FiStar, FiCalendar, FiEdit
} from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot, FaBrain, FaWandMagicSparkles } from 'react-icons/fa6';
import { RiSlackFill, RiImageLine, RiFileTextLine, RiLinkedinBoxFill, RiWordpressFill, RiInstagramLine, RiFacebookBoxFill, RiTwitterXFill, RiSearchLine, RiFlowChart, RiPulseLine, RiQuillPenLine, RiGalleryLine, RiMegaphoneLine, RiDraftLine, RiCheckboxCircleLine, RiTimeLine } from 'react-icons/ri';
import { useNotifications } from '../../contexts/NotificationContext';
import { debugSupabaseAuth } from '../../utils/debugHelper';
import OrganizationDropdown from './OrganizationDropdown';
import { apiUrl } from '../../config/api';
import { useOrganization } from '../../contexts/OrganizationContext';
import { useAwaitingApproval } from '../../contexts/AwaitingApprovalContext';
import PageContent from './PageContent';

function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const { unreadCount } = useNotifications();
  const { awaitingCount } = useAwaitingApproval();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getPlanName, isAgentInUserPlan } = useOrganization();
  const scrollableRef = useRef(null);

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
        // Filter out background agents
        const filteredAgents = (data.agents || []).filter(agent => !agent.is_background_agent);
        setAgents(filteredAgents);
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
  const getAgentIcon = (systemName, isActive) => {
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
      case 'campaign_manager_agent':
        return <RiMegaphoneLine className="mr-2" />;
      case 'image_generator_agent':
        return <RiImageLine className="mr-2" />;
      case 'echo_prompt_agent':
        return <FaWandMagicSparkles className="mr-2" />;
      case 'prompt_personalizer_agent':
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
      case 'threads_influencer_agent':
        // Official Threads by Meta logo SVG, color based on active state
        return (
          <svg aria-label="Threads" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" className={`${isActive ? 'text-emerald-400' : 'text-gray-300'} mr-2 w-5 h-5 fill-current`}>
            <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"></path>
          </svg>
        );
      case 'tiktok_influencer_agent':
        // TikTok logo SVG, color based on active state
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={`${isActive ? 'text-emerald-400' : 'text-gray-300'} mr-2 w-5 h-5 fill-current`}>
            <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
          </svg>
        );
      case 'x_influencer_agent':
        // X (formerly Twitter) logo SVG, color based on active state
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={`${isActive ? 'text-emerald-400' : 'text-gray-300'} mr-2 w-5 h-5 fill-current`}>
            <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
          </svg>
        );
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
      return 'bg-gradient-to-r from-purple-900/40 to-purple-800/20 border border-purple-700/30';
    }
    if (planName.includes('business')) {
      return 'bg-gradient-to-r from-blue-900/40 to-blue-800/20 border border-blue-700/30';
    }
    // Default for starter/basic plans
    return 'bg-gradient-to-r from-amber-900/40 to-amber-800/20 border border-amber-700/30';
  };
  
  // Function to get the text color for the plan name
  const getPlanTextColor = () => {
    const planName = getPlanName().toLowerCase();
    if (planName.includes('pro')) return 'text-purple-300';
    if (planName.includes('business')) return 'text-blue-300';
    return 'text-amber-300'; // Default for starter/basic plans
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
    } else if (path.includes('/dashboard/marketing')) {
      setActiveSection('marketing');
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
      path: '/dashboard/personalization',
      label: 'Personalization ✨',
      icon: <span className="mr-2">✨</span>
    }
  ];

  // Marketing assets menu items (part of dashboard but with separate header)
  const marketingMenuItems = [
    {
      path: '/dashboard/campaigns',
      label: 'Campaigns',
      icon: <RiMegaphoneLine className="mr-2" />
    },
    {
      path: '/dashboard/published',
      label: 'Published',
      icon: <RiCheckboxCircleLine className="mr-2" />
    },
    {
      path: '/dashboard/awaiting-approval',
      label: 'Awaiting Approval',
      icon: <RiTimeLine className="mr-2" />,
      badge: awaitingCount > 0 ? awaitingCount : null,
      badgeStyle: 'bg-emerald-500 border border-emerald-400/20'
    },
    {
      path: '/dashboard/scheduled',
      label: 'Scheduled',
      icon: <FiCalendar className="mr-2" />
    },
    {
      path: '/dashboard/drafts',
      label: 'Drafts',
      icon: <RiDraftLine className="mr-2" />
    },
    {
      path: '/dashboard/images',
      label: 'Images',
      icon: <RiGalleryLine className="mr-2" />
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
      path: '/dashboard/help/quicksetup',
      label: 'Quick Setup Guide',
      icon: <FiSettings className="mr-2" />
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
  
  // Marketing Assets section menu items
  const marketingAssetsMenuItems = [
    {
      path: '/dashboard/campaigns',
      label: 'Campaigns',
      icon: <RiMegaphoneLine className="mr-2" />
    },
    {
      path: '/dashboard/published',
      label: 'Published',
      icon: <RiCheckboxCircleLine className="mr-2" />
    },
    {
      path: '/dashboard/awaiting-approval',
      label: 'Awaiting Approval',
      icon: <RiTimeLine className="mr-2" />,
      badge: awaitingCount > 0 ? awaitingCount : null,
      badgeStyle: 'bg-emerald-500 border border-emerald-400/20'
    },
    {
      path: '/dashboard/scheduled',
      label: 'Scheduled',
      icon: <FiCalendar className="mr-2" />
    },
    {
      path: '/dashboard/drafts',
      label: 'Drafts',
      icon: <RiDraftLine className="mr-2" />
    },
    {
      path: '/dashboard/images',
      label: 'Images',
      icon: <RiGalleryLine className="mr-2" />
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
      case 'marketing':
        return marketingAssetsMenuItems;
      default:
        return [...dashboardMenuItems, ...marketingMenuItems];
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

  useEffect(() => {
    const checkScrollable = () => {
      if (scrollableRef.current) {
        const isScrollable = scrollableRef.current.scrollHeight > scrollableRef.current.clientHeight;
        if (isScrollable) {
          scrollableRef.current.classList.add('has-overflow');
        } else {
          scrollableRef.current.classList.remove('has-overflow');
        }
      }
    };

    // Check on initial render and window resize
    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScrollable);
  }, [agents, activeSection]);

  // Filter menu agents to only those in the user's plan
  const visibleMenuAgents = agents.filter(agent => isAgentInUserPlan(agent));

  return (
    <div className="flex flex-col min-h-screen bg-[#111418]">
      <div className="flex-grow flex flex-col">
        <div className="container mx-auto px-8 pb-4 max-w-[1440px] page-content flex-grow">
          <div className="flex flex-col md:flex-row gap-6 pb-0 pt-8">
            <div className="w-full md:w-64 shrink-0 md:sticky md:top-8 md:self-start md:max-h-[calc(100vh-2.5rem)] mt-2">
              {/* Contextual Section Menu */}
              <div className="bg-[#1A1E23] rounded-2xl shadow-lg border border-gray-700/40 p-4">
                {/* Fixed Header Section */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white mb-4 px-2">
                    {activeSection === 'account' ? 'My Account' : activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                  </h2>
                  
                  {/* Organization Dropdown - Show on all sections */}
                  <div className="px-2 py-4 border-b border-gray-800/50 mb-4 bg-transparent">
                    {/* Subscription Plan Badge - Moved above dropdown */}
                    <div className={`w-full px-3 py-1.5 mb-3 text-xs font-medium ${getPlanBadgeStyle()} rounded-xl flex items-center justify-center space-x-1.5 shadow-sm`}>
                      <FiStar className={`text-sm ${getPlanStarColor()}`} />
                      <span className={`${getPlanTextColor()}`}>{getPlanName()} Plan</span>
                    </div>
                    
                    {/* Organization Dropdown */}
                    <div className="flex justify-center">
                      <OrganizationDropdown />
                    </div>
                  </div>
                </div>
                
                {/* Scrollable Menu Section */}
                <div ref={scrollableRef} className="md:max-h-[calc(100vh-16rem)] md:overflow-y-auto custom-scrollbar relative">
                  {/* Scroll indicator - only shows when content is scrollable */}
                  <div className="scroll-indicator-container">
                    <div className="scroll-indicator"></div>
                  </div>
                  <nav>
                    <ul className="space-y-1">
                      {/* Dashboard menu items */}
                      {activeSection === 'dashboard' && (
                        <>
                          {/* Regular dashboard items */}
                          {dashboardMenuItems.map((item) => {
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

                          {/* Marketing Assets section */}
                          <li className="border-t border-gray-700/40 my-3"></li>
                          <li className="text-emerald-400 text-xs uppercase font-bold px-3 py-2">MARKETING ASSETS</li>
                          {marketingMenuItems.map((item) => {
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
                                  {item.badge && (
                                    <span className={`ml-auto flex items-center justify-center text-xs font-medium text-white rounded-full w-5 h-5 min-w-[1.25rem] shadow-sm ${item.badgeStyle || 'bg-red-500/80'}`}>
                                      {item.badge}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            );
                          })}

                          {/* AI Agents section */}
                          <li className="border-t border-gray-700/40 my-3"></li>
                          <li className="text-emerald-400 text-xs uppercase font-bold px-3 py-2">AI AGENTS</li>
                          {loading ? (
                            <li className="text-gray-400 text-xs px-3 py-2">Loading agents...</li>
                          ) : visibleMenuAgents.length > 0 ? (
                            visibleMenuAgents.map((agent) => {
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
                                <li key={agent.id || agent.system_name}>
                                  <Link
                                    to={targetPath}
                                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                                      isActive
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'text-gray-300 hover:bg-black/20 hover:text-white'
                                    }`}
                                  >
                                    {getAgentIcon(agent.system_name, isActive)}
                                    {agent.name}
                                  </Link>
                                </li>
                              );
                            })
                          ) : (
                            // Fallback to default agents if API fails
                            <>
                              <li>
                                <Link
                                  to="/dashboard/settings/slack_app_agent"
                                  className="flex items-center px-3 py-2 rounded-lg transition-colors text-gray-300 hover:bg-black/20 hover:text-white"
                                >
                                  <RiSlackFill className="mr-2" />
                                  Messaging Integration
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="/dashboard/settings/image_generator_agent"
                                  className="flex items-center px-3 py-2 rounded-lg transition-colors text-gray-300 hover:bg-black/20 hover:text-white"
                                >
                                  <RiImageLine className="mr-2" />
                                  Image Generator
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="/dashboard/settings/content_writer_agent"
                                  className="flex items-center px-3 py-2 rounded-lg transition-colors text-gray-300 hover:bg-black/20 hover:text-white"
                                >
                                  <RiFileTextLine className="mr-2" />
                                  Content Writer
                                </Link>
                              </li>
                            </>
                          )}
                        </>
                      )}

                      {/* Other section menu items (tokens, billing, help, account, notifications) */}
                      {activeSection !== 'dashboard' && getActiveMenuItems().map((item) => {
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
                              {item.badge && (
                                <span className={`ml-auto flex items-center justify-center text-xs font-medium text-white rounded-full w-5 h-5 min-w-[1.25rem] shadow-sm ${item.badgeStyle || 'bg-red-500/80'}`}>
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <PageContent>
                {children}
              </PageContent>
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
