import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Mail, Send, Users, Search, Filter, Plus, MoreVertical, Check, Clock, AlertCircle, Paperclip } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import ModernButton from '@/components/ui/ModernButton';

interface Message {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone?: string;
  type: 'sms' | 'whatsapp' | 'email';
  content: string;
  direction: 'inbound' | 'outbound';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  attachments?: Array<{
    type: 'image' | 'document' | 'video';
    name: string;
    url: string;
    size?: number;
  }>;
}

interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  lastMessage?: Date;
  unreadCount: number;
}

interface Template {
  id: string;
  name: string;
  content: string;
  type: 'sms' | 'whatsapp' | 'email';
  category: string;
}

const CommunicationHub: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeTab, setActiveTab] = useState<'messages' | 'templates' | 'broadcast'>('messages');
  const [messageType, setMessageType] = useState<'sms' | 'whatsapp' | 'email'>('sms');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mock data initialization
  useEffect(() => {
    const mockContacts: Contact[] = [
      {
        id: '1',
        name: 'John Smith',
        phone: '+1-555-0123',
        email: 'john@example.com',
        lastMessage: new Date(Date.now() - 300000), // 5 minutes ago
        unreadCount: 2
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        phone: '+1-555-0456',
        email: 'sarah@example.com',
        lastMessage: new Date(Date.now() - 3600000), // 1 hour ago
        unreadCount: 0
      },
      {
        id: '3',
        name: 'Michael Chen',
        phone: '+1-555-0789',
        email: 'michael@example.com',
        lastMessage: new Date(Date.now() - 86400000), // 1 day ago
        unreadCount: 1
      }
    ];
    
    const mockMessages: Message[] = [
      {
        id: '1',
        contactId: '1',
        contactName: 'John Smith',
        contactPhone: '+1-555-0123',
        type: 'sms',
        content: 'Hi! I\'m interested in learning more about your services.',
        direction: 'inbound',
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        status: 'delivered'
      },
      {
        id: '2',
        contactId: '1',
        contactName: 'John Smith',
        contactPhone: '+1-555-0123',
        type: 'sms',
        content: 'Thanks for reaching out! I\'d be happy to discuss our services with you. When would be a good time for a call?',
        direction: 'outbound',
        timestamp: new Date(Date.now() - 540000), // 9 minutes ago
        status: 'read'
      },
      {
        id: '3',
        contactId: '1',
        contactName: 'John Smith',
        contactPhone: '+1-555-0123',
        type: 'sms',
        content: 'How about tomorrow afternoon around 2 PM?',
        direction: 'inbound',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        status: 'delivered'
      }
    ];
    
    const mockTemplates: Template[] = [
      {
        id: '1',
        name: 'Welcome Message',
        content: 'Hi {name}! Welcome to our service. We\'re excited to work with you.',
        type: 'sms',
        category: 'Onboarding'
      },
      {
        id: '2',
        name: 'Follow-up',
        content: 'Hi {name}, just following up on our conversation. Let me know if you have any questions!',
        type: 'sms',
        category: 'Follow-up'
      },
      {
        id: '3',
        name: 'Appointment Reminder',
        content: 'Hi {name}, this is a reminder about your appointment tomorrow at {time}. Looking forward to speaking with you!',
        type: 'sms',
        category: 'Appointments'
      }
    ];
    
    setContacts(mockContacts);
    setMessages(mockMessages);
    setTemplates(mockTemplates);
    setSelectedContact(mockContacts[0]);
  }, []);
  
  // Filter messages for selected contact
  const contactMessages = messages.filter(msg => 
    selectedContact ? msg.contactId === selectedContact.id : false
  );
  
  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.phone && contact.phone.includes(searchTerm)) ||
    (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;
    
    setIsSending(true);
    try {
      const message: Message = {
        id: Date.now().toString(),
        contactId: selectedContact.id,
        contactName: selectedContact.name,
        contactPhone: selectedContact.phone,
        type: messageType,
        content: newMessage,
        direction: 'outbound',
        timestamp: new Date(),
        status: 'sent'
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Update contact's last message time
      setContacts(contacts.map(contact =>
        contact.id === selectedContact.id
          ? { ...contact, lastMessage: new Date() }
          : contact
      ));
      
      // Simulate message delivery
      setTimeout(() => {
        setMessages(prev => prev.map(msg =>
          msg.id === message.id ? { ...msg, status: 'delivered' } : msg
        ));
      }, 2000);
      
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };
  
  const useTemplate = (template: Template) => {
    let content = template.content;
    if (selectedContact) {
      content = content.replace('{name}', selectedContact.name);
      // Add more placeholder replacements as needed
    }
    setNewMessage(content);
    setMessageType(template.type);
  };
  
  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent': return <Clock size={12} className="text-gray-400" />;
      case 'delivered': return <Check size={12} className="text-gray-400" />;
      case 'read': return <Check size={12} className="text-green-500" />;
      case 'failed': return <AlertCircle size={12} className="text-red-500" />;
      default: return null;
    }
  };
  
  const getTypeIcon = (type: Message['type']) => {
    switch (type) {
      case 'sms': return <MessageSquare size={16} className="text-blue-500" />;
      case 'whatsapp': return <MessageSquare size={16} className="text-green-500" />;
      case 'email': return <Mail size={16} className="text-purple-500" />;
      default: return <MessageSquare size={16} className="text-gray-500" />;
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (messageDate.getTime() === today.getTime() - 86400000) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <GlassCard className="w-80 border-r border-gray-200 flex flex-col rounded-none">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Communication Hub</h1>
          <p className="text-sm text-gray-600">SMS, WhatsApp & Email</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          {[
            { key: 'messages', label: 'Messages', icon: MessageSquare },
            { key: 'templates', label: 'Templates', icon: Mail },
            { key: 'broadcast', label: 'Broadcast', icon: Users }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <ModernButton
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                variant={activeTab === tab.key ? "primary" : "ghost"}
                className={`flex-1 flex items-center justify-center py-3 text-sm font-medium rounded-none ${
                  activeTab === tab.key
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <IconComponent size={16} className="mr-1" />
                {tab.label}
              </ModernButton>
            );
          })}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'messages' && (
            <>
              {/* Search */}
              <div className="p-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              
              {/* Contacts List */}
              <div className="flex-1 overflow-y-auto">
                {filteredContacts.map(contact => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedContact?.id === contact.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900">{contact.name}</h3>
                      {contact.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {contact.phone && <div>{contact.phone}</div>}
                      {contact.lastMessage && (
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(contact.lastMessage)} {formatTime(contact.lastMessage)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {activeTab === 'templates' && (
            <div className="p-4">
              <div className="space-y-2">
                {templates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => useTemplate(template)}
                    className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <span className="text-xs text-gray-500">{template.category}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{template.content}</p>
                    <div className="flex items-center mt-2">
                      {getTypeIcon(template.type)}
                      <span className="text-xs text-gray-500 ml-1 capitalize">{template.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'broadcast' && (
            <div className="p-4 text-center">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Broadcast Messages</h3>
              <p className="text-gray-500 mb-4">Send messages to multiple contacts at once</p>
              <ModernButton variant="primary">
                <Plus size={16} className="mr-1" />
                Create Broadcast
              </ModernButton>
            </div>
          )}
        </div>
      </GlassCard>
      
      {/* Main Chat Area */}
      <GlassCard className="flex-1 flex flex-col rounded-none">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedContact.name}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {selectedContact.phone && (
                      <div className="flex items-center">
                        <Phone size={14} className="mr-1" />
                        {selectedContact.phone}
                      </div>
                    )}
                    {selectedContact.email && (
                      <div className="flex items-center">
                        <Mail size={14} className="mr-1" />
                        {selectedContact.email}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <select
                    value={messageType}
                    onChange={(e) => setMessageType(e.target.value as any)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                  </select>
                  <ModernButton variant="ghost" size="sm">
                    <MoreVertical size={16} />
                  </ModernButton>
                </div>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {contactMessages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                  <p className="text-gray-500">Start a conversation with {selectedContact.name}</p>
                </div>
              ) : (
                contactMessages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.direction === 'outbound'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {getTypeIcon(message.type)}
                        <span className="text-xs ml-1 opacity-75">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      {message.direction === 'outbound' && (
                        <div className="flex items-center justify-end mt-1">
                          {getStatusIcon(message.status)}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={`Type a ${messageType} message...`}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Paperclip size={16} />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSending}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Select a Contact</h3>
              <p className="text-gray-500">Choose a contact from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationHub;