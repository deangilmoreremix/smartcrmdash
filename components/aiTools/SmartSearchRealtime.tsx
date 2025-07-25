import React, { useState, useEffect, useRef } from 'react';
import { useGemini } from '../../services/geminiService';
import { useOpenAIEmbeddings } from '../../services/openaiEmbeddingsService';
import { useApiStore } from '../../store/apiStore';
import { Search, FileText, User, Briefcase, Clock, ArrowRight, RefreshCw, X, Sparkles, Filter, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Contact, Deal } from '../../types';

// Mock data for the demo
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    company: 'Acme Inc',
    position: 'CTO',
    status: 'customer',
    score: 85,
    lastContact: new Date('2023-06-15'),
    notes: 'Interested in enterprise plan. Has concerns about implementation timeline.',
    industry: 'Technology',
    location: 'San Francisco, CA'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@globex.com',
    phone: '(555) 987-6543',
    company: 'Globex Corp',
    position: 'Marketing Director',
    status: 'lead',
    score: 65,
    lastContact: new Date('2023-05-28'),
    notes: 'Looking for marketing automation tools. Complained about current vendor being too expensive.',
    industry: 'Manufacturing',
    location: 'Chicago, IL'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert@initech.com',
    phone: '(555) 456-7890',
    company: 'Initech',
    position: 'CEO',
    status: 'prospect',
    score: 75,
    lastContact: new Date('2023-06-02'),
    notes: 'Interested in comprehensive CRM solution. Budget concerns, but decision maker.',
    industry: 'Financial Services',
    location: 'New York, NY'
  }
];

const mockDeals: Deal[] = [
  {
    id: 'deal-1',
    title: 'Enterprise License',
    value: 75000,
    stage: 'qualification',
    company: 'Acme Inc',
    contact: 'John Doe',
    contactId: '1',
    dueDate: new Date('2025-07-15'),
    createdAt: new Date('2025-06-01'),
    updatedAt: new Date('2025-06-01'),
    probability: 10,
    daysInStage: 5,
    priority: 'high'
  },
  {
    id: 'deal-2',
    title: 'Software Renewal',
    value: 45000,
    stage: 'proposal',
    company: 'Globex Corp',
    contact: 'Jane Smith',
    contactId: '2',
    dueDate: new Date('2025-06-30'),
    createdAt: new Date('2025-05-15'),
    updatedAt: new Date('2025-06-01'),
    probability: 50,
    daysInStage: 3,
    priority: 'medium'
  },
  {
    id: 'deal-3',
    title: 'Support Contract',
    value: 25000,
    stage: 'negotiation',
    company: 'Initech',
    contact: 'Robert Johnson',
    contactId: '3',
    dueDate: new Date('2025-07-10'),
    createdAt: new Date('2025-05-20'),
    updatedAt: new Date('2025-06-01'),
    probability: 75,
    daysInStage: 7,
    priority: 'low'
  }
];

interface SearchResult {
  type: 'contact' | 'deal';
  item: Contact | Deal;
  score: number;
}

interface SmartSearchRealtimeProps {
  onSearchResult?: (results: SearchResult[]) => void;
}

const SmartSearchRealtime: React.FC<SmartSearchRealtimeProps> = ({ onSearchResult }) => {
  const { apiKeys } = useApiStore();
  const gemini = useGemini();
  const embeddings = useOpenAIEmbeddings();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [filters, setFilters] = useState<{
    type: 'all' | 'contacts' | 'deals';
  }>({
    type: 'all'
  });
  const [embedData, setEmbedData] = useState<{
    ready: boolean;
    error: string | null;
    contactEmbeddings: { contactId: string; embedding: number[] }[];
    dealEmbeddings: { dealId: string; embedding: number[] }[];
  }>({
    ready: false,
    error: null,
    contactEmbeddings: [],
    dealEmbeddings: []
  });
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check if API keys are available
  const hasApiKeys = apiKeys.openai || apiKeys.gemini;
  
  // Initialize embeddings on first load
  useEffect(() => {
    const initializeEmbeddings = async () => {
      // Check if we have the required API keys
      if (!apiKeys.openai) {
        setEmbedData({
          ready: false,
          error: 'OpenAI API key is required for semantic search functionality',
          contactEmbeddings: [],
          dealEmbeddings: []
        });
        return;
      }

      try {
        // Generate embeddings for contacts and deals
        const contactEmbs = await embeddings.createContactEmbeddings(mockContacts);
        const dealEmbs = await embeddings.createDealEmbeddings(mockDeals);
        
        setEmbedData({
          ready: true,
          error: null,
          contactEmbeddings: contactEmbs,
          dealEmbeddings: dealEmbs
        });
      } catch (error) {
        console.error('Error initializing embeddings:', error);
        setEmbedData({
          ready: false,
          error: 'Failed to initialize search embeddings. Please check your API key configuration.',
          contactEmbeddings: [],
          dealEmbeddings: []
        });
      }
    };
    
    initializeEmbeddings();
  }, [apiKeys.openai]); // Re-run when API key changes
  
  // Generate search suggestions based on input
  useEffect(() => {
    if (searchQuery.length > 2 && hasApiKeys) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        generateSearchSuggestions(searchQuery);
      }, 300);
    } else {
      setShowSearchSuggestions(false);
    }
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, hasApiKeys]);
  
  // Generate search suggestions
  const generateSearchSuggestions = async (query: string) => {
    try {
      // In a real implementation, call Gemini API
      // For demo, generate simple suggestions
      const baseSuggestions = [
        `${query} in technology companies`,
        `high priority ${query}`,
        `${query} with budget over $50k`,
        `recently contacted ${query}`,
        `${query} closing this month`
      ];
      
      // Filter to 3 most relevant suggestions
      setSearchSuggestions(baseSuggestions.slice(0, 3));
      setShowSearchSuggestions(true);
    } catch (error) {
      console.error('Error generating search suggestions:', error);
    }
  };
  
  // Perform the semantic search
  const performSemanticSearch = async (query: string) => {
    if (query.trim().length === 0 || !embedData.ready) return;
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      // Create an embedding for the search query
      const queryEmbedding = await embeddings.createEmbedding(query);
      
      const results: SearchResult[] = [];
      
      // Search contacts if not filtered out
      if (filters.type === 'all' || filters.type === 'contacts') {
        const contactsById = mockContacts.reduce((acc, contact) => {
          acc[contact.id] = contact;
          return acc;
        }, {} as Record<string, Contact>);
        
        const contactResults = await embeddings.searchContacts(query, embedData.contactEmbeddings, contactsById);
        
        results.push(...contactResults.map(result => ({
          type: 'contact',
          item: result.contact,
          score: result.score
        })));
      }
      
      // Search deals if not filtered out
      if (filters.type === 'all' || filters.type === 'deals') {
        const dealsById = mockDeals.reduce((acc, deal) => {
          acc[deal.id] = deal;
          return acc;
        }, {} as Record<string, Deal>);
        
        const dealResults = await embeddings.searchDeals(query, embedData.dealEmbeddings, dealsById);
        
        results.push(...dealResults.map(result => ({
          type: 'deal',
          item: result.deal,
          score: result.score
        })));
      }
      
      // Sort by similarity score
      const sortedResults = results.sort((a, b) => b.score - a.score).slice(0, 5);
      
      setSearchResults(sortedResults);
      
      if (onSearchResult) {
        onSearchResult(sortedResults);
      }
      
      setShowSearchSuggestions(false);
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const selectSearchSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSearchSuggestions(false);
    performSemanticSearch(suggestion);
  };
  
  // Handle search on Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      performSemanticSearch(searchQuery);
    }
  };
  
  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-lg font-semibold flex items-center">
          <Search size={20} className="text-blue-600 mr-2" />
          Smart Search
          <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
            Real-time
          </span>
        </h3>
      </div>
      
      <div className="p-6 space-y-6">
        {/* API Key Warning */}
        {!hasApiKeys && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="text-amber-600 mr-3 mt-0.5" size={20} />
              <div className="flex-1">
                <h4 className="text-amber-800 font-medium mb-1">API Key Required</h4>
                <p className="text-amber-700 text-sm mb-3">
                  Semantic search requires an OpenAI API key to function. Please configure your API key in settings.
                </p>
                <a
                  href="/settings"
                  className="inline-flex items-center text-sm text-amber-800 hover:text-amber-900 font-medium"
                >
                  <Settings size={16} className="mr-1" />
                  Go to Settings
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Embedding Error */}
        {embedData.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="text-red-600 mr-3 mt-0.5" size={20} />
              <div className="flex-1">
                <h4 className="text-red-800 font-medium mb-1">Search Initialization Error</h4>
                <p className="text-red-700 text-sm">
                  {embedData.error}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              hasApiKeys 
                ? "Search using natural language (e.g., 'high priority deals closing this month')"
                : "API key required for semantic search"
            }
            disabled={!hasApiKeys}
            className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 ${
              !hasApiKeys ? 'bg-gray-50 cursor-not-allowed' : ''
            }`}
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        
        {/* Search suggestions dropdown */}
        <AnimatePresence>
          {showSearchSuggestions && searchSuggestions.length > 0 && hasApiKeys && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
              style={{ width: searchInputRef.current?.offsetWidth }}
            >
              <div className="p-2">
                {searchSuggestions.map((suggestion, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => selectSearchSuggestion(suggestion)}
                    className="flex items-center p-2 hover:bg-blue-50 rounded-md cursor-pointer"
                  >
                    <Sparkles size={14} className="text-blue-500 mr-2" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilters({...filters, type: 'all'})}
              disabled={!hasApiKeys}
              className={`px-3 py-1.5 text-sm rounded-md ${
                filters.type === 'all' 
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              } ${!hasApiKeys ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setFilters({...filters, type: 'contacts'})}
              disabled={!hasApiKeys}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                filters.type === 'contacts' 
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              } ${!hasApiKeys ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <User size={14} className="mr-1" />
              Contacts
            </button>
            <button
              onClick={() => setFilters({...filters, type: 'deals'})}
              disabled={!hasApiKeys}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                filters.type === 'deals' 
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              } ${!hasApiKeys ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Briefcase size={14} className="mr-1" />
              Deals
            </button>
          </div>
          
          <button
            onClick={() => performSemanticSearch(searchQuery)}
            disabled={!searchQuery.trim() || isSearching || !hasApiKeys}
            className={`flex items-center px-4 py-2 rounded-md ${
              !searchQuery.trim() || isSearching || !hasApiKeys
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSearching ? (
              <RefreshCw size={18} className="animate-spin mr-1" />
            ) : (
              <Search size={18} className="mr-1" />
            )}
            Search
          </button>
        </div>
      
        {/* Search metadata */}
        {embedData.ready && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center text-xs text-gray-500">
              <CheckCircle size={14} className="text-blue-500 mr-1.5" />
              <span>
                Semantic search index ready ({mockContacts.length} contacts, {mockDeals.length} deals)
              </span>
            </div>
          </div>
        )}
        
        {/* Search results */}
        <div className="mt-6">
          <AnimatePresence>
            {isSearching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center py-12"
              >
                <RefreshCw size={32} className="text-blue-500 animate-spin" />
                <span className="ml-3 text-gray-600">Searching with AI...</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {!isSearching && searchResults.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <Sparkles size={16} className="text-blue-500 mr-2" />
                {searchResults.length} Results for "{searchQuery}"
              </h4>
              
              <div className="space-y-4">
                {searchResults.map((result, index) => (
                  <motion.div
                    key={`${result.type}-${result.item.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    {result.type === 'contact' ? (
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center">
                            <User size={16} className="text-blue-600 mr-2" />
                            <h3 className="font-medium text-blue-600">
                              {(result.item as Contact).name}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-500">
                            {(result.item as Contact).position} at {(result.item as Contact).company}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-medium">
                            Match: {Math.round(result.score * 100)}%
                          </div>
                          <div className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 capitalize">
                            {(result.item as Contact).status}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center">
                            <Briefcase size={16} className="text-purple-600 mr-2" />
                            <h3 className="font-medium text-purple-600">
                              {(result.item as Deal).title}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-500">
                            {(result.item as Deal).company} - ${(result.item as Deal).value.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-medium">
                            Match: {Math.round(result.score * 100)}%
                          </div>
                          <div className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 capitalize">
                            {(result.item as Deal).stage}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {result.type === 'contact' && (result.item as Contact).notes && (
                      <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                        {(result.item as Contact).notes}
                      </div>
                    )}
                    
                    {result.type === 'deal' && (
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Clock size={14} className="mr-1" />
                        Due: {formatDate((result.item as Deal).dueDate)}
                        <span className={`ml-2 px-2 py-0.5 rounded-full ${
                          (result.item as Deal).priority === 'high' ? 'bg-red-100 text-red-800' :
                          (result.item as Deal).priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {(result.item as Deal).priority} priority
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-2 flex justify-end">
                      <button className="text-blue-600 hover:text-blue-800 text-xs flex items-center">
                        View Details <ArrowRight size={12} className="ml-1" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {!isSearching && searchQuery && searchResults.length === 0 && hasApiKeys && (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
              <p className="text-gray-500 text-sm">
                Try using different keywords or filters
              </p>
            </div>
          )}
          
          {!isSearching && !searchQuery && hasApiKeys && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Smart Semantic Search</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-4">
                Use natural language to find exactly what you need across all your CRM data.
              </p>
              <div className="max-w-md mx-auto">
                <div className="text-sm text-left">Try asking:</div>
                <ul className="text-left text-sm text-gray-700 space-y-2 mt-2">
                  <li className="flex items-center">
                    <ArrowRight size={12} className="text-blue-500 mr-2" />
                    Deals with high priority closing this month
                  </li>
                  <li className="flex items-center">
                    <ArrowRight size={12} className="text-blue-500 mr-2" />
                    Contacts in the technology industry with budget concerns
                  </li>
                  <li className="flex items-center">
                    <ArrowRight size={12} className="text-blue-500 mr-2" />
                    Deals over $50,000 in the negotiation stage
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartSearchRealtime;