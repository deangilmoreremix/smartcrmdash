import React, { useState } from 'react';

const ContactsWorking: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [remoteUrl, setRemoteUrl] = useState('');
  const [useRemote, setUseRemote] = useState(false);
  
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
                    console.log('Enabling remote contacts with URL:', remoteUrl);
                    alert(`Remote contacts enabled with: ${remoteUrl}`);
                  }
                }}
                disabled={!remoteUrl}
                style={{
                  padding: '4px 12px',
                  fontSize: '12px',
                  backgroundColor: remoteUrl ? '#3b82f6' : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: remoteUrl ? 'pointer' : 'not-allowed'
                }}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Contacts Content</h2>
        <p style={{ color: '#6b7280' }}>
          {useRemote && remoteUrl 
            ? `🔗 Remote contacts would load from: ${remoteUrl}` 
            : '📋 Local contacts interface would be displayed here'
          }
        </p>
        
        {useRemote && remoteUrl && (
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '14px' }}>
              <strong>Next Step:</strong> Deploy your Bolt contacts app and enter the URL above to enable Module Federation!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsWorking;