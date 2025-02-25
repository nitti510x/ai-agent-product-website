import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

function AgentActivity() {
  const { agentId } = useParams();
  const navigate = useNavigate();

  // Get agent name based on ID
  const getAgentName = () => {
    const agents = {
      'support': 'Slack App',
      'team': 'Image Creator',
      'analytics': 'Copy Creator',
      'metrics': 'LinkedIn Poster',
      'wordpress': 'WordPress Blogger'
    };
    return agents[agentId] || 'AI Agent';
  };

  const activities = [
    {
      id: 1,
      timestamp: '2023-08-10T14:30:00Z',
      type: 'response',
      channel: 'support',
      request: {
        prompt: 'How do I reset my password?',
        context: {
          channel: '#support',
          user: 'user123',
          thread: 'thread_abc123'
        }
      },
      response: 'To reset your password, please follow these steps: 1. Go to the login page 2. Click "Forgot Password" 3. Enter your email address 4. Follow the instructions sent to your email',
      processingTime: '1.2s'
    },
    {
      id: 2,
      timestamp: '2023-08-10T14:15:00Z',
      type: 'analysis',
      channel: 'data',
      request: {
        task: 'Generate weekly performance report',
        parameters: {
          timeframe: 'last_week',
          metrics: ['response_time', 'satisfaction_score', 'resolution_rate']
        }
      },
      processingTime: '2.5s'
    },
    {
      id: 3,
      timestamp: '2023-08-10T14:00:00Z',
      type: 'response',
      channel: 'general',
      request: {
        prompt: 'Schedule a team meeting for next week',
        context: {
          channel: '#general',
          user: 'manager456',
          thread: 'thread_def456'
        }
      },
      response: "I've found the following time slots where all team members are available: Monday 2pm, Tuesday 10am, or Wednesday 3pm. Would you like me to schedule the meeting for any of these times?",
      processingTime: '0.8s'
    }
  ];

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-400 hover:text-primary transition-colors mr-4"
          >
            <FiArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Agent Activity</h1>
            <p className="text-gray-400 mt-1">{getAgentName()}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="bg-dark-lighter p-6 rounded-xl border border-dark-card"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <span className="text-sm bg-dark px-3 py-1 rounded-full text-primary">
                  {activity.type}
                </span>
                <span className="text-sm text-gray-400 ml-3">
                  Channel: {activity.channel}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-400">
                  {formatDate(activity.timestamp)}
                </span>
                <div className="text-sm text-primary mt-1">
                  Processing Time: {activity.processingTime}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-dark p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Request</h3>
                {activity.request.prompt ? (
                  <div>
                    <p className="text-gray-100 mb-2">Prompt: {activity.request.prompt}</p>
                    <div className="text-sm text-gray-400">
                      <p>Channel: {activity.request.context.channel}</p>
                      <p>User: {activity.request.context.user}</p>
                      <p>Thread: {activity.request.context.thread}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-100 mb-2">Task: {activity.request.task}</p>
                    <div className="text-sm text-gray-400">
                      <p>Parameters:</p>
                      <ul className="list-disc ml-4">
                        {Object.entries(activity.request.parameters).map(([key, value]) => (
                          <li key={key}>
                            {key}: {Array.isArray(value) ? value.join(', ') : value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {activity.response && (
                <div className="bg-dark p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Response</h3>
                  <p className="text-gray-100">{activity.response}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AgentActivity;
