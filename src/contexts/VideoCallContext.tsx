import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import SimplePeer from 'simple-peer';

export interface CallParticipant {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

export interface CallData {
  id: string;
  caller: CallParticipant;
  recipient: CallParticipant;
  startTime: Date;
  status: 'ringing' | 'connected' | 'ended' | 'rejected';
  type: 'video' | 'audio';
}

interface GroupCallParticipant extends CallParticipant {
  stream?: MediaStream;
  peer?: SimplePeer.Instance;
  isConnected: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isSpeaking: boolean;
}

interface VideoCallContextType {
  // Call State
  currentCall: CallData | null;
  isInCall: boolean;
  callStatus: 'idle' | 'calling' | 'ringing' | 'connected' | 'ending';
  
  // Media State
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  
  // Call Actions
  initiateCall: (recipient: CallParticipant, type: 'video' | 'audio') => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  endCall: () => void;
  
  // Media Controls
  toggleVideo: () => void;
  toggleAudio: () => void;
  toggleScreenShare: () => Promise<void>;
  
  // Connection Management
  peer: SimplePeer.Instance | null;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
  
  // Chat/Data Channel
  sendMessage: (message: string) => void;
  onMessageReceived: (callback: (message: string) => void) => void;
  
  // Recording
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  isRecording: boolean;
  
  // Group Call Features
  initiateGroupCall: (participants: CallParticipant[], type: 'video' | 'audio') => Promise<void>;
  addParticipantToCall: (participant: CallParticipant) => Promise<void>;
  removeParticipantFromCall: (participantId: string) => void;
  participants: GroupCallParticipant[];
  isGroupCall: boolean;
}

const VideoCallContext = createContext<VideoCallContextType | undefined>(undefined);

export const useVideoCall = () => {
  const context = useContext(VideoCallContext);
  if (!context) {
    throw new Error('useVideoCall must be used within a VideoCallProvider');
  }
  return context;
};

export const VideoCallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Call State
  const [currentCall, setCurrentCall] = useState<CallData | null>(null);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'ringing' | 'connected' | 'ending'>('idle');
  
  // Media State
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Peer Connection
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('disconnected');
  
  // Group Call
  const [participants, setParticipants] = useState<GroupCallParticipant[]>([]);
  const [isGroupCall, setIsGroupCall] = useState(false);
  
  // Refs
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const peersRef = useRef<Map<string, SimplePeer.Instance>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const originalStreamRef = useRef<MediaStream | null>(null);
  const messageCallbackRef = useRef<((message: string) => void) | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const roomIdRef = useRef<string | null>(null);

  const isInCall = callStatus === 'connected';

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log('Cleaning up video call...');
    
