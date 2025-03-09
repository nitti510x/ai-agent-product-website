import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiBell, FiAlertCircle, FiCheckCircle, FiClock, FiRefreshCw } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa6';
import { supabase } from '../../../config/supabase';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '../../../contexts/NotificationContext';

function Notifications() {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState('all');

  // Parse URL parameters for filtering
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get('filter');
    if (filterParam) {
      setFilter(filterParam);
    } else {
      setFilter('all');
    }
  }, [location.search]);
  
  // Handle filter changes
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    navigate(`/dashboard/notifications${newFilter !== 'all' ? `?filter=${newFilter}` : ''}`);
  };
  
  // Sample notifications are now handled by the NotificationContext

  // Notifications are now fetched in the NotificationContext

  // These functions are now handled by the NotificationContext

  const getFilteredNotifications = () => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.read);
    if (filter === 'pending') return notifications.filter(n => n.status === 'pending');
    if (filter === 'completed') return notifications.filter(n => n.status === 'completed');
    if (filter === 'alerts') return notifications.filter(n => n.status === 'alert');
    return notifications;
  };

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

  const getTypeLabel = (type) => {
    switch (type) {
      case 'social_post':
        return 'Social Media';
      case 'ad_created':
        return 'Advertising';
      case 'task_completed':
        return 'Task';
      case 'token_low':
        return 'System';
      default:
        return 'Notification';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Notifications</h2>
          <p className="text-gray-400 text-sm mt-1">
            Stay updated on agent activities and system alerts
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={markAllAsRead}
            className="px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm transition-colors flex items-center"
          >
            <FiCheckCircle className="mr-1" />
            Mark all as read
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors flex items-center"
          >
            <FiRefreshCw className="mr-1" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-gray-700 mb-4">
        <button 
          onClick={() => handleFilterChange('all')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          All
        </button>
        <button 
          onClick={() => handleFilterChange('unread')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'unread' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Unread
        </button>
        <button 
          onClick={() => handleFilterChange('pending')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'pending' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Pending Approval
        </button>
        <button 
          onClick={() => handleFilterChange('completed')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'completed' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Completed
        </button>
        <button 
          onClick={() => handleFilterChange('alerts')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'alerts' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Alerts
        </button>
      </div>

      {/* Notifications list */}
      <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : getFilteredNotifications().length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <FiBell className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg">No notifications found</p>
            <p className="text-sm mt-1">
              {filter !== 'all' 
                ? `Try changing your filter from "${filter}"`
                : 'You\'re all caught up!'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {getFilteredNotifications().map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-gray-800/30 transition-colors flex items-start ${
                  notification.read ? 'opacity-75' : ''
                }`}
              >
                <div className="mr-3 mt-1">
                  {getStatusIcon(notification.status)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-white">
                      {notification.title}
                      {!notification.read && (
                        <span className="ml-2 bg-primary text-xs px-2 py-0.5 rounded-full text-black">
                          New
                        </span>
                      )}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(notification.created_at, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-300 mt-1">{notification.message}</p>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex space-x-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">
                        <FaRobot className="mr-1" />
                        {getTypeLabel(notification.type)}
                      </span>
                      {notification.status === 'pending' && (
                        <a 
                          href={notification.action_url}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                        >
                          View & Approve
                        </a>
                      )}
                      {notification.status === 'completed' && (
                        <a 
                          href={notification.action_url}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                        >
                          View Details
                        </a>
                      )}
                      {notification.status === 'alert' && (
                        <a 
                          href={notification.action_url}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          Take Action
                        </a>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-primary transition-colors"
                          title="Mark as read"
                        >
                          <FiCheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
