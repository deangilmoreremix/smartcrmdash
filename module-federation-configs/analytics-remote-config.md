# Module Federation Configuration for AI Analytics Remote App

## Overview
Configuration for the AI Analytics app to be loaded as a remote module in the SmartCRM host application.

## Vite Configuration (vite.config.js)

```javascript
import { defineConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    federation({
      name: 'AnalyticsApp',
      filename: 'remoteEntry.js',
      exposes: {
        './AnalyticsApp': './src/App.tsx',
        './AnalyticsWidget': './src/components/AnalyticsWidget.tsx',
        './DashboardManager': './src/services/DashboardManager.ts',
      },
      shared: {
        react: {},
        'react-dom': {},
        'react-router-dom': {},
        // Add other shared dependencies
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3001, // Different port from host
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  },
});
```

## Webpack Configuration (webpack.config.js) - Alternative

```javascript
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  // ... other webpack config
  plugins: [
    new ModuleFederationPlugin({
      name: 'AnalyticsApp',
      filename: 'remoteEntry.js',
      exposes: {
        './AnalyticsApp': './src/App.tsx',
        './AnalyticsWidget': './src/components/AnalyticsWidget.tsx',
        './DashboardManager': './src/services/DashboardManager.ts',
      },
      shared: {
        react: {
          singleton: true,
          eager: true,
        },
        'react-dom': {
          singleton: true,
          eager: true,
        },
        'react-router-dom': {
          singleton: true,
        },
      },
    }),
  ],
  devServer: {
    port: 3001,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  },
};
```

## Communication Interface

### Receiving Messages from Host

```javascript
// src/utils/communication.ts
export class RemoteCommunicator {
  private hostOrigin = 'https://your-crm-domain.com';

  listenForHostMessages() {
    window.addEventListener('message', (event) => {
      if (event.origin !== this.hostOrigin) return;

      const { type, data } = event.data;

      switch (type) {
        case 'SET_THEME':
          this.applyTheme(data.theme, data.mode);
          break;
        case 'INITIAL_DATA_SYNC':
          this.updateAnalyticsData(data);
          break;
        case 'CRM_READY':
          this.onHostReady();
          break;
        case 'UPDATE_DASHBOARD_DATA':
          this.updateDashboard(data);
          break;
      }
    });
  }

  sendToHost(type: string, data: any) {
    window.parent.postMessage({
      type,
      data,
      source: 'AnalyticsApp'
    }, this.hostOrigin);
  }

  // Specific event handlers
  onDashboardInteraction(action: string, data?: any) {
    this.sendToHost('DASHBOARD_INTERACTION', { action, ...data });
  }

  onAnalyticsReady() {
    this.sendToHost('ANALYTICS_READY', { version: '1.0.0' });
  }

  onDataUpdate(data: any) {
    this.sendToHost('ANALYTICS_DATA_UPDATE', data);
  }

  private applyTheme(theme: string, mode: string) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-mode', mode);

    // Update chart themes, etc.
    this.updateChartThemes(theme);
  }

  private updateAnalyticsData(data: any) {
    // Update analytics with data from host
    console.log('Received analytics data from host:', data);
  }

  private updateDashboard(data: any) {
    // Update dashboard with new data
    console.log('Updating dashboard:', data);
  }

  private updateChartThemes(theme: string) {
    // Update chart library themes
    // Example: Chart.js, D3, etc.
  }

  private onHostReady() {
    console.log('Host application is ready');
    this.onAnalyticsReady();
  }
}

export const communicator = new RemoteCommunicator();
communicator.listenForHostMessages();
```

### App Integration

```javascript
// src/App.tsx
import React, { useEffect } from 'react';
import { communicator } from './utils/communication';

function App() {
  useEffect(() => {
    // Notify host that analytics is ready
    communicator.onAnalyticsReady();
  }, []);

  const handleDashboardClick = (chartId: string, data: any) => {
    communicator.onDashboardInteraction('chart_click', { chartId, data });
  };

  const handleDataRefresh = () => {
    communicator.onDashboardInteraction('refresh_data');
  };

  return (
    <div className="analytics-app">
      <button onClick={handleDataRefresh}>Refresh Data</button>
      <div onClick={() => handleDashboardClick('sales-chart', { value: 100 })}>
        Sales Chart
      </div>
      {/* Your analytics dashboard content */}
    </div>
  );
}

export default App;
```

## Build and Deployment

1. **Install dependencies:**
   ```bash
   npm install @originjs/vite-plugin-federation --save-dev
   # or for webpack
   npm install webpack webpack-cli --save-dev
   ```

2. **Build the remote app:**
   ```bash
   npm run build
   ```

3. **Deploy to `https://ai-analytics.smartcrm.vip`:**
   - Upload the `dist` folder contents
   - Ensure `remoteEntry.js` is accessible at the root
   - Configure CORS headers on your server

## Server Configuration (nginx example)

```nginx
server {
    listen 80;
    server_name ai-analytics.smartcrm.vip;

    location / {
        root /path/to/analytics/dist;
        index index.html;
        try_files $uri $uri/ /index.html;

        # CORS headers for Module Federation
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With' always;
    }
}
```

## Testing

1. **Start the remote app:**
   ```bash
   npm run dev
   ```

2. **Test Module Federation:**
   ```javascript
   // In browser console
   await import('http://localhost:3001/remoteEntry.js');
   ```

3. **Test communication:**
   ```javascript
   // Send test message
   window.postMessage({
     type: 'SET_THEME',
     data: { theme: 'dark', mode: 'dark' }
   }, 'http://localhost:3001');
   ```

## Troubleshooting

- **CORS errors**: Ensure server allows cross-origin requests
- **Module not found**: Check `remoteEntry.js` is accessible
- **Shared dependencies**: Ensure React versions match between host and remote
- **Communication not working**: Verify message event listeners are attached

## Performance Optimization

- **Lazy load charts**: Load chart libraries only when needed
- **Data caching**: Cache analytics data locally
- **Code splitting**: Split large analytics bundles
- **Preload critical data**: Load essential dashboard data first