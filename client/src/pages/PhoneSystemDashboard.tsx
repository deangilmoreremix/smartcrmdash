import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '../contexts/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import CommunicationDashboard from '../components/CommunicationDashboard';
import GlassCard from '../components/GlassCard';
import { gpt5Communication } from '../services/gpt5CommunicationService';
import {
  Phone,
  Mic,
  Volume2,
  Users,
  Clock,
  TrendingUp,
  BarChart3,
  Settings,
  Sparkles,
  Play,
  Pause,
  Square,
  Headphones,
  MessageSquare,
  Zap,
  Shield,
  Activity,
  Target
} from 'lucide-react';

interface Call {
  id: string;
  caller: string;
  duration: number;
  status: 'completed' | 'missed' | 'ongoing' | 'voicemail';
  sentiment: 'positive' | 'neutral' | 'negative';
  transcript?: string;
  recording?: string;
  gpt5Analysis?: {
    summary: string;
    keyPoints: string[];
    actionItems: string[];
    sentimentScore: number;
  };
}

interface PhoneStats {
  totalCalls: number;
  answeredCalls: number;
  averageCallDuration: number;
  callQuality: number;
  customerSatisfaction: number;
  aiAccuracy: number;
}

export default function PhoneSystemDashboard() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('calls');
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [callPurpose, setCallPurpose] = useState('sales');
  const [objectionType, setObjectionType] = useState('price');
  const [callRecording, setCallRecording] = useState('automatic');
  const [transcription, setTranscription] = useState('realtime');
  const [aiAnalysis, setAiAnalysis] = useState('enabled');
  const [voicemail, setVoicemail] = useState('transcribe');

  // Mock data
  const mockCalls: Call[] = [
    {
      id: '1',
      caller: '+1 (555) 123-4567',
      duration: 245,
      status: 'completed',
      sentiment: 'positive',
      transcript: 'Customer called about product demo scheduling...',
      gpt5Analysis: {
        summary: 'Customer interested in enterprise solution',
        keyPoints: ['Needs demo next week', 'Budget approved', 'Decision maker'],
        actionItems: ['Schedule demo call', 'Send proposal', 'Follow up in 3 days'],
        sentimentScore: 0.85
      }
    },
    {
      id: '2',
      caller: '+1 (555) 987-6543',
      duration: 0,
      status: 'missed',
      sentiment: 'neutral'
    },
    {
      id: '3',
      caller: '+1 (555) 456-7890',
      duration: 180,
      status: 'completed',
      sentiment: 'negative',
      transcript: 'Customer unhappy with recent service...',
      gpt5Analysis: {
        summary: 'Service complaint requiring immediate attention',
        keyPoints: ['Billing issue', 'Poor customer service', 'Threatening to cancel'],
        actionItems: ['Contact customer today', 'Resolve billing issue', 'Offer compensation'],
        sentimentScore: 0.25
      }
    }
  ];

  const mockStats: PhoneStats = {
    totalCalls: 247,
    answeredCalls: 189,
    averageCallDuration: 4.2,
    callQuality: 0.94,
    customerSatisfaction: 0.87,
    aiAccuracy: 0.91
  };

  const { data: calls = mockCalls, isLoading: callsLoading } = useQuery<Call[]>({
    queryKey: ['/api/phone/calls'],
    refetchInterval: 30000,
  });

  const { data: stats = mockStats, isLoading: statsLoading } = useQuery<PhoneStats>({
    queryKey: ['/api/phone/stats'],
    refetchInterval: 30000,
  });

  const analyzeCall = async (call: Call) => {
    if (!call.transcript) return;

    setIsAnalyzing(true);
    try {
      const analysis = await gpt5Communication.analyzeContent(call.transcript, 'call-transcript');
      console.log('Call analysis:', analysis);
      // In real implementation, this would update the call record
    } catch (error) {
      console.error('Failed to analyze call:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'ongoing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'missed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      case 'voicemail': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'neutral': return 'bg-yellow-100 text-yellow-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const actionButtons = [
    <Button
      key="new-call"
      onClick={() => setShowCallModal(true)}
      className="bg-green-600 hover:bg-green-700"
    >
      <Phone className="h-4 w-4 mr-2" />
      Make Call
    </Button>,
    <Button
      key="ai-analysis"
      variant="outline"
      onClick={() => analyzeCall(mockCalls[0])}
      disabled={isAnalyzing}
    >
      <Sparkles className="h-4 w-4 mr-2" />
      {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
    </Button>
  ];

  const headerStats = (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{stats.totalCalls}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Total Calls</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">{Math.round((stats.answeredCalls / stats.totalCalls) * 100)}%</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Answer Rate</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-600">{stats.averageCallDuration}m</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Avg Duration</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-600">{Math.round(stats.customerSatisfaction * 100)}%</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
      </div>
    </div>
  );

  return (
    <CommunicationDashboard
      appName="AI Voice Communication Center"
      appDescription="Advanced phone system with AI-powered call analysis, real-time transcription, and intelligent routing"
      actionButtons={actionButtons}
      headerStats={headerStats}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calls">Call History</TabsTrigger>
          <TabsTrigger value="live">Live Calls</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="calls" className="space-y-6">
          {/* Call History */}
          <GlassCard className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Recent Calls
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-4">
                {calls.map(call => (
                  <GlassCard
                    key={call.id}
                    className="p-4 cursor-pointer hover:border-blue-300"
                    onClick={() => setSelectedCall(call)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          call.status === 'completed' ? 'bg-green-100' :
                          call.status === 'missed' ? 'bg-red-100' :
                          call.status === 'ongoing' ? 'bg-blue-100' : 'bg-yellow-100'
                        }`}>
                          <Phone className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{call.caller}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {call.duration > 0 ? `${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')}` : 'No answer'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(call.status)}>
                          {call.status}
                        </Badge>
                        {call.sentiment && (
                          <Badge className={getSentimentColor(call.sentiment)}>
                            {call.sentiment}
                          </Badge>
                        )}
                        {call.gpt5Analysis && (
                          <div className="flex items-center gap-1">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            <span className="text-xs text-purple-600">AI</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </CardContent>
          </GlassCard>
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Call Panel */}
            <GlassCard className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Active Call
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="text-center py-8">
                  <div className="text-6xl font-bold text-blue-600 mb-2">
                    {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 mb-6">
                    +1 (555) 123-4567
                  </div>

                  <div className="flex justify-center gap-4 mb-6">
                    <Button
                      size="lg"
                      variant={isRecording ? "destructive" : "outline"}
                      onClick={() => setIsRecording(!isRecording)}
                    >
                      {isRecording ? <Square className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <Button size="lg" variant="outline">
                      <Pause className="h-5 w-5" />
                    </Button>
                    <Button size="lg" className="bg-red-600 hover:bg-red-700">
                      <Square className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="text-sm text-gray-500">
                    {isRecording ? 'Recording active' : 'Recording paused'}
                  </div>
                </div>
              </CardContent>
            </GlassCard>

            {/* Real-time Transcript */}
            <GlassCard className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Live Transcript
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-y-auto">
                  <div className="space-y-2 text-sm">
                    <div className="text-blue-600 font-medium">Caller:</div>
                    <p className="text-gray-700 dark:text-gray-300">{transcript || 'Transcript will appear here during live calls...'}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Sparkles className="h-4 w-4 mr-1" />
                    AI Summary
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Target className="h-4 w-4 mr-1" />
                    Action Items
                  </Button>
                </div>
              </CardContent>
            </GlassCard>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Call Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Call Quality Score</span>
                    <span className="font-semibold">{Math.round(stats.callQuality * 100)}%</span>
                  </div>
                  <Progress value={stats.callQuality * 100} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">AI Analysis Accuracy</span>
                    <span className="font-semibold">{Math.round(stats.aiAccuracy * 100)}%</span>
                  </div>
                  <Progress value={stats.aiAccuracy * 100} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="font-semibold">{Math.round(stats.customerSatisfaction * 100)}%</span>
                  </div>
                  <Progress value={stats.customerSatisfaction * 100} className="h-2" />
                </div>
              </CardContent>
            </GlassCard>

            <GlassCard className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Call Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Peak Call Hours</span>
                    <span className="font-semibold">9 AM - 11 AM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Busiest Day</span>
                    <span className="font-semibold">Wednesday</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg Handle Time</span>
                    <span className="font-semibold">4.2 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">First Call Resolution</span>
                    <span className="font-semibold">78%</span>
                  </div>
                </div>
              </CardContent>
            </GlassCard>
          </div>
        </TabsContent>

        <TabsContent value="ai-tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Call Script Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="call-purpose">Call Purpose</Label>
                    <Select value={callPurpose} onValueChange={setCallPurpose}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales Call</SelectItem>
                        <SelectItem value="support">Support Call</SelectItem>
                        <SelectItem value="followup">Follow-up Call</SelectItem>
                        <SelectItem value="survey">Customer Survey</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="prospect-info">Prospect Information</Label>
                    <Textarea
                      id="prospect-info"
                      placeholder="Enter prospect details, previous interactions, etc."
                      rows={4}
                    />
                  </div>
                  <Button className="w-full">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Call Script
                  </Button>
                </div>
              </CardContent>
            </GlassCard>

            <GlassCard className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Objection Handler
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="objection">Common Objection</Label>
                    <Select value={objectionType} onValueChange={setObjectionType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">Price Too High</SelectItem>
                        <SelectItem value="competition">Using Competitor</SelectItem>
                        <SelectItem value="timing">Not Right Time</SelectItem>
                        <SelectItem value="features">Missing Features</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="context">Call Context</Label>
                    <Textarea
                      id="context"
                      placeholder="Describe the current call situation..."
                      rows={3}
                    />
                  </div>
                  <Button className="w-full" variant="outline">
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Response
                  </Button>
                </div>
              </CardContent>
            </GlassCard>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <GlassCard className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Phone System Settings</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Call Recording</Label>
                  <Select value={callRecording} onValueChange={setCallRecording}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Transcription</Label>
                  <Select value={transcription} onValueChange={setTranscription}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="postcall">Post-Call</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>AI Analysis</Label>
                  <Select value={aiAnalysis} onValueChange={setAiAnalysis}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Voicemail</Label>
                  <Select value={voicemail} onValueChange={setVoicemail}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transcribe">Transcribe & Analyze</SelectItem>
                      <SelectItem value="record">Record Only</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </GlassCard>
        </TabsContent>
      </Tabs>

      {/* Call Details Modal */}
      {selectedCall && (
        <Dialog open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Call Details
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Caller</Label>
                  <div className="font-medium">{selectedCall.caller}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Duration</Label>
                  <div className="font-medium">
                    {selectedCall.duration > 0 ? `${Math.floor(selectedCall.duration / 60)}:${(selectedCall.duration % 60).toString().padStart(2, '0')}` : 'No answer'}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</Label>
                  <Badge className={getStatusColor(selectedCall.status)}>
                    {selectedCall.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Sentiment</Label>
                  {selectedCall.sentiment && (
                    <Badge className={getSentimentColor(selectedCall.sentiment)}>
                      {selectedCall.sentiment}
                    </Badge>
                  )}
                </div>
              </div>

              {selectedCall.transcript && (
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Transcript</Label>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg max-h-40 overflow-y-auto">
                    <p className="text-sm">{selectedCall.transcript}</p>
                  </div>
                </div>
              )}

              {selectedCall.gpt5Analysis && (
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    AI Analysis
                  </Label>
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium text-sm mb-1">Summary</div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{selectedCall.gpt5Analysis.summary}</p>
                    </div>

                    <div>
                      <div className="font-medium text-sm mb-1">Key Points</div>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        {selectedCall.gpt5Analysis.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="font-medium text-sm mb-1">Action Items</div>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        {selectedCall.gpt5Analysis.actionItems.map((action, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </CommunicationDashboard>
  );
}