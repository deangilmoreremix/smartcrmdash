import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Calendar, Mail, Phone, Video, MessageSquare, ChevronRight } from 'lucide-react';
import { getInitials } from '../../utils/avatars';
import Avatar from '../ui/Avatar';

interface Interaction {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'message';
  title: string;
  contact: {
    name: string;
    avatar?: string;
  };
  date: Date;
  status: string;
  content?: string;
}

const InteractionHistory: React.FC = () => {
  const { isDark } = useTheme();
  
  // Sample interaction history data
  const interactions: Interaction[] = [
    {
      id: '1',
      type: 'email',
      title: 'Proposal Follow-up',
      contact: {
        name: 'Jane Doe',
        avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      },
      date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: 'sent',
      content: 'Thanks for considering our proposal. I wanted to follow up on our discussion last week...'
    },
    {
      id: '2',
      type: 'call',
      title: 'Discovery Call',
      contact: {
        name: 'Michael Rodriguez',
        avatar: 'https://images.pexels.com/photos/3778212/pexels-photo-3778212.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      },
      date: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      status: 'completed',
      content: 'Discussed needs assessment and potential solutions. Customer interested in enterprise plan.'
    },
    {
      id: '3',
      type: 'meeting',
      title: 'Product Demo',
      contact: {
        name: 'Sarah Chen',
        avatar: 'https://images.pexels.com/photos/3771790/pexels-photo-3771790.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      },
      date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      status: 'completed',
      content: 'Demonstrated premium features. Client was particularly interested in reporting capabilities.'
    },
    {
      id: '4',
      type: 'message',
      title: 'Quick Question',
      contact: {
        name: 'David Thompson'
      },
      date: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      status: 'received',
      content: 'Can you send over the pricing details for the enterprise plan?'
    }
  ];

  // Function to format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return hours === 0 ? 'Just now' : `${hours}h ago`;
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };

  // Function to get icon based on interaction type
  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'meeting': return <Video className="w-4 h-4" />;
      case 'message': return <MessageSquare className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  // Function to get color based on interaction type
  const getInteractionColor = (type: string) => {
    switch (type) {
      case 'email': 
        return isDark 
          ? { bg: 'bg-blue-500/20', text: 'text-blue-400' } 
          : { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'call': 
        return isDark 
          ? { bg: 'bg-green-500/20', text: 'text-green-400' } 
          : { bg: 'bg-green-100', text: 'text-green-600' };
      case 'meeting': 
        return isDark 
          ? { bg: 'bg-purple-500/20', text: 'text-purple-400' } 
          : { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'message': 
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
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Recent Interactions
        </h2>
        <button className={`text-sm flex items-center ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
          View All <ChevronRight size={16} className="ml-1" />
        </button>
      </div>

      <div className="space-y-4">
        {interactions.map((interaction) => {
          const colorClasses = getInteractionColor(interaction.type);
          
          return (
            <div 
              key={interaction.id}
              className={`p-4 rounded-lg border ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'} transition-colors group`}
            >
              <div className="flex items-start">
                <Avatar
                  src={interaction.contact.avatar}
                  alt={interaction.contact.name}
                  size="md"
                  fallback={getInitials(interaction.contact.name)}
                  className="mr-4 flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <h3 className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {interaction.contact.name}
                      </h3>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${colorClasses.bg} ${colorClasses.text}`}>
                        {interaction.type}
                      </span>
                    </div>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(interaction.date)}
                    </span>
                  </div>
                  
                  <p className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {interaction.title}
                  </p>
                  
                  {interaction.content && (
                    <p className={`text-sm line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {interaction.content}
                    </p>
                  )}
                  
                  <div className="flex items-center mt-3">
                    <span className={`mr-4 flex items-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span className={`p-1 rounded-full mr-1.5 ${colorClasses.bg}`}>
                        {getInteractionIcon(interaction.type)}
                      </span>
                      {interaction.status}
                    </span>
                    
                    <button className={`text-xs ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InteractionHistory;