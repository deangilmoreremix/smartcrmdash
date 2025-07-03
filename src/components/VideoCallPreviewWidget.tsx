import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Phone, 
  PhoneOff, 
  Minimize2, 
  Maximize2, 
  MessageSquare, 
  Users,
  Monitor,
  MonitorOff,
  Volume2,
  VolumeX,
  Settings,
  MoreVertical,
  X,
  Plus
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useVideoCall } from '../contexts/VideoCallContext';
import { useContactStore } from '../store/contactStore';
import Avatar from './ui/Avatar';
import { getInitials } from '../utils/avatars';

const VideoCallPreviewWidget = () => {
  const { isDark } = useTheme();
  const { currentCall, callStatus, initiateCall } = useVideoCall();
  const { contacts } = useContactStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration] = useState(127); // Sample duration
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  // Show preview widget only when not in an actual call
  if (currentCall || callStatus !== 'idle') return null;

  // Sample participant data
  const sampleParticipant = {
    id: '1',
    name: 'Jane Doe',
    email: 'jane.doe@microsoft.com',
    avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  };

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get first 6 contacts for contact list
  const contactList = Object.values(contacts).slice(0, 6);

  // Handle starting a call with a selected contact
  const handleStartCall = async (contactId: string, type: 'video' | 'audio') => {
    const contact = contacts[contactId];
    if (!contact) return;

    try {
      await initiateCall({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        avatar: contact.avatar
      }, type);
      setIsExpanded(false);
      setSelectedContact(null);
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  };

  if (isExpanded) {
    // Expanded contact selection view
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <div className={`${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/20' : 'border-gray-200'} rounded-2xl overflow-hidden shadow-2xl w-80 max-h-96`}>
          {/* Header */}
          <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'} flex items-center justify-between`}>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Start a Call
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className={`p-1 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}
            >
              <X size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            </button>
          </div>

          {/* Contact List */}
          <div className="max-h-80 overflow-y-auto">
            {contactList.length > 0 ? (
              contactList.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-4 border-b ${isDark ? 'border-white/5' : 'border-gray-100'} hover:${isDark ? 'bg-white/5' : 'bg-gray-50'} transition-colors last:border-b-0`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        src={contact.avatar}
                        alt={contact.name}
                        size="md"
                        fallback={getInitials(contact.name)}
                        status="online"
                      />
                      <div>
                        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {contact.name}
                        </h4>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {contact.position} {contact.company ? `at ${contact.company}` : ''}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStartCall(contact.id, 'video')}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isDark 
                            ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400' 
                            : 'bg-green-100 hover:bg-green-200 text-green-600'
                        }`}
                        title="Start video call"
                      >
                        <Video size={16} />
                      </button>
                      
                      <button
                        onClick={() => handleStartCall(contact.id, 'audio')}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isDark 
                            ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' 
                            : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                        }`}
                        title="Start audio call"
                      >
                        <Phone size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Users size={32} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No contacts found</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className={`p-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} bg-gradient-to-r ${isDark ? 'from-gray-800/50 to-gray-700/50' : 'from-gray-50 to-gray-100'}`}>
            <div className="grid grid-cols-2 gap-3">
              <button className={`flex items-center justify-center space-x-2 p-3 rounded-lg ${isDark ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'} transition-colors`}>
                <Users size={16} />
                <span className="text-sm font-medium">Group Call</span>
              </button>
              <button className={`flex items-center justify-center space-x-2 p-3 rounded-lg ${isDark ? 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'} transition-colors`}>
                <MessageSquare size={16} />
                <span className="text-sm font-medium">Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className={`${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-2xl border ${isDark ? 'border-white/20' : 'border-gray-200'} rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-20 h-20' : 'w-96 h-72'
      }`}>
        {isMinimized ? (
          // Minimized view
          <div 
            className="w-full h-full relative group cursor-pointer" 
            onClick={() => setIsMinimized(false)}
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Avatar
                src={sampleParticipant.avatar}
                alt={sampleParticipant.name}
                size="md"
                fallback={getInitials(sampleParticipant.name)}
              />
            </div>
            
            <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 size={16} className="text-white" />
            </div>
            
            {/* Call status indicator */}
            <div className="absolute top-2 right-2 flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-xs text-white bg-black/50 px-1 rounded">
                {formatDuration(callDuration)}
              </span>
            </div>
          </div>
        ) : (
          // Expanded view
          <>
            {/* Video Container */}
            <div 
              className="relative w-full h-48 bg-gray-900"
              onMouseEnter={() => setShowControls(true)}
            >
              {/* Remote Video Background */}
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
                {/* Background avatar */}
                <div className="text-center">
                  <Avatar
                    src={sampleParticipant.avatar}
                    alt={sampleParticipant.name}
                    size="xl"
                    fallback={getInitials(sampleParticipant.name)}
                    className="mx-auto mb-3"
                  />
                  <p className="text-white font-medium">{sampleParticipant.name}</p>
                  <p className="text-white/70 text-sm">Connected</p>
                </div>

                {/* Video overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white/80 text-sm">Video Call Preview</p>
                  </div>
                </div>
              </div>

              {/* Local Video (Picture-in-Picture) */}
              <div className="absolute top-4 right-4 w-24 h-18 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
                {isVideoEnabled ? (
                  <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">JD</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <VideoOff size={16} className="text-gray-400" />
                  </div>
                )}
              </div>

              {/* Header Controls */}
              <div className={`absolute top-3 left-3 right-3 flex justify-between items-center transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="flex items-center space-x-2">
                  {/* Connection Quality */}
                  <div className="flex items-center space-x-1 bg-black/50 rounded-full px-3 py-1">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-white text-xs">Excellent</span>
                  </div>
                  
                  {/* Call Duration */}
                  <div className="bg-black/50 rounded-full px-3 py-1">
                    <span className="text-white text-xs">{formatDuration(callDuration)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Minimize2 size={14} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Screen Share Indicator */}
              {isScreenSharing && (
                <div className="absolute bottom-4 left-4">
                  <div className="bg-blue-500 rounded-lg px-3 py-1 flex items-center space-x-2">
                    <Monitor size={14} className="text-white" />
                    <span className="text-white text-xs">Sharing Screen</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Controls Panel */}
            <div className={`p-4 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50/50'} transition-opacity duration-300`}>
              <div className="flex items-center justify-between">
                {/* Left Controls */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isAudioEnabled 
                        ? `${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${isDark ? 'text-gray-300' : 'text-gray-600'}` 
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                    title={isAudioEnabled ? 'Mute' : 'Unmute'}
                  >
                    {isAudioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
                  </button>
                  
                  <button
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isVideoEnabled 
                        ? `${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${isDark ? 'text-gray-300' : 'text-gray-600'}` 
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                    title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
                  >
                    {isVideoEnabled ? <Video size={16} /> : <VideoOff size={16} />}
                  </button>

                  <button
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isScreenSharing 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : `${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${isDark ? 'text-gray-300' : 'text-gray-600'}`
                    }`}
                    title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
                  >
                    {isScreenSharing ? <MonitorOff size={16} /> : <Monitor size={16} />}
                  </button>
                </div>

                {/* Center - Participant Info */}
                <div className="flex-1 text-center">
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {sampleParticipant.name}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Microsoft
                  </p>
                </div>

                {/* Right Controls */}
                <div className="flex items-center space-x-3">
                  <button 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
                    title="Chat"
                  >
                    <MessageSquare size={16} />
                  </button>
                  
                  <button 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
                    title="More options"
                  >
                    <MoreVertical size={16} />
                  </button>
                  
                  <button 
                    onClick={() => setIsExpanded(true)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isDark 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                    title="Select contact"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCallPreviewWidget;