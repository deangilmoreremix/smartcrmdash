import React, { useState, useEffect, useMemo } from 'react';
import { Goal, GoalCategory, AIGoalContext } from '../types/goals';
import { allGoals, goalCategories } from '../data/completeGoalsData';
import InteractiveGoalCard from './InteractiveGoalCard';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  BarChart3, 
  Target, 
  Users, 
  Zap,
  Brain,
  Sparkles,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';

interface InteractiveGoalExplorerProps {
  realMode?: boolean;
  onModeToggle?: (mode: boolean) => void;
  onGoalSelected?: (goal: Goal) => void;
  contextData?: AIGoalContext | null;
  className?: string;
}

const InteractiveGoalExplorer: React.FC<InteractiveGoalExplorerProps> = ({
  realMode = false,
  onModeToggle,
  onGoalSelected,
  contextData,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [executingGoals, setExecutingGoals] = useState<Set<string>>(new Set());
  const [completedGoals, setCompletedGoals] = useState<Set<string>>(new Set());

  // Use the complete goals data
  const goals: Goal[] = useMemo(() => allGoals, []);

  // Filter goals based on search and filters
  const filteredGoals = useMemo(() => {
    let filtered = goals;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(goal => 
        goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(goal => goal.category === selectedCategory);
    }

    // Priority filter
    if (selectedPriority !== 'All') {
      filtered = filtered.filter(goal => goal.priority === selectedPriority);
    }

    // Complexity filter
    if (selectedComplexity !== 'All') {
      filtered = filtered.filter(goal => goal.complexity === selectedComplexity);
    }

    // Context-based filtering
    if (contextData) {
      filtered = filtered.filter(goal => 
        !goal.recommendedFor || goal.recommendedFor.includes(contextData.type)
      );
    }

    return filtered;
  }, [goals, searchQuery, selectedCategory, selectedPriority, selectedComplexity, contextData]);

  // Goal execution handler
  const handleGoalExecute = (goal: Goal) => {
    if (executingGoals.has(goal.id)) return;

    setExecutingGoals(prev => new Set([...Array.from(prev), goal.id]));
    
    // Simulate execution
    const executionTime = realMode ? 5000 + Math.random() * 10000 : 2000 + Math.random() * 3000;
    
    setTimeout(() => {
      setExecutingGoals(prev => {
        const newSet = new Set(prev);
        newSet.delete(goal.id);
        return newSet;
      });
      setCompletedGoals(prev => new Set([...Array.from(prev), goal.id]));
      
      if (onGoalSelected) {
        onGoalSelected(goal);
      }
    }, executionTime);
  };

  // Goal preview handler
  const handleGoalPreview = (goal: Goal) => {
    if (onGoalSelected) {
      onGoalSelected(goal);
    }
  };

  // Get category stats
  const categoryStats = useMemo(() => {
    return goalCategories.map(category => ({
      ...category,
      count: goals.filter(goal => goal.category === category.id).length,
      completedCount: goals.filter(goal => 
        goal.category === category.id && completedGoals.has(goal.id)
      ).length
    }));
  }, [goals, completedGoals]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{goals.length}</div>
              <div className="text-blue-100 text-sm">Total Goals</div>
            </div>
            <Target className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{completedGoals.size}</div>
              <div className="text-green-100 text-sm">Completed</div>
            </div>
            <Sparkles className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{executingGoals.size}</div>
              <div className="text-orange-100 text-sm">Executing</div>
            </div>
            <Brain className="h-8 w-8 text-orange-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{goalCategories.length}</div>
              <div className="text-purple-100 text-sm">Categories</div>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search goals by title, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
            
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 border-l border-gray-300 dark:border-gray-600 ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="All">All Categories</option>
                {goalCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Complexity</label>
              <select
                value={selectedComplexity}
                onChange={(e) => setSelectedComplexity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="All">All Complexity</option>
                <option value="Simple">Simple</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {selectedCategory === 'All' ? 'All AI Goals' : `${selectedCategory} Goals`}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredGoals.length} goal{filteredGoals.length !== 1 ? 's' : ''} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>
        
        {filteredGoals.length > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total estimated setup time: {Math.round(filteredGoals.length * 1.5)} - {Math.round(filteredGoals.length * 3)} hours
          </div>
        )}
      </div>

      {/* Goals Grid/List */}
      {filteredGoals.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No goals found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search criteria or filters to find relevant AI goals.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedPriority('All');
              setSelectedComplexity('All');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredGoals.map((goal) => (
            <InteractiveGoalCard
              key={goal.id}
              goal={goal}
              onExecute={handleGoalExecute}
              onPreview={handleGoalPreview}
              isExecuting={executingGoals.has(goal.id)}
              isCompleted={completedGoals.has(goal.id)}
              realMode={realMode}
            />
          ))}
        </div>
      )}

      {/* Category Overview */}
      {selectedCategory === 'All' && filteredGoals.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Category Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryStats.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 text-left"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-3`}>
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{category.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {category.completedCount}/{category.count} completed
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveGoalExplorer;