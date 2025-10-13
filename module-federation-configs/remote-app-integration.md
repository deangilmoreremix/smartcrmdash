# Remote App Integration Guide

## Overview
This guide explains how to integrate remote applications with the SmartCRM host using Module Federation and iframe communication.

## Current Implementation Status

The SmartCRM host application currently uses a hybrid approach:

1. **Primary**: Dynamic Module Federation loading
2. **Fallback**: iframe communication when Module Federation fails

## For Remote App Developers

### 1. Module Federation Setup (Recommended)

Add this to your `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    federation({
      name: 'YourAppName', // e.g., 'CalendarApp', 'AnalyticsApp'
      filename: 'remoteEntry.js',
      exposes: {
        './YourApp': './src/App.tsx', // Main component
        './Widget': './src/components/Widget.tsx', // Optional widget
      },
      shared: {
        react: {},
        'react-dom': {},
        'react-router-dom': {},
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
```

### 2. Communication Interface

Implement this communication pattern in your remote app:

```javascript
// src/utils/communication.ts
export class RemoteCommunicator {
  private hostOrigin = 'https://your-crm-domain.com';

  // Listen for messages from host
  listenForHostMessages() {
    window.addEventListener('message', (event) => {
      if (event.origin !== this.hostOrigin) return;

      const { type, data } = event.data;

      switch (type) {
        case 'SET_THEME':
          this.applyTheme(data.theme, data.mode);
          break;
        case 'INITIAL_DATA_SYNC':
          this.updateAppData(data);
          break;
        case 'CRM_READY':
          this.onHostReady();
          break;
      }
    });
  }

  // Send messages to host
  sendToHost(type: string, data: any) {
    window.parent.postMessage({
      type,
      data,
      source: 'YourAppName'
    }, this.hostOrigin);
  }

  // Specific event handlers
  onButtonClick(action: string, buttonData?: any) {
    this.sendToHost('BUTTON_CLICK', { action, ...buttonData });
  }

  onDataChange(data: any) {
    this.sendToHost('DATA_UPDATED', data);
  }

  onAppReady() {
    this.sendToHost('APP_READY', { version: '1.0.0' });
  }

  private applyTheme(theme: string, mode: string) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-mode', mode);
  }

  private updateAppData(data: any) {
    // Update your app's state with data from host
    console.log('Received data from host:', data);
  }

  private onHostReady() {
    console.log('Host application is ready');
    this.onAppReady();
  }
}

// Initialize communication
export const communicator = new RemoteCommunicator();
communicator.listenForHostMessages();
```

### 3. App Integration

In your main App component:

```javascript
// src/App.tsx
import React, { useEffect } from 'react';
import { communicator } from './utils/communication';

function App() {
  useEffect(() => {
    // Notify host that app is ready
    communicator.onAppReady();
  }, []);

  const handleButtonClick = (action: string) => {
    communicator.onButtonClick(action, { timestamp: Date.now() });
  };

  const handleDataChange = (newData: any) => {
    communicator.onDataChange(newData);
  };

  return (
    <div className="app">
      <button onClick={() => handleButtonClick('create-appointment')}>
        Create Appointment
      </button>
      <button onClick={() => handleButtonClick('view-calendar')}>
        View Calendar
      </button>
      {/* Your app content */}
    </div>
  );
}

export default App;
```

### 4. Build and Deployment

```bash
# Build with federation
npm run build

# Deploy the dist folder to your domain
# Ensure remoteEntry.js is accessible at the root
```

## Host Application Integration

The host app will automatically try to load your remote module. If Module Federation fails, it falls back to iframe loading.

### Testing Your Integration

1. **Module Federation Test**:
   ```javascript
   // In browser console
   await import('https://your-app-domain.com/remoteEntry.js');
   ```

2. **Communication Test**:
   ```javascript
   // Send test message
   window.postMessage({
     type: 'SET_THEME',
     data: { theme: 'light', mode: 'light' }
   }, 'https://your-app-domain.com');
   ```

## Troubleshooting

### Module Federation Issues

- **"Container not found"**: Ensure `remoteEntry.js` is accessible
- **"Shared dependency version mismatch"**: Check React versions
- **CORS errors**: Configure CORS on your server

### Communication Issues

- **Messages not received**: Check origin validation
- **Events not firing**: Ensure event listeners are attached
- **Data not syncing**: Verify message structure

### Common Solutions

1. **Add CORS headers**:
   ```nginx
   # nginx.conf
   location / {
     add_header 'Access-Control-Allow-Origin' 'https://your-crm-domain.com';
     add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
     add_header 'Access-Control-Allow-Headers' 'Content-Type';
   }
   ```

2. **Handle loading errors**:
   ```javascript
   try {
     const RemoteApp = await loadRemoteComponent(url, scope, module);
     return RemoteApp;
   } catch (error) {
     console.warn('Module Federation failed, using iframe fallback');
     return IframeFallback;
   }
   ```

3. **Debug communication**:
   ```javascript
   // Add to both host and remote
   window.addEventListener('message', (e) => {
     console.log('Message received:', e.data);
   });
   ```

## Performance Considerations

- **Bundle size**: Keep shared dependencies to minimum
- **Lazy loading**: Load remote modules only when needed
- **Caching**: Implement proper caching strategies
- **Error boundaries**: Handle loading failures gracefully

## Security Best Practices

- Always validate message origins
- Sanitize data passed between applications
- Use HTTPS for all communications
- Implement proper authentication if needed
- Avoid exposing sensitive data in shared state