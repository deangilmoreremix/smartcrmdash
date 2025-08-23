// Remote Pipeline Page - Exact same pattern as ContactsWithRemote.tsx
import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Wifi, WifiOff, Search, Target } from 'lucide-react';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';
import { gpt5SocialResearchService } from '../services/gpt5SocialResearchService';

const PipelineWithRemote: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isResearchingDeals, setIsResearchingDeals] = useState(false);
  const { deals, addDeal, updateDeal, deleteDeal, fetchDeals } = useDealStore();
  const { getContactById } = useContactStore();

  // Initialize pipeline data when component mounts
  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // Handle iframe load event - same as contacts
  const handleIframeLoad = () => {
    console.log('📱 Remote pipeline iframe loaded');
    // Set connected status - no complex bridge needed
    setTimeout(() => {
      setIsConnected(true);
    }, 1000);
  };

  // Social research for deals
  const handleDealsSocialResearch = async () => {
    setIsResearchingDeals(true);
    try {
      const dealsList = Object.values(deals);
      console.log('🔍 Starting social research for', dealsList.length, 'deals');
      
      for (const deal of dealsList.slice(0, 3)) { // Limit to first 3 for demo
        try {
          const contact = getContactById(deal.contactId);
          if (contact) {
            const contactForResearch = {
              ...contact,
              lastContact: contact.lastContact ? new Date(contact.lastContact) : new Date()
            };
            const research = await gpt5SocialResearchService.researchContactSocialMedia(
              contactForResearch,
              ['LinkedIn', 'Twitter', 'Instagram', 'YouTube', 'GitHub'],
              'basic'
            );
            console.log('✅ Deal social research completed for:', deal.name, research);
          }
        } catch (error) {
          console.error('❌ Deal social research failed for:', deal.name, error);
        }
      }
    } catch (error) {
      console.error('Deal social research failed:', error);
    } finally {
      setIsResearchingDeals(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header - exact same pattern as contacts */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ExternalLink className="h-6 w-6 text-blue-600" />
              Pipeline Module
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remote pipeline management system
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDealsSocialResearch}
              disabled={isResearchingDeals}
              className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Target className="h-4 w-4" />
              <span>{isResearchingDeals ? 'Researching...' : 'Research Deal Contacts'}</span>
            </button>
            <div className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
              ✓ Remote Module
            </div>
            <div className={`text-sm px-3 py-1 rounded-full flex items-center gap-1 ${
              isConnected 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
            }`}>
              {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-3 w-3" />}
              {isConnected ? 'CRM Connected' : 'Connecting...'}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Remote App - exact same pattern as contacts */}
      <div className="flex-1" style={{ height: 'calc(100vh - 100px)' }}>
        <iframe
          ref={iframeRef}
          src="https://cheery-syrniki-b5b6ca.netlify.app"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            overflow: 'hidden'
          }}
          title="Remote Pipeline Module"
          allow="clipboard-read; clipboard-write"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
};

export default PipelineWithRemote;