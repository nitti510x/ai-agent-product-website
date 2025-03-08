import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiActivity, FiBarChart2, FiSettings, FiSlack, FiImage, FiFileText, FiUsers } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';

function DashboardLayout({ children }) {
  const location = useLocation();
  
  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard Home',
      icon: <FiHome className="mr-2" />
    },
    {
      path: '/dashboard/activity',
      label: 'Recent Agent Activity',
      icon: <FiActivity className="mr-2" />
    },
    {
      path: '/dashboard/usage',
      label: 'Overall Usage',
      icon: <FiBarChart2 className="mr-2" />
    },
    {
      path: '/dashboard/tokens',
      label: 'Credit Management',
      icon: <IoDiamond className="mr-2" />,
      isCredit: true
    },
    {
      path: '/dashboard/users',
      label: 'Users Management',
      icon: <FiUsers className="mr-2" />
    },
    {
      divider: true
    },
    {
      header: 'AI Agents'
    },
    {
      path: '/dashboard/settings/support',
      label: 'Slack App',
      icon: <FiSlack className="mr-2" />
    },
    {
      path: '/dashboard/settings/team',
      label: 'Image Creator',
      icon: <FiImage className="mr-2" />
    },
    {
      path: '/dashboard/settings/analytics',
      label: 'Copy Creator',
      icon: <FiFileText className="mr-2" />
    }
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-8">
      <div className="flex items-center mb-8">
        <div className="bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] h-8 w-1 rounded-full mr-3"></div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-4">
            <h2 className="text-lg font-bold text-white mb-4 px-2">Dashboard Menu</h2>
            <nav>
              <ul className="space-y-1">
                {menuItems.map((item, index) => {
                  if (item.divider) {
                    return <li key={`divider-${index}`} className="border-t border-white/10 my-3"></li>;
                  }
                  
                  if (item.header) {
                    return <li key={`header-${index}`} className="text-gray-400 text-xs uppercase font-bold px-3 py-2">{item.header}</li>;
                  }
                  
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

export default DashboardLayout;