    // Clean up individual peer
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
      setPeer(null);
    }
    
    // Clean up all peers in group calls
    peersRef.current.forEach(peer => {
      peer.destroy();
    });
    peersRef.current.clear();
    setParticipants([]);
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind);
        track.stop();
      });
      localStreamRef.current = null;
      setLocalStream(null);
    }
    
    if (originalStreamRef.current) {
      originalStreamRef.current.getTracks().forEach(track => track.stop());
      originalStreamRef.current = null;
    }
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    setRemoteStream(null);
    setCurrentCall(null);
    setCallStatus('idle');
    setIsScreenSharing(false);
    setConnectionQuality('disconnected');
    setIsGroupCall(false);
    roomIdRef.current = null;
  }, [isRecording]);

  // Get user media with enhanced error handling
  const getUserMedia = useCallback(async (videoEnabled: boolean = true, audioEnabled: boolean = true) => {
    console.log('Getting user media:', { videoEnabled, audioEnabled });
    
    try {
      const constraints: MediaStreamConstraints = {
        video: videoEnabled ? {
          width: { ideal: 1280, max: 1920, min: 640 },
          height: { ideal: 720, max: 1080, min: 480 },
          frameRate: { ideal: 30, max: 60, min: 15 },
          facingMode: 'user'
        } : false,
        audio: audioEnabled ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: { ideal: 48000 },
          channelCount: { ideal: 2 }
        } : false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Got user media stream:', stream.getTracks().map(t => `${t.kind}: ${t.label}`));
      
      // Verify track states
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();
      
      if (videoEnabled && videoTracks.length === 0) {
        console.warn('Video requested but no video tracks received');
      }
      
      if (audioEnabled && audioTracks.length === 0) {
        console.warn('Audio requested but no audio tracks received');
      }
      
      localStreamRef.current = stream;
      setLocalStream(stream);
      setIsVideoEnabled(videoEnabled && videoTracks.length > 0);
      setIsAudioEnabled(audioEnabled && audioTracks.length > 0);
      
      // Set up track event listeners
      stream.getTracks().forEach(track => {
        track.addEventListener('ended', () => {
          console.log(`Track ended: ${track.kind}`);
          if (track.kind === 'video') {
            setIsVideoEnabled(false);
          } else if (track.kind === 'audio') {
            setIsAudioEnabled(false);
          }
        });
      });
      
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Camera/microphone access denied. Please allow permissions and try again.');
        } else if (error.name === 'NotFoundError') {
          throw new Error('No camera/microphone found. Please check your devices.');
        } else if (error.name === 'NotReadableError') {
          throw new Error('Camera/microphone is already in use by another application.');
        } else if (error.name === 'OverconstrainedError') {
          // Try with relaxed constraints
          console.log('Constraints too strict, trying with basic constraints...');
          try {
            const basicStream = await navigator.mediaDevices.getUserMedia({
              video: videoEnabled ? true : false,
              audio: audioEnabled ? true : false
            });
            
            localStreamRef.current = basicStream;
            setLocalStream(basicStream);
            setIsVideoEnabled(videoEnabled && basicStream.getVideoTracks().length > 0);
            setIsAudioEnabled(audioEnabled && basicStream.getAudioTracks().length > 0);
            
            return basicStream;
          } catch (basicError) {
            throw new Error('Unable to access camera/microphone with any settings.');
          }
        }
      }
      
      throw new Error('Could not access camera/microphone. Please check permissions and ensure no other app is using them.');
    }
  }, []);

  // Create peer connection with real WebRTC
  const createPeer = useCallback((initiator: boolean, stream: MediaStream, recipientId?: string) => {
    console.log('Creating peer connection, initiator:', initiator, 'recipient:', recipientId);
    
    const config = {
      initiator,
      trickle: false,
      stream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' },
          // Add TURN servers for better connectivity
          { 
            urls: 'turn:openrelay.metered.ca:80',
            username: 'openrelayproject',
            credential: 'openrelayproject'
          }
        ],
        sdpSemantics: 'unified-plan'
      },
      channelConfig: {
        ordered: true
      }
    };

    const newPeer = new SimplePeer(config);

    // Enhanced signaling with real WebRTC
    newPeer.on('signal', (signal) => {
      console.log('Signal generated:', signal.type, signal);
      
      // In a production app, you'd send this to a signaling server
      // For demo, we'll use localStorage to simulate peer communication
      handleSignaling(signal, initiator, recipientId);
    });

    // Handle incoming stream
    newPeer.on('stream', (stream) => {
      console.log('Remote stream received:', stream.getTracks().map(t => `${t.kind}: ${t.label || 'unlabeled'}`));
      
      // For group calls, associate stream with participant
      if (isGroupCall && recipientId) {
        setParticipants(prev => 
          prev.map(p => p.id === recipientId ? { ...p, stream } : p)
        );
      } else {
        setRemoteStream(stream);
      }
      
      setCallStatus('connected');
      setConnectionQuality('excellent');
      
      // Set up remote stream track event listeners
      stream.getTracks().forEach(track => {
        track.addEventListener('ended', () => {
          console.log(`Remote track ended: ${track.kind}`);
        });
        
        track.addEventListener('mute', () => {
          console.log(`Remote track muted: ${track.kind}`);
        });
        
        track.addEventListener('unmute', () => {
          console.log(`Remote track unmuted: ${track.kind}`);
        });
      });
    });

    // Handle connection events
    newPeer.on('connect', () => {
      console.log('Peer connected successfully');
      setCallStatus('connected');
      setConnectionQuality('excellent');
      
      if (recipientId) {
        setParticipants(prev => 
          prev.map(p => p.id === recipientId ? { ...p, isConnected: true } : p)
        );
      }
    });

    // Handle data channel messages
    newPeer.on('data', (data) => {
      try {
        const message = data.toString();
        console.log('Received data:', message);
        
        const parsedData = JSON.parse(message);
        
        if (parsedData.type === 'chat' && messageCallbackRef.current) {
          messageCallbackRef.current(parsedData.content);
        } else if (parsedData.type === 'media-control') {
          console.log('Received media control:', parsedData);
          // Handle remote media control notifications
          if (recipientId && parsedData.action) {
            // Update participant state based on control messages
            if (parsedData.action === 'video-toggle') {
              setParticipants(prev => 
                prev.map(p => p.id === recipientId ? { ...p, isVideoEnabled: parsedData.enabled } : p)
              );
            } else if (parsedData.action === 'audio-toggle') {
              setParticipants(prev => 
                prev.map(p => p.id === recipientId ? { ...p, isAudioEnabled: parsedData.enabled } : p)
              );
            }
          }
        }
      } catch (error) {
        console.error('Error handling received data:', error);
      }
    });

    // Enhanced error handling
    newPeer.on('error', (error) => {
      console.error('Peer error:', error);
      
      if (error.message.includes('Ice connection failed')) {
        setConnectionQuality('poor');
        console.log('ICE connection failed, attempting to reconnect...');
        
        // Attempt to restart ICE
        setTimeout(() => {
          if (peerRef.current && !peerRef.current.destroyed) {
            console.log('Attempting ICE restart...');
            // In a real app, you'd restart the ICE connection
          }
        }, 2000);
      } else {
        setConnectionQuality('disconnected');
        console.log('Unrecoverable peer error, ending call');
        setTimeout(() => {
          // If this is a group call, just remove this participant
          if (isGroupCall && recipientId) {
            removeParticipantFromCall(recipientId);
          } else {
            cleanup();
          }
        }, 2000);
      }
    });

    // Handle close
    newPeer.on('close', () => {
      console.log('Peer connection closed');
      if (isGroupCall && recipientId) {
        removeParticipantFromCall(recipientId);
      } else {
        cleanup();
      }
    });

    if (recipientId) {
      // Store in peers map for group calls
      peersRef.current.set(recipientId, newPeer);
    } else {
      // Store as main peer for 1:1 calls
      peerRef.current = newPeer;
      setPeer(newPeer);
    }
    
    return newPeer;
  }, [cleanup, isGroupCall]);

  // Real signaling simulation using localStorage for cross-tab communication
  const handleSignaling = useCallback((signal: any, isInitiator: boolean, recipientId?: string) => {
    console.log('Handling signaling:', signal.type, 'initiator:', isInitiator, 'recipient:', recipientId);
    
    // For demo purposes, use localStorage to enable cross-tab calling
    const channelName = recipientId
      ? `webrtc-signal-${currentCall?.id || 'demo'}-${recipientId}`
      : `webrtc-signal-${currentCall?.id || 'demo'}`;
    
    if (isInitiator) {
      // Store offer for the other peer to pick up
      localStorage.setItem(`${channelName}-offer`, JSON.stringify(signal));
      
      // Listen for answer
      const checkForAnswer = () => {
        const answer = localStorage.getItem(`${channelName}-answer`);
        if (answer) {
          try {
            const parsedAnswer = JSON.parse(answer);
            // For group calls, find the correct peer
            if (recipientId && peersRef.current.has(recipientId)) {
              const targetPeer = peersRef.current.get(recipientId);
              if (targetPeer && !targetPeer.destroyed) {
                targetPeer.signal(parsedAnswer);
                console.log('Processed answer signal for participant:', recipientId);
              }
            }
            // For 1:1 calls
            else if (peerRef.current && !peerRef.current.destroyed) {
              peerRef.current.signal(parsedAnswer);
              console.log('Processed answer signal for 1:1 call');
            }
            
            localStorage.removeItem(`${channelName}-answer`);
          } catch (error) {
            console.error('Error processing answer:', error);
          }
        } else {
          setTimeout(checkForAnswer, 1000);
        }
      };
      
      setTimeout(checkForAnswer, 1000);
    } else {
      // Store answer for the initiator to pick up
      localStorage.setItem(`${channelName}-answer`, JSON.stringify(signal));
    }
    
    // For single-tab demo, also create a mirror connection
    if (isInitiator) {
      setTimeout(() => {
        if (recipientId && peersRef.current.has(recipientId)) {
          const targetPeer = peersRef.current.get(recipientId);
          if (targetPeer && !targetPeer.destroyed) {
            console.log('Setting up demo connection for participant:', recipientId);
            setCallStatus('connected');
            
            // For demo, create a clone of the local stream
            if (localStreamRef.current) {
              const clonedStream = localStreamRef.current.clone();
              
              // Update participant's stream
              setParticipants(prev => 
                prev.map(p => p.id === recipientId ? { 
                  ...p, 
                  isConnected: true,
                  stream: clonedStream 
                } : p)
              );
            }
          }
        }
        else if (peerRef.current && !peerRef.current.destroyed) {
          try {
            // Create a self-connecting demo by using the same signal
            console.log('Setting up demo self-connection for 1:1 call');
            setCallStatus('connected');
            
            // For demo, use the local stream as remote stream with some delay
            setTimeout(() => {
              if (localStreamRef.current) {
                // Clone the local stream for demo remote stream
                const clonedStream = localStreamRef.current.clone();
                setRemoteStream(clonedStream);
                setConnectionQuality('excellent');
                console.log('Demo connection established');
              }
            }, 1000);
          } catch (error) {
            console.error('Error in demo connection:', error);
          }
        }
      }, 2000);
    }
  }, [currentCall?.id, isGroupCall]);

  // Initiate call with real media capture
  const initiateCall = useCallback(async (recipient: CallParticipant, type: 'video' | 'audio') => {
    console.log('Initiating call to:', recipient.name, 'type:', type);
    
    try {
      setCallStatus('calling');
      
      // Create call data
      const callData: CallData = {
        id: Date.now().toString(),
        caller: {
          id: 'current-user',
          name: 'John Doe',
          email: 'john@example.com'
        },
        recipient,
        startTime: new Date(),
        status: 'ringing',
        type
      };
      
      setCurrentCall(callData);
      
      // Get real user media
      const stream = await getUserMedia(type === 'video', true);
      
      // Create peer as initiator with real WebRTC
      createPeer(true, stream);
      
      // Set calling status
      setTimeout(() => {
        if (callStatus === 'calling') {
          setCallStatus('ringing');
        }
      }, 1000);
      
      // For demo, auto-accept after delay (in real app, wait for recipient)
      setTimeout(() => {
        if (callStatus === 'ringing' || callStatus === 'calling') {
          console.log('Demo auto-accepting call');
          setCallStatus('connected');
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error initiating call:', error);
      cleanup();
      throw error;
    }
  }, [callStatus, getUserMedia, createPeer, cleanup]);

  // Accept call with real media
  const acceptCall = useCallback(async () => {
    if (!currentCall) return;
    
    console.log('Accepting call');
    
    try {
      // Get real user media
      const stream = await getUserMedia(currentCall.type === 'video', true);
      
      // Create peer as non-initiator
      createPeer(false, stream);
      
      setCallStatus('connected');
      
    } catch (error) {
      console.error('Error accepting call:', error);
      rejectCall();
      throw error;
    }
  }, [currentCall, getUserMedia, createPeer]);

  // Reject call
  const rejectCall = useCallback(() => {
    console.log('Rejecting call');
    setCallStatus('ending');
    setTimeout(() => {
      cleanup();
    }, 1000);
  }, [cleanup]);

  // End call
  const endCall = useCallback(() => {
    console.log('Ending call');
    setCallStatus('ending');
    
    // Notify remote peer
    if (peerRef.current && peerRef.current.connected) {
      try {
        peerRef.current.send(JSON.stringify({
          type: 'call-end',
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Error sending call end notification:', error);
      }
    }
    
    // For group calls, notify all peers
    if (isGroupCall) {
      peersRef.current.forEach((peer, participantId) => {
        try {
          if (peer.connected) {
            peer.send(JSON.stringify({
              type: 'call-end',
              timestamp: new Date().toISOString()
            }));
          }
        } catch (error) {
          console.error(`Error sending call end notification to ${participantId}:`, error);
        }
      });
    }
    
    setTimeout(() => {
      cleanup();
    }, 1000);
  }, [cleanup, isGroupCall]);

  // Toggle video with real track control
  const toggleVideo = useCallback(() => {
    console.log('Toggling video, current state:', isVideoEnabled);
    
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        console.log('Video toggled to:', videoTrack.enabled);
        
        // Notify remote peer in 1:1 call
        if (peerRef.current && peerRef.current.connected) {
          try {
            peerRef.current.send(JSON.stringify({
              type: 'media-control',
              action: 'video-toggle',
              enabled: videoTrack.enabled,
              timestamp: new Date().toISOString()
            }));
          } catch (error) {
            console.error('Error sending video toggle notification:', error);
          }
        }
        
        // Notify all peers in group call
        if (isGroupCall) {
          peersRef.current.forEach(peer => {
            try {
              if (peer.connected) {
                peer.send(JSON.stringify({
                  type: 'media-control',
                  action: 'video-toggle',
                  enabled: videoTrack.enabled,
                  timestamp: new Date().toISOString()
                }));
              }
            } catch (error) {
              console.error('Error sending video toggle to group:', error);
            }
          });
        }
      } else {
        console.log('No video track found');
      }
    }
  }, [isVideoEnabled, isGroupCall]);

  // Toggle audio with real track control
  const toggleAudio = useCallback(() => {
    console.log('Toggling audio, current state:', isAudioEnabled);
    
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        console.log('Audio toggled to:', audioTrack.enabled);
        
        // Notify remote peer in 1:1 call
        if (peerRef.current && peerRef.current.connected) {
          try {
            peerRef.current.send(JSON.stringify({
              type: 'media-control',
              action: 'audio-toggle',
              enabled: audioTrack.enabled,
              timestamp: new Date().toISOString()
            }));
          } catch (error) {
            console.error('Error sending audio toggle notification:', error);
          }
        }
        
        // Notify all peers in group call
        if (isGroupCall) {
          peersRef.current.forEach(peer => {
            try {
              if (peer.connected) {
                peer.send(JSON.stringify({
                  type: 'media-control',
                  action: 'audio-toggle',
                  enabled: audioTrack.enabled,
                  timestamp: new Date().toISOString()
                }));
              }
            } catch (error) {
              console.error('Error sending audio toggle to group:', error);
            }
          });
        }
      } else {
        console.log('No audio track found');
      }
    }
  }, [isAudioEnabled, isGroupCall]);

  // Real screen sharing implementation
  const toggleScreenShare = useCallback(async () => {
    console.log('Toggling screen share, current state:', isScreenSharing);
    
    try {
      if (!isScreenSharing) {
        // Start screen sharing with real getDisplayMedia
        console.log('Starting screen share');
        
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { 
            frameRate: { ideal: 30, max: 60 },
            width: { ideal: 1920, max: 4096 },
            height: { ideal: 1080, max: 2160 }
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 48000
          }
        });
        
        console.log('Screen share stream obtained:', screenStream.getTracks().map(t => `${t.kind}: ${t.label}`));
        
        // Store original stream
        originalStreamRef.current = localStreamRef.current;
        
        if (isGroupCall) {
          // For group calls, replace video track for all peers
          peersRef.current.forEach((peerConnection, participantId) => {
            if (peerConnection && !peerConnection.destroyed) {
              const videoTrack = screenStream.getVideoTracks()[0];
              if (videoTrack) {
                // Get the peer connection
                const pc = (peerConnection as any)._pc;
                if (pc) {
                  const senders = pc.getSenders();
                  const videoSender = senders.find((sender: RTCRtpSender) => 
                    sender.track && sender.track.kind === 'video'
                  );
                  
                  if (videoSender) {
                    videoSender.replaceTrack(videoTrack)
                      .then(() => console.log('Screen share track replaced for:', participantId))
                      .catch(err => console.error('Error replacing track for', participantId, err));
                    
                    // Notify peer
                    try {
                      peerConnection.send(JSON.stringify({
                        type: 'media-control',
                        action: 'screen-share-start',
                        timestamp: new Date().toISOString()
                      }));
                    } catch (e) {
                      console.error('Error sending screen share notification:', e);
                    }
                  }
                }
              }
            }
          });
        } else {
          // Replace video track in 1:1 peer connection
          if (peerRef.current && localStreamRef.current) {
            const videoTrack = screenStream.getVideoTracks()[0];
            
            // Get the peer connection
            const pc = (peerRef.current as any)._pc;
            if (pc) {
              const senders = pc.getSenders();
              const videoSender = senders.find((sender: RTCRtpSender) => 
                sender.track && sender.track.kind === 'video'
              );
              
              if (videoSender && videoTrack) {
                try {
                  await videoSender.replaceTrack(videoTrack);
                  console.log('Screen share track replaced successfully in peer connection');
                  
                  // Notify remote peer
                  if (peerRef.current.connected) {
                    peerRef.current.send(JSON.stringify({
                      type: 'media-control',
                      action: 'screen-share-start',
                      timestamp: new Date().toISOString()
                    }));
                  }
                } catch (replaceError) {
                  console.error('Error replacing video track:', replaceError);
                }
              }
            }
          }
        }
        
        localStreamRef.current = screenStream;
        setLocalStream(screenStream);
        setIsScreenSharing(true);
        
        // Handle screen share end by user
        screenStream.getVideoTracks()[0].addEventListener('ended', () => {
          console.log('Screen share ended by user');
          toggleScreenShare();
        });
        
      } else {
        // Stop screen sharing
        console.log('Stopping screen share');
        
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(track => {
            console.log('Stopping screen share track:', track.kind);
            track.stop();
          });
        }
        
        // Restore original camera stream
        if (originalStreamRef.current) {
          const videoTrack = originalStreamRef.current.getVideoTracks()[0];
          
          if (isGroupCall) {
            // Replace track in all group connections
            peersRef.current.forEach((peerConnection, participantId) => {
              if (peerConnection && !peerConnection.destroyed && videoTrack) {
                const pc = (peerConnection as any)._pc;
                if (pc) {
                  const senders = pc.getSenders();
                  const videoSender = senders.find((sender: RTCRtpSender) => 
                    sender.track && sender.track.kind === 'video'
                  );
                  
                  if (videoSender) {
                    videoSender.replaceTrack(videoTrack)
                      .then(() => console.log('Camera track restored for:', participantId))
                      .catch(err => console.error('Error restoring track for', participantId, err));
                    
                    // Notify peer
                    try {
                      peerConnection.send(JSON.stringify({
                        type: 'media-control',
                        action: 'screen-share-stop',
                        timestamp: new Date().toISOString()
                      }));
                    } catch (e) {
                      console.error('Error sending screen share stop notification:', e);
                    }
                  }
                }
              }
            });
          } else {
            // Replace track back to camera in 1:1 peer connection
            if (peerRef.current && videoTrack) {
              const pc = (peerRef.current as any)._pc;
              if (pc) {
                const senders = pc.getSenders();
                const videoSender = senders.find((sender: RTCRtpSender) => 
                  sender.track && sender.track.kind === 'video'
                );
                
                if (videoSender) {
                  try {
                    await videoSender.replaceTrack(videoTrack);
                    console.log('Camera track restored successfully in peer connection');
                    
                    // Notify remote peer
                    if (peerRef.current.connected) {
                      peerRef.current.send(JSON.stringify({
                        type: 'media-control',
                        action: 'screen-share-stop',
                        timestamp: new Date().toISOString()
                      }));
                    }
                  } catch (replaceError) {
                    console.error('Error restoring camera track:', replaceError);
                  }
                }
              }
            }
          }
          
          localStreamRef.current = originalStreamRef.current;
          setLocalStream(originalStreamRef.current);
          originalStreamRef.current = null;
        } else {
          // If no original stream, get fresh camera stream
          try {
            const newStream = await getUserMedia(currentCall?.type === 'video', true);
            localStreamRef.current = newStream;
            setLocalStream(newStream);
          } catch (error) {
            console.error('Error getting fresh camera stream:', error);
          }
        }
        
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
      setIsScreenSharing(false);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          alert('Screen sharing was denied. Please allow screen sharing to continue.');
        } else if (error.name === 'NotSupportedError') {
          alert('Screen sharing is not supported in your browser.');
        } else if (error.name === 'AbortError') {
          console.log('Screen sharing was cancelled by user');
        } else {
          alert(`Screen sharing failed: ${error.message}`);
        }
      }
    }
  }, [isScreenSharing, currentCall?.type, getUserMedia, isGroupCall]);

  // Real call recording implementation
  const startRecording = useCallback(async () => {
    if (!isInCall || !localStreamRef.current) {
      throw new Error('Cannot start recording: not in call or no local stream');
    }

    try {
      console.log('Starting call recording...');
      
      // Create combined stream for recording
      const combinedStream = new MediaStream();
      
      // Add local tracks
      localStreamRef.current.getTracks().forEach(track => {
        combinedStream.addTrack(track);
      });

      // For 1:1 calls, add remote stream
      if (!isGroupCall && remoteStream) {
        remoteStream.getTracks().forEach(track => {
          combinedStream.addTrack(track);
        });
      } 
      // For group calls, add all participant streams
      else if (isGroupCall) {
        participants.forEach(participant => {
          if (participant.stream) {
            participant.stream.getTracks().forEach(track => {
              combinedStream.addTrack(track);
            });
          }
        });
      }

      // Check for MediaRecorder support
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4'
      ];
      
      let supportedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          supportedMimeType = mimeType;
          break;
        }
      }
      
      if (!supportedMimeType) {
        throw new Error('No supported video format for recording');
      }

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: supportedMimeType,
        videoBitsPerSecond: 2500000, // 2.5 Mbps
        audioBitsPerSecond: 128000   // 128 kbps
      });

      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
          console.log('Recording chunk received:', event.data.size, 'bytes');
        }
      };

      mediaRecorder.onstop = () => {
        console.log('Recording stopped, creating blob...');
        const recordedBlob = new Blob(recordedChunksRef.current, {
          type: supportedMimeType
        });
        
        // Save recording to downloads
        const url = URL.createObjectURL(recordedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `call-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Recording saved, blob size:', recordedBlob.size, 'bytes');
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setIsRecording(false);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Record in 1-second chunks
      setIsRecording(true);
      
      console.log('Recording started successfully');

    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      throw error;
    }
  }, [isInCall, isGroupCall, participants, remoteStream]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('Stopping recording...');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  // Send message via data channel
  const sendMessage = useCallback((message: string) => {
    // For 1:1 calls
    if (!isGroupCall && peerRef.current && peerRef.current.connected) {
      try {
        const messageData = {
          type: 'chat',
          content: message,
          timestamp: new Date().toISOString(),
          sender: 'user'
        };
        
        peerRef.current.send(JSON.stringify(messageData));
        console.log('Message sent to single peer:', message);
      } catch (error) {
        console.error('Error sending message:', error);
        throw new Error('Failed to send message');
      }
    } 
    // For group calls, broadcast to all peers
    else if (isGroupCall) {
      try {
        const messageData = {
          type: 'chat',
          content: message,
          timestamp: new Date().toISOString(),
          sender: 'user'
        };
        
        const serializedMessage = JSON.stringify(messageData);
        
        // Send to all connected peers
        let successCount = 0;
        peersRef.current.forEach((peer, participantId) => {
          if (peer.connected) {
            try {
              peer.send(serializedMessage);
              successCount++;
            } catch (peerError) {
              console.error(`Failed to send message to participant ${participantId}:`, peerError);
            }
          }
        });
        
        console.log(`Broadcast message to ${successCount}/${peersRef.current.size} participants:`, message);
        
        if (successCount === 0) {
          throw new Error('No connected peers to send message to');
        }
      } catch (error) {
        console.error('Error broadcasting message:', error);
        throw new Error('Failed to broadcast message');
      }
    } else {
      console.warn('Cannot send message: no active call');
      throw new Error('No active call');
    }
  }, [isGroupCall]);

  // Set message received callback
  const onMessageReceived = useCallback((callback: (message: string) => void) => {
    messageCallbackRef.current = callback;
  }, []);

  // Initiate a group call
  const initiateGroupCall = useCallback(async (
    participants: CallParticipant[],
    type: 'video' | 'audio'
  ) => {
    console.log('Initiating group call with', participants.length, 'participants');
    
    try {
      setCallStatus('calling');
      setIsGroupCall(true);
      
      // Generate a room ID for this group call
      const roomId = `group-call-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      roomIdRef.current = roomId;
      
      // Create call data (use first participant as representative)
      const callData: CallData = {
        id: roomId,
        caller: {
          id: 'current-user',
          name: 'John Doe',
          email: 'john@example.com'
        },
        recipient: participants[0],
        startTime: new Date(),
        status: 'ringing',
        type
      };
      
      setCurrentCall(callData);
      
      // Get user media
      const stream = await getUserMedia(type === 'video', true);
      
      // Set up group call participants
      const initialParticipants: GroupCallParticipant[] = participants.map(p => ({
        ...p,
        isConnected: false,
        isVideoEnabled: false,
        isAudioEnabled: false,
        isSpeaking: false
      }));
      setParticipants(initialParticipants);
      
      // Create peer connections for each participant
      for (const participant of participants) {
        // Create initiator peer for this participant
        createPeer(true, stream, participant.id);
        
        // In a real app, you would send the offer to each participant through a signaling server
      }
      
      // Set calling status
      setTimeout(() => {
        if (callStatus === 'calling') {
          setCallStatus('ringing');
        }
      }, 1000);
      
      // For demo, auto-accept after delay
      setTimeout(() => {
        if (callStatus === 'ringing' || callStatus === 'calling') {
          console.log('Demo auto-accepting group call');
          setCallStatus('connected');
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error initiating group call:', error);
      cleanup();
      throw error;
    }
  }, [callStatus, getUserMedia, createPeer, cleanup]);

  // Add a new participant to an ongoing call
  const addParticipantToCall = useCallback(async (participant: CallParticipant) => {
    if (!isGroupCall || !localStreamRef.current) {
      throw new Error('Cannot add participant: not in a group call or no local stream');
    }
    
    console.log('Adding participant to group call:', participant.name);
    
    // Add participant to state
    setParticipants(prev => [
      ...prev,
      {
        ...participant,
        isConnected: false,
        isVideoEnabled: false,
        isAudioEnabled: false,
        isSpeaking: false
      }
    ]);
    
    // Create peer connection for this participant
    createPeer(true, localStreamRef.current, participant.id);
    
    // In a real app, you would send the offer to this participant through a signaling server
    
    return Promise.resolve();
  }, [isGroupCall, createPeer]);

  // Remove a participant from the call
  const removeParticipantFromCall = useCallback((participantId: string) => {
    console.log('Removing participant from call:', participantId);
    
    // Get peer connection for this participant
    const peerConnection = peersRef.current.get(participantId);
    
    // Close and remove the connection
    if (peerConnection) {
      peerConnection.destroy();
      peersRef.current.delete(participantId);
    }
    
    // Remove participant from state
    setParticipants(prev => prev.filter(p => p.id !== participantId));
  }, []);

  // Real connection quality monitoring
  useEffect(() => {
    if (!peerRef.current || !isInCall) return;

    const monitorConnection = async () => {
      try {
        const pc = (peerRef.current as any)?._pc;
        if (!pc) return;

        const stats = await pc.getStats();
        let packetsLost = 0;
        let packetsReceived = 0;
        let rtt = 0;

        stats.forEach((report: any) => {
          if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
            packetsLost += report.packetsLost || 0;
            packetsReceived += report.packetsReceived || 0;
          } else if (report.type === 'candidate-pair' && report.state === 'succeeded') {
            rtt = report.currentRoundTripTime || 0;
          }
        });

        // Calculate quality based on real metrics
        let quality: 'excellent' | 'good' | 'poor' | 'disconnected' = 'excellent';
        
        const lossRate = packetsReceived > 0 ? (packetsLost / packetsReceived) * 100 : 0;
        const rttMs = rtt * 1000;

        if (lossRate > 5 || rttMs > 300) {
          quality = 'poor';
        } else if (lossRate > 2 || rttMs > 150) {
          quality = 'good';
        } else if (pc.connectionState === 'connected') {
          quality = 'excellent';
        } else {
          quality = 'disconnected';
        }

        setConnectionQuality(quality);
        
      } catch (error) {
        console.error('Error monitoring connection:', error);
        setConnectionQuality('poor');
      }
    };

    const interval = setInterval(monitorConnection, 3000);
    return () => clearInterval(interval);
  }, [isInCall]);
  
  // Group call quality monitoring
  useEffect(() => {
    if (!isGroupCall || !isInCall) return;
    
    const monitorGroupConnections = async () => {
      try {
        const participantQuality: Record<string, 'excellent' | 'good' | 'poor' | 'disconnected'> = {};
        
        // Check each participant's connection
        for (const [participantId, peerConn] of peersRef.current.entries()) {
          const pc = (peerConn as any)?._pc;
          if (!pc) continue;
          
          try {
            const stats = await pc.getStats();
            let packetsLost = 0;
            let packetsReceived = 0;
            let rtt = 0;

            stats.forEach((report: any) => {
              if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
                packetsLost += report.packetsLost || 0;
                packetsReceived += report.packetsReceived || 0;
              } else if (report.type === 'candidate-pair' && report.state === 'succeeded') {
                rtt = report.currentRoundTripTime || 0;
              }
            });
            
            // Calculate quality
            let quality: 'excellent' | 'good' | 'poor' | 'disconnected' = 'excellent';
            
            const lossRate = packetsReceived > 0 ? (packetsLost / packetsReceived) * 100 : 0;
            const rttMs = rtt * 1000;

            if (lossRate > 5 || rttMs > 300) {
              quality = 'poor';
            } else if (lossRate > 2 || rttMs > 150) {
              quality = 'good';
            } else if (pc.connectionState === 'connected') {
              quality = 'excellent';
            } else {
              quality = 'disconnected';
            }
            
            participantQuality[participantId] = quality;
          } catch (statsError) {
            console.warn(`Could not get stats for participant ${participantId}:`, statsError);
            participantQuality[participantId] = 'poor';
          }
        }
        
        // Update participant connection status
        setParticipants(prev => 
          prev.map(participant => ({
            ...participant,
            connectionQuality: participantQuality[participant.id] || 'disconnected'
          }))
        );
        
        // Set overall quality (lowest of all participants)
        const qualityPriority = { 'disconnected': 0, 'poor': 1, 'good': 2, 'excellent': 3 };
        const qualityValues = Object.values(participantQuality);
        
        if (qualityValues.length > 0) {
          const minQuality = qualityValues.reduce((min, quality) => 
            qualityPriority[quality as keyof typeof qualityPriority] < qualityPriority[min as keyof typeof qualityPriority] ? quality : min
          , 'excellent' as 'excellent' | 'good' | 'poor' | 'disconnected');
          
          setConnectionQuality(minQuality);
        }
      } catch (error) {
        console.error('Error monitoring group call quality:', error);
      }
    };
    
    const interval = setInterval(monitorGroupConnections, 3000);
    return () => clearInterval(interval);
  }, [isGroupCall, isInCall, participants]);

  // Audio level monitoring for "isSpeaking" detection
  useEffect(() => {
    if (!isGroupCall || !isInCall) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyzers: { [key: string]: { analyzer: AnalyserNode, source: MediaStreamAudioSourceNode } } = {};
    
    // Set up audio analyzers for each participant stream
    participants.forEach(participant => {
      if (participant.stream && participant.stream.getAudioTracks().length > 0) {
        try {
          const source = audioContext.createMediaStreamSource(participant.stream);
          const analyzer = audioContext.createAnalyser();
          analyzer.fftSize = 256;
          analyzer.smoothingTimeConstant = 0.8;
          source.connect(analyzer);
          
          analyzers[participant.id] = { analyzer, source };
        } catch (error) {
          console.warn(`Could not set up audio analyzer for participant ${participant.id}:`, error);
        }
      }
    });
    
    // Also set up for local stream
    if (localStreamRef.current && localStreamRef.current.getAudioTracks().length > 0) {
      try {
        const source = audioContext.createMediaStreamSource(localStreamRef.current);
        const analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 256;
        analyzer.smoothingTimeConstant = 0.8;
        source.connect(analyzer);
        
        analyzers['local'] = { analyzer, source };
      } catch (error) {
        console.warn('Could not set up local audio analyzer:', error);
      }
    }
    
    // Analyze audio levels
    const detectSpeaking = () => {
      const speakingParticipants: string[] = [];
      
      Object.entries(analyzers).forEach(([id, { analyzer }]) => {
        const dataArray = new Uint8Array(analyzer.frequencyBinCount);
        analyzer.getByteFrequencyData(dataArray);
        
        // Calculate audio level
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        
        // Threshold for "speaking" (adjust as needed)
        if (average > 30) {
          if (id !== 'local') {
            speakingParticipants.push(id);
          }
        }
      });
      
      // Update speaking status
      if (speakingParticipants.length > 0) {
        setParticipants(prev => 
          prev.map(participant => ({
            ...participant,
            isSpeaking: speakingParticipants.includes(participant.id)
          }))
        );
      }
    };
    
    const interval = setInterval(detectSpeaking, 200);
    
    return () => {
      clearInterval(interval);
      // Clean up audio analyzers
      Object.values(analyzers).forEach(({ source }) => {
        source.disconnect();
      });
      // Close audio context
      audioContext.close().catch(err => console.warn('Error closing audio context:', err));
    };
  }, [isGroupCall, isInCall, participants]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('VideoCallProvider unmounting, cleaning up...');
      cleanup();
    };
  }, [cleanup]);

  const value: VideoCallContextType = {
    // Call State
    currentCall,
    isInCall,
    callStatus,
    
    // Media State
    localStream,
    remoteStream,
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    
    // Call Actions
    initiateCall,
    acceptCall,
    rejectCall,
    endCall,
    
    // Media Controls
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    
    // Connection Management
    peer,
    connectionQuality,
    
    // Chat/Data Channel
    sendMessage,
    onMessageReceived,
    
    // Recording
    startRecording,
    stopRecording,
    isRecording,
    
    // Group Call Features
    initiateGroupCall,
    addParticipantToCall,
    removeParticipantFromCall,
    participants,
    isGroupCall
  };

  return (
    <VideoCallContext.Provider value={value}>
      {children}
    </VideoCallContext.Provider>
  );
};