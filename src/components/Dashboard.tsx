import React, { useState, useEffect } from 'react';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';
import { useGemini } from '../services/geminiService';
import { useTaskStore } from '../store/taskStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useAITools } from './AIToolsProvider';
import { useTheme } from '../contexts/ThemeContext';
import { useDashboardLayout } from '../contexts/DashboardLayoutContext';
import AppointmentWidget from './AppointmentWidget';
import DealAnalytics from './DealAnalytics';
import HelpTooltip from './ui/HelpTooltip';
import LeadsSection from './LeadsSection';
import TasksSection from './TasksSection';
import DraggableSection from './DraggableSection';
import DashboardLayoutControls from './DashboardLayoutControls';
import Avatar from './ui/Avatar';
import { getInitials } from '../utils/avatars';
import { useEnhancedHelp } from '../contexts/EnhancedHelpContext';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  Calendar, 
  Clock,
  Zap, 
  ChevronRight, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  CheckCircle,
  Users,
  Briefcase,
  Tag,
  Building,
  Mail,
  CheckSquare,
  Plus,
  Search,
  ExternalLink,
  Grid3X3,
  Megaphone,
  FileText,
  Settings,
  Palette,
  RefreshCw,
  Target,
  Award,
  Phone,
  Video
} from 'lucide-react';

// Import the dashboard components
import MetricsCards from './dashboard/MetricsCards';
import InteractionHistory from './dashboard/InteractionHistory';
import TasksAndFunnel from './dashboard/TasksAndFunnel';
import CustomerProfile from './dashboard/CustomerProfile';
import RecentActivity from './dashboard/RecentActivity';
import DashboardHeader from './dashboard/DashboardHeader';
import ChartsSection from './dashboard/ChartsSection';
import ConnectedApps from './dashboard/ConnectedApps';
import AIInsightsPanel from './dashboard/AIInsightsPanel';
import NewLeadsSection from './dashboard/NewLeadsSection';
import KPICards from './dashboard/KPICards';
import QuickActions from './dashboard/QuickActions';

// Import AI tools components
import StreamingChat from './aiTools/StreamingChat';
import SmartSearchRealtime from './aiTools/SmartSearchRealtime';
import LiveDealAnalysis from './aiTools/LiveDealAnalysis';

