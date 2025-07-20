import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Brain, 
  Download, 
  Upload, 
  X,
  ArrowUp,
  ArrowDown,
  CheckCheck,
  Mail,
  Phone,
  Building,
  User,
  Calendar,
  MapPin,
  Edit,
  Trash2,
  Tag,
  Eye
} from 'lucide-react';
import { ContactsModal } from '../components/modals/ContactsModal';

// Sample contact interface (this would normally come from types)
interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  status: 'lead' | 'prospect' | 'customer' | 'churned';
  score?: number;
  lastContact?: Date;
  notes?: string;
  industry?: string;
  location?: string;
  avatar?: string;
}

const Contacts: React.FC = () => {
  // Sample contacts data - replace with real data from store
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      company: 'Acme Inc',
      position: 'CTO',
      status: 'customer',
      score: 85,
      lastContact: new Date('2023-06-15'),
      notes: 'Interested in enterprise plan',
      industry: 'Technology',
      location: 'San Francisco, CA'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@globex.com',
      phone: '(555) 987-6543',
      company: 'Globex Corp',
      position: 'Marketing Director',
      status: 'lead',
      score: 65,
      lastContact: new Date('2023-05-28'),
      notes: 'Follow up on marketing proposal',
      industry: 'Manufacturing',
      location: 'Chicago, IL'
    },
    {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert@initech.com',
      phone: '(555) 456-7890',
      company: 'Initech',
      position: 'CEO',
      status: 'prospect',
      score: 75,
      lastContact: new Date('2023-06-02'),
      notes: 'Interested in comprehensive CRM solution. Budget concerns, but decision maker.',
      industry: 'Financial Services',
      location: 'New York, NY'
    },
    {
      id: '4',
      name: 'Sarah Williams',
      email: 'sarah@umbrella.org',
      phone: '(555) 234-5678',
      company: 'Umbrella Corp',
      position: 'Procurement Manager',
      status: 'customer',
      score: 90,
      lastContact: new Date('2023-06-10'),
      notes: 'Renewal coming up in 60 days',
      industry: 'Healthcare',
      location: 'Boston, MA'
    },
    {
      id: '5',
      name: 'Michael Brown',
      email: 'michael@starkindustries.com',
      phone: '(555) 876-5432',
      company: 'Stark Industries',
      position: 'Head of Innovation',
      status: 'lead',
      score: 72,
      lastContact: new Date('2023-06-05'),
      notes: 'Interested in AI features',
      industry: 'Technology',
      location: 'Malibu, CA'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
  const [sortBy, setSortBy] = useState<'name' | 'company' | 'score' | 'lastContact'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // New contact form state
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    status: 'lead'
  });

  const statuses = ['lead', 'prospect', 'customer', 'churned'];
  const industries = ['Technology', 'Healthcare', 'Manufacturing', 'Financial Services', 'Retail', 'Other'];

  const statusColors = {
    lead: 'bg-yellow-100 text-yellow-800',
    prospect: 'bg-purple-100 text-purple-800',
    customer: 'bg-green-100 text-green-800',
    churned: 'bg-red-100 text-red-800'
  };

  // Filter and search contacts
  const filteredContacts = useMemo(() => {
    let filtered = contacts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.position?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let aVal: any = a[sortBy];
      let bVal: any = b[sortBy];

      if (sortBy === 'lastContact') {
        aVal = aVal?.getTime() || 0;
        bVal = bVal?.getTime() || 0;
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal?.toLowerCase() || '';
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [contacts, searchTerm, statusFilter, sortBy, sortOrder]);

  // Handle contact selection
  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const selectAllContacts = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id));
    }
  };

  // Handle AI analysis
  const handleAnalyzeContacts = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedContacts = contacts.map(contact => {
        const randomAdjustment = Math.floor(Math.random() * 10) - 5;
        const newScore = Math.max(0, Math.min(100, (contact.score || 50) + randomAdjustment));
        
        return {
          ...contact,
          score: newScore
        };
      });
      
      setContacts(updatedContacts);
      setSelectedContacts([]);
    } catch (error) {
      console.error('Error analyzing contacts:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle add contact
  const handleAddContact = () => {
    if (!newContact.name || !newContact.email) return;

    const contact: Contact = {
      id: `new-${Date.now()}`,
      name: newContact.name || '',
      email: newContact.email || '',
      phone: newContact.phone,
      company: newContact.company,
      position: newContact.position,
      status: newContact.status as Contact['status'] || 'lead',
      score: 50,
      lastContact: new Date(),
      notes: newContact.notes,
      industry: newContact.industry,
      location: newContact.location
    };

    setContacts([...contacts, contact]);
    setNewContact({ status: 'lead' });
    setShowAddContactModal(false);
  };

  // Handle sort
  const handleSort = (field: 'name' | 'company' | 'score' | 'lastContact') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Contact Card Component
  const ContactCard = ({ contact }: { contact: Contact }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            {getInitials(contact.name)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
            <p className="text-gray-600">{contact.position} at {contact.company}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <input
            type="checkbox"
            checked={selectedContacts.includes(contact.id)}
            onChange={() => toggleContactSelection(contact.id)}
            className="rounded border-gray-300 text-blue-600"
          />
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Mail size={16} className="mr-2" />
          <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
            {contact.email}
          </a>
        </div>
        {contact.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone size={16} className="mr-2" />
            <a href={`tel:${contact.phone}`} className="hover:text-blue-600">
              {contact.phone}
            </a>
          </div>
        )}
        {contact.location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2" />
            {contact.location}
          </div>
        )}
        {contact.lastContact && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2" />
            Last contact: {formatDate(contact.lastContact)}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[contact.status]}`}>
            {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
          </span>
          {contact.industry && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              {contact.industry}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-500">Score:</span>
          <span className="font-semibold text-blue-600">{contact.score || 0}/100</span>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <Link
          to={`/contacts/${contact.id}`}
          className="flex-1 bg-blue-50 text-blue-700 text-center py-2 rounded-md hover:bg-blue-100 transition-colors"
        >
          <Eye size={16} className="inline mr-1" />
          View
        </Link>
        <button className="flex-1 bg-green-50 text-green-700 py-2 rounded-md hover:bg-green-100 transition-colors">
          <Mail size={16} className="inline mr-1" />
          Email
        </button>
        <button className="flex-1 bg-purple-50 text-purple-700 py-2 rounded-md hover:bg-purple-100 transition-colors">
          <Phone size={16} className="inline mr-1" />
          Call
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-600 mt-1">Manage your contacts with AI-powered insights</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
            <button 
              onClick={handleAnalyzeContacts}
              disabled={isAnalyzing}
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors disabled:bg-purple-300"
            >
              <Brain size={18} className="mr-1" />
              {isAnalyzing ? 'Analyzing...' : 'AI Lead Scoring'}
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors">
              <Download size={18} className="mr-1" />
              Export
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors">
              <Upload size={18} className="mr-1" />
              Import
            </button>
            <button 
              onClick={() => setShowAddContactModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              <Plus size={18} className="mr-1" />
              Add Contact
            </button>
            <button 
              onClick={() => setShowContactsModal(true)}
              className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors"
            >
              <User size={18} className="mr-1" />
              Browse Contacts
            </button>
          </div>
        </div>
      </header>

      {/* Bulk Actions */}
      {selectedContacts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-blue-700 font-medium">{selectedContacts.length} contacts selected</span>
            <button 
              onClick={() => setSelectedContacts([])}
              className="ml-4 text-blue-600 hover:text-blue-800"
            >
              Clear selection
            </button>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200">
              Delete
            </button>
            <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200">
              Export Selected
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>

              <div className="flex space-x-2">
                <button 
                  onClick={() => setViewMode('card')}
                  className={`px-3 py-2 rounded-md ${viewMode === 'card' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  Cards
                </button>
                <button 
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 rounded-md ${viewMode === 'table' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contacts Display */}
      {filteredContacts.length > 0 ? (
        viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map(contact => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedContacts.length === filteredContacts.length}
                      onChange={selectAllContacts}
                      className="rounded border-gray-300 text-blue-600"
                    />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {sortBy === 'name' && (
                        sortOrder === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('company')}
                  >
                    <div className="flex items-center">
                      Company
                      {sortBy === 'company' && (
                        sortOrder === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('score')}
                  >
                    <div className="flex items-center">
                      Score
                      {sortBy === 'score' && (
                        sortOrder === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('lastContact')}
                  >
                    <div className="flex items-center">
                      Last Contact
                      {sortBy === 'lastContact' && (
                        sortOrder === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.map(contact => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleContactSelection(contact.id)}
                        className="rounded border-gray-300 text-blue-600"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {getInitials(contact.name)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-500">{contact.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.company || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{contact.position || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[contact.status]}`}>
                        {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${contact.score || 0}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500">{contact.score || 0}/100</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contact.lastContact ? formatDate(contact.lastContact) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-1">
                        <Link
                          to={`/contacts/${contact.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye size={16} />
                        </Link>
                        <button className="text-green-600 hover:text-green-900">
                          <Mail size={16} />
                        </button>
                        <button className="text-purple-600 hover:text-purple-900">
                          <Phone size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <User size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? `No results for "${searchTerm}"` : 'Get started by adding your first contact.'}
          </p>
          <button 
            onClick={() => setShowAddContactModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            <Plus size={18} className="mr-1" />
            Add Contact
          </button>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddContactModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Contact</h3>
                  <button
                    onClick={() => setShowAddContactModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name *</label>
                    <input
                      type="text"
                      value={newContact.name || ''}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      value={newContact.email || ''}
                      onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={newContact.phone || ''}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <input
                      type="text"
                      value={newContact.company || ''}
                      onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <input
                      type="text"
                      value={newContact.position || ''}
                      onChange={(e) => setNewContact({ ...newContact, position: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={newContact.status || 'lead'}
                      onChange={(e) => setNewContact({ ...newContact, status: e.target.value as Contact['status'] })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Industry</label>
                    <select
                      value={newContact.industry || ''}
                      onChange={(e) => setNewContact({ ...newContact, industry: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                      <option value="">Select Industry</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={newContact.location || ''}
                      onChange={(e) => setNewContact({ ...newContact, location: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      rows={3}
                      value={newContact.notes || ''}
                      onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddContactModal(false)}
                    className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddContact}
                    disabled={!newContact.name || !newContact.email}
                    className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
                  >
                    Add Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Contacts Modal */}
      <ContactsModal
        isOpen={showContactsModal}
        onClose={() => setShowContactsModal(false)}
        onSelectContact={(contactId) => {
          console.log('Selected contact:', contactId);
          // You can add navigation or other actions here
        }}
        selectionMode={false}
      />
    </div>
  );
};

export default Contacts;
