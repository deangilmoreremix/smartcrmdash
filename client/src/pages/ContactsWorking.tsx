import React, { useState, useEffect } from 'react';
import { loadRemoteComponent } from '../utils/dynamicModuleFederation';

const ContactsWorking: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [remoteUrl, setRemoteUrl] = useState('https://taupe-sprinkles-83c9ee.netlify.app/');
  const [useRemote, setUseRemote] = useState(false);
  const [RemoteContacts, setRemoteContacts] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRemoteContacts = async (url: string) => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading remote contacts from:', url);
      
      // Try different possible container names and module paths
      const attempts = [
        { scope: 'ContactsApp', module: './ContactsApp' },
        { scope: 'contactsApp', module: './ContactsApp' },
        { scope: 'ContactsApp', module: './App' },
        { scope: 'remoteApp', module: './ContactsApp' },
        { scope: 'ContactsApp', module: './src/ContactsApp' }
      ];
      
      let module = null;
      let lastError = null;
      
      for (const attempt of attempts) {
        try {
          console.log(`Trying container: ${attempt.scope}, module: ${attempt.module}`);
          module = await loadRemoteComponent(url, attempt.scope, attempt.module);
          if (module) {
            console.log(`Success with container: ${attempt.scope}, module: ${attempt.module}`);
            break;
          }
        } catch (err) {
          console.log(`Failed attempt: ${attempt.scope}/${attempt.module}`, err);
          lastError = err;
        }
      }
      
      if (!module) {
        throw lastError || new Error('All Module Federation attempts failed');
      }
      
      if (module && (module.default || module)) {
        setRemoteContacts(() => module.default || module);
        console.log('Remote contacts loaded successfully');
      } else {
        throw new Error('Remote module did not export a component');
      }
    } catch (err) {
      console.error('Failed to load remote contacts:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      // Don't disable useRemote automatically, let user see the error and try again
    } finally {
      setLoading(false);
    }
  };

  // Don't auto-load on mount to prevent runtime errors
  // Only load when user explicitly clicks Apply
  
  return (
    <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f9fafb', pointerEvents: 'auto' }}>
      <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Contacts - Module Federation</h1>
            <p style={{ color: '#666', margin: 0 }}>
              {useRemote && remoteUrl ? 'Using remote contacts app' : 'Using local contacts'}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => {
                console.log('Test button clicked!');
                alert('Test button works!');
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                pointerEvents: 'auto',
                zIndex: 9999,
                position: 'relative'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
            >
              Test
            </button>
            
            <button 
              onClick={() => {
                console.log('Settings clicked, current:', showSettings);
                setShowSettings(!showSettings);
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: showSettings ? '#3b82f6' : '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                pointerEvents: 'auto',
                zIndex: 9999,
                position: 'relative'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = showSettings ? '#2563eb' : '#4b5563'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = showSettings ? '#3b82f6' : '#6b7280'}
            >
              Settings {showSettings ? '✓' : '⚙️'}
            </button>
          </div>
        </div>

        {showSettings && (
          <div style={{
            padding: '20px',
            backgroundColor: '#dbeafe',
            borderRadius: '8px',
            border: '2px solid #3b82f6',
            marginTop: '16px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
              🔧 Module Federation Configuration
            </h3>
            
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#dcfce7', border: '1px solid #16a34a', borderRadius: '4px' }}>
              <strong>Success!</strong> Settings panel is working! showSettings = {String(showSettings)}
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>
                Remote App URL
              </label>
              <input
                type="url"
                value={remoteUrl}
                onChange={(e) => setRemoteUrl(e.target.value)}
                placeholder="https://your-bolt-contacts-app.vercel.app"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <input
                type="checkbox"
                id="useRemote"
                checked={useRemote}
                onChange={(e) => setUseRemote(e.target.checked)}
                disabled={!remoteUrl}
                style={{ marginRight: '4px' }}
              />
              <label htmlFor="useRemote" style={{ fontSize: '12px', color: '#374151' }}>
                Use remote contacts app (requires URL above)
              </label>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  padding: '4px 12px',
                  fontSize: '12px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (remoteUrl) {
                    setUseRemote(true);
                    setRemoteContacts(null); // Force reload
                    setError(null); // Clear previous errors
                    console.log('Enabling remote contacts with URL:', remoteUrl);
                    loadRemoteContacts(remoteUrl);
                  }
                }}
                disabled={!remoteUrl || loading}
                style={{
                  padding: '4px 12px',
                  fontSize: '12px',
                  backgroundColor: (remoteUrl && !loading) ? '#3b82f6' : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: (remoteUrl && !loading) ? 'pointer' : 'not-allowed',
                  pointerEvents: 'auto'
                }}
              >
                {loading ? 'Loading...' : 'Connect Remote App'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Contacts Content</h2>
        
        {loading && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>🔄 Loading remote contacts...</div>
            <div style={{ fontSize: '14px' }}>Connecting to: {remoteUrl}</div>
          </div>
        )}
        
        {error && (
          <div style={{ padding: '16px', backgroundColor: '#fef2f2', border: '1px solid #ef4444', borderRadius: '4px', marginBottom: '16px' }}>
            <div style={{ color: '#dc2626', fontWeight: '500', marginBottom: '8px' }}>❌ Module Federation Container Missing</div>
            <div style={{ color: '#7f1d1d', fontSize: '14px', marginBottom: '12px' }}>
              Script loads successfully but no 'ContactsApp' container found. Your Bolt app needs proper Module Federation setup.
            </div>
            
            <div style={{ padding: '12px', backgroundColor: '#fffbeb', border: '1px solid #f59e0b', borderRadius: '4px', fontSize: '12px', marginBottom: '12px' }}>
              <div style={{ fontWeight: '500', marginBottom: '8px', color: '#92400e' }}>Required Fix:</div>
              <div style={{ color: '#92400e', lineHeight: '1.5' }}>
                1. Install: <code>npm install @originjs/vite-plugin-federation</code><br/>
                2. Replace your vite.config.js with the one in docs/BOLT_SETUP_CHECKLIST.md<br/>
                3. Create src/ContactsApp.tsx with the test component<br/>
                4. Run <code>npm run build</code> and redeploy<br/>
                5. Verify window.ContactsApp exists in browser console
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setError(null);
                  loadRemoteContacts(remoteUrl);
                }}
                style={{
                  padding: '4px 12px',
                  fontSize: '12px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  pointerEvents: 'auto'
                }}
              >
                Retry Connection
              </button>
              
              <button
                onClick={() => {
                  window.open(`${remoteUrl}/assets/remoteEntry.js`, '_blank');
                }}
                style={{
                  padding: '4px 12px',
                  fontSize: '12px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  pointerEvents: 'auto'
                }}
              >
                Check remoteEntry.js
              </button>
            </div>
          </div>
        )}
        
        {useRemote && RemoteContacts && !loading && (
          <div style={{ border: '2px solid #10b981', borderRadius: '8px', padding: '16px', backgroundColor: '#f0fdf4' }}>
            <div style={{ marginBottom: '12px', color: '#065f46', fontWeight: '500' }}>
              ✅ Remote Contacts App Connected
            </div>
            <div style={{ border: '1px solid #d1d5db', borderRadius: '4px', minHeight: '400px', backgroundColor: 'white' }}>
              <RemoteContacts />
            </div>
          </div>
        )}
        
        {!useRemote && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
            📋 Local contacts interface would be displayed here
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsWorking;