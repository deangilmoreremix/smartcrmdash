import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Mail, Phone, MapPin, Calendar, Tag, MoreVertical, Edit, Trash2, Star, User, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import AdvancedTooltip from './ui/AdvancedTooltip';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  tags?: string[];
  status: 'active' | 'inactive' | 'lead' | 'customer';
  lastContact?: string;
  notes?: string;
  avatar?: string;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

const DetailedContactsModule: React.FC = () => {
  const { isDark } = useTheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockContacts: Contact[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@techcorp.com',
        phone: '+1 (555) 123-4567',
        company: 'TechCorp',
        position: 'VP of Sales',
        location: { city: 'San Francisco', state: 'CA', country: 'USA' },
        tags: ['VIP', 'Enterprise'],
        status: 'customer',
        lastContact: '2024-01-15',
        notes: 'Key decision maker for enterprise deals',
        socialProfiles: {
          linkedin: 'https://linkedin.com/in/sarahjohnson',
          website: 'https://techcorp.com'
        }
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'm.chen@startup.io',
        phone: '+1 (555) 987-6543',
        company: 'Startup.io',
        position: 'Founder',
        location: { city: 'Austin', state: 'TX', country: 'USA' },
        tags: ['Startup', 'High-Potential'],
        status: 'lead',
        lastContact: '2024-01-10',
        notes: 'Interested in AI automation solutions'
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily@innovate.com',
        phone: '+1 (555) 456-7890',
        company: 'Innovate Solutions',
        position: 'Marketing Director',
        location: { city: 'New York', state: 'NY', country: 'USA' },
        tags: ['Marketing', 'Mid-Market'],
        status: 'active',
        lastContact: '2024-01-12',
        notes: 'Needs comprehensive CRM solution'
      }
    ];

    setTimeout(() => {
      setContacts(mockContacts);
      setFilteredContacts(mockContacts);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter contacts based on search and filters
  useEffect(() => {
    let filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }

    if (tagFilter !== 'all') {
      filtered = filtered.filter(contact =>
        contact.tags?.includes(tagFilter)
      );
    }

    setFilteredContacts(filtered);
  }, [contacts, searchTerm, statusFilter, tagFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'customer': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'lead': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'active': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getAllTags = () => {
    const tags = new Set<string>();
    contacts.forEach(contact => {
      contact.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner message="Loading contacts..." size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 contacts-module">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contacts & Leads</h3>
          <AdvancedTooltip
            id="contacts-module-tooltip"
            target="ⓘ"
            context="leads"
            data={{
              totalContacts: contacts.length,
              activeLeads: contacts.filter(c => c.status === 'lead').length,
              conversionRate: '32%'
            }}
            federated={true}
          />
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 contact-filters">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="lead">Leads</option>
            <option value="active">Active</option>
            <option value="customer">Customers</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Tags</option>
            {getAllTags().map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer contact-card"
            onClick={() => setSelectedContact(contact)}
          >
            {/* Contact Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{contact.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{contact.position}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                  {contact.status}
                </span>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">{contact.email}</span>
              </div>
              {contact.phone && (
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{contact.phone}</span>
                </div>
              )}
              {contact.location && (
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {contact.location.city}, {contact.location.state}
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            {contact.tags && contact.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {contact.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Last Contact */}
            {contact.lastContact && (
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="h-3 w-3" />
                <span>Last contact: {new Date(contact.lastContact).toLocaleDateString()}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2 mt-4">
              <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No contacts found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedContact(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedContact.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{selectedContact.position} at {selectedContact.company}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <p className="text-gray-900 dark:text-white">{selectedContact.email}</p>
                  </div>
                  {selectedContact.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                      <p className="text-gray-900 dark:text-white">{selectedContact.phone}</p>
                    </div>
                  )}
                  {selectedContact.location && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedContact.location.city}, {selectedContact.location.state}, {selectedContact.location.country}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {selectedContact.tags && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedContact.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 text-sm rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedContact.lastContact && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Contact</label>
                      <p className="text-gray-900 dark:text-white">{new Date(selectedContact.lastContact).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedContact.notes && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
                  <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">{selectedContact.notes}</p>
                </div>
              )}

              <div className="flex space-x-3 mt-6">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Send Email
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Edit Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedContactsModule;