import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useOpenAI } from '../services/openaiService';
import messagingService from '../services/messagingService';
import { videoEnhancementService, VideoEnhancementOptions } from '../services/videoEnhancementService';
import {
  Video,
  Download,
  Trash,
  Play,
  Pause,
  RefreshCw,
  Camera,
  X,
  Check,
  Clock,
  Scissors,
  FileVideo,
  Copy,
  Mail,
  Sliders,
  PenTool,
  List,
  Brain,
  Settings,
  ChevronRight,
  ChevronLeft,
  Upload as UploadIcon,
  Edit,
  Link,
  AlertCircle,
  MessageSquare,
  Share2,
  Send,
  UserCircle,
  BarChart3,
  Lightbulb,
  Eye,
  Mic,
  Monitor,
  Square,
  RotateCcw,
  Timer,
  HardDrive,
  Wifi,
  Zap,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Layers,
  Smartphone,
  MonitorSpeaker,
  Upload,
  Download as DownloadIcon,
  Crop,
  Palette,
  Sparkles,
  Target,
  TrendingUp,
  Activity,
  Gauge,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface VideoRecordingData {
  id: string;
  blob: Blob;
  url: string;
  duration: number;
  timestamp: Date;
  title: string;
  recipients?: string[];
  status?: 'draft' | 'sent' | 'processing' | 'ready';
  thumbnailUrl?: string;
  size: number;
  viewCount?: number;
  watchTimePercentage?: number;
  codec?: string;
  resolution?: string;
  bitrate?: number;
  fileSize?: number;
  uploadProgress?: number;
  isScreenRecording?: boolean;
  isPictureInPicture?: boolean;
  cameraDeviceId?: string;
  microphoneDeviceId?: string;
  systemAudioEnabled?: boolean;
  recordingQuality?: 'low' | 'medium' | 'high' | 'ultra';
  chunks?: Blob[];
  transcript?: string;
  captions?: CaptionData[];
  aiAnalysis?: AIAnalysisData;
  thumbnailVariants?: ThumbnailVariant[];
  engagement?: EngagementData;
}

interface CaptionData {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  language: string;
  confidence: number;
}

interface AIAnalysisData {
  sentiment: number;
  engagementScore: number;
  facialExpressions: FacialExpressionData[];
  speakingPace: number;
  fillerWords: string[];
  recommendations: string[];
  confidence: number;
}

interface FacialExpressionData {
  timestamp: number;
  expression: string;
  confidence: number;
  intensity: number;
}

interface ThumbnailVariant {
  id: string;
  url: string;
  type: 'auto' | 'ai-generated' | 'custom' | 'ai-optimized';
  engagement: number;
  clicks: number;
  impressions: number;
}

interface EngagementData {
  views: number;
  completionRate: number;
  averageWatchTime: number;
  clickThroughRate: number;
  heatMap: HeatMapPoint[];
}

interface HeatMapPoint {
  timestamp: number;
  engagement: number;
}

interface TalkingPoint {
  id: string;
  text: string;
  completed: boolean;
}

const VideoEmail: React.FC = () => {
  // Video Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState<VideoRecordingData[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<VideoRecordingData | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [combinedStream, setCombinedStream] = useState<MediaStream | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Recording Configuration States
  const [recordingMode, setRecordingMode] = useState<'camera' | 'screen' | 'picture-in-picture'>('camera');
  const [selectedCodec, setSelectedCodec] = useState('video/webm');
  const [recordingQuality, setRecordingQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');
  const [countdownDuration, setCountdownDuration] = useState(3);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [countdownTime, setCountdownTime] = useState(0);
  const [fileSize, setFileSize] = useState(0);
  const [bandwidthUsage, setBandwidthUsage] = useState(0);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [availableMicrophones, setAvailableMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [selectedMicrophoneId, setSelectedMicrophoneId] = useState<string>('');
  const [systemAudioEnabled, setSystemAudioEnabled] = useState(false);

  // Video Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Email Composition States
  const [emailRecipients, setEmailRecipients] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [showEmailComposer, setShowEmailComposer] = useState(false);

  // Talking Points States
  const [talkingPoints, setTalkingPoints] = useState<TalkingPoint[]>([]);
  const [showTalkingPoints, setShowTalkingPoints] = useState(false);
  const [isGeneratingTalkingPoints, setIsGeneratingTalkingPoints] = useState(false);

  // Player States
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // AI Enhancement States
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Script and Teleprompter States
  const [script, setScript] = useState('');
  const [showTeleprompter, setShowTeleprompter] = useState(false);
  const [teleprompterSpeed, setTeleprompterSpeed] = useState(1);
  const [teleprompterFontSize, setTeleprompterFontSize] = useState(24);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [scriptTemplates, setScriptTemplates] = useState<any[]>([]);
  const [currentScriptPosition, setCurrentScriptPosition] = useState(0);

  // Thumbnail and Caption States
  const [thumbnails, setThumbnails] = useState<ThumbnailVariant[]>([]);
  const [captions, setCaptions] = useState<CaptionData[]>([]);
  const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false);
  const [isTranscribingCaptions, setIsTranscribingCaptions] = useState(false);

  // Video Enhancement States
  const [enhancementOptions, setEnhancementOptions] = useState<VideoEnhancementOptions>({
    autoCrop: false,
    backgroundBlur: false,
    backgroundReplace: false,
    noiseReduction: false,
    colorCorrection: false,
    lightingOptimization: false,
    stabilization: false,
    watermark: undefined,
    compression: { quality: 'high' }
  });
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementResult, setEnhancementResult] = useState<any>(null);
  const [backgroundImages, setBackgroundImages] = useState<string[]>([
    '/api/placeholder/1920/1080', // Virtual office
    '/api/placeholder/1920/1080', // Gradient background
    '/api/placeholder/1920/1080', // Nature background
  ]);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const screenRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileSizeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Errors and UI states
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'record' | 'library' | 'analytics'>('record');

  // AI Services
  const openai = useOpenAI();

  // Initialize video enhancement service
  useEffect(() => {
    videoEnhancementService.initialize().catch(console.error);
  }, []);
  
  // Mock recipients for demo
  const availableRecipients = [
    { email: "john.doe@acme.com", name: "John Doe", company: "Acme Inc", position: "CTO" },
    { email: "sarah.smith@globex.com", name: "Sarah Smith", company: "Globex Corp", position: "Marketing Director" },
    { email: "mike.johnson@initech.com", name: "Mike Johnson", company: "Initech", position: "CEO" }
  ];
  
  // Initialize device enumeration
  const enumerateDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      const microphones = devices.filter(device => device.kind === 'audioinput');

      setAvailableCameras(cameras);
      setAvailableMicrophones(microphones);

      if (cameras.length > 0 && !selectedCameraId) {
        setSelectedCameraId(cameras[0].deviceId);
      }
      if (microphones.length > 0 && !selectedMicrophoneId) {
        setSelectedMicrophoneId(microphones[0].deviceId);
      }
    } catch (err) {
      console.error('Error enumerating devices:', err);
    }
  };

  // Initialize video recorder with enhanced features
  const initializeRecorder = async () => {
    try {
      await enumerateDevices();

      const constraints: MediaStreamConstraints = {
        video: recordingMode !== 'screen' ? {
          deviceId: selectedCameraId ? { exact: selectedCameraId } : undefined,
          width: { ideal: getResolutionForQuality(recordingQuality).width },
          height: { ideal: getResolutionForQuality(recordingQuality).height },
          frameRate: { ideal: 30 }
        } : false,
        audio: !isMuted ? {
          deviceId: selectedMicrophoneId ? { exact: selectedMicrophoneId } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : false
      };

      let stream: MediaStream;

      if (recordingMode === 'screen' || recordingMode === 'picture-in-picture') {
        // Get screen sharing stream
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 }
          },
          audio: systemAudioEnabled
        });

        setScreenStream(screenStream);

        if (recordingMode === 'picture-in-picture' && constraints.video) {
          // Get camera stream for picture-in-picture
          const cameraStream = await navigator.mediaDevices.getUserMedia({
            video: constraints.video as MediaTrackConstraints,
            audio: false
          });

          setVideoStream(cameraStream);

          // Combine streams for picture-in-picture
          stream = await combineStreamsForPictureInPicture(screenStream, cameraStream);
        } else {
          stream = screenStream;
        }
      } else {
        // Regular camera recording
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        setVideoStream(stream);
      }

      setCombinedStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Initialize MediaRecorder with selected codec
      const options: MediaRecorderOptions = {
        mimeType: selectedCodec,
        videoBitsPerSecond: getBitrateForQuality(recordingQuality)
      };

      const mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          setFileSize(prev => prev + e.data.size);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: selectedCodec });
        const url = URL.createObjectURL(blob);

        const newRecording: VideoRecordingData = {
          id: Date.now().toString(),
          blob,
          url,
          duration: recordingTime,
          timestamp: new Date(),
          title: `Video Recording - ${new Date().toLocaleDateString()}`,
          size: blob.size,
          codec: selectedCodec,
          resolution: `${getResolutionForQuality(recordingQuality).width}x${getResolutionForQuality(recordingQuality).height}`,
          bitrate: getBitrateForQuality(recordingQuality),
          fileSize: blob.size,
          isScreenRecording: recordingMode === 'screen' || recordingMode === 'picture-in-picture',
          isPictureInPicture: recordingMode === 'picture-in-picture',
          cameraDeviceId: selectedCameraId,
          microphoneDeviceId: selectedMicrophoneId,
          systemAudioEnabled,
          recordingQuality,
          chunks: chunksRef.current,
          status: 'ready'
        };

        setRecordings(prev => [newRecording, ...prev]);
        setSelectedRecording(newRecording);
        chunksRef.current = [];

        // Stop all streams
        stopAllStreams();
      };

      mediaRecorderRef.current = mediaRecorder;

    } catch (err) {
      setError('Error accessing media devices: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error accessing media devices:', err);
    }
  };

  // Helper functions for recording configuration
  const getResolutionForQuality = (quality: string) => {
    switch (quality) {
      case 'low': return { width: 640, height: 480 };
      case 'medium': return { width: 1280, height: 720 };
      case 'high': return { width: 1920, height: 1080 };
      case 'ultra': return { width: 3840, height: 2160 };
      default: return { width: 1920, height: 1080 };
    }
  };

  const getBitrateForQuality = (quality: string) => {
    switch (quality) {
      case 'low': return 1000000; // 1 Mbps
      case 'medium': return 2500000; // 2.5 Mbps
      case 'high': return 5000000; // 5 Mbps
      case 'ultra': return 15000000; // 15 Mbps
      default: return 5000000;
    }
  };

  const combineStreamsForPictureInPicture = async (screenStream: MediaStream, cameraStream: MediaStream): Promise<MediaStream> => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Canvas not available');

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    canvas.width = 1920;
    canvas.height = 1080;

    const screenVideo = document.createElement('video');
    const cameraVideo = document.createElement('video');

    screenVideo.srcObject = screenStream;
    cameraVideo.srcObject = cameraStream;

    await Promise.all([
      new Promise(resolve => { screenVideo.onloadedmetadata = resolve; }),
      new Promise(resolve => { cameraVideo.onloadedmetadata = resolve; })
    ]);

    screenVideo.play();
    cameraVideo.play();

    const stream = canvas.captureStream(30);

    const draw = () => {
      // Draw screen
      ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);

      // Draw camera in picture-in-picture (bottom right corner)
      const pipWidth = 320;
      const pipHeight = 240;
      const pipX = canvas.width - pipWidth - 20;
      const pipY = canvas.height - pipHeight - 20;

      ctx.drawImage(cameraVideo, pipX, pipY, pipWidth, pipHeight);

      // Add border to PIP
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.strokeRect(pipX, pipY, pipWidth, pipHeight);

      requestAnimationFrame(draw);
    };

    draw();

    return stream;
  };

  const stopAllStreams = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    }
    if (combinedStream) {
      combinedStream.getTracks().forEach(track => track.stop());
      setCombinedStream(null);
    }
  };
  
  // Start recording with countdown
  const startRecording = async () => {
    if (countdownDuration > 0) {
      setIsCountdownActive(true);
      setCountdownTime(countdownDuration);

      countdownRef.current = setInterval(() => {
        setCountdownTime(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current!);
            setIsCountdownActive(false);
            startRecordingImmediately();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      await startRecordingImmediately();
    }
  };

  const startRecordingImmediately = async () => {
    if (mediaRecorderRef.current && combinedStream) {
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setFileSize(0);
      setBandwidthUsage(0);

      // Start file size monitoring
      fileSizeIntervalRef.current = setInterval(() => {
        setBandwidthUsage(prev => prev + (getBitrateForQuality(recordingQuality) / 8 / 1024 / 1024)); // MB per second
      }, 1000);

      // Start the timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      chunksRef.current = [];
      mediaRecorderRef.current.start(1000);

      // Start real-time speech recognition if enabled
      if (showTeleprompter && 'webkitSpeechRecognition' in window) {
        startSpeechRecognition();
      }
    } else {
      await initializeRecorder().then(() => {
        if (mediaRecorderRef.current) {
          setIsRecording(true);
          setIsPaused(false);
          setRecordingTime(0);
          setFileSize(0);
          setBandwidthUsage(0);

          // Start file size monitoring
          fileSizeIntervalRef.current = setInterval(() => {
            setBandwidthUsage(prev => prev + (getBitrateForQuality(recordingQuality) / 8 / 1024 / 1024));
          }, 1000);

          // Start the timer
          timerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
          }, 1000);

          chunksRef.current = [];
          mediaRecorderRef.current.start(1000);

          // Start real-time speech recognition if enabled
          if (showTeleprompter && 'webkitSpeechRecognition' in window) {
            startSpeechRecognition();
          }
        }
      });
    }
  };

  // Start speech recognition for real-time transcription
  const startSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscription(finalTranscript + interimTranscript);

        // Update script position based on speech
        if (script && finalTranscript) {
          const words = script.split(' ');
          const spokenWords = finalTranscript.split(' ');
          const position = Math.min(spokenWords.length, words.length - 1);
          setCurrentScriptPosition(position);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      recognition.start();
      speechRecognitionRef.current = recognition;
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    // Stop speech recognition
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      speechRecognitionRef.current = null;
    }

    // Stop the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Stop file size monitoring
    if (fileSizeIntervalRef.current) {
      clearInterval(fileSizeIntervalRef.current);
      fileSizeIntervalRef.current = null;
    }

    setIsRecording(false);
    setIsPaused(false);
  };

  // Pause/Resume recording
  const togglePauseRecording = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);

        // Resume timer
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);

        // Pause timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }
  };

  // Cancel recording
  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    // Stop speech recognition
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      speechRecognitionRef.current = null;
    }

    // Clear chunks
    chunksRef.current = [];

    // Stop the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Stop file size monitoring
    if (fileSizeIntervalRef.current) {
      clearInterval(fileSizeIntervalRef.current);
      fileSizeIntervalRef.current = null;
    }

    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setFileSize(0);
    setBandwidthUsage(0);

    // Stop all streams
    stopAllStreams();
  };
  
  // Format time (seconds to MM:SS)
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Generate talking points using AI
  const generateTalkingPoints = async () => {
    setIsGeneratingTalkingPoints(true);

    try {
      const prompt = `Generate 5-7 key talking points for a professional video email. Each point should be concise and actionable. Focus on business communication best practices.`;

      const response = await fetch('/api/openai-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 500,
          response_format: { type: "text" }
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || 'Error generating content';

      const points = content.split('\n').filter((point: string) =>
        point.trim() && !point.match(/^\d+\./) && point.length > 10
      ).slice(0, 7);

      const newTalkingPoints: TalkingPoint[] = points.map((point: string, index: number) => ({
        id: `point-${Date.now()}-${index}`,
        text: point.trim(),
        completed: false
      }));

      setTalkingPoints(newTalkingPoints);
    } catch (error) {
      console.error("Failed to generate talking points:", error);
      // Fallback to mock data
      const mockTalkingPoints = [
        "Introduce yourself and company background",
        "Highlight key product benefits and value proposition",
        "Address potential customer pain points",
        "Present competitive advantages and differentiators",
        "Conclude with clear call-to-action and next steps"
      ];

      const newTalkingPoints: TalkingPoint[] = mockTalkingPoints.map((point: string, index: number) => ({
        id: `point-${Date.now()}-${index}`,
        text: point,
        completed: false
      }));

      setTalkingPoints(newTalkingPoints);
    } finally {
      setIsGeneratingTalkingPoints(false);
    }
  };

  // Generate AI script
  const generateAIScript = async (params: {
    recipient?: any;
    purpose?: string;
    tone?: string;
    length?: number;
  }) => {
    setIsGeneratingScript(true);

    try {
      const prompt = `Generate a compelling video email script with the following specifications:

Recipient: ${params.recipient?.name || 'Professional Contact'} (${params.recipient?.company || 'Company'})
Purpose: ${params.purpose || 'Business communication'}
Tone: ${params.tone || 'Professional'}
Length: ${params.length || 60} seconds

Create a natural, engaging script that includes:
1. Strong opening hook
2. Clear value proposition
3. Specific call-to-action
4. Professional closing

Format as a script with timing notes.`;

      const scriptResponse = await fetch('/api/openai-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
          max_tokens: 1000,
          response_format: { type: "text" }
        })
      });

      if (!scriptResponse.ok) {
        throw new Error(`API error: ${scriptResponse.status}`);
      }

      const scriptData = await scriptResponse.json();
      const scriptContent = scriptData.choices?.[0]?.message?.content || 'Error generating script';

      setScript(scriptContent);
      setScriptTemplates(prev => [...prev, {
        id: Date.now().toString(),
        name: `${params.purpose || 'Custom'} Script`,
        content: scriptContent,
        recipient: params.recipient,
        created: new Date()
      }]);
    } catch (error) {
      console.error("Failed to generate AI script:", error);
      setScript("Error generating script. Please try again.");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Analyze video with AI
  const analyzeVideoWithAI = async (videoBlob: Blob) => {
    setIsAnalyzing(true);

    try {
      // Convert blob to base64 for analysis
      const base64 = await blobToBase64(videoBlob);

      const prompt = `Analyze this video for:
1. Overall sentiment and tone
2. Speaking pace and clarity
3. Facial expressions and body language
4. Content engagement potential
5. Recommendations for improvement

Provide a detailed analysis in JSON format.`;

      const analysisResponse = await fetch('/api/openai-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 800,
          response_format: { type: "json_object" }
        })
      });

      if (!analysisResponse.ok) {
        throw new Error(`API error: ${analysisResponse.status}`);
      }

      const analysisData = await analysisResponse.json();
      const analysisContent = analysisData.choices?.[0]?.message?.content || '{}';

      const analysis = JSON.parse(analysisContent);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error("Failed to analyze video:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate thumbnails with AI optimization
  const generateThumbnails = async (videoBlob: Blob) => {
    setIsGeneratingThumbnails(true);

    try {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(videoBlob);

      await new Promise(resolve => {
        video.onloadedmetadata = resolve;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 320;
      canvas.height = 180;

      const thumbnails: ThumbnailVariant[] = [];
      const intervals = [0.25, 0.5, 0.75]; // 25%, 50%, 75% through video

      // Generate basic thumbnails
      for (const interval of intervals) {
        video.currentTime = video.duration * interval;
        await new Promise(resolve => {
          video.onseeked = resolve;
        });

        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailBlob = await new Promise<Blob>(resolve =>
          canvas.toBlob(resolve as BlobCallback, 'image/jpeg', 0.8)
        );

        thumbnails.push({
          id: `thumb-${Date.now()}-${interval}`,
          url: URL.createObjectURL(thumbnailBlob),
          type: 'auto',
          engagement: Math.random() * 100, // Mock engagement score
          clicks: 0,
          impressions: 0
        });
      }

      // Use AI to optimize thumbnail selection
      const optimizedThumbnails = await optimizeThumbnailsWithAI(thumbnails, videoBlob);
      setThumbnails(optimizedThumbnails);
    } catch (error) {
      console.error("Failed to generate thumbnails:", error);
    } finally {
      setIsGeneratingThumbnails(false);
    }
  };

  // AI-powered thumbnail optimization
  const optimizeThumbnailsWithAI = async (thumbnails: ThumbnailVariant[], videoBlob: Blob): Promise<ThumbnailVariant[]> => {
    try {
      // Convert video to base64 for AI analysis (first few seconds)
      const video = document.createElement('video');
      video.src = URL.createObjectURL(videoBlob);
      await new Promise(resolve => video.onloadedmetadata);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 640;
      canvas.height = 360;

      // Capture frames at different intervals for AI analysis
      const frames: string[] = [];
      const intervals = [0.1, 0.3, 0.5, 0.7, 0.9];

      for (const interval of intervals) {
        video.currentTime = video.duration * interval;
        await new Promise(resolve => video.onseeked = resolve);

        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frameData = canvas.toDataURL('image/jpeg', 0.8);
        frames.push(frameData);
      }

      // Use AI to analyze frames and suggest optimal thumbnails
      const prompt = `Analyze these video frames and suggest which ones would make the best thumbnails for engagement. Consider:
1. Facial expressions (smiling, confident)
2. Action/movement in frame
3. Text/logos visibility
4. Overall composition
5. Emotional appeal

Frames: ${frames.map((frame, i) => `Frame ${i + 1}: ${frame.substring(0, 100)}...`).join('\n')}

Return a JSON object with recommended frame indices and engagement scores.`;

      const response = await fetch('/api/openai-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 300,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`AI analysis failed: ${response.status}`);
      }

      const data = await response.json();
      const analysis = JSON.parse(data.choices[0].message.content);

      // Apply AI recommendations to thumbnails
      return thumbnails.map((thumb, index) => ({
        ...thumb,
        engagement: analysis.recommendedFrames?.[index]?.score || thumb.engagement,
        type: analysis.recommendedFrames?.[index]?.recommended ? 'ai-optimized' : 'auto'
      }));

    } catch (error) {
      console.error("AI thumbnail optimization failed:", error);
      return thumbnails; // Return original thumbnails if AI fails
    }
  };

  // A/B testing for thumbnails
  const runThumbnailABTest = async (thumbnails: ThumbnailVariant[]): Promise<ThumbnailVariant[]> => {
    // Create test variants
    const testVariants = thumbnails.map(thumb => ({
      ...thumb,
      testGroup: Math.random() > 0.5 ? 'A' : 'B',
      impressions: 0,
      clicks: 0
    }));

    // In a real implementation, this would track actual user interactions
    // For now, simulate A/B test results
    return testVariants.map(variant => ({
      ...variant,
      engagement: variant.testGroup === 'A' ? variant.engagement * 1.2 : variant.engagement * 0.8,
      clicks: Math.floor(Math.random() * 50),
      impressions: Math.floor(Math.random() * 200)
    }));
  };

  // Transcribe video to captions with multi-language support
  const transcribeVideo = async (videoBlob: Blob) => {
    setIsTranscribingCaptions(true);

    try {
      // Convert video to audio for transcription
      const audioBlob = await extractAudioFromVideo(videoBlob);

      // Use Web Speech API for real-time transcription during recording
      // For post-processing, we'd use a more robust service
      const transcription = await transcribeAudio(audioBlob);

      // Generate captions with timestamps
      const captions = await generateCaptions(transcription);

      // Translate to multiple languages if needed
      const translatedCaptions = await translateCaptions(captions, ['es', 'fr', 'de']);

      setCaptions([...captions, ...translatedCaptions]);
      setTranscription(transcription.text);
    } catch (error) {
      console.error("Failed to transcribe video:", error);
      // Fallback to mock data
      const mockCaptions: CaptionData[] = [
        {
          id: 'caption-1',
          startTime: 0,
          endTime: 5,
          text: 'Hello and welcome to this video message.',
          language: 'en',
          confidence: 0.95
        },
        {
          id: 'caption-2',
          startTime: 5,
          endTime: 10,
          text: 'I wanted to discuss our upcoming project.',
          language: 'en',
          confidence: 0.92
        }
      ];
      setCaptions(mockCaptions);
      setTranscription(mockCaptions.map(c => c.text).join(' '));
    } finally {
      setIsTranscribingCaptions(false);
    }
  };

  // Extract audio from video blob
  const extractAudioFromVideo = async (videoBlob: Blob): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.src = URL.createObjectURL(videoBlob);
      video.onloadedmetadata = () => {
        // For now, return the original blob as we can't easily extract audio client-side
        // In production, this would use Web Audio API or server-side processing
        resolve(videoBlob);
      };

      video.onerror = reject;
    });
  };

  // Transcribe audio using speech recognition
  const transcribeAudio = async (audioBlob: Blob): Promise<{ text: string; timestamps: any[] }> => {
    // In production, this would use a proper speech-to-text service
    // For now, simulate transcription
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          text: "Hello and welcome to this video message. I wanted to discuss our upcoming project and share some exciting updates about our progress.",
          timestamps: [
            { start: 0, end: 3, text: "Hello and welcome" },
            { start: 3, end: 6, text: "to this video message" },
            { start: 6, end: 9, text: "I wanted to discuss" },
            { start: 9, end: 12, text: "our upcoming project" }
          ]
        });
      }, 2000);
    });
  };

  // Generate captions from transcription
  const generateCaptions = async (transcription: { text: string; timestamps: any[] }): Promise<CaptionData[]> => {
    return transcription.timestamps.map((segment, index) => ({
      id: `caption-${index}`,
      startTime: segment.start,
      endTime: segment.end,
      text: segment.text,
      language: 'en',
      confidence: 0.9
    }));
  };

  // Translate captions to multiple languages
  const translateCaptions = async (captions: CaptionData[], languages: string[]): Promise<CaptionData[]> => {
    const translatedCaptions: CaptionData[] = [];

    for (const lang of languages) {
      for (const caption of captions) {
        try {
          const translatedText = await translateText(caption.text, 'en', lang);
          translatedCaptions.push({
            ...caption,
            id: `${caption.id}-${lang}`,
            text: translatedText,
            language: lang,
            confidence: caption.confidence * 0.9 // Slightly lower confidence for translations
          });
        } catch (error) {
          console.error(`Translation failed for ${lang}:`, error);
        }
      }
    }

    return translatedCaptions;
  };

  // Translate text using AI
  const translateText = async (text: string, from: string, to: string): Promise<string> => {
    try {
      const response = await fetch('/api/openai-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Translate this text from ${from} to ${to}: "${text}"`
          }],
          temperature: 0.1,
          max_tokens: 100
        })
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error("Translation error:", error);
      return text; // Return original text if translation fails
    }
  };

  // Search transcripts
  const searchTranscripts = (query: string): CaptionData[] => {
    const lowercaseQuery = query.toLowerCase();
    return captions.filter(caption =>
      caption.text.toLowerCase().includes(lowercaseQuery)
    );
  };

  // Email Integration and Delivery Optimization
  const sendVideoEmail = async (videoData: VideoRecordingData, emailData: {
    recipients: string[];
    subject: string;
    body: string;
    thumbnailUrl?: string;
  }) => {
    try {
      // Generate optimized email template
      const emailTemplate = await generateEmailTemplate(videoData, emailData);

      // Send via messaging service
      const result = await messagingService.sendVideoEmail({
        ...emailTemplate,
        videoUrl: videoData.url,
        videoId: videoData.id,
        analytics: {
          trackOpens: true,
          trackClicks: true,
          trackVideoPlays: true
        }
      });

      // Update video record with email data
      setRecordings(prev => prev.map(rec =>
        rec.id === videoData.id
          ? { ...rec, recipients: emailData.recipients, status: 'sent' as const }
          : rec
      ));

      return result;
    } catch (error) {
      console.error("Failed to send video email:", error);
      throw error;
    }
  };

  // Generate email template with video embed
  const generateEmailTemplate = async (videoData: VideoRecordingData, emailData: any) => {
    const thumbnailUrl = emailData.thumbnailUrl || videoData.thumbnailUrl;

    const template = {
      subject: emailData.subject,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #333;">${emailData.subject}</h2>
          <p style="color: #666; line-height: 1.6;">${emailData.body}</p>

          <div style="margin: 30px 0; text-align: center;">
            ${thumbnailUrl ? `<img src="${thumbnailUrl}" alt="Video thumbnail" style="max-width: 100%; border-radius: 8px; margin-bottom: 15px;">` : ''}
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 2px dashed #dee2e6;">
              <p style="margin: 0; color: #6c757d;">🎥 Video Message</p>
              <p style="margin: 5px 0 15px; font-size: 14px; color: #6c757d;">
                Duration: ${Math.floor(videoData.duration / 60)}:${(videoData.duration % 60).toString().padStart(2, '0')}
              </p>
              <a href="#" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                ▶️ Watch Video
              </a>
            </div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px;">
            <p>This video was sent using SmartCRM Video Email</p>
          </div>
        </div>
      `,
      text: `${emailData.subject}\n\n${emailData.body}\n\nWatch the video: [Video Link]\n\nDuration: ${Math.floor(videoData.duration / 60)}:${(videoData.duration % 60).toString().padStart(2, '0')}`,
      recipients: emailData.recipients,
      metadata: {
        videoId: videoData.id,
        hasVideo: true,
        duration: videoData.duration,
        thumbnailUrl
      }
    };

    return template;
  };

  // Personalize email content based on recipient data
  const personalizeEmailContent = async (baseContent: string, recipient: any) => {
    try {
      const prompt = `Personalize this email content for the recipient:

Recipient: ${recipient.name} (${recipient.email})
Company: ${recipient.company}
Industry: ${recipient.industry}

Base content: "${baseContent}"

Make it more personal and relevant to their role and company. Keep the same overall message but add personalized touches.`;

      const response = await fetch('/api/openai-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        throw new Error(`Personalization failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error("Email personalization failed:", error);
      return baseContent; // Return original content if personalization fails
    }
  };

  // AI Performance Analytics and Insights
  const generateVideoAnalytics = async (videoData: VideoRecordingData) => {
    try {
      // Generate engagement heatmap data
      const heatmapData = generateEngagementHeatmap(videoData);

      // Calculate performance metrics
      const metrics = await calculateVideoMetrics(videoData);

      // Generate predictive analytics
      const predictions = await generateVideoPredictions(videoData);

      // AI-driven recommendations
      const recommendations = await generateVideoRecommendations(videoData, metrics);

      return {
        heatmapData,
        metrics,
        predictions,
        recommendations
      };
    } catch (error) {
      console.error("Failed to generate video analytics:", error);
      return null;
    }
  };

  // Generate engagement heatmap
  const generateEngagementHeatmap = (videoData: VideoRecordingData): HeatMapPoint[] => {
    const points: HeatMapPoint[] = [];
    const duration = videoData.duration;

    // Generate mock heatmap data based on video characteristics
    for (let i = 0; i < duration; i += 5) {
      // Simulate engagement patterns (higher at start and end, dips in middle)
      let engagement = 0.5; // Base engagement

      if (i < duration * 0.2) {
        engagement += 0.3; // High engagement at start
      } else if (i > duration * 0.8) {
        engagement += 0.2; // Good engagement at end
      } else {
        engagement += (Math.random() - 0.5) * 0.4; // Variable in middle
      }

      points.push({
        timestamp: i,
        engagement: Math.max(0, Math.min(1, engagement))
      });
    }

    return points;
  };

  // Calculate video performance metrics
  const calculateVideoMetrics = async (videoData: VideoRecordingData) => {
    const metrics = {
      totalViews: videoData.viewCount || 0,
      completionRate: videoData.watchTimePercentage || 0,
      averageWatchTime: (videoData.watchTimePercentage || 0) * videoData.duration / 100,
      clickThroughRate: Math.random() * 0.3, // Mock CTR
      engagementScore: videoData.engagement?.views ? calculateEngagementScore(videoData.engagement) : 0.5,
      sentimentScore: videoData.aiAnalysis?.sentiment || 0,
      thumbnailPerformance: videoData.thumbnailVariants?.reduce((acc, thumb) =>
        acc + (thumb.clicks / Math.max(thumb.impressions, 1)), 0
      ) || 0
    };

    return metrics;
  };

  // Calculate engagement score
  const calculateEngagementScore = (engagement: EngagementData): number => {
    const viewScore = Math.min(engagement.views / 100, 1); // Normalize to 0-1
    const completionScore = engagement.completionRate;
    const watchTimeScore = engagement.averageWatchTime / engagement.heatMap.length; // Normalize watch time

    return (viewScore * 0.4 + completionScore * 0.4 + watchTimeScore * 0.2);
  };

  // Generate predictive analytics
  const generateVideoPredictions = async (videoData: VideoRecordingData) => {
    try {
      const prompt = `Based on this video's characteristics, predict its performance:

Video duration: ${videoData.duration}s
Quality: ${videoData.recordingQuality}
Has AI analysis: ${!!videoData.aiAnalysis}
Has captions: ${!!videoData.captions?.length}
Has thumbnails: ${!!videoData.thumbnailVariants?.length}

Predict:
1. Expected view count range
2. Expected engagement rate
3. Best send times
4. Target audience response likelihood
5. Content improvement suggestions

Return as JSON with predictions and confidence scores.`;

      const response = await fetch('/api/openai-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 400,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`Prediction failed: ${response.status}`);
      }

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error("Video prediction failed:", error);
      return {
        viewCountRange: { min: 10, max: 100 },
        engagementRate: 0.65,
        bestSendTimes: ['Tuesday 10 AM', 'Thursday 2 PM'],
        confidence: 0.7
      };
    }
  };

  // Generate AI recommendations
  const generateVideoRecommendations = async (videoData: VideoRecordingData, metrics: any) => {
    const recommendations = [];

    if (metrics.completionRate < 0.7) {
      recommendations.push({
        type: 'engagement',
        priority: 'high',
        suggestion: 'Video completion rate is low. Consider shortening the video or adding more engaging content in the first 30 seconds.',
        expectedImpact: 'Increase completion rate by 20-30%'
      });
    }

    if (!videoData.captions?.length) {
      recommendations.push({
        type: 'accessibility',
        priority: 'medium',
        suggestion: 'Add captions to improve accessibility and SEO. This can increase engagement by 15-25%.',
        expectedImpact: 'Improve accessibility and searchability'
      });
    }

    if (metrics.thumbnailPerformance < 0.1) {
      recommendations.push({
        type: 'thumbnail',
        priority: 'high',
        suggestion: 'Thumbnail click-through rate is low. Try more engaging visuals or clearer text overlays.',
        expectedImpact: 'Increase open rates by 25-40%'
      });
    }

    if (videoData.aiAnalysis?.facialExpressions) {
      const positiveExpressions = videoData.aiAnalysis.facialExpressions.filter((exp: any) => exp.expression === 'happy').length;
      if (positiveExpressions < videoData.aiAnalysis.facialExpressions.length * 0.3) {
        recommendations.push({
          type: 'content',
          priority: 'medium',
          suggestion: 'Consider adding more positive, engaging moments to improve viewer connection.',
          expectedImpact: 'Enhance emotional engagement'
        });
      }
    }

    return recommendations;
  };

  // Video Library Management
  const createVideoFolder = (name: string, parentId?: string) => {
    const newFolder = {
      id: `folder-${Date.now()}`,
      name,
      parentId,
      type: 'folder',
      createdAt: new Date(),
      videos: []
    };

    // In a real implementation, this would save to database
    console.log('Created folder:', newFolder);
    return newFolder;
  };

  const organizeVideos = (videos: VideoRecordingData[], criteria: 'date' | 'sentiment' | 'engagement' | 'duration') => {
    const organized: Record<string, VideoRecordingData[]> = {};

    videos.forEach(video => {
      let key = '';

      switch (criteria) {
        case 'date':
          key = video.timestamp.toISOString().split('T')[0];
          break;
        case 'sentiment':
          key = video.aiAnalysis?.sentiment ? (video.aiAnalysis.sentiment > 0 ? 'positive' : 'negative') : 'neutral';
          break;
        case 'engagement':
          const score = video.engagement?.views ? calculateEngagementScore(video.engagement) : 0;
          key = score > 0.7 ? 'high' : score > 0.4 ? 'medium' : 'low';
          break;
        case 'duration':
          key = video.duration < 60 ? 'short' : video.duration < 180 ? 'medium' : 'long';
          break;
      }

      if (!organized[key]) organized[key] = [];
      organized[key].push(video);
    });

    return organized;
  };

  const searchVideos = (videos: VideoRecordingData[], query: string): VideoRecordingData[] => {
    const lowercaseQuery = query.toLowerCase();

    return videos.filter(video => {
      // Search in title
      if (video.title.toLowerCase().includes(lowercaseQuery)) return true;

      // Search in transcript
      if (video.transcript?.toLowerCase().includes(lowercaseQuery)) return true;

      // Search in captions
      if (video.captions?.some(caption => caption.text.toLowerCase().includes(lowercaseQuery))) return true;

      // Search in AI analysis
      if (video.aiAnalysis?.recommendations?.some(rec => rec.toLowerCase().includes(lowercaseQuery))) return true;

      return false;
    });
  };

  // Bulk operations
  const bulkUpdateVideos = async (videoIds: string[], updates: Partial<VideoRecordingData>) => {
    try {
      // Update local state
      setRecordings(prev => prev.map(video =>
        videoIds.includes(video.id) ? { ...video, ...updates } : video
      ));

      // In a real implementation, this would make API calls
      console.log(`Bulk updated ${videoIds.length} videos with:`, updates);

      return { success: true, updated: videoIds.length };
    } catch (error) {
      console.error("Bulk update failed:", error);
      return { success: false, error: (error as Error).message };
    }
  };

  const bulkDeleteVideos = async (videoIds: string[]) => {
    try {
      // Remove from local state
      setRecordings(prev => prev.filter(video => !videoIds.includes(video.id)));

      // Clean up URLs
      videoIds.forEach(id => {
        const video = recordings.find(r => r.id === id);
        if (video) URL.revokeObjectURL(video.url);
      });

      // In a real implementation, this would make API calls
      console.log(`Bulk deleted ${videoIds.length} videos`);

      return { success: true, deleted: videoIds.length };
    } catch (error) {
      console.error("Bulk delete failed:", error);
      return { success: false, error: (error as Error).message };
    }
  };

  // Recording Quality and Technical Features
  const checkDeviceCompatibility = async () => {
    const compatibility = {
      camera: false,
      microphone: false,
      screenSharing: false,
      webRTC: false,
      mediaRecorder: false,
      codecs: [] as string[]
    };

    try {
      // Check camera access
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      compatibility.camera = true;
      cameraStream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.warn("Camera not available:", error);
    }

    try {
      // Check microphone access
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      compatibility.microphone = true;
      micStream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.warn("Microphone not available:", error);
    }

    try {
      // Check screen sharing
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      compatibility.screenSharing = true;
      screenStream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.warn("Screen sharing not available:", error);
    }

    // Check WebRTC support
    compatibility.webRTC = !!(window.RTCPeerConnection);

    // Check MediaRecorder support
    compatibility.mediaRecorder = !!(window.MediaRecorder);

    // Check supported codecs
    if (window.MediaRecorder) {
      const testCanvas = document.createElement('canvas');
      const testStream = testCanvas.captureStream();

      ['video/webm', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8'].forEach(codec => {
        try {
          new MediaRecorder(testStream, { mimeType: codec });
          compatibility.codecs.push(codec);
        } catch (error) {
          // Codec not supported
        }
      });
    }

    return compatibility;
  };

  const adaptBitrateForConnection = async (): Promise<number> => {
    // Simple connection quality detection
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        const downlink = connection.downlink; // Mbps

        if (downlink < 1) return 500000; // 0.5 Mbps for slow connections
        if (downlink < 5) return 1000000; // 1 Mbps for medium connections
        if (downlink < 25) return 2500000; // 2.5 Mbps for fast connections
        return 5000000; // 5 Mbps for very fast connections
      }
    }

    // Default to high quality if connection info unavailable
    return 2500000;
  };

  const switchCamera = async (deviceId: string) => {
    try {
      setSelectedCameraId(deviceId);

      // Restart recording with new camera if currently recording
      if (isRecording) {
        await stopRecording();
        await initializeRecorder();
        await startRecordingImmediately();
      } else {
        await initializeRecorder();
      }
    } catch (error) {
      console.error("Failed to switch camera:", error);
      setError("Failed to switch camera");
    }
  };

  const switchMicrophone = async (deviceId: string) => {
    try {
      setSelectedMicrophoneId(deviceId);

      // Restart recording with new microphone if currently recording
      if (isRecording) {
        await stopRecording();
        await initializeRecorder();
        await startRecordingImmediately();
      } else {
        await initializeRecorder();
      }
    } catch (error) {
      console.error("Failed to switch microphone:", error);
      setError("Failed to switch microphone");
    }
  };

  // Integration and Workflow Features
  const syncWithCRM = async (videoData: VideoRecordingData, contactId: string) => {
    try {
      // Update contact with video interaction
      await fetch('/api/contacts/update-interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
        body: JSON.stringify({
          contactId,
          interaction: {
            type: 'video_email',
            videoId: videoData.id,
            timestamp: new Date(),
            duration: videoData.duration,
            status: videoData.status
          }
        })
      });

      console.log(`Synced video ${videoData.id} with CRM contact ${contactId}`);
      return { success: true };
    } catch (error) {
      console.error("CRM sync failed:", error);
      return { success: false, error: (error as Error).message };
    }
  };

  const setupWebhook = async (url: string, events: string[]) => {
    try {
      const response = await fetch('/api/webhooks/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
        body: JSON.stringify({
          url,
          events, // ['video.created', 'video.sent', 'video.viewed', etc.]
          secret: generateWebhookSecret()
        })
      });

      if (!response.ok) {
        throw new Error(`Webhook setup failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Webhook setup successful:', result);
      return result;
    } catch (error) {
      console.error("Webhook setup failed:", error);
      throw error;
    }
  };

  const integrateWithZapier = async (zapierWebhookUrl: string) => {
    try {
      // Test the Zapier webhook
      const testResponse = await fetch(zapierWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test: true,
          timestamp: new Date(),
          source: 'SmartCRM Video Email'
        })
      });

      if (!testResponse.ok) {
        throw new Error('Zapier webhook test failed');
      }

      // Save the integration
      await fetch('/api/integrations/zapier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
        body: JSON.stringify({
          webhookUrl: zapierWebhookUrl,
          active: true
        })
      });

      console.log('Zapier integration successful');
      return { success: true };
    } catch (error) {
      console.error("Zapier integration failed:", error);
      return { success: false, error: error.message };
    }
  };

  const createAPIEndpoint = async (endpointConfig: {
    name: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    authentication: boolean;
    rateLimit: number;
  }) => {
    try {
      const response = await fetch('/api/endpoints/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
        body: JSON.stringify(endpointConfig)
      });

      if (!response.ok) {
        throw new Error(`API endpoint creation failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('API endpoint created:', result);
      return result;
    } catch (error) {
      console.error("API endpoint creation failed:", error);
      throw error;
    }
  };

  // Utility functions
  const generateWebhookSecret = (): string => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  // Utility function to convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  
  // Delete recording
  const deleteRecording = (id: string) => {
    const recordingToDelete = recordings.find(rec => rec.id === id);
    
    if (recordingToDelete) {
      URL.revokeObjectURL(recordingToDelete.url);
      setRecordings(recordings.filter(rec => rec.id !== id));
      
      if (selectedRecording?.id === id) {
        setSelectedRecording(null);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Video Email Suite</h1>
          <p className="text-gray-600 mt-1">Create, analyze, and optimize professional video emails with AI assistance</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button
            onClick={() => setActiveTab('record')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'record'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Camera size={16} className="inline mr-1" />
            Record
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'library'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileVideo size={16} className="inline mr-1" />
            Library
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 size={16} className="inline mr-1" />
            Analytics
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle size={20} className="text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {activeTab === 'record' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Record Video</h2>
                <div className="flex items-center space-x-2">
                  {/* Recording Mode Selector */}
                  <select
                    value={recordingMode}
                    onChange={(e) => setRecordingMode(e.target.value as any)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="camera">Camera</option>
                    <option value="screen">Screen</option>
                    <option value="picture-in-picture">Picture-in-Picture</option>
                  </select>

                  {/* Quality Selector */}
                  <select
                    value={recordingQuality}
                    onChange={(e) => setRecordingQuality(e.target.value as any)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="low">Low (640p)</option>
                    <option value="medium">Medium (720p)</option>
                    <option value="high">High (1080p)</option>
                    <option value="ultra">Ultra (4K)</option>
                  </select>

                  {/* Codec Selector */}
                  <select
                    value={selectedCodec}
                    onChange={(e) => setSelectedCodec(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="video/webm">WebM</option>
                    <option value="video/mp4">MP4</option>
                  </select>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-2 rounded-md ${isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>

                  <button
                    onClick={() => setShowTeleprompter(!showTeleprompter)}
                    className={`p-2 rounded-md ${showTeleprompter ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <Monitor size={16} />
                  </button>

                  <button
                    onClick={() => setIsConfigOpen(!isConfigOpen)}
                    className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    <Settings size={16} />
                  </button>
                </div>
              </div>
              
              {/* Video Preview */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  muted={isMuted}
                  className="w-full h-64 object-cover"
                />

                {/* Teleprompter Overlay */}
                {showTeleprompter && script && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-black/80 text-white p-6 rounded-lg max-w-2xl mx-4">
                      <div className="text-center text-lg leading-relaxed">
                        {script.split(' ').map((word, index) => (
                          <span
                            key={index}
                            className={`inline-block mx-1 ${
                              index <= currentScriptPosition
                                ? 'text-green-400'
                                : index === currentScriptPosition + 1
                                ? 'text-yellow-400 font-bold'
                                : 'text-white'
                            }`}
                            style={{
                              fontSize: `${teleprompterFontSize}px`,
                              animation: index === currentScriptPosition + 1 ? 'pulse 1s infinite' : 'none'
                            }}
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-center space-x-2">
                        <button
                          onClick={() => setTeleprompterSpeed(Math.max(0.5, teleprompterSpeed - 0.25))}
                          className="px-3 py-1 bg-gray-700 rounded text-sm"
                        >
                          Slower
                        </button>
                        <span className="px-3 py-1 text-sm">{teleprompterSpeed}x</span>
                        <button
                          onClick={() => setTeleprompterSpeed(Math.min(2, teleprompterSpeed + 0.25))}
                          className="px-3 py-1 bg-gray-700 rounded text-sm"
                        >
                          Faster
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Countdown Timer */}
                {isCountdownActive && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-white mb-4">{countdownTime}</div>
                      <div className="text-white text-lg">Get ready to record...</div>
                    </div>
                  </div>
                )}

                {/* Recording Indicator */}
                {isRecording && (
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">
                      REC {formatTime(recordingTime)}
                    </span>
                    <span className="text-white text-xs">
                      {fileSize > 0 && `Size: ${(fileSize / 1024 / 1024).toFixed(1)}MB`}
                    </span>
                    <span className="text-white text-xs">
                      BW: {bandwidthUsage.toFixed(1)} MB/s
                    </span>
                  </div>
                )}

                {/* Recording Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center space-x-4">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        disabled={isCountdownActive}
                        className="w-16 h-16 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        <Camera size={24} />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={togglePauseRecording}
                          className="w-12 h-12 bg-yellow-600 hover:bg-yellow-700 rounded-full flex items-center justify-center text-white"
                        >
                          {isPaused ? <Play size={20} /> : <Pause size={20} />}
                        </button>
                        <button
                          onClick={stopRecording}
                          className="w-12 h-12 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center text-white"
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={cancelRecording}
                          className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white"
                        >
                          <X size={20} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Recording Configuration Panel */}
              {isConfigOpen && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-3">Recording Configuration</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Countdown</label>
                      <select
                        value={countdownDuration}
                        onChange={(e) => setCountdownDuration(Number(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value={0}>None</option>
                        <option value={3}>3 seconds</option>
                        <option value={5}>5 seconds</option>
                        <option value={10}>10 seconds</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Camera</label>
                      <select
                        value={selectedCameraId}
                        onChange={(e) => setSelectedCameraId(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {availableCameras.map(camera => (
                          <option key={camera.deviceId} value={camera.deviceId}>
                            {camera.label || `Camera ${camera.deviceId.slice(0, 8)}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Microphone</label>
                      <select
                        value={selectedMicrophoneId}
                        onChange={(e) => setSelectedMicrophoneId(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {availableMicrophones.map(mic => (
                          <option key={mic.deviceId} value={mic.deviceId}>
                            {mic.label || `Mic ${mic.deviceId.slice(0, 8)}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">System Audio</label>
                      <input
                        type="checkbox"
                        checked={systemAudioEnabled}
                        onChange={(e) => setSystemAudioEnabled(e.target.checked)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'library' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Video Library</h2>
                <span className="text-sm text-gray-500">{recordings.length} recordings</span>
              </div>
              
              {recordings.length === 0 ? (
                <div className="text-center py-12">
                  <FileVideo size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recordings yet</h3>
                  <p className="text-gray-500 mb-4">Start recording to create your first video email</p>
                  <button
                    onClick={() => setActiveTab('record')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Camera size={16} className="inline mr-1" />
                    Start Recording
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recordings.map((recording) => (
                    <div key={recording.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="aspect-video bg-gray-900 rounded-lg mb-3 overflow-hidden">
                        <video
                          src={recording.url}
                          className="w-full h-full object-cover"
                          controls
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-900 truncate">{recording.title}</h3>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{formatTime(recording.duration)}</span>
                          <span>{recording.timestamp.toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedRecording(recording)}
                            className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            <Mail size={14} className="inline mr-1" />
                            Send
                          </button>
                          <button
                            onClick={() => deleteRecording(recording.id)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Script & Teleprompter */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">AI Script Generator</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => generateAIScript({
                    recipient: { name: 'John Doe', company: 'Example Corp' },
                    purpose: 'product demonstration',
                    tone: 'professional',
                    length: 60
                  })}
                  disabled={isGeneratingScript}
                  className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-50"
                >
                  {isGeneratingScript ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Sparkles size={16} />
                  )}
                </button>
                <button
                  onClick={generateTalkingPoints}
                  disabled={isGeneratingTalkingPoints}
                  className="p-2 rounded-md bg-green-100 text-green-600 hover:bg-green-200 disabled:opacity-50"
                >
                  {isGeneratingTalkingPoints ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <List size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Script Input */}
            <div className="mb-4">
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Enter your script here, or use AI to generate one..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Talking Points */}
            {talkingPoints.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Talking Points</h4>
                <div className="space-y-2">
                  {talkingPoints.map((point) => (
                    <div key={point.id} className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        checked={point.completed}
                        onChange={(e) => {
                          setTalkingPoints(talkingPoints.map(p =>
                            p.id === point.id ? { ...p, completed: e.target.checked } : p
                          ));
                        }}
                        className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                      <span className={`text-sm ${point.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                        {point.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Analysis Results */}
            {aiAnalysis && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Activity size={16} className="mr-1" />
                  AI Analysis
                </h4>
                <div className="text-sm space-y-1">
                  <div>Sentiment: {aiAnalysis.sentiment > 0 ? 'Positive' : aiAnalysis.sentiment < 0 ? 'Negative' : 'Neutral'}</div>
                  <div>Confidence: {Math.round(aiAnalysis.confidence * 100)}%</div>
                  {aiAnalysis.recommendations && (
                    <div>Recommendations: {aiAnalysis.recommendations.join(', ')}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Video Processing & Enhancement */}
          {selectedRecording && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">AI Video Enhancement & Post-Processing</h3>

              <div className="space-y-6">
                {/* Enhancement Options */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={enhancementOptions.autoCrop || false}
                      onChange={(e) => setEnhancementOptions(prev => ({ ...prev, autoCrop: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Auto-crop to speaker</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={enhancementOptions.backgroundBlur || false}
                      onChange={(e) => setEnhancementOptions(prev => ({ ...prev, backgroundBlur: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Background blur</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={enhancementOptions.colorCorrection || false}
                      onChange={(e) => setEnhancementOptions(prev => ({ ...prev, colorCorrection: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Color correction</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={enhancementOptions.lightingOptimization || false}
                      onChange={(e) => setEnhancementOptions(prev => ({ ...prev, lightingOptimization: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Lighting optimization</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={enhancementOptions.noiseReduction || false}
                      onChange={(e) => setEnhancementOptions(prev => ({ ...prev, noiseReduction: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Noise reduction</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={enhancementOptions.stabilization || false}
                      onChange={(e) => setEnhancementOptions(prev => ({ ...prev, stabilization: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Video stabilization</span>
                  </label>
                </div>

                {/* Background Replacement Options */}
                {enhancementOptions.backgroundBlur && (
                  <div>
                    <h4 className="font-medium mb-2">Background Options</h4>
                    <div className="flex space-x-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="background"
                          checked={!enhancementOptions.backgroundReplace}
                          onChange={() => setEnhancementOptions(prev => ({
                            ...prev,
                            backgroundReplace: false,
                            backgroundImage: undefined
                          }))}
                        />
                        <span className="text-sm">Blur only</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="background"
                          checked={enhancementOptions.backgroundReplace || false}
                          onChange={() => setEnhancementOptions(prev => ({
                            ...prev,
                            backgroundReplace: true,
                            backgroundImage: backgroundImages[0]
                          }))}
                        />
                        <span className="text-sm">Replace background</span>
                      </label>
                    </div>

                    {enhancementOptions.backgroundReplace && (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {backgroundImages.map((bg, index) => (
                          <img
                            key={index}
                            src={bg}
                            alt={`Background ${index + 1}`}
                            className={`w-full h-16 object-cover rounded border-2 cursor-pointer ${
                              enhancementOptions.backgroundImage === bg
                                ? 'border-blue-500'
                                : 'border-gray-300'
                            }`}
                            onClick={() => setEnhancementOptions(prev => ({
                              ...prev,
                              backgroundImage: bg
                            }))}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Watermark Options */}
                <div>
                  <h4 className="font-medium mb-2">Branded Watermark</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Watermark text"
                      value={enhancementOptions.watermark?.text || ''}
                      onChange={(e) => setEnhancementOptions(prev => ({
                        ...prev,
                        watermark: {
                          ...prev.watermark,
                          text: e.target.value,
                          position: prev.watermark?.position || 'bottom-right',
                          opacity: prev.watermark?.opacity || 0.8
                        }
                      }))}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <select
                      value={enhancementOptions.watermark?.position || 'bottom-right'}
                      onChange={(e) => setEnhancementOptions(prev => ({
                        ...prev,
                        watermark: {
                          ...prev.watermark,
                          position: e.target.value as any,
                          opacity: prev.watermark?.opacity || 0.8
                        }
                      }))}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="center">Center</option>
                    </select>
                  </div>
                </div>

                {/* Compression Options */}
                <div>
                  <h4 className="font-medium mb-2">Video Compression</h4>
                  <select
                    value={enhancementOptions.compression?.quality || 'high'}
                    onChange={(e) => setEnhancementOptions(prev => ({
                      ...prev,
                      compression: {
                        ...prev.compression,
                        quality: e.target.value as 'low' | 'medium' | 'high'
                      }
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="high">High Quality</option>
                    <option value="medium">Medium Quality</option>
                    <option value="low">Low Quality (Smaller file)</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={async () => {
                      setIsEnhancing(true);
                      try {
                        const result = await videoEnhancementService.enhanceVideo(
                          selectedRecording.blob,
                          enhancementOptions
                        );
                        setEnhancementResult(result);

                        // Update the recording with enhanced version
                        setSelectedRecording(prev => prev ? {
                          ...prev,
                          blob: result.enhancedBlob,
                          url: URL.createObjectURL(result.enhancedBlob)
                        } : null);

                      } catch (error) {
                        console.error('Enhancement failed:', error);
                      } finally {
                        setIsEnhancing(false);
                      }
                    }}
                    disabled={isEnhancing}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
                  >
                    {isEnhancing ? <RefreshCw size={16} className="animate-spin mr-1" /> : <Sparkles size={16} className="mr-1" />}
                    Apply AI Enhancements
                  </button>

                  <button
                    onClick={() => analyzeVideoWithAI(selectedRecording.blob)}
                    disabled={isAnalyzing}
                    className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                  >
                    {isAnalyzing ? <RefreshCw size={16} className="animate-spin mr-1" /> : <Activity size={16} className="mr-1" />}
                    AI Analysis
                  </button>

                  <button
                    onClick={() => generateThumbnails(selectedRecording.blob)}
                    disabled={isGeneratingThumbnails}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {isGeneratingThumbnails ? <RefreshCw size={16} className="animate-spin mr-1" /> : <Camera size={16} className="mr-1" />}
                    Generate Thumbnails
                  </button>

                  <button
                    onClick={() => transcribeVideo(selectedRecording.blob)}
                    disabled={isTranscribingCaptions}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isTranscribingCaptions ? <RefreshCw size={16} className="animate-spin mr-1" /> : <Mic size={16} className="mr-1" />}
                    Transcribe
                  </button>
                </div>

                {/* Enhancement Results */}
                {enhancementResult && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Enhancement Complete!</h4>
                    <div className="text-sm text-green-700 space-y-1">
                      <div>Processing time: {enhancementResult.processingTime}ms</div>
                      <div>Applied: {enhancementResult.appliedEnhancements.join(', ')}</div>
                      <div>Quality score: {enhancementResult.quality}/100</div>
                    </div>
                  </div>
                )}

                {/* Thumbnails */}
                {thumbnails.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Generated Thumbnails</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {thumbnails.map((thumb, index) => (
                        <div key={thumb.id} className="relative">
                          <img
                            src={thumb.url}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-20 object-cover rounded border-2 border-transparent hover:border-blue-500 cursor-pointer"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1">
                            {Math.round(thumb.engagement)}% engagement
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Captions */}
                {captions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Transcription</h4>
                    <div className="max-h-32 overflow-y-auto bg-gray-50 p-3 rounded text-sm">
                      {captions.map((caption) => (
                        <div key={caption.id} className="mb-1">
                          <span className="font-medium">{formatTime(caption.startTime)}: </span>
                          {caption.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Email Composer */}
          {selectedRecording && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Send Video Email</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipients
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email addresses..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Video message for you"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Add a personal message..."
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
                  <Send size={16} className="mr-1" />
                  Send Video Email
                </button>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Videos</span>
                <span className="text-sm font-medium">{recordings.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Videos Sent</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg View Rate</span>
                <span className="text-sm font-medium">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEmail;