import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../config/supabase';

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
      action_url: '/dashboard/tokens/purchase',
      read: true
    }
  ];

  useEffect(() => {
    // In a real app, fetch notifications from the database
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        setTimeout(() => {
          setNotifications(sampleNotifications);
          setUnreadCount(sampleNotifications.filter(n => !n.read).length);
          setLoading(false);
        }, 500);
        
        // In a real app, you would fetch from supabase:
        // const { data: { user } } = await supabase.auth.getUser();
        // const { data, error } = await supabase
        //   .from('notifications')
        //   .select('*')
        //   .eq('user_id', user.id)
        //   .order('created_at', { ascending: false });
        
        // if (error) throw error;
        // setNotifications(data);
        // setUnreadCount(data.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Set up real-time subscription for new notifications
    // In a real app:
    // const subscription = supabase
    //   .channel('public:notifications')
    //   .on('INSERT', payload => {
    //     setNotifications(prev => [payload.new, ...prev]);
    //     if (!payload.new.read) {
    //       setUnreadCount(prev => prev + 1);
    //     }
    //   })
    //   .subscribe();
    
    // return () => {
    //   subscription.unsubscribe();
    // };
  }, []);

  const markAsRead = async (id) => {
    // In a real app, update the database
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // In a real app:
    // await supabase
    //   .from('notifications')
    //   .update({ read: true })
    //   .eq('id', id);
  };

  const markAllAsRead = async () => {
    // In a real app, update all notifications in the database
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    setUnreadCount(0);
    
    // In a real app:
    // const { data: { user } } = await supabase.auth.getUser();
    // await supabase
    //   .from('notifications')
    //   .update({ read: true })
    //   .eq('user_id', user.id)
    //   .eq('read', false);
  };

  // Notification deletion has been removed as per requirements

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(), // Simple ID generation for demo
      created_at: new Date(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // In a real app:
    // await supabase
    //   .from('notifications')
    //   .insert([newNotification]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
