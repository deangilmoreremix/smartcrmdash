
import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Brain, 
  MessageSquare, 
  Activity, 
  Clock, 
  TrendingUp, 
  Users, 
  Briefcase, 
  CheckCircle, 
  AlertCircle,
  Eye,
  BarChart3,
  Zap,
  Settings,
  Play,
  Pause,
  RefreshCw,
  MessageCircle,
  Star,
  ArrowRight
} from 'lucide-react';
import { persistentAssistantService, PersistentAssistant } from '../services/persistentAssistantService';
import { assistantThreadManager } from '../services/assistantThreadManager';

const AssistantsDashboard: React.FC = () => {
  const [assistants, setAssistants] = useState<PersistentAssistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssistant, setSelectedAssistant] = useState<PersistentAssistant | null>(null);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [activeThreads, setActiveThreads] = useState<Map<string, any>>(new Map());
  const [systemStats, setSystemStats] = useState<any>({});

  useEffect(() => {
    loadAssistantData();
    loadSystemStats();
    const interval = setInterval(loadAssistantData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAssistantData = async () => {
    try {
      await persistentAssistantService.initialize();
      const assistantsList = persistentAssistantService.getAssistantStats();
      setAssistants(assistantsList);
      
      // Load active threads for each assistant
      const threadsMap = new Map();
      for (const assistant of assistantsList) {
        const threads = Array.from(assistant.activeThreads.entries());
        threadsMap.set(assistant.id, threads);
      }
      setActiveThreads(threadsMap);
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to load assistant data:', error);
      setLoading(false);
    }
  };

  const loadSystemStats = async () => {
    // Calculate system-wide statistics
    const stats = {
      totalInteractions: assistants.reduce((sum, a) => sum + a.totalInteractions, 0),
      avgResponseTime: assistants.reduce((sum, a) => sum + a.performance.averageResponseTime, 0) / Math.max(assistants.length, 1),
      totalActiveThreads: Array.from(activeThreads.values()).reduce((sum, threads) => sum + threads.length, 0),
      overallSuccessRate: assistants.reduce((sum, a) => sum + a.performance.successRate, 0) / Math.max(assistants.length, 1)
    };
    setSystemStats(stats);
  };

  const loadConversationHistory = async (assistant: PersistentAssistant, entityId: string) => {
    try {
      const history = await persistentAssistantService.getAssistantMemory(
        assistant.type,
        entityId,
        50
      );
      setConversationHistory(history);
    } catch (error) {
      console.error('Failed to load conversation history:', error);
    }
  };

  const getAssistantIcon = (type: string) => {
    switch (type) {
      case 'contact': return <Users className="h-5 w-5" />;
      case 'deal': return <Briefcase className="h-5 w-5" />;
      case 'task': return <CheckCircle className="h-5 w-5" />;
      case 'pipeline': return <BarChart3 className="h-5 w-5" />;
      default: return <Bot className="h-5 w-5" />;
    }
  };

  const getStatusColor = (lastUsed: Date) => {
    const hoursSinceLastUsed = (Date.now() - lastUsed.getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastUsed < 1) return 'text-green-600 bg-green-100';
    if (hoursSinceLastUsed < 24) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getStatusText = (lastUsed: Date) => {
    const hoursSinceLastUsed = (Date.now() - lastUsed.getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastUsed < 1) return 'Active';
    if (hoursSinceLastUsed < 24) return 'Recent';
    return 'Idle';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading AI Assistants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Assistants Dashboard</h1>
              <p className="text-gray-600">Monitor and manage your persistent AI assistants</p>
            </div>
            <button
              onClick={loadAssistantData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Assistants</p>
                <p className="text-2xl font-bold text-gray-900">{assistants.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Interactions</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalInteractions?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(systemStats.avgResponseTime || 0)}ms</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round((systemStats.overallSuccessRate || 0) * 100)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assistants Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {assistants.map((assistant) => (
            <div
              key={assistant.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedAssistant(assistant)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                    {getAssistantIcon(assistant.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{assistant.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{assistant.type} Assistant</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assistant.lastUsed)}`}>
                  {getStatusText(assistant.lastUsed)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Interactions</span>
                  <span className="text-sm font-medium">{assistant.totalInteractions.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Threads</span>
                  <span className="text-sm font-medium">{assistant.activeThreads.size}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="text-sm font-medium">{Math.round(assistant.performance.successRate * 100)}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Response</span>
                  <span className="text-sm font-medium">{Math.round(assistant.performance.averageResponseTime)}ms</span>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Satisfaction</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{assistant.performance.userSatisfaction.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                <Eye className="h-4 w-4 mr-2" />
                View Details
                <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Assistant Detail Modal */}
        {selectedAssistant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                      {getAssistantIcon(selectedAssistant.type)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedAssistant.name}</h2>
                      <p className="text-gray-600 capitalize">{selectedAssistant.type} Assistant</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAssistant(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Performance Metrics */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Performance Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Total Interactions</span>
                        <span className="font-medium">{selectedAssistant.totalInteractions.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Success Rate</span>
                        <span className="font-medium">{Math.round(selectedAssistant.performance.successRate * 100)}%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Average Response Time</span>
                        <span className="font-medium">{Math.round(selectedAssistant.performance.averageResponseTime)}ms</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">User Satisfaction</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="font-medium">{selectedAssistant.performance.userSatisfaction.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Threads */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Active Conversations</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {Array.from(selectedAssistant.activeThreads.entries()).map(([entityId, threadId]) => (
                        <div
                          key={entityId}
                          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100"
                          onClick={() => loadConversationHistory(selectedAssistant, entityId)}
                        >
                          <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="text-sm font-medium">Entity {entityId.slice(0, 8)}...</span>
                          </div>
                          <span className="text-xs text-blue-600">View Chat</span>
                        </div>
                      ))}
                      {selectedAssistant.activeThreads.size === 0 && (
                        <p className="text-gray-500 text-center py-4">No active conversations</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Assistant Instructions</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedAssistant.instructions || 'No specific instructions configured.'}</p>
                  </div>
                </div>

                {/* Conversation History */}
                {conversationHistory.length > 0 && (
                  <div className="space-y-4 mt-6">
                    <h3 className="font-semibold text-gray-900">Recent Conversation</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-4">
                      {conversationHistory.slice(0, 10).map((message, index) => (
                        <div key={index} className={`p-2 rounded ${message.role === 'user' ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-600 capitalize">{message.role}</span>
                            <span className="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm text-gray-700">{message.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {assistants.length === 0 && (
          <div className="text-center py-16">
            <Bot className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No AI Assistants Found</h3>
            <p className="text-gray-500 mb-6">Your AI assistants will appear here once they're initialized.</p>
            <button
              onClick={() => persistentAssistantService.initialize()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Initialize Assistants
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantsDashboard;
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Bot, 
  Plus, 
  Settings, 
  MessageSquare, 
  Brain, 
  Zap,
  Clock,
  Users,
  BarChart3,
  Play,
  Pause,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Star,
  Activity,
  User,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { ModernButton } from '../components/ui/ModernButton';
import AIAssistantChat from '../components/aiTools/AIAssistantChat';

interface Assistant {
  id: string;
  name: string;
  description: string;
  model: string;
  status: 'active' | 'inactive' | 'training';
  conversations: number;
  lastUsed: string;
  avatar?: string;
  tools: string[];
  instructions: string;
  created: string;
}

const AssistantsDashboard: React.FC = () => {
  const { isDark } = useTheme();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Sample assistants data
  useEffect(() => {
    const sampleAssistants: Assistant[] = [
      {
        id: '1',
        name: 'Sales Coach',
        description: 'Specialized in sales process optimization and deal coaching',
        model: 'gpt-4o',
        status: 'active',
        conversations: 45,
        lastUsed: '2 hours ago',
        tools: ['CRM Integration', 'Email Composer', 'Deal Analysis'],
        instructions: 'You are a sales coach focused on helping sales representatives improve their performance.',
        created: '2024-01-15'
      },
      {
        id: '2',
        name: 'Customer Support',
        description: 'Handles customer inquiries and support tickets',
        model: 'gpt-4o-mini',
        status: 'active',
        conversations: 128,
        lastUsed: '15 minutes ago',
        tools: ['Knowledge Base', 'Ticket Management', 'Escalation'],
        instructions: 'You are a helpful customer support assistant.',
        created: '2024-01-10'
      },
      {
        id: '3',
        name: 'Market Researcher',
        description: 'Analyzes market trends and competitor intelligence',
        model: 'gpt-4o',
        status: 'training',
        conversations: 12,
        lastUsed: '1 day ago',
        tools: ['Web Scraping', 'Data Analysis', 'Report Generation'],
        instructions: 'You are a market research analyst providing insights on industry trends.',
        created: '2024-01-20'
      }
    ];
    setAssistants(sampleAssistants);
  }, []);

  const filteredAssistants = assistants.filter(assistant => {
    const matchesSearch = assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assistant.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || assistant.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <AlertCircle className="w-4 h-4 text-gray-400" />;
      case 'training': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-600';
      case 'training': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            AI Assistants Dashboard
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Manage and monitor your AI assistants
          </p>
        </div>
        
        <ModernButton
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Assistant</span>
        </ModernButton>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Assistants
              </p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {assistants.length}
              </p>
            </div>
            <Bot className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Active Assistants
              </p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {assistants.filter(a => a.status === 'active').length}
              </p>
            </div>
            <Activity className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Conversations
              </p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {assistants.reduce((sum, a) => sum + a.conversations, 0)}
              </p>
            </div>
            <MessageSquare className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Models Used
              </p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {new Set(assistants.map(a => a.model)).size}
              </p>
            </div>
            <Brain className={`w-8 h-8 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
          </div>
        </GlassCard>
      </div>

      {/* Filters and Search */}
      <GlassCard className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search assistants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className={`px-3 py-2 border rounded-lg ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Assistants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAssistants.map((assistant) => (
          <GlassCard key={assistant.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-blue-600' : 'bg-blue-100'} flex items-center justify-center`}>
                  <Bot className={`w-6 h-6 ${isDark ? 'text-white' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {assistant.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusIcon(assistant.status)}
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(assistant.status)}`}>
                      {assistant.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button 
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}
                  onClick={() => {
                    setSelectedAssistant(assistant);
                    setShowChatModal(true);
                  }}
                >
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                </button>
                <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}>
                  <Settings className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              {assistant.description}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Model:</span>
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {assistant.model}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Conversations:</span>
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {assistant.conversations}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Last Used:</span>
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {assistant.lastUsed}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-1">
                {assistant.tools.slice(0, 2).map((tool, index) => (
                  <span 
                    key={index}
                    className={`text-xs px-2 py-1 rounded-full ${
                      isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tool}
                  </span>
                ))}
                {assistant.tools.length > 2 && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    +{assistant.tools.length - 2} more
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <ModernButton
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedAssistant(assistant);
                  setShowChatModal(true);
                }}
                className="flex-1 flex items-center justify-center space-x-1"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Chat</span>
              </ModernButton>
              
              <ModernButton
                size="sm"
                variant="outline"
                className="flex items-center justify-center"
              >
                <Eye className="w-3 h-3" />
              </ModernButton>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Chat Modal */}
      {showChatModal && selectedAssistant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-4xl h-[80vh] rounded-xl shadow-xl ${
            isDark ? 'bg-gray-900' : 'bg-white'
          } flex flex-col`}>
            <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Chat with {selectedAssistant.name}
              </h3>
              <button
                onClick={() => setShowChatModal(false)}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
              >
                ×
              </button>
            </div>
            <div className="flex-1 p-4">
              <AIAssistantChat />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantsDashboard;
