import React, { useState } from 'react';
import { Search, User, Building, DollarSign } from 'lucide-react';

const SmartSearchRealtime: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    // Simulate real-time search results
    const mockResults = [
      {
        type: 'contact',
        id: '1',
        title: 'Jane Doe',
        subtitle: 'Marketing Director at Microsoft',
        icon: User,
        value: '$75,000 deal'
      },
      {
        type: 'deal',
        id: '2',
        title: 'Enterprise Software License',
        subtitle: 'In Negotiation Stage',
        icon: DollarSign,
        value: '$75,000'
      },
      {
        type: 'company',
        id: '3',
        title: 'Microsoft Corporation',
        subtitle: '2 active deals, 3 contacts',
        icon: Building,
        value: '$100,000 potential'
      }
    ].filter(result => 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(mockResults);
  };

  return (
    <div className="p-4 h-full">
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search contacts, deals, companies..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="space-y-2">
        {results.length > 0 ? (
          results.map((result) => (
            <div
              key={result.id}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <result.icon size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">{result.title}</h3>
                  <p className="text-xs text-gray-500">{result.subtitle}</p>
                </div>
                <div className="text-xs text-gray-600">{result.value}</div>
              </div>
            </div>
          ))
        ) : query ? (
          <div className="text-center py-8 text-gray-500">
            <Search size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm">No results found for "{query}"</p>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Search size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm">Start typing to search...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartSearchRealtime;