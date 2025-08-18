import React, { useState } from 'react';
import { Phone, User, Clock, BarChart2, RefreshCw, Send, MessageSquare, Mic, MicOff, Volume2, VolumeX, PhoneOff, Play, Pause, MousePointer } from 'lucide-react';

interface CallLog {
  id: string;
  contactName: string;
  phoneNumber: string;
  direction: 'inbound' | 'outbound';
  startTime: Date;
  duration: number; // in seconds
  status: 'completed' | 'missed' | 'voicemail';
  notes?: string;
  recordingUrl?: string;
}

const PhoneSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dialer' | 'logs' | 'voicemail' | 'settings'>('dialer');
  const [dialerNumber, setDialerNumber] = useState('');
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [callStatus, setCallStatus] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null);
  const [recordingPlayback, setRecordingPlayback] = useState<string | null>(null);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  
  // Call logs data
  const [callLogs] = useState<CallLog[]>([
    {
      id: '1',
      contactName: 'John Doe',
      phoneNumber: '(555) 123-4567',
      direction: 'outbound',
      startTime: new Date(Date.now() - 86400000), // yesterday
      duration: 325, // 5:25
      status: 'completed',
      notes: 'Discussed proposal details. Follow up next week.',
      recordingUrl: 'https://example.com/recording1.mp3'
    },
    {
      id: '2',
      contactName: 'Sarah Williams',
      phoneNumber: '(555) 987-6543',
      direction: 'inbound',
      startTime: new Date(Date.now() - 172800000), // 2 days ago
      duration: 0,
      status: 'missed',
      notes: 'Left a voicemail about scheduling a demo'
    },
    {
      id: '3',
      contactName: 'Robert Johnson',
      phoneNumber: '(555) 456-7890',
      direction: 'outbound',
      startTime: new Date(Date.now() - 259200000), // 3 days ago
      duration: 183, // 3:03
      status: 'completed',
      recordingUrl: 'https://example.com/recording2.mp3'
    },
    {
      id: '4',
      contactName: 'Jane Smith',
      phoneNumber: '(555) 321-7654',
      direction: 'inbound',
      startTime: new Date(Date.now() - 345600000), // 4 days ago
      duration: 0,
      status: 'voicemail',
      notes: 'Asked about pricing options',
      recordingUrl: 'https://example.com/voicemail1.mp3'
    }
  ]);
  
  // Voicemail data
  const [voicemails] = useState([
    {
      id: '1',
      callerName: 'Jane Smith',
      phoneNumber: '(555) 321-7654',
      timestamp: new Date(Date.now() - 345600000),
      duration: 45,
      isNew: true,
      recordingUrl: 'https://example.com/voicemail1.mp3'
    },
    {
      id: '2',
      callerName: 'Mike Davis',
      phoneNumber: '(555) 555-5555',
      timestamp: new Date(Date.now() - 432000000),
      duration: 32,
      isNew: false,
      recordingUrl: 'https://example.com/voicemail2.mp3'
    }
  ]);

  const handleDialerInput = (digit: string) => {
    if (dialerNumber.length < 15) {
      setDialerNumber(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    setDialerNumber(prev => prev.slice(0, -1));
  };

  const formatPhoneNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const startCall = () => {
    setIsCallInProgress(true);
    setCallStatus('Calling...');
    
    // Simulate call connecting
    setTimeout(() => {
      setCallStatus('Connected');
      setCallDuration(0);
      
      // Start timer
      const timerId = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      setCallTimer(timerId);
    }, 2000);
  };
  
  const endCall = () => {
    setIsCallInProgress(false);
    setCallStatus(null);
    
    // Clear timer
    if (callTimer) {
      clearInterval(callTimer);
      setCallTimer(null);
    }
    
    // Reset call states
    setCallDuration(0);
    setIsMuted(false);
    setIsOnHold(false);
    setIsSpeakerOn(false);
  };
  
  // Add function to handle direct calls from call logs
  const handleCallContact = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber.replace(/\D/g, '')}`;
  };
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const formatDateTimeForCallLog = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };
  
  const togglePlayRecording = (recordingUrl: string) => {
    if (recordingPlayback === recordingUrl && isPlayingRecording) {
      setIsPlayingRecording(false);
    } else {
      setRecordingPlayback(recordingUrl);
      setIsPlayingRecording(true);
    }
  };
  
  const renderTab = () => {
    switch (activeTab) {
      case 'dialer':
        return (
          <div className="p-6">
            <div className="mb-6">
              <input
                type="text"
                value={formatPhoneNumber(dialerNumber)}
                readOnly
                className="w-full text-center text-2xl py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            
            {isCallInProgress ? (
              <div className="mb-6">
                <div className="text-center mb-2">
                  <span className="text-lg font-semibold">{callStatus}</span>
                </div>
                <div className="text-center mb-4">
                  <span className="text-2xl">{formatDuration(callDuration)}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg ${
                      isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    <span className="text-xs mt-1">Mute</span>
                  </button>
                  <button
                    onClick={() => setIsOnHold(!isOnHold)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg ${
                      isOnHold ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {isOnHold ? <Play size={24} /> : <Pause size={24} />}
                    <span className="text-xs mt-1">{isOnHold ? 'Resume' : 'Hold'}</span>
                  </button>
                  <button
                    onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg ${
                      isSpeakerOn ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {isSpeakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
                    <span className="text-xs mt-1">Speaker</span>
                  </button>
                </div>
                <button
                  onClick={endCall}
                  className="w-full flex items-center justify-center py-4 rounded-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <PhoneOff size={24} className="mr-2" />
                  End Call
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map(digit => (
                  <button
                    key={digit}
                    onClick={() => handleDialerInput(digit.toString())}
                    className="py-4 rounded-full bg-gray-100 hover:bg-gray-200 text-xl font-medium text-gray-800"
                  >
                    {digit}
                  </button>
                ))}
              </div>
            )}
            
            {!isCallInProgress && (
              <div className="flex justify-center relative">
                <button
                  onClick={startCall}
                  disabled={dialerNumber.length === 0}
                  className={`flex items-center justify-center w-16 h-16 rounded-full ${
                    dialerNumber.length > 0
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Phone size={24} />
                </button>
                
                {dialerNumber.length > 0 && (
                  <button
                    onClick={handleBackspace}
                    className="absolute right-8 mt-5 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        );

      case 'logs':
        return (
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Call History</h3>
                <button className="flex items-center text-blue-600 hover:text-blue-700">
                  <RefreshCw size={16} className="mr-1" />
                  Refresh
                </button>
              </div>
              
              {callLogs.map(log => (
                <div key={log.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className={`p-1 rounded-full ${
                          log.direction === 'inbound' ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          <Phone size={12} className={
                            log.direction === 'inbound' ? 'text-green-600' : 'text-blue-600'
                          } />
                        </div>
                        <span className="ml-2 font-medium">{log.contactName}</span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded ${
                          log.status === 'completed' ? 'bg-green-100 text-green-700' :
                          log.status === 'missed' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>{log.phoneNumber}</div>
                        <div>{formatDateTimeForCallLog(log.startTime)}</div>
                        {log.duration > 0 && (
                          <div>Duration: {formatDuration(log.duration)}</div>
                        )}
                        {log.notes && (
                          <div className="mt-1 text-gray-500">{log.notes}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {log.recordingUrl && (
                        <button
                          onClick={() => togglePlayRecording(log.recordingUrl!)}
                          className={`p-2 rounded-full ${
                            recordingPlayback === log.recordingUrl && isPlayingRecording
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-600'
                          } hover:bg-gray-200`}
                        >
                          {recordingPlayback === log.recordingUrl && isPlayingRecording ? 
                            <Pause size={16} /> : <Play size={16} />
                          }
                        </button>
                      )}
                      <button
                        onClick={() => handleCallContact(log.phoneNumber)}
                        className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                      >
                        <Phone size={16} />
                      </button>
                      <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                        <MessageSquare size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'voicemail':
        return (
          <div className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Voicemail</h3>
              
              {voicemails.map(voicemail => (
                <div key={voicemail.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {voicemail.isNew && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        )}
                        <span className="font-medium">{voicemail.callerName}</span>
                        {voicemail.isNew && (
                          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                            New
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>{voicemail.phoneNumber}</div>
                        <div>{formatDateTimeForCallLog(voicemail.timestamp)}</div>
                        <div>Duration: {formatDuration(voicemail.duration)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => togglePlayRecording(voicemail.recordingUrl)}
                        className={`p-2 rounded-full ${
                          recordingPlayback === voicemail.recordingUrl && isPlayingRecording
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        } hover:bg-gray-200`}
                      >
                        {recordingPlayback === voicemail.recordingUrl && isPlayingRecording ? 
                          <Pause size={16} /> : <Play size={16} />
                        }
                      </button>
                      <button
                        onClick={() => handleCallContact(voicemail.phoneNumber)}
                        className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                      >
                        <Phone size={16} />
                      </button>
                      <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                        <MessageSquare size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Phone Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call Recording
                </label>
                <select className="w-full border rounded-lg p-2">
                  <option>Automatic</option>
                  <option>Manual</option>
                  <option>Disabled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caller ID
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  placeholder="Your Business Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voicemail Greeting
                </label>
                <textarea
                  className="w-full border rounded-lg p-2"
                  rows={3}
                  placeholder="Record or type your voicemail greeting..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call Forwarding
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  placeholder="Forwarding number"
                />
              </div>
              
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Save Settings
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Phone System</h1>
        <p className="text-gray-600">Manage calls, voicemail, and phone settings</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'dialer', label: 'Dialer', icon: Phone },
              { key: 'logs', label: 'Call Logs', icon: Clock },
              { key: 'voicemail', label: 'Voicemail', icon: MessageSquare },
              { key: 'settings', label: 'Settings', icon: BarChart2 }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={20} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTab()}
      </div>
    </div>
  );
};

export default PhoneSystem;