import React, { useState, useEffect, useRef } from 'react';
import openAIService from '../services/openAIService';
import messagingService from '../services/messagingService';
import SMSSettings from '../components/SMSSettings';
import {
  MessageSquare,
  Send,
  Clock,
  Check,
  AlertCircle,
  RefreshCw,
  Trash2,
  Brain,
  Settings,
  Calendar,
  Plus,
  User,
  X,
  Copy,
  Search,
  Filter,
  SlidersHorizontal,
  Upload,
  ExternalLink,
  Image,
  Phone
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'contact';
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  attachments?: MessageAttachment[];
  emojis?: string[];
}

interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'video' | 'audio';
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  unread: number;
  lastMessage?: string;
  lastActivity?: Date;
  messages: Message[];
}

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  variables: string[];
}

const TextMessages: React.FC = () => {
  // OpenAI service for generating content
  const openai = openAIService;
  
  // Mock contacts with message history
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Doe',
      phone: '(555) 123-4567',
      unread: 2,
      lastMessage: 'That sounds great! I\'ll check my calendar.',
      lastActivity: new Date('2025-06-15T14:32:00'),
      messages: [
        {
          id: 'm1',
          sender: 'user',
          content: 'Hi John, are you available for a quick call this week to discuss your needs?',
          timestamp: new Date('2025-06-15T14:30:00'),
          status: 'read'
        },
        {
          id: 'm2',
          sender: 'contact',
          content: 'That sounds great! I\'ll check my calendar.',
          timestamp: new Date('2025-06-15T14:32:00'),
          status: 'read'
        }
      ]
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone: '(555) 987-6543',
      unread: 0,
      lastMessage: 'Thanks for sending the proposal. I\'ll review it today.',
      lastActivity: new Date('2025-06-14T11:15:00'),
      messages: [
        {
          id: 'm1',
          sender: 'user',
          content: 'Hello Jane, I just sent over the proposal we discussed. Let me know if you have any questions!',
          timestamp: new Date('2025-06-14T11:10:00'),
          status: 'read'
        },
        {
          id: 'm2',
          sender: 'contact',
          content: 'Thanks for sending the proposal. I\'ll review it today.',
          timestamp: new Date('2025-06-14T11:15:00'),
          status: 'read'
        }
      ]
    },
    {
      id: '3',
      name: 'Robert Johnson',
      phone: '(555) 456-7890',
      unread: 0,
      lastMessage: 'Yes, that works for me. See you then!',
      lastActivity: new Date('2025-06-13T16:45:00'),
      messages: [
        {
          id: 'm1',
          sender: 'user',
          content: 'Hi Robert, are you available for a demo next Tuesday at 2pm?',
          timestamp: new Date('2025-06-13T16:40:00'),
          status: 'read'
        },
        {
          id: 'm2',
          sender: 'contact',
          content: 'Yes, that works for me. See you then!',
          timestamp: new Date('2025-06-13T16:45:00'),
          status: 'read'
        }
      ]
    }
  ]);
  
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [isScheduled, setIsScheduled] = useState(false);

  // Template management
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>([
    {
      id: 'template-1',
      name: 'Follow-up',
      content: 'Hi {name}, I wanted to follow up on our recent conversation. Do you have any questions I can answer for you?',
      category: 'follow-up',
      variables: ['name']
    },
    {
      id: 'template-2',
      name: 'Appointment Confirmation',
      content: 'Hi {name}, this is just a quick confirmation of our appointment on {date} at {time}. Looking forward to meeting with you!',
      category: 'appointment',
      variables: ['name', 'date', 'time']
    },
    {
      id: 'template-3',
      name: 'New Resource',
      content: 'Hi {name}, I thought you might find this resource helpful based on our conversation: {link}. Let me know what you think!',
      category: 'resource',
      variables: ['name', 'link']
    }
  ]);
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const selectedContact = contacts.find(contact => contact.id === selectedContactId);
  
  // Auto-scroll to latest message
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedContact?.messages]);

  // Load contacts from local storage on mount
  useEffect(() => {
    const savedContacts = localStorage.getItem('textMessagesContacts');
    if (savedContacts) {
      try {
        const parsedContacts = JSON.parse(savedContacts);
        // Convert date strings back to Date objects
        const contactsWithDates = parsedContacts.map((contact: any) => ({
          ...contact,
          lastActivity: contact.lastActivity ? new Date(contact.lastActivity) : undefined,
          messages: contact.messages.map((message: any) => ({
            ...message,
            timestamp: new Date(message.timestamp)
          }))
        }));
        setContacts(contactsWithDates);
      } catch (error) {
        console.error('Failed to load contacts from local storage:', error);
      }
    }
  }, []);

  // Save contacts to local storage whenever contacts change
  useEffect(() => {
    localStorage.setItem('textMessagesContacts', JSON.stringify(contacts));
  }, [contacts]);

  // Load templates from local storage on mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem('textMessagesTemplates');
    if (savedTemplates) {
      try {
        const parsedTemplates = JSON.parse(savedTemplates);
        setMessageTemplates(parsedTemplates);
      } catch (error) {
        console.error('Failed to load templates from local storage:', error);
      }
    }
  }, []);

  // Save templates to local storage whenever templates change
  useEffect(() => {
    localStorage.setItem('textMessagesTemplates', JSON.stringify(messageTemplates));
  }, [messageTemplates]);

  // Polling for new messages
  useEffect(() => {
    if (!selectedContactId) return;

    const pollInterval = setInterval(async () => {
      try {
        const selectedContact = contacts.find(c => c.id === selectedContactId);
        if (!selectedContact) return;

        // Fetch latest messages from API
        const latestMessages = await messagingService.getMessageHistory(10, 0, {
          status: 'delivered'
        });

        // Update local state if new messages are found
        // This is a simplified implementation; in a real app, you'd need to match messages to contacts
        // For now, we'll just log new messages
        if (latestMessages.length > 0) {
          console.log('New messages received:', latestMessages);
          // TODO: Update contacts state with new messages
        }
      } catch (error) {
        console.error('Failed to poll for new messages:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [selectedContactId, contacts]);
  
  const selectContact = (contactId: string) => {
    setSelectedContactId(contactId);
    
    // Mark unread messages as read
    setContacts(contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, unread: 0 } 
        : contact
    ));
    
    setShowTemplates(false);
    setGeneratedText(null);
  };
  
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
    contact.phone.includes(searchText)
  );
  
  const sendMessage = async () => {
    if (!selectedContactId || !newMessage.trim()) return;

    // Basic input validation
    if (newMessage.length > 1000) {
      alert('Message is too long. Please keep it under 1000 characters.');
      return;
    }

    // Check for potentially harmful content (basic check)
    const suspiciousPatterns = [/javascript:/i, /<script/i, /on\w+=/i];
    if (suspiciousPatterns.some(pattern => pattern.test(newMessage))) {
      alert('Message contains potentially unsafe content.');
      return;
    }

    setIsSending(true);

    try {
      const selectedContact = contacts.find(c => c.id === selectedContactId);
      if (!selectedContact) return;

      // Check if scheduling is enabled
      if (isScheduled && scheduledTime) {
        const scheduledDate = new Date(scheduledTime);
        if (scheduledDate <= new Date()) {
          alert('Scheduled time must be in the future.');
          return;
        }

        // For now, just show a confirmation. In a real app, this would be handled by the backend
        alert(`Message scheduled for ${scheduledDate.toLocaleString()}`);
        setIsScheduled(false);
        setScheduledTime('');
      } else {
        // Send message immediately via API
        const response = await messagingService.sendMessage({
          content: newMessage,
          recipient: selectedContact.phone,
          priority: 'medium'
        });

        // Create new message object
        const newMessageObj: Message = {
          id: response.message.id,
          sender: 'user',
          content: newMessage,
          timestamp: new Date(),
          status: response.message.status as Message['status']
        };

        // Update contacts state with the new message
        setContacts(contacts.map(contact =>
          contact.id === selectedContactId
            ? {
                ...contact,
                messages: [...contact.messages, newMessageObj],
                lastMessage: newMessage,
                lastActivity: new Date()
              }
            : contact
        ));
      }

      // Clear input
      setNewMessage('');

    } catch (error) {
      console.error('Failed to send message:', error);
      // Show error to user (could add a toast or alert)
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };
  
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const useTemplate = (templateContent: string) => {
    if (selectedContact) {
      const personalizedContent = templateContent.replace('{name}', selectedContact.name);
      setNewMessage(personalizedContent);
      setShowTemplates(false);
    }
  };
  
  const generateTextSuggestion = async () => {
    if (!selectedContact) return;

    setIsGenerating(true);
    setGeneratedText(null);

    try {
      // Enhanced prompt for better AI suggestions
      const prompt = `Generate a short, professional text message (under 160 characters) for a follow-up conversation with ${selectedContact.name}.

Context: This is a business communication in a CRM system. The message should be:
- Professional but friendly
- Personalized using the contact's name
- Focused on building relationship or following up on previous discussion
- Action-oriented (encourage response)

Examples of good messages:
- "Hi ${selectedContact.name}, following up on our recent discussion. How did the proposal look to you?"
- "Hello ${selectedContact.name}, just checking in to see if you had any questions about the demo we discussed."

Generate one concise message:`;

      const result = await openai.generateEmail({
        recipient: selectedContact.name,
        purpose: "Generate a short, professional text message (under 160 characters) for a follow-up conversation. Context: Business communication in CRM system. Professional but friendly, personalized, focused on building relationship.",
        tone: 'casual'
      });

      let message = result.body.trim();

      // Clean up the response
      if (message.includes('\n\n')) {
        message = message.split('\n\n')[0];
      }

      // Remove any quotes or formatting
      message = message.replace(/^["']|["']$/g, '');

      // Ensure it's under 160 characters
      if (message.length > 160) {
        message = message.substring(0, 157) + '...';
      }

      setGeneratedText(message);
    } catch (error) {
      console.error("Failed to generate text suggestion:", error);
      // Fallback suggestion
      setGeneratedText(`Hi ${selectedContact.name}, just following up on our recent conversation. Do you have any questions?`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const MessageStatus = ({ status }: { status: Message['status'] }) => {
    switch (status) {
      case 'sending':
        return <Clock size={12} className="text-gray-400" />;
      case 'sent':
        return <Check size={12} className="text-gray-400" />;
      case 'delivered':
        return <div className="flex"><Check size={12} className="text-gray-400" /><Check size={12} className="text-gray-400 -ml-1" /></div>;
      case 'read':
        return <div className="flex"><Check size={12} className="text-blue-500" /><Check size={12} className="text-blue-500 -ml-1" /></div>;
      case 'failed':
        return <AlertCircle size={12} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Contacts Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Text Messages</h1>
            <button className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
              <Plus size={16} />
            </button>
          </div>
          
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => selectContact(contact.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedContactId === contact.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User size={20} className="text-gray-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                      {contact.unread > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 ml-2">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{contact.phone}</p>
                    <p className="text-sm text-gray-600 truncate mt-1">{contact.lastMessage}</p>
                  </div>
                </div>
              </div>
              {contact.lastActivity && (
                <p className="text-xs text-gray-400 mt-1">{formatDate(contact.lastActivity)}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User size={16} className="text-gray-600" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{selectedContact.name}</h2>
                  <p className="text-sm text-gray-500">{selectedContact.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  <MessageSquare size={16} />
                </button>
                <button className="p-2 rounded-md bg-gray-100 hover:bg-gray-200">
                  <Phone size={16} />
                </button>
                <button className="p-2 rounded-md bg-gray-100 hover:bg-gray-200">
                  <Settings size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedContact.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {/* Display emojis if present */}
                    {message.emojis && message.emojis.length > 0 && (
                      <div className="flex space-x-1 mt-1">
                        {message.emojis.map((emoji, index) => (
                          <span key={index} className="text-lg">{emoji}</span>
                        ))}
                      </div>
                    )}
                    {/* Display attachments if present */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-black bg-opacity-10 rounded">
                            {attachment.type === 'image' ? (
                              <Image size={16} className="text-gray-500" />
                            ) : (
                              <Upload size={16} className="text-gray-500" />
                            )}
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs underline"
                            >
                              {attachment.fileName}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs opacity-70">{formatDate(message.timestamp)}</p>
                      {message.sender === 'user' && (
                        <MessageStatus status={message.status} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>

            {/* AI Suggestion */}
            {generatedText && (
              <div className="p-4 bg-blue-50 border-t border-blue-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Brain size={16} className="text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-900">AI Suggestion</span>
                    </div>
                    <p className="text-sm text-gray-700">{generatedText}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setNewMessage(generatedText)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      Use
                    </button>
                    <button
                      onClick={() => setGeneratedText(null)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Templates Panel */}
            {showTemplates && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">Message Templates</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        // Add new template
                        const newTemplate: MessageTemplate = {
                          id: `template-${Date.now()}`,
                          name: 'New Template',
                          content: 'Hi {name}, [your message here]',
                          category: 'other',
                          variables: ['name']
                        };
                        setMessageTemplates([...messageTemplates, newTemplate]);
                      }}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Add new template"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => setShowTemplates(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {messageTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="p-2 bg-white rounded border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-gray-900">{template.name}</div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => {
                              // Edit template
                              const newName = prompt('Edit template name:', template.name);
                              const newContent = prompt('Edit template content:', template.content);
                              if (newName && newContent) {
                                setMessageTemplates(messageTemplates.map(t =>
                                  t.id === template.id
                                    ? { ...t, name: newName, content: newContent }
                                    : t
                                ));
                              }
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Edit template"
                          >
                            <Settings size={12} />
                          </button>
                          <button
                            onClick={() => {
                              // Delete template
                              if (confirm('Delete this template?')) {
                                setMessageTemplates(messageTemplates.filter(t => t.id !== template.id));
                              }
                            }}
                            className="p-1 text-red-400 hover:text-red-600"
                            title="Delete template"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{template.content}</div>
                      <button
                        onClick={() => useTemplate(template.content)}
                        className="mt-1 text-xs text-blue-600 hover:text-blue-800"
                      >
                        Use Template
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              {/* Schedule Input */}
              {isScheduled && (
                <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">Schedule Message</span>
                    <button
                      onClick={() => {
                        setIsScheduled(false);
                        setScheduledTime('');
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full p-2 border border-blue-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              )}

              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={3}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={generateTextSuggestion}
                    disabled={isGenerating}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    {isGenerating ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Brain size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => setIsScheduled(!isScheduled)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
                    title="Schedule message"
                  >
                    <Calendar size={16} />
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={isSending || !newMessage.trim()}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
                  >
                    {isSending ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a contact from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextMessages;