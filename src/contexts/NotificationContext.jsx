import React, { createContext, useState, useContext, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Sample notifications - in a real app, these would come from the database
  const sampleNotifications = [
    {
      id: 1,
      type: 'social_post',
      title: 'Social Media Post Created',
      message: 'Your LinkedIn Agent has created a new post about industry trends that requires your approval.',
      created_at: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      status: 'pending',
      action_url: '/dashboard/agents/linkedin/posts/123',
      read: false
    },
    {
      id: 2,
      type: 'ad_created',
      title: 'LinkedIn Ad Created',
      message: 'Your Marketing Agent has created a new LinkedIn ad campaign that requires your approval.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: 'pending',
      action_url: '/dashboard/agents/marketing/ads/456',
      read: false
    },
    {
      id: 3,
      type: 'task_completed',
      title: 'Weekly Report Generated',
      message: 'Your Analytics Agent has completed generating your weekly performance report.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      status: 'completed',
      action_url: '/dashboard/agents/analytics/reports/789',
      read: true
    },
    {
      id: 4,
      type: 'token_low',
      title: 'Token Balance Low',
      message: 'Your token balance is running low. Consider purchasing more tokens to ensure uninterrupted service.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      status: 'alert',
      action_url: '/dashboard/billing/tokens',
      read: true
    },
    {
      id: 5,
      type: 'subscription_renewing',
      title: 'Subscription Renewing Soon',
      message: 'Your subscription will renew in 3 days. Your card ending in 4242 will be charged $49.99.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      status: 'info',
      action_url: '/dashboard/billing/subscription',
      read: true
    }
  ];

  // Function to check if the current path requires authentication
  const isAuthenticatedRoute = () => {
    if (typeof window === 'undefined') return false;
    
    const path = window.location.pathname;
    return path.startsWith('/dashboard') || 
           path.startsWith('/auth/callback') || 
           path === '/login' ||
           path.startsWith('/checkout');
  };

  // Load notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      
      try {
        // Only fetch real notifications on authenticated routes
        if (isAuthenticatedRoute()) {
          try {
            // Dynamically import supabase only when needed
            const { supabase } = await import('../config/supabase');
            
            // Check if user is authenticated
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData?.session) {
              // Here you would fetch real notifications from your database
              // For now, we'll use the sample notifications
              console.log('Would fetch real notifications for user:', sessionData.session.user.id);
            }
          } catch (error) {
            console.error('Error loading Supabase client:', error);
          }
        }
        
        // Use sample notifications for demo purposes
        setNotifications(sampleNotifications);
        const unread = sampleNotifications.filter(n => !n.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Mark a notification as read
  const markAsRead = async (id) => {
    try {
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      
      // In a real app, you would also update the database
      if (isAuthenticatedRoute()) {
        try {
          // Dynamically import supabase only when needed
          const { supabase } = await import('../config/supabase');
          
          // Check if user is authenticated
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session) {
            console.log('Would update notification read status in database for ID:', id);
          }
        } catch (error) {
          console.error('Error loading Supabase client:', error);
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
      
      // In a real app, you would also update the database
      if (isAuthenticatedRoute()) {
        try {
          // Dynamically import supabase only when needed
          const { supabase } = await import('../config/supabase');
          
          // Check if user is authenticated
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session) {
            console.log('Would mark all notifications as read in database');
          }
        } catch (error) {
          console.error('Error loading Supabase client:', error);
        }
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete a notification
  const deleteNotification = async (id) => {
    try {
      // Update local state
      const notificationToDelete = notifications.find(n => n.id === id);
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== id)
      );
      
      // Update unread count if the deleted notification was unread
      if (notificationToDelete && !notificationToDelete.read) {
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
      
      // In a real app, you would also update the database
      if (isAuthenticatedRoute()) {
        try {
          // Dynamically import supabase only when needed
          const { supabase } = await import('../config/supabase');
          
          // Check if user is authenticated
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session) {
            console.log('Would delete notification from database with ID:', id);
          }
        } catch (error) {
          console.error('Error loading Supabase client:', error);
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      loading,
      markAsRead,
      markAllAsRead,
      deleteNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
