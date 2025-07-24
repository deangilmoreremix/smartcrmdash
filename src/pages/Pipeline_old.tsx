import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Briefcase, 
  ChevronRight, 
  Plus, 
  RefreshCw, 
  Filter, 
  ArrowUp, 
  ArrowDown, 
  Brain, 
  X,
  Move,
  Calendar,
  DollarSign,
  User,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  MessageSquare,
  Zap,
  TrendingUp,
  Eye,
  Edit2,
  Trash2
} from 'lucide-react';
import DealKanbanBoard from '../components/DealKanbanBoard';
import DealDetailsModal from '../components/DealDetailsModal';
import RevenueForecasting from '../components/RevenueForecasting';
import SalesVelocityChart from '../components/SalesVelocityChart';
import { useDealStore } from '../store/dealStore';
import { Deal as DealType } from '../types/deal';

// Deal interface
interface Deal {
  id: string;
  title: string;
  value: number;
  stage: 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  company: string;
  contact: string;
  contactId?: string;
  probability: number;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  daysInStage?: number;
  description?: string;
}

// Sample data
const sampleDeals: Deal[] = [
  {
    id: 'deal-1',
    title: 'Enterprise Software License',
    value: 75000,
    stage: 'qualification',
    company: 'Tech Corp',
    contact: 'John Smith',
    probability: 25,
    priority: 'high',
    dueDate: new Date('2024-02-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    daysInStage: 5,
    description: 'Large enterprise client looking for comprehensive software solution'
  },
  {
    id: 'deal-2',
    title: 'Cloud Migration Project',
    value: 45000,
    stage: 'proposal',
    company: 'StartupInc',
    contact: 'Sarah Johnson',
    probability: 60,
    priority: 'medium',
    dueDate: new Date('2024-02-20'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25'),
    daysInStage: 10,
    description: 'Cloud infrastructure migration and optimization'
  },
  {
    id: 'deal-3',
    title: 'Security Audit Services',
    value: 25000,
    stage: 'negotiation',
    company: 'SecureBase',
    contact: 'Mike Chen',
    probability: 75,
    priority: 'high',
    dueDate: new Date('2024-02-10'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-28'),
    daysInStage: 15,
    description: 'Comprehensive security assessment and implementation'
  },
  {
    id: 'deal-4',
    title: 'Marketing Automation Setup',
    value: 15000,
    stage: 'closed-won',
    company: 'Growth Co',
    contact: 'Lisa Wang',
    probability: 100,
    priority: 'medium',
    dueDate: new Date('2024-01-30'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-30'),
    daysInStage: 0,
    description: 'Complete marketing automation platform setup'
  }
];

// Pipeline stages configuration
const pipelineStages = [
  { id: 'qualification', title: 'Qualification', color: 'bg-blue-500' },
  { id: 'proposal', title: 'Proposal', color: 'bg-purple-500' },
  { id: 'negotiation', title: 'Negotiation', color: 'bg-orange-500' },
  { id: 'closed-won', title: 'Closed Won', color: 'bg-green-500' },
  { id: 'closed-lost', title: 'Closed Lost', color: 'bg-red-500' }
];

const Pipeline: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(sampleDeals);
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [sortBy, setSortBy] = useState<string>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [showDealDetail, setShowDealDetail] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  
  const [newDealData, setNewDealData] = useState<Partial<Deal>>({
    title: '',
    value: 0,
    stage: 'qualification',
    company: '',
    contact: '',
    probability: 25,
    priority: 'medium',
  });

  // Filter and sort deals
  const filteredDeals = deals.filter(deal => {
    // Search filter
    if (searchTerm && 
        !deal.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !deal.company.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (filterStatus !== 'all' && deal.stage !== filterStatus) {
      return false;
    }
    
    // Priority filter
    if (filterPriority !== 'all' && deal.priority !== filterPriority) {
      return false;
    }
    
    return true;
  });

  // Sort deals for list view
  const sortedDeals = [...filteredDeals].sort((a, b) => {
    if (sortBy === 'dueDate') {
      if (!a.dueDate || !b.dueDate) return 0;
      return sortOrder === 'asc' ? 
        a.dueDate.getTime() - b.dueDate.getTime() : 
        b.dueDate.getTime() - a.dueDate.getTime();
    }
    
    if (sortBy === 'value') {
      return sortOrder === 'asc' ? a.value - b.value : b.value - a.value;
    }
    
    if (sortBy === 'probability') {
      return sortOrder === 'asc' ? 
        a.probability - b.probability : 
        b.probability - a.probability;
    }
    
    // Default to title
    return sortOrder === 'asc' ? 
      a.title.localeCompare(b.title) : 
      b.title.localeCompare(a.title);
  });

  // Group deals by stage for kanban view
  const dealsByStage = pipelineStages.reduce((acc, stage) => {
    acc[stage.id] = filteredDeals.filter(deal => deal.stage === stage.id);
    return acc;
  }, {} as Record<string, Deal[]>);

  // Calculate stage values
  const stageValues = pipelineStages.reduce((acc, stage) => {
    acc[stage.id] = dealsByStage[stage.id].reduce((sum, deal) => sum + deal.value, 0);
    return acc;
  }, {} as Record<string, number>);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Handle deal click
  const handleDealClick = (dealId: string) => {
    setSelectedDeal(dealId);
    setShowDealDetail(true);
  };

  // Generate AI insight
  const generateAiInsight = async (dealId: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const insight = `Analysis for "${deal.title}": This ${formatCurrency(deal.value)} deal shows strong potential with ${deal.probability}% probability. Consider focusing on technical validation and stakeholder alignment. The ${deal.daysInStage || 0} days in ${deal.stage} stage is within normal range. Recommended next steps: 1) Schedule demo with decision makers, 2) Prepare customized proposal, 3) Address pricing concerns early.`;
      setAiInsight(insight);
      setIsAnalyzing(false);
    }, 2000);
  };

  // Add new deal
  const handleAddDeal = () => {
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      title: newDealData.title || 'New Deal',
      value: newDealData.value || 0,
      stage: newDealData.stage || 'qualification',
      company: newDealData.company || '',
      contact: newDealData.contact || '',
      probability: newDealData.probability || 25,
      priority: newDealData.priority || 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      daysInStage: 0
    };
    
    setDeals([...deals, newDeal]);
    setShowAddDealModal(false);
    setNewDealData({
      title: '',
      value: 0,
      stage: 'qualification',
      company: '',
      contact: '',
      probability: 25,
      priority: 'medium',
    });
  };

  // Calculate metrics
  const totalPipelineValue = deals.reduce((sum, deal) => 
    deal.stage !== 'closed-won' && deal.stage !== 'closed-lost' ? sum + deal.value : sum, 0
  );
  const activeDeals = deals.filter(deal => 
    deal.stage !== 'closed-won' && deal.stage !== 'closed-lost'
  ).length;
  const wonDeals = deals.filter(deal => deal.stage === 'closed-won').length;
  const avgDealSize = deals.length > 0 ? 
    deals.reduce((sum, deal) => sum + deal.value, 0) / deals.length : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-600 mt-1">Manage your deals with AI-powered insights</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            onClick={() => setShowAddDealModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            <Plus size={18} className="mr-1.5" />
            Add Deal
          </button>
        </div>
      </header>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pipeline Value</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalPipelineValue)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Deals</p>
              <p className="text-2xl font-semibold text-gray-900">{activeDeals}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Won Deals</p>
              <p className="text-2xl font-semibold text-gray-900">{wonDeals}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Deal Size</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(avgDealSize)}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-wrap items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search deals..."
                className="pl-10 pr-4 py-2 border rounded-md w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-md p-2 text-sm"
            >
              <option value="all">All Stages</option>
              <option value="qualification">Qualification</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed-won">Closed Won</option>
              <option value="closed-lost">Closed Lost</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border rounded-md p-2 text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          
          <div className="inline-flex shadow-sm rounded-md">
            <button 
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                viewMode === 'kanban' ? 
                  'bg-blue-600 text-white' : 
                  'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Kanban
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                viewMode === 'list' ? 
                  'bg-blue-600 text-white' : 
                  'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {filteredDeals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' ? 
              'Try adjusting your search or filters' : 
              'Get started by adding your first deal'}
          </p>
          <button 
            onClick={() => setShowAddDealModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={18} className="mr-1.5" />
            Add Your First Deal
          </button>
        </div>
      ) : (
        <>
          {viewMode === 'kanban' ? (
            // Kanban Board View
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 min-h-screen">
                {pipelineStages.map((stage) => {
                  const stageDeals = dealsByStage[stage.id];
                  return (
                    <div key={stage.id} className="flex flex-col">
                      {/* Column Header */}
                      <div className="rounded-t-lg p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-semibold text-gray-900">{stage.title}</h3>
                          <span className="text-sm bg-white px-2 py-1 rounded-full text-gray-700 shadow-sm border border-gray-200">
                            {stageDeals.length}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(stageValues[stage.id] || 0)}
                        </div>
                      </div>
                      
                      {/* Column Content */}
                      <div className="flex-1 min-h-[70vh] bg-gray-50 p-2 rounded-b-lg border-l border-r border-b border-gray-200 overflow-y-auto">
                        <div className="space-y-2">
                          {stageDeals.map((deal) => (
                            <div 
                              key={deal.id}
                              className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => handleDealClick(deal.id)}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900 text-sm">{deal.title}</h4>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  deal.priority === 'high' ? 'bg-red-100 text-red-800' :
                                  deal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {deal.priority}
                                </span>
                              </div>
                              
                              <div className="text-sm text-gray-600 mb-2">
                                <div className="flex items-center mb-1">
                                  <Briefcase size={12} className="mr-1 text-gray-400" />
                                  {deal.company}
                                </div>
                                <div className="flex items-center">
                                  <User size={12} className="mr-1 text-gray-400" />
                                  {deal.contact}
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-900">{formatCurrency(deal.value)}</span>
                                <div className="flex items-center text-xs text-gray-500">
                                  <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                                    <div 
                                      className="h-1.5 rounded-full bg-blue-500"
                                      style={{ width: `${deal.probability}%` }}
                                    ></div>
                                  </div>
                                  {deal.probability}%
                                </div>
                              </div>
                              
                              {deal.dueDate && (
                                <div className="flex items-center mt-2 text-xs text-gray-500">
                                  <Calendar size={12} className="mr-1" />
                                  Due {formatDate(deal.dueDate)}
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {stageDeals.length === 0 && (
                            <div className="p-4 text-center text-gray-500 text-sm bg-gray-100 rounded-lg border border-dashed border-gray-300">
                              No deals in this stage
                              <div className="mt-1">
                                <button
                                  onClick={() => {
                                    setNewDealData({
                                      ...newDealData,
                                      stage: stage.id as any
                                    });
                                    setShowAddDealModal(true);
                                  }}
                                  className="text-xs text-blue-600 flex items-center justify-center mt-2"
                                >
                                  <Plus size={12} className="mr-1" />
                                  Add deal
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // List View
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">All Deals ({filteredDeals.length})</h2>
                <div className="flex items-center space-x-2">
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border-gray-300 rounded-md text-sm"
                  >
                    <option value="dueDate">Due Date</option>
                    <option value="value">Value</option>
                    <option value="probability">Probability</option>
                    <option value="title">Title</option>
                  </select>
                  <button 
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-1.5 rounded-md border border-gray-300 bg-white text-gray-700"
                  >
                    {sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deal
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stage
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Probability
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedDeals.map(deal => (
                        <tr key={deal.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleDealClick(deal.id)}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="font-medium text-gray-900">{deal.title}</div>
                                <div className="text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <User size={12} className="mr-1 text-gray-400" />
                                    {deal.contact}
                                  </div>
                                  <div className="flex items-center">
                                    <Briefcase size={12} className="mr-1 text-gray-400" />
                                    {deal.company}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              deal.stage === 'qualification' ? 'bg-blue-100 text-blue-800' :
                              deal.stage === 'proposal' ? 'bg-indigo-100 text-indigo-800' :
                              deal.stage === 'negotiation' ? 'bg-purple-100 text-purple-800' :
                              deal.stage === 'closed-won' ? 'bg-green-100 text-green-800' :
                              deal.stage === 'closed-lost' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {deal.stage === 'closed-won' ? 'Closed Won' :
                               deal.stage === 'closed-lost' ? 'Closed Lost' :
                               deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
                            </span>
                            {deal.priority && (
                              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                deal.priority === 'high' ? 'bg-red-100 text-red-800' :
                                deal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {deal.priority}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(deal.value)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                                <div 
                                  className="h-1.5 rounded-full bg-blue-500"
                                  style={{ width: `${deal.probability}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-900">{deal.probability}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar size={12} className="mr-1 text-gray-400" />
                              {deal.dueDate ? formatDate(deal.dueDate) : 'Not set'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDeal(deal.id);
                                generateAiInsight(deal.id);
                              }}
                            >
                              <Zap size={18} />
                            </button>
                            <button
                              className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-purple-600 ml-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Open notes or edit
                              }}
                            >
                              <MessageSquare size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Deal Modal */}
      {showAddDealModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add New Deal</h3>
                  <button 
                    onClick={() => setShowAddDealModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Deal Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={newDealData.title}
                      onChange={(e) => setNewDealData({...newDealData, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={newDealData.company}
                        onChange={(e) => setNewDealData({...newDealData, company: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        id="contact"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={newDealData.contact}
                        onChange={(e) => setNewDealData({...newDealData, contact: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                        Deal Value
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          id="value"
                          className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={newDealData.value?.toString() || ''}
                          onChange={(e) => setNewDealData({...newDealData, value: parseInt(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="stage" className="block text-sm font-medium text-gray-700">
                        Stage
                      </label>
                      <select
                        id="stage"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={newDealData.stage}
                        onChange={(e) => setNewDealData({...newDealData, stage: e.target.value as any})}
                      >
                        <option value="qualification">Qualification</option>
                        <option value="proposal">Proposal</option>
                        <option value="negotiation">Negotiation</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="probability" className="block text-sm font-medium text-gray-700">
                        Probability (%)
                      </label>
                      <input
                        type="number"
                        id="probability"
                        min="0"
                        max="100"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={newDealData.probability}
                        onChange={(e) => setNewDealData({...newDealData, probability: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                        Priority
                      </label>
                      <select
                        id="priority"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={newDealData.priority}
                        onChange={(e) => setNewDealData({...newDealData, priority: e.target.value as any})}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAddDeal}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Create Deal
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddDealModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deal Detail Modal */}
      {showDealDetail && selectedDeal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Deal Details</h3>
                  <button 
                    onClick={() => setShowDealDetail(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {(() => {
                  const deal = deals.find(d => d.id === selectedDeal);
                  if (!deal) return null;
                  
                  return (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">{deal.title}</h4>
                        <p className="text-gray-600">{deal.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Company</label>
                          <p className="mt-1 text-sm text-gray-900">{deal.company}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Contact</label>
                          <p className="mt-1 text-sm text-gray-900">{deal.contact}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Value</label>
                          <p className="mt-1 text-sm text-gray-900">{formatCurrency(deal.value)}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Probability</label>
                          <p className="mt-1 text-sm text-gray-900">{deal.probability}%</p>
                        </div>
                      </div>
                      
                      {/* AI Insights */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="text-sm font-medium text-gray-900 flex items-center">
                            <Brain className="h-4 w-4 text-purple-600 mr-1" />
                            AI Insights
                          </h5>
                          <button
                            onClick={() => generateAiInsight(deal.id)}
                            disabled={isAnalyzing}
                            className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          >
                            {isAnalyzing ? 'Analyzing...' : 'Generate Insight'}
                          </button>
                        </div>
                        
                        {isAnalyzing && (
                          <div className="flex items-center space-x-2 text-gray-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm">Analyzing deal...</span>
                          </div>
                        )}
                        
                        {aiInsight && (
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <p className="text-sm text-gray-700">{aiInsight}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowDealDetail(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pipeline;
