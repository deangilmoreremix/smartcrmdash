import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Building, Mail, Phone, Globe, MapPin, User, Calendar, DollarSign, Star } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { getInitials } from '../../utils/avatars';

const CustomerProfile: React.FC = () => {
  const { isDark } = useTheme();
  
  // Sample customer data
  const customer = {
    name: 'Microsoft Corporation',
    logo: 'https://images.pexels.com/photos/4167544/pexels-photo-4167544.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    primaryContact: {
      name: 'Jane Doe',
      position: 'Marketing Director',
      email: 'jane.doe@microsoft.com',
      phone: '+1 (555) 123-4567',
      avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    industry: 'Technology',
    website: 'microsoft.com',
    location: 'Redmond, WA',
    customerSince: new Date('2022-03-15'),
    totalRevenue: 245000,
    nextMeeting: new Date('2024-05-15T14:30:00'),
    accountHealth: 'excellent', // excellent, good, average, poor
    accountOwner: 'John Smith',
    notes: 'Enterprise client with multiple business units. Looking to expand software licensing across subsidiaries.',
    tags: ['Enterprise', 'Strategic', 'High-Value']
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Get account health color
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return isDark ? 'text-green-400 bg-green-500/20' : 'text-green-700 bg-green-100';
      case 'good':
        return isDark ? 'text-blue-400 bg-blue-500/20' : 'text-blue-700 bg-blue-100';
      case 'average':
        return isDark ? 'text-yellow-400 bg-yellow-500/20' : 'text-yellow-700 bg-yellow-100';
      case 'poor':
        return isDark ? 'text-red-400 bg-red-500/20' : 'text-red-700 bg-red-100';
      default:
        return isDark ? 'text-gray-400 bg-gray-500/20' : 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
      {/* Header with Company Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {customer.logo ? (
              <img 
                src={customer.logo} 
                alt={customer.name} 
                className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-white/10"
              />
            ) : (
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <Building className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            )}
            <div className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 text-xs font-bold rounded-md ${getHealthColor(customer.accountHealth)}`}>
              {customer.accountHealth.toUpperCase()}
            </div>
          </div>
          <div>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {customer.name}
            </h2>
            <div className="flex items-center mt-1">
              <Globe className={`w-3.5 h-3.5 mr-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <a 
                href={`https://${customer.website}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                {customer.website}
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
            {customer.industry}
          </div>
          <div className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Customer since {formatDate(customer.customerSince)}
          </div>
        </div>
      </div>
      
      {/* Primary Contact */}
      <div className={`p-4 rounded-lg mb-4 ${isDark ? 'bg-white/10' : 'bg-gray-50'}`}>
        <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          PRIMARY CONTACT
        </h3>
        <div className="flex items-center">
          <Avatar 
            src={customer.primaryContact.avatar}
            alt={customer.primaryContact.name}
            size="md"
            fallback={getInitials(customer.primaryContact.name)}
          />
          <div className="ml-3">
            <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {customer.primaryContact.name}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {customer.primaryContact.position}
            </div>
            <div className="flex items-center mt-1">
              <Mail className={`w-3.5 h-3.5 mr-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <a 
                href={`mailto:${customer.primaryContact.email}`} 
                className={`text-xs ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                {customer.primaryContact.email}
              </a>
            </div>
          </div>
          <div className="ml-auto">
            <button className={`px-3 py-1 text-xs rounded-lg ${isDark ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`}>
              Contact
            </button>
          </div>
        </div>
      </div>
      
      {/* Key Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="flex items-center">
            <DollarSign className={`w-4 h-4 mr-2 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            <div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Total Revenue
              </div>
              <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(customer.totalRevenue)}
              </div>
            </div>
          </div>
        </div>
        
        <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="flex items-center">
            <Calendar className={`w-4 h-4 mr-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Next Meeting
              </div>
              <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {formatDate(customer.nextMeeting)}
              </div>
            </div>
          </div>
        </div>
        
        <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="flex items-center">
            <MapPin className={`w-4 h-4 mr-2 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
            <div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Location
              </div>
              <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {customer.location}
              </div>
            </div>
          </div>
        </div>
        
        <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="flex items-center">
            <User className={`w-4 h-4 mr-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Account Owner
              </div>
              <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {customer.accountOwner}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tags */}
      <div className="mb-4">
        <h3 className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          TAGS
        </h3>
        <div className="flex flex-wrap gap-2">
          {customer.tags.map((tag, index) => (
            <span 
              key={index} 
              className={`px-2 py-1 text-xs rounded-full ${
                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {tag}
            </span>
          ))}
          <button className={`px-2 py-1 text-xs rounded-full ${
            isDark ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-700' : 'bg-gray-100/50 text-gray-500 hover:bg-gray-200'
          }`}>
            + Add
          </button>
        </div>
      </div>
      
      {/* Notes */}
      <div>
        <h3 className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          NOTES
        </h3>
        <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {customer.notes}
          </p>
          <button className={`text-xs mt-2 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
            Edit Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;