import React, { useState, useEffect } from 'react';
import { FiClock, FiFilter, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';
import { supabase } from '../../config/supabase';
import { agentService } from '../../services/agentService';

function RecentActivity() {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Define a consistent gradient matching the site style
  const mainGradient = 'from-emerald-400 to-blue-500';

  useEffect(() => {
    fetchActivities();
  }, [filter, page]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }
      
      // This would be replaced with an actual API call to get activities
      // For now, we'll simulate with mock data
      const mockActivities = generateMockActivities(filter, page);
      
      if (page === 1) {
        setActivities(mockActivities);
      } else {
        setActivities(prev => [...prev, ...mockActivities]);
      }
      
      // If we have less than 10 results, assume there are no more pages
      setHasMore(mockActivities.length === 10);
      
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockActivities = (filter, page) => {
    const agentTypes = [
      { name: 'IntellAgent Slack App', type: 'slack' },
      { name: 'Image Creator', type: 'image' },
      { name: 'Copy Creator', type: 'copy' },
      { name: 'LinkedIn Marketer', type: 'linkedin' },
      { name: 'WordPress Blogger', type: 'wordpress' },
      { name: 'Facebook Marketer', type: 'facebook' },
      { name: 'X Marketer', type: 'twitter' },
      { name: 'Instagram Marketer', type: 'instagram' }
    ];
    
    const actionTypes = [
      'Generated content',
      'Processed request',
      'Posted content',
      'Scheduled post',
      'Analyzed data',
      'Responded to query',
      'Created image',
      'Optimized content'
    ];
    
    const mockData = [];
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    
    for (let i = startIndex; i < endIndex; i++) {
      const agent = agentTypes[i % agentTypes.length];
      const action = actionTypes[i % actionTypes.length];
      const date = new Date();
      date.setHours(date.getHours() - (i * 2));
      
      const activity = {
        id: `activity-${i}`,
        agentName: agent.name,
        agentType: agent.type,
        action: action,
        timestamp: date.toISOString(),
        tokensUsed: Math.floor(Math.random() * 1000) + 100,
        status: Math.random() > 0.1 ? 'success' : 'error',
        details: `Details for activity ${i}`
      };
      
      // Apply filter if needed
      if (filter === 'all' || filter === agent.type) {
        mockData.push(activity);
      }
    }
    
    return mockData.slice(0, 10); // Ensure we return at most 10 items
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when filter changes
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleRefresh = () => {
    setPage(1);
    fetchActivities();
  };

  const handleExport = () => {
    // In a real app, this would generate and download a CSV/JSON file
    alert('Export functionality would be implemented here');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const getAgentIcon = (agentType) => {
    // This would be replaced with actual agent icons
    return <div className="w-8 h-8 bg-dark-lighter rounded-md flex items-center justify-center text-emerald-400">
      {agentType.charAt(0).toUpperCase()}
    </div>;
  };

  const filteredActivities = activities.filter(activity => 
    activity.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Page title */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          <p className="text-gray-400 text-sm mt-1">Track your AI assistants' usage and performance</p>
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-dark-card/80 border border-emerald-400/20 text-emerald-400 rounded-lg hover:bg-dark-card hover:border-emerald-400/40 transition-all duration-300 text-sm font-medium flex items-center"
        >
          <FiRefreshCw className="mr-2" />
          Refresh
        </button>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30' 
                : 'bg-dark-card text-gray-400 border border-white/5 hover:border-emerald-400/20 hover:text-emerald-400'
            }`}
          >
            All Agents
          </button>
          <button
            onClick={() => handleFilterChange('slack')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === 'slack' 
                ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30' 
                : 'bg-dark-card text-gray-400 border border-white/5 hover:border-emerald-400/20 hover:text-emerald-400'
            }`}
          >
            Slack
          </button>
          <button
            onClick={() => handleFilterChange('image')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === 'image' 
                ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30' 
                : 'bg-dark-card text-gray-400 border border-white/5 hover:border-emerald-400/20 hover:text-emerald-400'
            }`}
          >
            Image
          </button>
          <button
            onClick={() => handleFilterChange('copy')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === 'copy' 
                ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30' 
                : 'bg-dark-card text-gray-400 border border-white/5 hover:border-emerald-400/20 hover:text-emerald-400'
            }`}
          >
            Copy
          </button>
          <button
            onClick={() => handleFilterChange('wordpress')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === 'wordpress' 
                ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30' 
                : 'bg-dark-card text-gray-400 border border-white/5 hover:border-emerald-400/20 hover:text-emerald-400'
            }`}
          >
            WordPress
          </button>
        </div>
        
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-card border border-white/10 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 focus:border-emerald-400/50"
          />
          <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Activity list */}
      <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-md">
        {loading && page === 1 ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading activities...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400">No activities found.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-dark-lighter transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getAgentIcon(activity.agentType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-medium truncate">{activity.agentName}</h3>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          activity.status === 'success' ? 'bg-emerald-400/20 text-emerald-400' : 'bg-red-500/20 text-red-500'
                        }`}>
                          {activity.status === 'success' ? 'Success' : 'Error'}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{activity.action}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <FiClock className="mr-1" />
                        {formatDate(activity.timestamp)}
                      </div>
                      <div className="flex items-center text-xs text-emerald-400">
                        <FaRobot className="mr-1" />
                        {activity.tokensUsed} tokens used
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Load more button */}
        {hasMore && !loading && (
          <div className="p-4 text-center border-t border-white/5">
            <button
              onClick={handleLoadMore}
              className="px-4 py-2 bg-dark-lighter border border-white/10 text-gray-300 rounded-lg hover:bg-dark hover:border-white/20 transition-all duration-300 text-sm font-medium"
            >
              {loading && page > 1 ? (
                <span className="flex items-center">
                  <span className="animate-spin w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full mr-2"></span>
                  Loading...
                </span>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentActivity;
