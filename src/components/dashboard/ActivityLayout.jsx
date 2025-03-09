import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiActivity, FiBarChart2, FiSlack, FiImage, FiFileText, FiLinkedin, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import { RiWordpressFill } from 'react-icons/ri';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';

function ActivityLayout({ children }) {
  const location = useLocation();
  
  const menuItems = [
    {
      path: '/dashboard/activity',
      label: 'All Activities',
      icon: <FiActivity className="mr-2" />
    },
    {
      path: '/dashboard/activity/slack',
      label: 'Slack App',
      icon: <FiSlack className="mr-2" />
    },
    {
      path: '/dashboard/activity/image',
      label: 'Image Creator',
      icon: <FiImage className="mr-2" />
    },
    {
      path: '/dashboard/activity/copy',
      label: 'Copy Creator',
      icon: <FiFileText className="mr-2" />
    },
    {
      path: '/dashboard/activity/linkedin',
      label: 'LinkedIn',
      icon: <FiLinkedin className="mr-2" />
    },
    {
      path: '/dashboard/activity/wordpress',
      label: 'WordPress',
      icon: <RiWordpressFill className="mr-2" />
    },
    {
      path: '/dashboard/activity/facebook',
      label: 'Facebook',
      icon: <FiFacebook className="mr-2" />
    },
    {
      path: '/dashboard/activity/instagram',
      label: 'Instagram',
      icon: <FiInstagram className="mr-2" />
    },
    {
      path: '/dashboard/activity/twitter',
      label: 'X (Twitter)',
      icon: <FiTwitter className="mr-2" />
    },
    {
      path: '/dashboard/usage',
      label: 'Token Usage',
      icon: <FaRobot className="mr-2" />,
      isCredit: true
    }
  ];

  return (
    <>
      <div className="max-w-[1440px] mx-auto px-8 page-content">
        {/* Title header removed */}
        
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
    <footer className="sticky-footer mt-16 pt-6 pb-0 border-t border-gray-700/40 bg-[#1A1E23] w-full" style={{ marginBottom: '-1px' }}>
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex flex-wrap items-center justify-between pt-5 pb-3 px-2">
          <div className="flex items-center space-x-2">
            <FaRobot className="text-primary" size={18} />
            <span className="text-white text-sm font-medium">geniusOS</span>
            <span className="text-gray-400 text-xs px-2">© {new Date().getFullYear()}</span>
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
