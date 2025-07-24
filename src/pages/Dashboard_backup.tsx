import React from 'react';
import Dashboard from '../components/Dashboard';

const DashboardPage: React.FC = () => {
  return <Dashboard />;
};

export default DashboardPage;

interface Task {
  id: string;
  title: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

interface AIRecommendation {
  id: string;
  type: 'deal' | 'contact' | 'task';
  title: string;
  description: string;
  action: string;
}

const Dashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState('month');
  const [pipelineInsight, setPipelineInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sample data - replace with real data from stores
  const metrics = {
    totalActiveDeals: 24,
    totalPipelineValue: 485000,
    totalClosingThisMonth: 8,
    totalAtRisk: 3
  };

  const aiMetrics = {
    activeSuggestions: 12,
    acceptedSuggestions: 8,
    efficiency: 85,
    qualityScore: 92
  };

  // Sample tasks data
  const importantTasks: Task[] = [
    {
      id: '1',
      title: 'Follow up with Acme Corp decision maker',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      priority: 'high',
      completed: false
    },
    {
      id: '2',
      title: 'Prepare proposal for TechStart Inc',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      priority: 'medium',
      completed: false
    },
    {
      id: '3',
      title: 'Review quarterly sales metrics',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      priority: 'low',
      completed: true
    }
  ];

  // Sample AI recommendations
  const aiRecommendations: AIRecommendation[] = [
    {
      id: '1',
      type: 'deal',
      title: 'High-value deal needs attention',
      description: 'TechCorp deal ($50k) hasn\'t been updated in 5 days',
      action: 'Update'
    },
    {
      id: '2',
      type: 'contact',
      title: 'Follow up opportunity',
      description: 'Sarah Johnson opened your email 3 times',
      action: 'Call'
    },
    {
      id: '3',
      type: 'task',
      title: 'Overdue task reminder',
      description: 'Contract review is 2 days overdue',
      action: 'Complete'
    }
  ];

  // Sample chart data
  const performanceData = [
    { name: 'Jan', revenue: 65000, deals: 12 },
    { name: 'Feb', revenue: 78000, deals: 15 },
    { name: 'Mar', revenue: 92000, deals: 18 },
    { name: 'Apr', revenue: 81000, deals: 14 },
    { name: 'May', revenue: 95000, deals: 19 },
    { name: 'Jun', revenue: 110000, deals: 22 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  };

  const generatePipelineInsight = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setPipelineInsight(
        "Your pipeline shows strong momentum with 24 active deals worth $485K. The biggest opportunity is in enterprise accounts, which make up 60% of your pipeline value. Consider focusing on the 3 at-risk deals to prevent revenue loss."
      );
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Sparkles className="text-blue-600 mr-3" size={32} />
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Your real-time sales performance overview</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative inline-block">
              <select 
                className="appearance-none pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={timeframe}
                onChange={e => setTimeframe(e.target.value)}
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* AI Insight Panel */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl shadow-sm p-6 border border-blue-100 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg mr-4">
            <Brain size={24} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold text-gray-900">AI Pipeline Intelligence</h2>
              <button 
                onClick={generatePipelineInsight}
                disabled={isAnalyzing}
                className="text-xs text-blue-700 hover:text-blue-900 px-3 py-1 bg-white rounded-full"
              >
                {isAnalyzing ? 'Analyzing...' : pipelineInsight ? 'Refresh' : 'Generate Insight'}
              </button>
            </div>
            
            {isAnalyzing ? (
              <div className="mt-2 flex items-center text-blue-700">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                <p>Analyzing your pipeline and generating insights...</p>
              </div>
            ) : pipelineInsight ? (
              <p className="mt-2 text-gray-700">{pipelineInsight}</p>
            ) : (
              <p className="mt-2 text-gray-600">Generate AI-powered insights to understand your pipeline health and get strategic recommendations.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
          <div className="rounded-full p-3 mr-4 bg-gradient-to-r from-blue-50 to-blue-100">
            <Briefcase className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Deals</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold">{metrics.totalActiveDeals}</p>
              <p className="ml-2 text-xs text-green-500 flex items-center">
                <ArrowUpRight size={12} className="mr-0.5" />
                12%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
          <div className="rounded-full p-3 mr-4 bg-gradient-to-r from-indigo-50 to-indigo-100">
            <DollarSign className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pipeline Value</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold">{formatCurrency(metrics.totalPipelineValue)}</p>
              <p className="ml-2 text-xs text-green-500 flex items-center">
                <ArrowUpRight size={12} className="mr-0.5" />
                8%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
          <div className="rounded-full p-3 mr-4 bg-gradient-to-r from-purple-50 to-purple-100">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Closing This Month</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold">{metrics.totalClosingThisMonth}</p>
              <p className="ml-2 text-xs text-red-500 flex items-center">
                <ArrowDownRight size={12} className="mr-0.5" />
                3%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
          <div className="rounded-full p-3 mr-4 bg-gradient-to-r from-amber-50 to-amber-100">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Deals At Risk</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold">{metrics.totalAtRisk}</p>
              <p className="ml-2 text-xs text-amber-500 flex items-center">
                <ArrowUpRight size={12} className="mr-0.5" />
                2
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Performance Metrics */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-indigo-100 mb-6">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 mr-3">
            <Brain size={18} />
          </div>
          <h2 className="text-lg font-semibold">AI Enhancement Metrics</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500">Active Suggestions</p>
            <p className="text-2xl font-semibold mt-1">{aiMetrics.activeSuggestions}</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${aiMetrics.activeSuggestions * 5}%` }}></div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Suggestions Accepted</p>
            <p className="text-2xl font-semibold mt-1">{aiMetrics.acceptedSuggestions}</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${aiMetrics.acceptedSuggestions * 10}%` }}></div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Efficiency Boost</p>
            <p className="text-2xl font-semibold mt-1">{aiMetrics.efficiency}%</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${aiMetrics.efficiency}%` }}></div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">AI Quality Score</p>
            <p className="text-2xl font-semibold mt-1">{aiMetrics.qualityScore}/100</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${aiMetrics.qualityScore}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Performance Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 size={20} className="text-blue-600 mr-2" />
                Sales Performance
              </h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md">Revenue</button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">Deals</button>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'revenue' ? `$${value.toLocaleString()}` : value,
                      name === 'revenue' ? 'Revenue' : 'Deals Closed'
                    ]}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="deals" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Right Column - Tasks and AI Recommendations */}
        <div className="space-y-6">
          {/* Important Tasks */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckSquare size={20} className="text-indigo-600 mr-2" />
                Important Tasks
              </h2>
              <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                View all <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
            
            {importantTasks.length > 0 ? (
              <div className="space-y-3">
                {importantTasks.map(task => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        className="h-4 w-4 mt-0.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        readOnly
                      />
                      <div>
                        <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center mt-1">
                          <Clock size={12} className="text-gray-400 mr-1" />
                          <span className={`text-xs ${
                            !task.completed && task.dueDate && task.dueDate < new Date() 
                              ? 'text-red-600 font-medium' 
                              : 'text-gray-500'
                          }`}>
                            {formatDate(task.dueDate)}
                          </span>
                          {task.priority && (
                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                              task.priority === 'high' ? 'bg-red-100 text-red-800' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {task.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No important tasks at the moment.</p>
            )}
          </div>
          
          {/* AI Recommendations */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Brain size={20} className="text-indigo-600 mr-2" />
                AI Recommendations
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View all
              </button>
            </div>
            
            <div className="divide-y divide-gray-100">
              {aiRecommendations.map((rec) => (
                <div key={rec.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start">
                    <div className={`p-1.5 rounded-full ${
                      rec.type === 'deal' ? 'bg-purple-100 text-purple-600' :
                      rec.type === 'contact' ? 'bg-blue-100 text-blue-600' :
                      'bg-green-100 text-green-600'
                    } mr-3 mt-0.5`}>
                      {rec.type === 'deal' ? (
                        <Briefcase size={16} />
                      ) : rec.type === 'contact' ? (
                        <Users size={16} />
                      ) : (
                        <BarChart3 size={16} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{rec.title}</h3>
                      <p className="text-xs text-gray-500">{rec.description}</p>
                    </div>
                    <button className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap">
                      {rec.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Section - Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 text-center bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 transition-colors">
              <Plus size={20} className="mx-auto mb-1" />
              <span className="text-sm">New Deal</span>
            </button>
            <button className="p-3 text-center bg-green-50 hover:bg-green-100 rounded-lg text-green-700 transition-colors">
              <Plus size={20} className="mx-auto mb-1" />
              <span className="text-sm">New Contact</span>
            </button>
            <button className="p-3 text-center bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 transition-colors">
              <Calendar size={20} className="mx-auto mb-1" />
              <span className="text-sm">Schedule</span>
            </button>
            <button className="p-3 text-center bg-amber-50 hover:bg-amber-100 rounded-lg text-amber-700 transition-colors">
              <Mail size={20} className="mx-auto mb-1" />
              <span className="text-sm">Send Email</span>
            </button>
          </div>
        </div>
        
        {/* Recent Activity Preview */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Link to="/activity" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              View all <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-600">Deal closed: TechCorp ($25K)</span>
              <span className="ml-auto text-gray-400">2h ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-gray-600">New contact added: Jane Smith</span>
              <span className="ml-auto text-gray-400">4h ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-gray-600">Task completed: Follow up call</span>
              <span className="ml-auto text-gray-400">6h ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
