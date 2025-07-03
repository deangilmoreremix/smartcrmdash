import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import SimplePeer from 'simple-peer';

export interface CallParticipant {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  stream?: MediaStream;
  isVideoEnabled?: boolean;
  isAudioEnabled?: boolean;
  isSpeaking?: boolean;
  isConnected?: boolean;
  peerId?: string;
}

interface PeerConnection {
  peer: SimplePeer.Instance;
  participantId: string;
  stream?: MediaStream;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
  dataChannel?: RTCDataChannel;
  lastActivity: number;
  audioLevel: number;
}

export interface CallData {
  id: string;
  caller: CallParticipant;
  recipient: CallParticipant;
  startTime: Date;
  status: 'ringing' | 'connected' | 'ended' | 'rejected';
  type: 'video' | 'audio';
  isGroup?: boolean;
  groupParticipants?: CallParticipant[];
}

interface VideoCallContextType {
  // Call State
  currentCall: CallData | null;
  isInCall: boolean;
  callStatus: 'idle' | 'calling' | 'ringing' | 'connected' | 'ending';
  isGroupCall: boolean;
  participants: CallParticipant[];
  
  // Media State
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  
  // Call Actions
  initiateCall: (recipient: CallParticipant, type: 'video' | 'audio') => Promise<void>;
  initiateGroupCall: (recipients: CallParticipant[], type: 'video' | 'audio') => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  endCall: () => void;
  addParticipantToCall: (participant: CallParticipant) => Promise<void>;
  removeParticipantFromCall: (participantId: string) => void;
  
  // Media Controls
  toggleVideo: () => void;
  toggleAudio: () => void;
  toggleScreenShare: () => Promise<void>;
  setAudioOutputDevice: (deviceId: string) => Promise<void>;
  
  // Connection Management
  peer: SimplePeer.Instance | null;
  peers: Record<string, PeerConnection>;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
  
  // Chat/Data Channel
  sendMessage: (message: string) => void;
  sendMessageToParticipant: (participantId: string, message: string) => void;
  broadcastMessage: (message: string) => void;
  onMessageReceived: (callback: (message: string, senderId: string) => void) => void;
  
  // Recording
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  isRecording: boolean;
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
  const [participants, setParticipants] = useState<CallParticipant[]>([]);
  const [isGroupCall, setIsGroupCall] = useState(false);
  
  // Media State
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Peer Connections
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
  const [peers, setPeers] = useState<Record<string, PeerConnection>>({});
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('disconnected');
  
  // Refs
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const peersRef = useRef<Record<string, PeerConnection>>({});
  const localStreamRef = useRef<MediaStream | null>(null);
  const originalStreamRef = useRef<MediaStream | null>(null);
  const messageCallbackRef = useRef<((message: string, senderId: string) => void) | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const audioDataRef = useRef<Uint8Array | null>(null);

  const isInCall = callStatus === 'connected';

  // Initialize audio analysis for speaking detection
  const initializeAudioAnalysis = useCallback((stream: MediaStream) => {
    try {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      audioAnalyserRef.current = analyser;
      audioDataRef.current = dataArray;
      
      // Start monitoring speaking status
      monitorSpeaking();
    } catch (error) {
      console.warn('Failed to initialize audio analysis:', error);
    }
  }, []);
  
  // Monitor if user is speaking
  const monitorSpeaking = useCallback(() => {
    const analyser = audioAnalyserRef.current;
    const dataArray = audioDataRef.current;
    
    if (!analyser || !dataArray) return;
    
    const checkSpeaking = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average volume level
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      
      // Update local participant speaking status if needed
      const isSpeaking = average > 30; // Threshold for speaking
      
      // Update participants if speaking status changed
      setParticipants(prev => 
        prev.map(p => 
          p.id === 'local' 
            ? { ...p, isSpeaking } 
            : p
        )
      );
      
      // Continue monitoring
      requestAnimationFrame(checkSpeaking);
    };
    
    checkSpeaking();
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log('Cleaning up video call...');
    
    // Clean up single peer connection
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
      setPeer(null);
    }
    
    // Clean up all peer connections in group calls
    Object.values(peersRef.current).forEach(peerConnection => {
      peerConnection.peer.destroy();
    });
    peersRef.current = {};
    setPeers({});
    
    // Clean up media streams
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      localStreamRef.current = null;
      setLocalStream(null);
    }
    
    if (originalStreamRef.current) {
      originalStreamRef.current.getTracks().forEach(track => track.stop());
      originalStreamRef.current = null;
    }
    
    // Stop recording if active
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    // Reset state
    setRemoteStream(null);
    setCurrentCall(null);
    setCallStatus('idle');
    setIsScreenSharing(false);
    setConnectionQuality('disconnected');
    setParticipants([]);
    setIsGroupCall(false);
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
      
      // Initialize audio analysis for speaking detection
      if (audioEnabled && audioTracks.length > 0) {
        initializeAudioAnalysis(stream);
      }
      
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
            
            // Initialize audio analysis if we have audio
            if (audioEnabled && basicStream.getAudioTracks().length > 0) {
              initializeAudioAnalysis(basicStream);
            }
            
            return basicStream;
          } catch (basicError) {
            throw new Error('Unable to access camera/microphone with any settings.');
          }
        }
      }
      
      throw new Error('Could not access camera/microphone. Please check permissions and ensure no other app is using them.');
    }
  }, [initializeAudioAnalysis]);

  // Create peer connection with real WebRTC for 1:1 calls
  const createPeer = useCallback((initiator: boolean, stream: MediaStream) => {
    console.log('Creating peer connection, initiator:', initiator);
    
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
      handleSignaling(signal, initiator);
    });

    // Handle incoming stream
    newPeer.on('stream', (stream) => {
      console.log('Remote stream received:', stream.getTracks().map(t => `${t.kind}: ${t.label || 'unlabeled'}`));
      setRemoteStream(stream);
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
      
      // Update participant with stream
      if (currentCall && !isGroupCall) {
        const updatedRecipient = {
          ...currentCall.recipient,
          stream,
          isConnected: true
        };
        
        setCurrentCall({
          ...currentCall,
          recipient: updatedRecipient
        });
      }
    });

    // Handle connection events
    newPeer.on('connect', () => {
      console.log('Peer connected successfully');
      setCallStatus('connected');
      setConnectionQuality('excellent');
    });

    // Handle data channel messages
    newPeer.on('data', (data) => {
      try {
        const message = data.toString();
        console.log('Received data:', message);
        
        const parsedData = JSON.parse(message);
        
        if (parsedData.type === 'chat' && messageCallbackRef.current) {
          messageCallbackRef.current(parsedData.content, parsedData.sender || 'unknown');
        } else if (parsedData.type === 'media-control') {
          console.log('Received media control:', parsedData);
          // Handle remote media control notifications
          
          // Update participant status for video/audio toggles
          if (parsedData.action === 'video-toggle' || parsedData.action === 'audio-toggle') {
            const isEnabled = parsedData.enabled;
            const participantId = parsedData.participantId;
            
            setParticipants(prev => 
              prev.map(p => 
                p.id === participantId 
                  ? { 
                    ...p, 
                    isVideoEnabled: parsedData.action === 'video-toggle' ? isEnabled : p.isVideoEnabled,
                    isAudioEnabled: parsedData.action === 'audio-toggle' ? isEnabled : p.isAudioEnabled
                  } 
                  : p
              )
            );
          }
        } else if (parsedData.type === 'speaking-update') {
          // Update speaking status for participant
          setParticipants(prev => 
            prev.map(p => 
              p.id === parsedData.participantId 
                ? { ...p, isSpeaking: parsedData.isSpeaking } 
                : p
            )
          );
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
        setTimeout(cleanup, 2000);
      }
    });

    // Handle close
    newPeer.on('close', () => {
      console.log('Peer connection closed');
      cleanup();
    });

    peerRef.current = newPeer;
    setPeer(newPeer);
    
    return newPeer;
  }, [cleanup, currentCall, handleSignaling, initializeAudioAnalysis, isGroupCall]);

  // Create a peer connection for a group call participant
  const createGroupPeerConnection = useCallback((participantId: string, stream: MediaStream, initiator: boolean = true) => {
    console.log(`Creating peer connection for participant ${participantId}, initiator:`, initiator);
    
    // Create the peer connection with similar config as 1:1 calls
    const config = {
      initiator,
      trickle: true, // Enable trickle ICE for faster connections
      stream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          // Add TURN servers for better connectivity
          { 
            urls: 'turn:openrelay.metered.ca:80',
            username: 'openrelayproject',
            credential: 'openrelayproject'
          }
        ]
      }
    };

    const newPeer = new SimplePeer(config);
    
    // Set up event handlers
    newPeer.on('signal', (signal) => {
      console.log(`Signal generated for participant ${participantId}:`, signal.type);
      
      // In a real app, you'd send this signal to the specific participant via a signaling server
      // For this demo, we'll simulate successful signaling
      simulateSignalingForGroupCall(participantId, signal, initiator);
    });
    
    newPeer.on('stream', (remoteStream) => {
      console.log(`Received stream from participant ${participantId}`);
      
      // Update participant with the stream
      setParticipants(prev => 
        prev.map(p => 
          p.id === participantId 
            ? { ...p, stream: remoteStream, isConnected: true } 
            : p
        )
      );
    });
    
    newPeer.on('connect', () => {
      console.log(`Connected to participant ${participantId}`);
      
      // Update connection status
      setParticipants(prev => 
        prev.map(p => 
          p.id === participantId 
            ? { ...p, isConnected: true } 
            : p
        )
      );
      
      // Store peer connection in ref
      const peerConnection: PeerConnection = {
        peer: newPeer,
        participantId,
        connectionQuality: 'excellent',
        lastActivity: Date.now(),
        audioLevel: 0
      };
      
      peersRef.current = { 
        ...peersRef.current, 
        [participantId]: peerConnection 
      };
      
      setPeers(peersRef.current);
      
      // Send initial state
      const initialState = {
        type: 'media-control',
        action: 'initial-state',
        participantId: 'local', // Your ID
        isVideoEnabled,
        isAudioEnabled,
        isSpeaking: false
      };
      
      try {
        newPeer.send(JSON.stringify(initialState));
      } catch (error) {
        console.warn('Failed to send initial state:', error);
      }
    });
    
    newPeer.on('data', (data) => {
      try {
        const message = data.toString();
        const parsedData = JSON.parse(message);
        
        if (parsedData.type === 'chat') {
          // Pass to message handler
          if (messageCallbackRef.current) {
            messageCallbackRef.current(parsedData.content, participantId);
          }
          
          // Also update UI if needed
          console.log(`Chat message from ${participantId}:`, parsedData.content);
        }
        else if (parsedData.type === 'media-control') {
          handleMediaControlMessage(parsedData, participantId);
        }
      } catch (error) {
        console.error('Error handling data from participant:', error);
      }
    });
    
    newPeer.on('error', (error) => {
      console.error(`Error in peer connection with ${participantId}:`, error);
      
      // Update connection quality
      const peerConnection = peersRef.current[participantId];
      if (peerConnection) {
        peerConnection.connectionQuality = 'poor';
        setPeers({...peersRef.current});
      }
    });
    
    newPeer.on('close', () => {
      console.log(`Connection with participant ${participantId} closed`);
      
      // Remove participant
      removeParticipantFromCall(participantId);
    });
    
    return newPeer;
  }, [isVideoEnabled, isAudioEnabled, removeParticipantFromCall, simulateSignalingForGroupCall, handleMediaControlMessage]);

  // Simulate signaling for group call (in a real app, this would use a server)
  const simulateSignalingForGroupCall = useCallback((participantId: string, signal: any, initiator: boolean) => {
    console.log(`Simulating signaling for ${participantId}, initiator: ${initiator}`);
    
    // In a real app, you'd send this signal to the participant via your signaling server
    // For this demo, we'll simulate a successful connection
    
    setTimeout(() => {
      // Simulate the participant accepting the call and sending back their signal
      if (initiator) {
        const peerConnection = peersRef.current[participantId];
        if (peerConnection && peerConnection.peer) {
          try {
            // Create a simulated answer signal
            const answerSignal = {
              type: 'answer',
              sdp: 'v=0\r\no=- 3256016840 1 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0 1\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS ZMHxrXXPEfQUBCB5QzlO6NZvmjzOSJOqlGIX\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:9rO2\r\na=ice-pwd:jZ8LoGYlEqsM4/GMO8rldjBi\r\na=ice-options:trickle\r\na=fingerprint:sha-256 4E:9C:FE:A9:69:4C:18:D1:89:29:F5:E5:31:FE:C9:85:37:38:35:17:16:3A:81:B0:FC:08:80:EB:BC:A5:F1:4D\r\na=setup:active\r\na=mid:0\r\na=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\na=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\na=recvonly\r\na=rtcp-mux\r\na=rtpmap:111 opus/48000/2\r\na=rtcp-fb:111 transport-cc\r\na=fmtp:111 minptime=10;useinbandfec=1\r\nm=video 9 UDP/TLS/RTP/SAVPF 96\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:9rO2\r\na=ice-pwd:jZ8LoGYlEqsM4/GMO8rldjBi\r\na=ice-options:trickle\r\na=fingerprint:sha-256 4E:9C:FE:A9:69:4C:18:D1:89:29:F5:E5:31:FE:C9:85:37:38:35:17:16:3A:81:B0:FC:08:80:EB:BC:A5:F1:4D\r\na=setup:active\r\na=mid:1\r\na=extmap:14 urn:ietf:params:rtp-hdrext:toffset\r\na=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\na=recvonly\r\na=rtcp-mux\r\na=rtcp-rsize\r\na=rtpmap:96 VP8/90000\r\na=rtcp-fb:96 goog-remb\r\na=rtcp-fb:96 transport-cc\r\na=rtcp-fb:96 ccm fir\r\na=rtcp-fb:96 nack\r\na=rtcp-fb:96 nack pli\r\n'
            };
            
            // Simulate receiving the answer
            console.log(`Simulating answer signal from ${participantId}`);
            peerConnection.peer.signal(answerSignal);
          } catch (error) {
            console.error(`Error in simulated signaling for ${participantId}:`, error);
          }
        }
      }
    }, 1000);
    
    // In a real implementation, this would be handled by the signaling server
    // and the remote peer would actually process the signal and respond
  }, []);

  // Handle media control messages
  const handleMediaControlMessage = useCallback((message: any, participantId: string) => {
    console.log(`Received media control from ${participantId}:`, message);
    
    // Update participant status based on message
    if (message.action === 'video-toggle' || message.action === 'audio-toggle' || message.action === 'initial-state') {
      setParticipants(prev => 
        prev.map(p => 
          p.id === participantId 
            ? { 
              ...p, 
              isVideoEnabled: message.action === 'video-toggle' ? message.enabled 
                : message.action === 'initial-state' ? message.isVideoEnabled 
                : p.isVideoEnabled,
              isAudioEnabled: message.action === 'audio-toggle' ? message.enabled 
                : message.action === 'initial-state' ? message.isAudioEnabled 
                : p.isAudioEnabled
            } 
            : p
        )
      );
    }
    else if (message.action === 'speaking-update') {
      setParticipants(prev => 
        prev.map(p => 
          p.id === participantId 
            ? { ...p, isSpeaking: message.isSpeaking } 
            : p
        )
      );
    }
  }, []);

  // Real signaling simulation using localStorage for cross-tab communication
  const handleSignaling = useCallback((signal: any, isInitiator: boolean) => {
    console.log('Handling signaling:', signal.type, 'initiator:', isInitiator);
    
    // For demo purposes, use localStorage to enable cross-tab calling
    const channelName = `webrtc-signal-${currentCall?.id || 'demo'}`;
    
    if (isInitiator) {
      // Store offer for the other peer to pick up
      localStorage.setItem(`${channelName}-offer`, JSON.stringify(signal));
      
      // Listen for answer
      const checkForAnswer = () => {
        const answer = localStorage.getItem(`${channelName}-answer`);
        if (answer && peerRef.current && !peerRef.current.destroyed) {
          try {
            peerRef.current.signal(JSON.parse(answer));
            localStorage.removeItem(`${channelName}-answer`);
            console.log('Processed answer signal');
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
        if (peerRef.current && !peerRef.current.destroyed) {
          try {
            // Create a self-connecting demo by using the same signal
            console.log('Setting up demo self-connection');
            setCallStatus('connected');
            
            // For demo, use the local stream as remote stream with some delay
            setTimeout(() => {
              if (localStreamRef.current) {
                // Clone the local stream for demo remote stream
                const clonedStream = localStreamRef.current.clone();
                setRemoteStream(clonedStream);
                setConnectionQuality('excellent');
                console.log('Demo connection established');
                
                // If this is a group call, also update participants with streams
                if (isGroupCall && currentCall?.groupParticipants) {
                  // Add streams to participants
                  setParticipants(currentCall.groupParticipants.map(participant => ({
                    ...participant,
                    stream: clonedStream.clone(),
                    isConnected: true,
                    isVideoEnabled: true,
                    isAudioEnabled: true,
                    isSpeaking: false
                  })));
                }
                
                // If 1:1 call, update recipient with stream
                else if (currentCall) {
                  const updatedRecipient = {
                    ...currentCall.recipient,
                    stream: clonedStream,
                    isConnected: true,
                    isVideoEnabled: true,
                    isAudioEnabled: true
                  };
                  
                  setCurrentCall({
                    ...currentCall,
                    recipient: updatedRecipient
                  });
                }
              }
            }, 1000);
          } catch (error) {
            console.error('Error in demo connection:', error);
          }
        }
      }, 2000);
    }
  }, [currentCall, isGroupCall]);

  // Initiate a one-on-one call
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
      setIsGroupCall(false);
      
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
  
  // Initiate a group call
  const initiateGroupCall = useCallback(async (recipients: CallParticipant[], type: 'video' | 'audio') => {
    console.log('Initiating group call with', recipients.length, 'participants, type:', type);
    
    if (recipients.length === 0) {
      throw new Error('No recipients provided for group call');
    }
    
    try {
      setCallStatus('calling');
      setIsGroupCall(true);
      
      // Create call data for group call
      const callData: CallData = {
        id: Date.now().toString(),
        caller: {
          id: 'current-user',
          name: 'John Doe',
          email: 'john@example.com'
        },
        recipient: recipients[0], // Primary recipient
        startTime: new Date(),
        status: 'ringing',
        type,
        isGroup: true,
        groupParticipants: recipients
      };
      
      setCurrentCall(callData);
      
      // Initialize empty participants list
      setParticipants([]);
      
      // Get user media
      const stream = await getUserMedia(type === 'video', true);
      
      // For demo purposes, simulate establishing connections with all participants
      setTimeout(() => {
        console.log('Setting up simulated group call connections');
        setCallStatus('connected');
        
        // Create demo peer connections for each participant
        const updatedParticipants = recipients.map(recipient => {
          // Create a new peer for this participant
          const peer = createGroupPeerConnection(recipient.id, stream, true);
          
          // Store in peersRef
          peersRef.current[recipient.id] = {
            peer,
            participantId: recipient.id,
            connectionQuality: 'excellent',
            lastActivity: Date.now(),
            audioLevel: 0
          };
          
          // Clone stream for this participant for demo purposes
          const participantStream = stream.clone();
          
          // Return updated participant info
          return {
            ...recipient,
            stream: participantStream,
            isConnected: true,
            isVideoEnabled: true,
            isAudioEnabled: true,
            isSpeaking: false,
            peerId: recipient.id
          };
        });
        
        // Update participants state
        setParticipants(updatedParticipants);
        setPeers(peersRef.current);
        
      }, 2000);
      
    } catch (error) {
      console.error('Error initiating group call:', error);
      cleanup();
      throw error;
    }
  }, [cleanup, createGroupPeerConnection, getUserMedia]);

  // Accept a call
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
    
    // Notify all peers in group call
    if (isGroupCall) {
      Object.values(peersRef.current).forEach(peerConnection => {
        try {
          peerConnection.peer.send(JSON.stringify({
            type: 'call-end',
            timestamp: new Date().toISOString(),
            participantId: 'local'
          }));
        } catch (error) {
          console.warn(`Failed to send end call to participant ${peerConnection.participantId}:`, error);
        }
      });
    }
    // Notify single peer
    else if (peerRef.current && peerRef.current.connected) {
      try {
        peerRef.current.send(JSON.stringify({
          type: 'call-end',
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Error sending call end notification:', error);
      }
    }
    
    setTimeout(() => {
      cleanup();
    }, 1000);
  }, [cleanup, isGroupCall]);

  // Add a new participant to an existing call
  const addParticipantToCall = useCallback(async (participant: CallParticipant) => {
    console.log('Adding participant to call:', participant.name);
    
    if (!isInCall || !isGroupCall || !localStreamRef.current) {
      throw new Error('Cannot add participant: not in a group call or no local stream');
    }
    
    try {
      // Create a new peer connection for this participant
      const peer = createGroupPeerConnection(participant.id, localStreamRef.current, true);
      
      // Store in peersRef
      peersRef.current[participant.id] = {
        peer,
        participantId: participant.id,
        connectionQuality: 'excellent',
        lastActivity: Date.now(),
        audioLevel: 0
      };
      
      // Update peers state
      setPeers({...peersRef.current});
      
      // Add to participants list
      setParticipants(prev => [...prev, {
        ...participant,
        isConnected: false, // Will be set to true when connection establishes
        isVideoEnabled: true,
        isAudioEnabled: true,
        isSpeaking: false
      }]);
      
      return true;
    } catch (error) {
      console.error('Failed to add participant:', error);
      throw error;
    }
  }, [isInCall, isGroupCall, createGroupPeerConnection]);

  // Remove a participant from a call
  const removeParticipantFromCall = useCallback((participantId: string) => {
    console.log('Removing participant from call:', participantId);
    
    // Destroy peer connection if exists
    if (peersRef.current[participantId]) {
      try {
        peersRef.current[participantId].peer.destroy();
      } catch (error) {
        console.warn(`Error destroying peer connection for ${participantId}:`, error);
      }
      
      // Remove from peersRef
      delete peersRef.current[participantId];
      setPeers({...peersRef.current});
    }
    
    // Remove from participants list
    setParticipants(prev => prev.filter(p => p.id !== participantId));
  }, []);

  // Toggle video with real track control
  const toggleVideo = useCallback(() => {
    console.log('Toggling video, current state:', isVideoEnabled);
    
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        console.log('Video toggled to:', videoTrack.enabled);
        
        // Notify peers about video state change
        const notifyPeers = (enabled: boolean) => {
          const message = {
            type: 'media-control',
            action: 'video-toggle',
            enabled,
            participantId: 'local',
            timestamp: new Date().toISOString()
          };
          
          // In group call, notify all peers
          if (isGroupCall) {
            Object.values(peersRef.current).forEach(peerConnection => {
              try {
                peerConnection.peer.send(JSON.stringify(message));
              } catch (error) {
                console.warn(`Failed to notify ${peerConnection.participantId} about video toggle:`, error);
              }
            });
          } 
          // In 1:1 call, notify the single peer
          else if (peerRef.current && peerRef.current.connected) {
            try {
              peerRef.current.send(JSON.stringify(message));
            } catch (error) {
              console.error('Error sending video toggle notification:', error);
            }
          }
        };
        
        notifyPeers(videoTrack.enabled);
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
        
        // Notify peers about audio state change
        const notifyPeers = (enabled: boolean) => {
          const message = {
            type: 'media-control',
            action: 'audio-toggle',
            enabled,
            participantId: 'local',
            timestamp: new Date().toISOString()
          };
          
          // In group call, notify all peers
          if (isGroupCall) {
            Object.values(peersRef.current).forEach(peerConnection => {
              try {
                peerConnection.peer.send(JSON.stringify(message));
              } catch (error) {
                console.warn(`Failed to notify ${peerConnection.participantId} about audio toggle:`, error);
              }
            });
          } 
          // In 1:1 call, notify the single peer
          else if (peerRef.current && peerRef.current.connected) {
            try {
              peerRef.current.send(JSON.stringify(message));
            } catch (error) {
              console.error('Error sending audio toggle notification:', error);
            }
          }
        };
        
        notifyPeers(audioTrack.enabled);
      } else {
        console.log('No audio track found');
      }
    }
  }, [isAudioEnabled, isGroupCall]);

  // Toggle screen sharing
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
        
        // Replace video track in all peer connections
        const videoTrack = screenStream.getVideoTracks()[0];
        
        if (videoTrack) {
          // For group calls, replace track in all peer connections
          if (isGroupCall) {
            Object.values(peersRef.current).forEach(peerConnection => {
              try {
                const pc = (peerConnection.peer as any)._pc;
                if (pc) {
                  const senders = pc.getSenders();
                  const videoSender = senders.find((sender: RTCRtpSender) => 
                    sender.track && sender.track.kind === 'video'
                  );
                  
                  if (videoSender && videoTrack) {
                    videoSender.replaceTrack(videoTrack);
                    console.log(`Screen share track replaced for participant ${peerConnection.participantId}`);
                  }
                }
              } catch (error) {
                console.error(`Error replacing track for participant ${peerConnection.participantId}:`, error);
              }
            });
          }
          // For 1:1 calls, replace track in the single peer connection
          else if (peerRef.current) {
            const pc = (peerRef.current as any)._pc;
            if (pc) {
              const senders = pc.getSenders();
              const videoSender = senders.find((sender: RTCRtpSender) => 
                sender.track && sender.track.kind === 'video'
              );
              
              if (videoSender) {
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
              }
            }
          }
          
          // Update local stream
          if (localStreamRef.current) {
            const audioTracks = localStreamRef.current.getAudioTracks();
            const newStreamTracks = [videoTrack, ...audioTracks];
            const newStream = new MediaStream(newStreamTracks);
            
            localStreamRef.current = newStream;
            setLocalStream(newStream);
          }
        }
        
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
          localStreamRef.current.getVideoTracks().forEach(track => {
            console.log('Stopping screen share track:', track.kind);
            track.stop();
          });
        }
        
        // Restore original camera stream
        if (originalStreamRef.current) {
          const videoTrack = originalStreamRef.current.getVideoTracks()[0];
          
          // Replace track back to camera in all peer connections
          if (isGroupCall) {
            Object.values(peersRef.current).forEach(async (peerConnection) => {
              try {
                const pc = (peerConnection.peer as any)._pc;
                if (pc && videoTrack) {
                  const senders = pc.getSenders();
                  const videoSender = senders.find((sender: RTCRtpSender) => 
                    sender.track && sender.track.kind === 'video'
                  );
                  
                  if (videoSender) {
                    await videoSender.replaceTrack(videoTrack);
                    console.log(`Camera track restored for participant ${peerConnection.participantId}`);
                    
                    // Notify peer
                    try {
                      peerConnection.peer.send(JSON.stringify({
                        type: 'media-control',
                        action: 'screen-share-stop',
                        participantId: 'local',
                        timestamp: new Date().toISOString()
                      }));
                    } catch (err) {
                      console.warn(`Failed to notify participant ${peerConnection.participantId} about screen share stop:`, err);
                    }
                  }
                }
              } catch (error) {
                console.error(`Error restoring camera track for participant ${peerConnection.participantId}:`, error);
              }
            });
          }
          // For 1:1 call
          else if (peerRef.current) {
            const pc = (peerRef.current as any)._pc;
            if (pc && videoTrack) {
              const senders = pc.getSenders();
              const videoSender = senders.find((sender: RTCRtpSender) => 
                sender.track && sender.track.kind === 'video'
              );
              
              if (videoSender) {
                try {
                  await videoSender.replaceTrack(videoTrack);
                  console.log('Camera track restored successfully in peer connection');
                  
                  // Notify remote peer
                  peerRef.current.send(JSON.stringify({
                    type: 'media-control',
                    action: 'screen-share-stop',
                    timestamp: new Date().toISOString()
                  }));
                } catch (replaceError) {
                  console.error('Error restoring camera track:', replaceError);
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

  // Change audio output device
  const setAudioOutputDevice = useCallback(async (deviceId: string) => {
    try {
      const videoElements = document.querySelectorAll('video, audio') as NodeListOf<HTMLMediaElement>;
      
      for (const element of videoElements) {
        if ('setSinkId' in element) {
          // @ts-ignore - setSinkId is not in the type definitions
          await element.setSinkId(deviceId);
        }
      }
      
      console.log('Audio output device changed successfully');
      return true;
    } catch (error) {
      console.error('Error changing audio output device:', error);
      throw error;
    }
  }, []);

  // Start call recording
  const startRecording = useCallback(async () => {
    if (!isInCall) {
      throw new Error('Cannot start recording: not in call');
    }

    try {
      console.log('Starting call recording...');
      
      // Create combined stream for recording
      const combinedStream = new MediaStream();
      
      // Add local tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          combinedStream.addTrack(track);
        });
      }

      // For 1:1 calls, add remote tracks
      if (!isGroupCall && remoteStream) {
        remoteStream.getTracks().forEach(track => {
          combinedStream.addTrack(track);
        });
      }
      
      // For group calls, try to add all participant streams
      // Note: This is a simplified approach, and might not capture all participants perfectly
      if (isGroupCall) {
        participants
          .filter(p => p.stream && p.id !== 'local')
          .slice(0, 3) // Limit to first 3 participants to avoid performance issues
          .forEach(participant => {
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
      
      // Notify participants about recording
      if (isGroupCall) {
        Object.values(peersRef.current).forEach(peerConnection => {
          try {
            peerConnection.peer.send(JSON.stringify({
              type: 'recording-state',
              isRecording: true,
              timestamp: new Date().toISOString()
            }));
          } catch (error) {
            console.warn(`Failed to notify participant ${peerConnection.participantId} about recording:`, error);
          }
        });
      } else if (peerRef.current && peerRef.current.connected) {
        peerRef.current.send(JSON.stringify({
          type: 'recording-state',
          isRecording: true,
          timestamp: new Date().toISOString()
        }));
      }
      
      console.log('Recording started successfully');

    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      throw error;
    }
  }, [isInCall, isGroupCall, remoteStream, participants]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('Stopping recording...');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Notify participants about recording stopped
      if (isGroupCall) {
        Object.values(peersRef.current).forEach(peerConnection => {
          try {
            peerConnection.peer.send(JSON.stringify({
              type: 'recording-state',
              isRecording: false,
              timestamp: new Date().toISOString()
            }));
          } catch (error) {
            console.warn(`Failed to notify participant ${peerConnection.participantId} about recording stop:`, error);
          }
        });
      } else if (peerRef.current && peerRef.current.connected) {
        peerRef.current.send(JSON.stringify({
          type: 'recording-state',
          isRecording: false,
          timestamp: new Date().toISOString()
        }));
      }
    }
  }, [isRecording, isGroupCall]);

  // Send message to all participants in a group call
  const broadcastMessage = useCallback((message: string) => {
    console.log('Broadcasting message to all participants:', message);
    
    if (!isGroupCall) {
      console.warn('Cannot broadcast: not in a group call');
      return;
    }
    
    const messageData = {
      type: 'chat',
      content: message,
      sender: 'local',
      timestamp: new Date().toISOString()
    };
    
    // Send to all peers
    Object.values(peersRef.current).forEach(peerConnection => {
      try {
        peerConnection.peer.send(JSON.stringify(messageData));
      } catch (error) {
        console.warn(`Failed to send message to participant ${peerConnection.participantId}:`, error);
      }
    });
  }, [isGroupCall]);

  // Send message to a specific participant in a group call
  const sendMessageToParticipant = useCallback((participantId: string, message: string) => {
    console.log(`Sending message to participant ${participantId}:`, message);
    
    const peerConnection = peersRef.current[participantId];
    if (!peerConnection || !peerConnection.peer.connected) {
      console.warn(`Cannot send message: no connection to participant ${participantId}`);
      return;
    }
    
    const messageData = {
      type: 'chat',
      content: message,
      sender: 'local',
      timestamp: new Date().toISOString()
    };
    
    try {
      peerConnection.peer.send(JSON.stringify(messageData));
    } catch (error) {
      console.error(`Error sending message to participant ${participantId}:`, error);
      throw new Error('Failed to send message');
    }
  }, []);

  // Send message (1:1 or via broadcast in group)
  const sendMessage = useCallback((message: string) => {
    if (isGroupCall) {
      broadcastMessage(message);
    } else if (peerRef.current && peerRef.current.connected) {
      try {
        const messageData = {
          type: 'chat',
          content: message,
          sender: 'local',
          timestamp: new Date().toISOString()
        };
        
        peerRef.current.send(JSON.stringify(messageData));
      } catch (error) {
        console.error('Error sending message:', error);
        throw new Error('Failed to send message');
      }
    } else {
      console.warn('Cannot send message: peer not connected');
      throw new Error('Peer not connected');
    }
  }, [isGroupCall, broadcastMessage]);

  // Set message received callback
  const onMessageReceived = useCallback((callback: (message: string, senderId: string) => void) => {
    messageCallbackRef.current = callback;
  }, []);

  // Real connection quality monitoring for all peer connections
  useEffect(() => {
    if (!isInCall) return;

    const monitorConnections = async () => {
      try {
        // For 1:1 calls
        if (peerRef.current && !isGroupCall) {
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

          setConnectionQuality(quality);
        }
        
        // For group calls, monitor each peer connection
        if (isGroupCall) {
          for (const [participantId, peerConnection] of Object.entries(peersRef.current)) {
            try {
              const pc = (peerConnection.peer as any)?._pc;
              if (!pc) continue;

              const stats = await pc.getStats();
              let packetsLost = 0;
              let packetsReceived = 0;
              let rtt = 0;
              let audioLevel = 0;

              stats.forEach((report: any) => {
                if (report.type === 'inbound-rtp') {
                  packetsLost += report.packetsLost || 0;
                  packetsReceived += report.packetsReceived || 0;
                  
                  // Check for audio level (speaking detection)
                  if (report.mediaType === 'audio' && report.audioLevel) {
                    audioLevel = report.audioLevel;
                    
                    // Check if speaking state changed
                    const isSpeaking = audioLevel > 0.05; // Threshold for speaking
                    const participant = participants.find(p => p.id === participantId);
                    
                    if (participant && participant.isSpeaking !== isSpeaking) {
                      // Update participant speaking state
                      setParticipants(prev => 
                        prev.map(p => 
                          p.id === participantId 
                            ? { ...p, isSpeaking } 
                            : p
                        )
                      );
                    }
                  }
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

              // Update peer connection quality
              if (peerConnection.connectionQuality !== quality) {
                peerConnection.connectionQuality = quality;
                // Create a new object to trigger state update
                peersRef.current = { ...peersRef.current };
                setPeers(peersRef.current);
              }
              
              // Update audio level
              peerConnection.audioLevel = audioLevel;
            } catch (error) {
              console.warn(`Error monitoring connection for participant ${participantId}:`, error);
            }
          }
        }
      } catch (error) {
        console.error('Error monitoring connections:', error);
      }
    };

    const interval = setInterval(monitorConnections, 2000);
    return () => clearInterval(interval);
  }, [isInCall, isGroupCall, participants]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('VideoCallProvider unmounting, cleaning up...');
      cleanup();
    };
  }, [cleanup]);

  // Create the context value
  const value: VideoCallContextType = {
    // Call State
    currentCall,
    isInCall,
    callStatus,
    isGroupCall,
    participants,
    
    // Media State
    localStream,
    remoteStream,
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    
    // Call Actions
    initiateCall,
    initiateGroupCall,
    acceptCall,
    rejectCall,
    endCall,
    addParticipantToCall,
    removeParticipantFromCall,
    
    // Media Controls
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    setAudioOutputDevice,
    
    // Connection Management
    peer,
    peers,
    connectionQuality,
    
    // Chat/Data Channel
    sendMessage,
    sendMessageToParticipant,
    broadcastMessage,
    onMessageReceived,
    
    // Recording
    startRecording,
    stopRecording,
    isRecording
  };

  return (
    <VideoCallContext.Provider value={value}>
      {children}
    </VideoCallContext.Provider>
  );
};