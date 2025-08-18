// Remote Contacts Page - Embedded Module with CRM Integration
import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Link, Wifi, WifiOff } from 'lucide-react';
import { useContactStore } from '../hooks/useContactStore';
import { RemoteContactsBridge, CRMContact } from '../services/remoteContactsBridge';

const ContactsWithRemote: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const bridgeRef = useRef<RemoteContactsBridge | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { contacts, addContact, updateContact, deleteContact, fetchContacts } = useContactStore();

  // Convert Contact to CRMContact format
  const convertToCRMContact = (contact: any): CRMContact => ({
    id: contact.id,
    name: contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
    email: contact.email,
    phone: contact.phone,
    company: contact.company,
    position: contact.position || contact.title,
    tags: contact.tags || [],
    notes: contact.notes,
    createdAt: typeof contact.createdAt === 'string' ? contact.createdAt : contact.createdAt?.toISOString(),
    updatedAt: typeof contact.updatedAt === 'string' ? contact.updatedAt : contact.updatedAt?.toISOString()
  });

  // Initialize bridge and set up communication
  useEffect(() => {
    const bridge = new RemoteContactsBridge();
    bridgeRef.current = bridge;

    // Set up message handlers
    bridge.onMessage('REMOTE_READY', () => {
      setIsConnected(true);
      console.log('✅ Remote contacts module connected');
    });

    bridge.onMessage('CONTACT_CREATED', (contact) => {
      console.log('📝 Remote contact created:', contact);
      addContact(contact);
    });

    bridge.onMessage('CONTACT_UPDATED', (contact) => {
      console.log('✏️ Remote contact updated:', contact);
      updateContact(contact.id, contact);
    });

    bridge.onMessage('CONTACT_DELETED', (data) => {
      console.log('🗑️ Remote contact deleted:', data.id);
      deleteContact(data.id);
    });

    bridge.onMessage('REQUEST_CONTACTS', () => {
      console.log('📤 Remote requesting contacts data');
      const crmContacts = Object.values(contacts).map(convertToCRMContact);
      bridge.syncContacts(crmContacts);
    });

    bridge.onMessage('SYNC_REQUEST', () => {
      console.log('🔄 Remote requesting full sync');
      fetchContacts();
    });

    return () => {
      bridge.disconnect();
    };
  }, [addContact, updateContact, deleteContact, fetchContacts]);

  // Handle iframe load and initialize CRM connection
  const handleIframeLoad = () => {
    if (iframeRef.current && bridgeRef.current) {
      bridgeRef.current.setIframe(iframeRef.current);
      
      // Wait for remote app to initialize, then send CRM data
      setTimeout(() => {
        const crmContacts = Object.values(contacts).map(convertToCRMContact);
        bridgeRef.current?.initializeCRM(crmContacts, {
          name: 'CRM System',
          version: '1.0.0',
          features: ['contacts', 'deals', 'tasks', 'ai-tools']
        });
      }, 1500);
    }
  };

  // Notify remote when local contacts change
  useEffect(() => {
    if (bridgeRef.current && isConnected) {
      const crmContacts = Object.values(contacts).map(convertToCRMContact);
      bridgeRef.current.syncContacts(crmContacts);
    }
  }, [contacts, isConnected]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ExternalLink className="h-6 w-6 text-blue-600" />
              Contacts Module
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remote contact management system
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
              ✓ Remote Module
            </div>
            <div className={`text-sm px-3 py-1 rounded-full flex items-center gap-1 ${
              isConnected 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
            }`}>
              {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isConnected ? 'CRM Connected' : 'Connecting...'}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Remote App */}
      <div className="flex-1" style={{ height: 'calc(100vh - 100px)' }}>
        <iframe
          ref={iframeRef}
          src="https://taupe-sprinkles-83c9ee.netlify.app"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            overflow: 'hidden'
          }}
          title="Remote Contacts Module"
          allow="clipboard-read; clipboard-write"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
};

export default ContactsWithRemote;