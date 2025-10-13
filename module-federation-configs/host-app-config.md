# Module Federation Host Application Configuration

## Overview
Configuration for the SmartCRM host application to consume remote modules using Module Federation.

## Webpack Configuration (webpack.config.js)

```javascript
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  // ... other webpack config
  plugins: [
    new ModuleFederationPlugin({
      name: 'SmartCRM',
      remotes: {
        CalendarApp: 'CalendarApp@https://calendar.smartcrm.vip/remoteEntry.js',
        AnalyticsApp: 'AnalyticsApp@https://analytics.smartcrm.vip/remoteEntry.js',
        ContactsApp: 'ContactsApp@https://contacts.smartcrm.vip/remoteEntry.js',
        AgencyApp: 'AgencyApp@https://agency.smartcrm.vip/remoteEntry.js',
        PipelineApp: 'PipelineApp@https://pipeline.smartcrm.vip/remoteEntry.js',
        ResearchApp: 'ResearchApp@https://research.smartcrm.vip/remoteEntry.js',
        SalesMaxApp: 'SalesMaxApp@https://salesmax.smartcrm.vip/remoteEntry.js',
        ReferralsApp: 'ReferralsApp@https://referrals.smartcrm.vip/remoteEntry.js',
        ContentAIApp: 'ContentAIApp@https://contentai.smartcrm.vip/remoteEntry.js',
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
        // Add other shared dependencies
      },
    }),
  ],
};
```

## Vite Configuration (vite.config.js)

```javascript
import { defineConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    federation({
      name: 'SmartCRM',
      remotes: {
        CalendarApp: 'https://calendar.smartcrm.vip/assets/remoteEntry.js',
        AnalyticsApp: 'https://analytics.smartcrm.vip/assets/remoteEntry.js',
        ContactsApp: 'https://contacts.smartcrm.vip/assets/remoteEntry.js',
        AgencyApp: 'https://agency.smartcrm.vip/assets/remoteEntry.js',
        PipelineApp: 'https://pipeline.smartcrm.vip/assets/remoteEntry.js',
        ResearchApp: 'https://research.smartcrm.vip/assets/remoteEntry.js',
        SalesMaxApp: 'https://salesmax.smartcrm.vip/assets/remoteEntry.js',
        ReferralsApp: 'https://referrals.smartcrm.vip/assets/remoteEntry.js',
        ContentAIApp: 'https://contentai.smartcrm.vip/assets/remoteEntry.js',
      },
      shared: {
        react: {},
        'react-dom': {},
        'react-router-dom': {},
      },
    }),
  ],
});
```

## Dynamic Module Loading (Alternative Approach)

If you prefer not to configure remotes at build time, use dynamic loading:

```javascript
// utils/dynamicModuleFederation.ts
export async function loadRemoteComponent<T = any>(
  remoteUrl: string,
  scope: string,
  module: string
): Promise<T> {
  // Dynamically load remote entry
  await loadScript(`${remoteUrl}/remoteEntry.js`);

  // Initialize the container
  await window[scope].init({
    react: { singleton: true },
    'react-dom': { singleton: true },
  });

  // Get the module
  const factory = await window[scope].get(module);
  return factory().default || factory();
}
```

## Usage in Components

```javascript
// Lazy load remote components
const RemoteCalendar = lazy(() =>
  loadRemoteComponent(
    'https://calendar.smartcrm.vip',
    'CalendarApp',
    './CalendarApp'
  ).then(module => ({ default: module }))
);

// Use in JSX
<Suspense fallback={<div>Loading...</div>}>
  <RemoteCalendar />
</Suspense>
```

## Communication Between Host and Remotes

### Host to Remote Communication

```javascript
// Send data to remote module
function sendToRemote(scope, type, data) {
  window.postMessage({
    type,
    targetScope: scope,
    data,
    source: 'host'
  }, '*');
}

// Example
sendToRemote('CalendarApp', 'SET_THEME', { theme: 'dark' });
```

### Remote to Host Communication

```javascript
// In remote module
function sendToHost(type, data) {
  window.parent.postMessage({
    type,
    data,
    source: 'remote',
    scope: 'CalendarApp'
  }, '*');
}

// Example
sendToHost('APPOINTMENT_CREATED', appointmentData);
```

## Error Handling

```javascript
try {
  const RemoteComponent = await loadRemoteComponent(url, scope, module);
  // Use component
} catch (error) {
  console.error('Failed to load remote module:', error);
  // Fallback to iframe or alternative implementation
}
```

## Build and Deployment

1. Configure Module Federation in webpack/vite config
2. Build the host application
3. Deploy remote applications with Module Federation enabled
4. Ensure remoteEntry.js files are accessible
5. Test loading and communication between modules

## Security Considerations

- Validate message origins
- Sanitize data passed between modules
- Use HTTPS for all remote modules
- Implement proper CORS policies
- Consider using signed messages for sensitive operations

## Performance Optimization

- Lazy load remote modules
- Cache remote entries
- Preload critical remote modules
- Monitor bundle sizes
- Use code splitting strategically