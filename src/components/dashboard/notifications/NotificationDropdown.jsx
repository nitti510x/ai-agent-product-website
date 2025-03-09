import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiClock, FiCheckCircle, FiAlertCircle, FiChevronRight } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa6';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '../../../contexts/NotificationContext';

function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get the most recent 5 notifications
  const recentNotifications = notifications.slice(0, 5);

  // Handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'completed':
        return <FiCheckCircle className="text-emerald-500" />;
      case 'alert':
        return <FiAlertCircle className="text-red-500" />;
      default:
        return <FiBell className="text-gray-400" />;
    }
  };

  const handleNotificationClick = (id) => {
    markAsRead(id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center text-gray-400 hover:text-primary transition-colors relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#1A1E23] shadow-lg rounded-xl border border-gray-700 overflow-hidden z-50">
          <div className="p-3 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-medium text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-emerald-500 text-xs px-2 py-0.5 rounded-full text-black">
                {unreadCount} new
              </span>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {recentNotifications.map((notification) => (
                  <Link
                    key={notification.id}
                    to={notification.action_url}
                    className={`block p-3 hover:bg-gray-800/30 transition-colors ${
                      notification.read ? 'opacity-75' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex">
                      <div className="mr-3 mt-1">
                        {getStatusIcon(notification.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-white text-sm">
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 bg-primary text-xs px-1.5 py-0.5 rounded-full text-black">
                                New
                              </span>
                            )}
                          </h4>
                        </div>
                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(notification.created_at, { addSuffix: true })}
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">
                            <FaRobot className="mr-1 text-xs" />
                            {notification.type.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-2 border-t border-gray-700 bg-gray-800/50">
            <Link
              to="/dashboard/notifications"
              className="block w-full py-2 text-center text-sm text-primary hover:bg-gray-700/30 rounded transition-colors"
              onClick={() => setIsOpen(false)}
            >
              View all notifications
              <FiChevronRight className="inline ml-1" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;