// Import recharts components for data visualization
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard: React.FC = () => {
  const { 
    deals, 
    fetchDeals, 
    isLoading,
    stageValues,
    totalPipelineValue 
  } = useDealStore();
  
  const { 
    contacts, 
    fetchContacts, 
    isLoading: contactsLoading 
  } = useContactStore();
  
  const { tasks, fetchTasks } = useTaskStore();
  const { fetchAppointments } = useAppointmentStore();
  const { openTool } = useAITools();
  const { showTours } = useEnhancedHelp();
  const { isDark } = useTheme();
  const { sectionOrder } = useDashboardLayout();
  
  const gemini = useGemini();
  
  const [pipelineInsight, setPipelineInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timeframe, setTimeframe] = useState('month');
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [aiMetrics, setAiMetrics] = useState({
    activeSuggestions: 12,
    acceptedSuggestions: 8,
    efficiency: 32,
    qualityScore: 87
  });
  
  useEffect(() => {
    // Fetch all data when component mounts
    fetchDeals();
    fetchContacts();
    fetchTasks();
    fetchAppointments();
    
    // Generate AI recommendations
    generateRecommendations();
    
    // Set up timer to refresh data periodically
    const intervalId = setInterval(() => {
      fetchDeals();
      fetchContacts();
    }, 300000); // refresh every 5 minutes
    
    return () => clearInterval(intervalId);
  }, []);
  
  const generateRecommendations = async () => {
    try {
      // Simulate AI recommendations based on actual CRM data
      const contactsArray = Object.values(contacts);
      const dealsArray = Object.values(deals);
      
      const recommendations = [
        {
          id: 1,
          title: 'Follow up with Microsoft Deal',
          description: 'Enterprise Software License has been in negotiation for 5 days',
          type: 'deal',
          priority: 'high',
          action: 'Schedule Follow-up',
          entityId: '1'
        },
        {
          id: 2,
          title: 'Nurture Ford Contact',
          description: 'Darlene Robertson shows warm interest, consider sending proposal',
          type: 'contact',
          priority: 'medium',
          action: 'Send Proposal',
          entityId: '2'
        },
        {
          id: 3,
          title: 'Pipeline Health Check',
          description: 'Strong conversion rate increase detected this month',
          type: 'general',
          priority: 'low',
          action: 'Review Analytics',
          entityId: null
        }
      ];
      
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setAiRecommendations([]);
    }
  };
  
  // Generate AI insight for the pipeline using real data
  const generatePipelineInsight = async () => {
    setIsAnalyzing(true);
    
    try {
      // Convert contacts object to array for analysis
      const contactsArray = Object.values(contacts);
      const dealsArray = Object.values(deals);
      
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const insights = [
        "Your pipeline shows strong momentum with $245K in active deals.",
        "The Microsoft enterprise deal in negotiation stage represents 31% of your total pipeline value.",
        "Consider focusing on the high-probability deals (>70%) to maximize this month's revenue.",
        "Your average deal size of $61K is above industry standards - excellent work!",
        "2 deals have been stalled for over 10 days and may need immediate attention."
      ];
      
      const randomInsight = insights[Math.floor(Math.random() * insights.length)];
      setPipelineInsight(randomInsight);
    } catch (error) {
      console.error('Error generating pipeline insight:', error);
      setPipelineInsight('Unable to generate insights at this time. Please ensure your data is up-to-date and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Render section content based on section ID
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'metrics-cards-section':
        return <MetricsCards />;

      case 'kpi-cards-section':
        return <KPICards />;

      case 'quick-actions-section':
        return <QuickActions />;
        
      case 'ai-insights-section':
        return <AIInsightsPanel />;

      case 'interaction-history-section':
        return <InteractionHistory />;

      case 'customer-profile-section':
        return <CustomerProfile />;

      case 'recent-activity-section':
        return <RecentActivity />;

      case 'tasks-and-funnel-section':
        return <TasksAndFunnel />;

      case 'charts-section':
        return <ChartsSection />;

      case 'pipeline-section':
        return (
          <div className="mb-12 scroll-mt-20">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mr-3">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Pipeline & Deal Analytics</h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Comprehensive deal performance and pipeline health</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Deal Analysis - takes 2 columns */}
              <div className={`lg:col-span-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl overflow-hidden`}>
                <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'} flex justify-between items-center`}>
                  <h3 className={`font-semibold flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <Zap size={18} className="text-purple-600 mr-2" />
                    Live Deal Analysis
                  </h3>
                  <button className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} flex items-center`}>
                    View all deals <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
                <div className="p-4">
                  <LiveDealAnalysis />
                </div>
              </div>

              {/* Quick AI Tools */}
              <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Tools</h3>
                  <HelpTooltip 
                    content="Quick access to AI-powered sales tools for email composition, meeting planning, and proposal generation."
                    placement="left"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => openTool('email-composer')}
                    className={`p-3 border ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'} rounded-lg transition-colors text-left`}
                  >
                    <div className="p-2 rounded-lg bg-blue-500/20 inline-block mb-2">
                      <Mail size={16} className="text-blue-400" />
                    </div>
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} text-sm`}>Email Composer</h4>
                  </button>
                  
                  <button
                    onClick={() => openTool('meeting-agenda')}
                    className={`p-3 border ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'} rounded-lg transition-colors text-left`}
                  >
                    <div className="p-2 rounded-lg bg-green-500/20 inline-block mb-2">
                      <Calendar size={16} className="text-green-400" />
                    </div>
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} text-sm`}>Meeting Agenda</h4>
                  </button>
                  
                  <button
                    onClick={() => openTool('proposal-generator')}
                    className={`p-3 border ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'} rounded-lg transition-colors text-left`}
                  >
                    <div className="p-2 rounded-lg bg-purple-500/20 inline-block mb-2">
                      <FileText size={16} className="text-purple-400" />
                    </div>
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} text-sm`}>Proposal Generator</h4>
                  </button>
                  
                  <button
                    onClick={() => openTool('business-analysis')}
                    className={`p-3 border ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'} rounded-lg transition-colors text-left`}
                  >
                    <div className="p-2 rounded-lg bg-orange-500/20 inline-block mb-2">
                      <Zap size={16} className="text-orange-400" />
                    </div>
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} text-sm`}>Business Analysis</h4>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'contacts-section':
        return (
          <div className="mb-12 scroll-mt-20">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mr-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Contacts & Leads Management</h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage and nurture your prospect relationships</p>
              </div>
            </div>
            
            <NewLeadsSection />
          </div>
        );

      case 'tasks-section':
        return (
          <div className="mb-12 scroll-mt-20">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mr-3">
                <CheckSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Tasks & Activities</h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage your daily activities and appointments</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tasks Section - spans 2 columns */}
              <div className="lg:col-span-2">
                <TasksSection />
              </div>

              {/* Appointments and Quick Actions */}
              <div className="space-y-6">
                {/* Upcoming Appointments */}
                <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl overflow-hidden`}>
                  <AppointmentWidget limit={3} />
                </div>
                
                {/* Quick Actions */}
                <div className={`bg-white/5 backdrop-blur-xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
                    <HelpTooltip 
                      content="These buttons let you quickly create new deals and contacts, or open AI tools for scheduling and email composition."
                      placement="left"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button className={`p-3 text-center ${isDark ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' : 'bg-blue-50 hover:bg-blue-100 text-blue-700'} rounded-lg transition-colors duration-200`}>
                      <Plus size={20} className="mx-auto mb-1" />
                      <span className="text-sm">New Deal</span>
                    </button>
                    
                    <button className={`p-3 text-center ${isDark ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400' : 'bg-green-50 hover:bg-green-100 text-green-700'} rounded-lg transition-colors duration-200`}>
                      <Plus size={20} className="mx-auto mb-1" />
                      <span className="text-sm">New Contact</span>
                    </button>
                    
                    <button 
                      onClick={() => openTool('meeting-agenda')}
                      className={`p-3 text-center ${isDark ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400' : 'bg-purple-50 hover:bg-purple-100 text-purple-700'} rounded-lg transition-colors duration-200`}
                    >
                      <Calendar size={20} className="mx-auto mb-1" />
                      <span className="text-sm">Schedule</span>
                    </button>
                    
                    <button 
                      onClick={() => openTool('email-composer')}
                      className={`p-3 text-center ${isDark ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400' : 'bg-amber-50 hover:bg-amber-100 text-amber-700'} rounded-lg transition-colors duration-200`}
                    >
                      <Mail size={20} className="mx-auto mb-1" />
                      <span className="text-sm">Send Email</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'apps-section':
        return (
          <div className="mb-12 scroll-mt-20">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl mr-3">
                <Grid3X3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Connected Apps & Integrations</h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Access your entire business toolkit</p>
              </div>
            </div>
            
            {/* Connected Apps Section */}
            <ConnectedApps />
          </div>
        );

      case 'analytics-section':
        return (
          <div className="mb-8 scroll-mt-20">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mr-3">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Comprehensive Analytics</h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Detailed charts and performance metrics</p>
              </div>
            </div>
            
            {/* DealAnalytics Component with Dark Theme */}
            <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
              <DealAnalytics />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 relative">
      {/* Dashboard Layout Controls */}
      <DashboardLayoutControls />

      {/* Dashboard Header */}
      <DashboardHeader />

      {/* Draggable Sections */}
      <div className="space-y-8">
        {sectionOrder.map((sectionId, index) => (
          <DraggableSection
            key={sectionId}
            sectionId={sectionId}
            index={index}
          >
            <div id={sectionId}>
              {renderSectionContent(sectionId)}
            </div>
          </DraggableSection>
        ))}
      </div>
    </main>
  );
};

export default Dashboard;