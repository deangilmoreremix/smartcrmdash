import React, { useState, useEffect } from 'react';
import { Phone, PhoneCall, PhoneIncoming, PhoneOutgoing, Clock, User, Search, Plus, Mic, MicOff, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { useContactStore } from '../hooks/useContactStore';

interface Call {
  id: string;
  contactId: string;
  contactName: string;
  company: string;
  phoneNumber: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration: string;
  timestamp: Date;
  status: 'completed' | 'missed' | 'ongoing';
}

interface CallSession {
  contactId: string;
  contactName: string;
  phoneNumber: string;
  startTime: Date;
  isActive: boolean;
  isMuted: boolean;
  isSpeakerOn: boolean;
}

const PhoneSystem: React.FC = () => {
  const { contacts } = useContactStore();
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [callHistory, setCallHistory] = useState<Call[]>([
    {
      id: '1',
      contactId: '1',
      contactName: 'Jane Doe',
      company: 'Microsoft',
      phoneNumber: '+1 (555) 123-4567',
      type: 'outgoing',
      duration: '12:45',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      id: '2', 
      contactId: '2',
      contactName: 'Darlene Robertson',
      company: 'Ford Motor Company',
      phoneNumber: '+1 (555) 234-5678',
      type: 'incoming',
      duration: '8:23',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      id: '3',
      contactId: '3', 
      contactName: 'Wade Warren',
      company: 'Zenith Corp',
      phoneNumber: '+1 (555) 345-6789',
      type: 'missed',
      duration: '0:00',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      status: 'missed'
    }
  ]);

  const [callDuration, setCallDuration] = useState('00:00');

  // Call timer for active calls
  useEffect(() => {
    if (activeCall && activeCall.isActive) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - activeCall.startTime.getTime()) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        setCallDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeCall]);

  const filteredContacts = Object.values(contacts).filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startCall = (contactId: string, contactName: string, phoneNumber: string) => {
    const newCall: CallSession = {
      contactId,
      contactName,
      phoneNumber,
      startTime: new Date(),
      isActive: true,
      isMuted: false,
      isSpeakerOn: false
    };
    setActiveCall(newCall);
  };

  const endCall = () => {
    if (activeCall) {
      // Add to call history
      const callRecord: Call = {
        id: Date.now().toString(),
        contactId: activeCall.contactId,
        contactName: activeCall.contactName,
        company: contacts[activeCall.contactId]?.company || '',
        phoneNumber: activeCall.phoneNumber,
        type: 'outgoing',
        duration: callDuration,
        timestamp: activeCall.startTime,
        status: 'completed'
      };
      setCallHistory(prev => [callRecord, ...prev]);
    }
    setActiveCall(null);
    setCallDuration('00:00');
  };

  const toggleMute = () => {
    if (activeCall) {
      setActiveCall(prev => prev ? { ...prev, isMuted: !prev.isMuted } : null);
    }
  };

  const toggleSpeaker = () => {
    if (activeCall) {
      setActiveCall(prev => prev ? { ...prev, isSpeakerOn: !prev.isSpeakerOn } : null);
    }
  };

  const getCallIcon = (type: string, status: string) => {
    if (status === 'missed') return PhoneIncoming;
    if (type === 'incoming') return PhoneIncoming;
    return PhoneOutgoing;
  };

  const getCallColor = (type: string, status: string) => {
    if (status === 'missed') return 'text-red-500';
    if (type === 'incoming') return 'text-green-500';
    return 'text-blue-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Phone System</h1>
            <p className="text-gray-600 dark:text-gray-400">Make calls and manage your communication</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">Status: </span>
              <span className="text-green-600 font-semibold">Connected</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Call Section */}
          {activeCall && (
            <div className="lg:col-span-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-semibold">{activeCall.contactName}</h3>
                  <p className="text-blue-100 mb-2">{contacts[activeCall.contactId]?.company}</p>
                  <p className="text-blue-200 mb-4">{activeCall.phoneNumber}</p>
                  <p className="text-2xl font-mono mb-6">{callDuration}</p>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={toggleMute}
                      className={`p-3 rounded-full ${activeCall.isMuted ? 'bg-red-500' : 'bg-white/20'} hover:bg-white/30 transition-colors`}
                    >
                      {activeCall.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>
                    <button
                      onClick={toggleSpeaker}
                      className={`p-3 rounded-full ${activeCall.isSpeakerOn ? 'bg-green-500' : 'bg-white/20'} hover:bg-white/30 transition-colors`}
                    >
                      {activeCall.isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                    </button>
                    <button
                      onClick={endCall}
                      className="p-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                    >
                      <Phone className="w-6 h-6 rotate-135" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Search & Call */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contacts</h2>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{contact.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{contact.company}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{contact.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => startCall(contact.id, contact.name, contact.phone || '')}
                      disabled={!!activeCall}
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call History */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Calls</h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {callHistory.map((call) => {
                  const IconComponent = getCallIcon(call.type, call.status);
                  const iconColor = getCallColor(call.type, call.status);
                  
                  return (
                    <div key={call.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <IconComponent className={`w-5 h-5 ${iconColor}`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{call.contactName}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{call.phoneNumber}</p>
                        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                          <span>{call.timestamp.toLocaleDateString()} {call.timestamp.toLocaleTimeString()}</span>
                          <span>{call.duration}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => startCall(call.contactId, call.contactName, call.phoneNumber)}
                        disabled={!!activeCall}
                        className="p-1 text-gray-400 hover:text-green-500 disabled:cursor-not-allowed"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneSystem;