import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Clock, FileText, DollarSign, Check, Phone, Mail, Calendar } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { getInitials } from '../../utils/avatars';

interface Activity {
  id: string;
  type: 'task_completed' | 'document_created' | 'deal_updated' | 'call_scheduled' | 'email_sent' | 'meeting_created';
  title: string;
  description?: string;
  timestamp: Date;
  user: {
    name: string;
    avatar?: string;
  };
}

const RecentActivity: React.FC = () => {
  const { isDark } = useTheme();
  
  // Sample activity data
  const activities: Activity[] = [
    {
      id: '1',
      type: 'task_completed',
      title: 'Task Completed',
      description: 'Follow up with Microsoft about Enterprise Plan',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      user: {
        name: 'John Doe',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      }
    },
    {
      id: '2',
      type: 'document_created',
      title: 'Document Created',
      description: 'Microsoft Enterprise Proposal v2.0',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      user: {
        name: 'Emma Johnson',
        avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      }
    },
    {
      id: '3',
      type: 'deal_updated',
      title: 'Deal Updated',
      description: 'Ford Motor Company deal moved to Proposal stage',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      user: {
        name: 'Michael Smith'
      }
    },
    {
      id: '4',
      type: 'call_scheduled',
      title: 'Call Scheduled',
      description: 'Call with Sarah Chen (TechStartup Inc) on Friday',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      user: {
        name: 'David Thompson',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      }
    },
    {
      id: '5',
      type: 'email_sent',
      title: 'Email Sent',
      description: 'Proposal follow-up sent to jane.doe@microsoft.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      user: {
        name: 'John Doe',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      }
    }
  ];

  // Function to format timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Function to get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completed': return <Check className="w-4 h-4" />;
      case 'document_created': return <FileText className="w-4 h-4" />;
      case 'deal_updated': return <DollarSign className="w-4 h-4" />;
      case 'call_scheduled': return <Phone className="w-4 h-4" />;
      case 'email_sent': return <Mail className="w-4 h-4" />;
      case 'meeting_created': return <Calendar className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Function to get color based on activity type
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'task_completed': 
        return isDark 
          ? { bg: 'bg-green-500/20', text: 'text-green-400' } 
          : { bg: 'bg-green-100', text: 'text-green-600' };
      case 'document_created': 
        return isDark 
          ? { bg: 'bg-blue-500/20', text: 'text-blue-400' } 
          : { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'deal_updated': 
        return isDark 
          ? { bg: 'bg-purple-500/20', text: 'text-purple-400' } 
          : { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'call_scheduled': 
        return isDark 
          ? { bg: 'bg-yellow-500/20', text: 'text-yellow-400' } 
          : { bg: 'bg-yellow-100', text: 'text-yellow-600' };
      case 'email_sent': 
        return isDark 
          ? { bg: 'bg-indigo-500/20', text: 'text-indigo-400' } 
          : { bg: 'bg-indigo-100', text: 'text-indigo-600' };
      case 'meeting_created': 
        return isDark 
          ? { bg: 'bg-orange-500/20', text: 'text-orange-400' } 
          : { bg: 'bg-orange-100', text: 'text-orange-600' };
      default: 
        return isDark 
          ? { bg: 'bg-gray-500/20', text: 'text-gray-400' } 
          : { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  return (
    <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6 mb-6`}>
      <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Recent Activity
      </h2>

      <div className="space-y-6">
        {activities.map((activity) => {
          const colorClasses = getActivityColor(activity.type);
          
          return (
            <div key={activity.id} className="relative pl-8">
              {/* Vertical Timeline Line */}
              {activities.indexOf(activity) !== activities.length - 1 && (
                <div className="absolute top-8 left-[0.9375rem] bottom-0 w-px bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600"></div>
              )}
              
              {/* Activity Icon */}
              <div className={`absolute top-1 left-0 p-1.5 rounded-full ${colorClasses.bg}`}>
                {getActivityIcon(activity.type)}
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {activity.title}
                  </h3>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
                
                {activity.description && (
                  <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {activity.description}
                  </p>
                )}
                
                <div className="flex items-center">
                  <Avatar
                    src={activity.user.avatar}
                    alt={activity.user.name}
                    size="xs"
                    fallback={getInitials(activity.user.name)}
                  />
                  <span className={`ml-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {activity.user.name}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;