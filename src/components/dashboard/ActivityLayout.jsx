import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiActivity, FiBarChart2, FiSlack, FiImage, FiFileText, FiLinkedin, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import { RiWordpressFill } from 'react-icons/ri';
import { IoDiamond } from 'react-icons/io5';

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
      icon: <IoDiamond className="mr-2" />,
      isCredit: true
    }
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-8">
      <div className="flex items-center mb-8">
        <div className="bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] h-8 w-1 rounded-full mr-3"></div>
        <h1 className="text-3xl font-bold text-white">Agent Activity</h1>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-4">
            <h2 className="text-lg font-bold text-white mb-4 px-2">Activity Filters</h2>
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
                          <IoDiamond className={`mr-2 ${isActive ? 'text-primary' : ''}`} />
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
  );
}

export default ActivityLayout;
