import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Pause, Volume2, BarChart3, TrendingUp, User, Clock, AlertTriangle } from 'lucide-react';

interface VoiceMetrics {
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  pace: 'slow' | 'normal' | 'fast';
  volume: number;
  clarity: number;
  engagement: number;
}

interface VoiceAnalysisRealTimeProps {
  onClose?: () => void;
}

const VoiceAnalysisRealtime: React.FC<VoiceAnalysisRealTimeProps> = ({ onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [metrics, setMetrics] = useState<VoiceMetrics>({
    sentiment: 'neutral',
    confidence: 0,
    pace: 'normal',
    volume: 0,
    clarity: 0,
    engagement: 0
  });
  const [realTimeData, setRealTimeData] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();

  const simulateVoiceAnalysis = () => {
    // Simulate real-time voice metrics
    const newMetrics: VoiceMetrics = {
      sentiment: Math.random() > 0.5 ? 'positive' : Math.random() > 0.3 ? 'neutral' : 'negative',
      confidence: 70 + Math.random() * 30,
      pace: Math.random() > 0.6 ? 'normal' : Math.random() > 0.5 ? 'fast' : 'slow',
      volume: 30 + Math.random() * 70,
      clarity: 60 + Math.random() * 40,
      engagement: 40 + Math.random() * 60
    };
    
    setMetrics(newMetrics);
    setRealTimeData(prev => [...prev.slice(-20), newMetrics.volume]);
  };

  const startRecording = () => {
    setIsRecording(true);
    setDuration(0);
    setRealTimeData([]);
    
    intervalRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
      simulateVoiceAnalysis();
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaceColor = (pace: string) => {
    switch (pace) {
      case 'fast': return 'text-orange-600 bg-orange-100';
      case 'slow': return 'text-blue-600 bg-blue-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Real-time Voice Analysis</h2>
        <p className="text-gray-600">
          Analyze voice calls in real-time for sentiment, pacing, clarity, and engagement metrics.
        </p>
      </div>

      {/* Recording Controls */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center justify-center w-16 h-16 rounded-full text-white transition-all duration-200 ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isRecording ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </button>
          
          {duration > 0 && !isRecording && (
            <button
              onClick={togglePlayback}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700 text-white transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </button>
          )}
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-mono text-gray-900 mb-2">
            {formatTime(duration)}
          </div>
          <div className="text-sm text-gray-600">
            {isRecording ? 'Recording in progress...' : duration > 0 ? 'Recording complete' : 'Click to start recording'}
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      {(isRecording || duration > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Sentiment</span>
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getSentimentColor(metrics.sentiment)}`}>
              {metrics.sentiment}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {Math.round(metrics.confidence)}% confident
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Speaking Pace</span>
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
            <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getPaceColor(metrics.pace)}`}>
              {metrics.pace}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Optimal range
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Voice Clarity</span>
              <Volume2 className="h-4 w-4 text-gray-400" />
            </div>
            <div className={`text-lg font-semibold ${getScoreColor(metrics.clarity)}`}>
              {Math.round(metrics.clarity)}%
            </div>
            <div className="text-xs text-gray-500">
              Audio quality score
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Engagement</span>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
            <div className={`text-lg font-semibold ${getScoreColor(metrics.engagement)}`}>
              {Math.round(metrics.engagement)}%
            </div>
            <div className="text-xs text-gray-500">
              Listener engagement
            </div>
          </div>
        </div>
      )}

      {/* Voice Waveform Visualization */}
      {isRecording && realTimeData.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Live Audio Analysis</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm">Live</span>
            </div>
          </div>
          
          <div className="flex items-end justify-center space-x-1 h-20">
            {realTimeData.map((value, index) => (
              <div
                key={index}
                className="bg-blue-400 w-2 rounded-t transition-all duration-200"
                style={{ 
                  height: `${Math.max(4, (value / 100) * 80)}px`,
                  opacity: index === realTimeData.length - 1 ? 1 : 0.7 - (realTimeData.length - index) * 0.05
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Analysis Summary */}
      {duration > 0 && !isRecording && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <BarChart3 className="h-6 w-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">AI Analysis Summary</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>
                  <strong>Overall Performance:</strong> Your voice analysis shows a {metrics.sentiment} sentiment 
                  with {Math.round(metrics.clarity)}% clarity and {Math.round(metrics.engagement)}% engagement score.
                </p>
                <p>
                  <strong>Speaking Pattern:</strong> You maintained a {metrics.pace} speaking pace throughout the recording, 
                  which is {metrics.pace === 'normal' ? 'ideal for' : 'acceptable for'} professional communication.
                </p>
                <p>
                  <strong>Recommendations:</strong> 
                  {metrics.clarity < 70 && ' Consider speaking more clearly for better audio quality.'}
                  {metrics.engagement < 60 && ' Try varying your tone and pace to increase engagement.'}
                  {metrics.clarity >= 70 && metrics.engagement >= 60 && ' Excellent performance! Keep up the great work.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Demo Notice */}
      {!isRecording && duration === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-800">
                <strong>Demo Mode:</strong> This is a simulated demonstration of real-time voice analysis. 
                In production, this would connect to actual microphone input and provide real voice analysis.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAnalysisRealtime;