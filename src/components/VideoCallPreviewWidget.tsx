import React, { useState } from 'react';
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
  MoreVertical
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useVideoCall } from '../contexts/VideoCallContext';
import Avatar from './ui/Avatar';
import { getInitials } from '../utils/avatars';

const VideoCallPreviewWidget = () => {
  const { isDark } = useTheme();
  const { currentCall, callStatus } = useVideoCall();
  const [isMinimized, setIsMinimized] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration] = useState(127); // Demo duration

  // Show preview widget only when not in an actual call
  if (currentCall || callStatus !== 'idle') return null;

  // Demo participant data
  const demoParticipant = {
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

  return (
    <div className="fixed bottom-20 right-4 z-40">
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
                src={demoParticipant.avatar}
                alt={demoParticipant.name}
                size="md"
                fallback={getInitials(demoParticipant.name)}
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

            {/* Demo Label */}
            <div className="absolute bottom-1 left-1 right-1">
              <div className="bg-purple-500/80 rounded px-1 py-0.5">
                <span className="text-xs text-white font-medium">DEMO</span>
              </div>
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
              {/* Demo Remote Video Background */}
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
                {/* Background avatar */}
                <div className="text-center">
                  <Avatar
                    src={demoParticipant.avatar}
                    alt={demoParticipant.name}
                    size="xl"
                    fallback={getInitials(demoParticipant.name)}
                    className="mx-auto mb-3"
                  />
                  <p className="text-white font-medium">{demoParticipant.name}</p>
                  <p className="text-white/70 text-sm">Connected</p>
                </div>

                {/* Demo video overlay */}
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

                  {/* Demo Label */}
                  <div className="bg-purple-500/80 rounded-full px-3 py-1">
                    <span className="text-white text-xs font-medium">DEMO</span>
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
                    {demoParticipant.name}
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
                    className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                    title="End call"
                  >
                    <PhoneOff size={16} className="text-white" />
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