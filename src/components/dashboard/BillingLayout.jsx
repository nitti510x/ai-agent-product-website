import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCreditCard, FiDollarSign, FiActivity, FiShoppingCart, FiSettings, FiStar } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';
import { useOrganization } from '../../contexts/OrganizationContext';
import OrganizationDropdown from './OrganizationDropdown';
import PageContent from './PageContent';

function BillingLayout({ children }) {
  const location = useLocation();
  const { 
    selectedOrg, 
    getPlanName = () => 'Free Plan', 
    getPlanBadgeStyle = () => 'bg-gray-500/20 border border-gray-500/30',
    getPlanStarColor = () => 'text-gray-400',
    getPlanTextColor = () => 'text-gray-400'
  } = useOrganization();
  
  // Reference for the scrollable container
  const scrollableRef = useRef(null);

  // Check if content is scrollable and add appropriate class
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
  }, []);

  // Define all billing and token-related menu items
  const menuItems = [
    // Billing Section
    {
      section: 'Billing',
      items: [
        {
          path: '/dashboard/billing',
          label: 'Subscription',
          icon: <FiCreditCard className="mr-2" />
        },
        {
          path: '/dashboard/billing/payment',
          label: 'Payment Methods',
          icon: <FiDollarSign className="mr-2" />
        },
        {
          path: '/dashboard/billing/transactions',
          label: 'Billing History',
          icon: <FiActivity className="mr-2" />
        }
      ]
    },
    // Tokens Section
    {
      section: 'Tokens',
      items: [
        {
          path: '/dashboard/tokens',
          label: 'Token Overview',
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
          icon: <FiActivity className="mr-2" />
        },
        {
          path: '/dashboard/tokens/settings',
          label: 'Token Settings',
          icon: <FiSettings className="mr-2" />
        }
      ]
    }
  ];

  // Check if the current path is active
  const isPathActive = (path) => {
    return location.pathname === path;
  };

  console.log("BillingLayout rendering, children:", children);

  return (
    <div className="max-w-[1440px] mx-auto px-8 page-content">
      <div className="flex flex-col md:flex-row gap-4 pt-4">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 md:sticky md:top-4 md:self-start md:max-h-[calc(100vh-2rem)]">
          <div className="bg-[#1A1E23] rounded-2xl shadow-lg border border-gray-700/40 p-4">
            {/* Fixed Header Section */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white mb-4 px-2">Billing & Tokens</h2>
              
              {/* Organization Dropdown */}
              <div className="px-2 py-3 mb-3 border-b border-gray-800/50 bg-transparent">
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
                {menuItems.map((section) => (
                  <div key={section.section} className="mb-4">
                    <h3 className="text-xs uppercase text-gray-500 font-semibold px-3 mb-2">{section.section}</h3>
                    <ul className="space-y-1">
                      {section.items.map((item) => {
                        const isActive = isPathActive(item.path);
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
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <PageContent>
            {children}
          </PageContent>
        </div>
      </div>
    </div>
  );
}

export default BillingLayout;
