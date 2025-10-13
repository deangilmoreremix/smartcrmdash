# Module Federation Configuration for AI Calendar Remote App

## Overview
This configuration enables the AI Calendar app to be loaded as a remote module in the SmartCRM host application using Webpack Module Federation.

## Webpack Configuration (webpack.config.js)

```javascript
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  // ... other webpack config
  plugins: [
    new ModuleFederationPlugin({
      name: 'CalendarApp',
      filename: 'remoteEntry.js',
      exposes: {
        './CalendarApp': './src/App.tsx', // Main calendar component
        './CalendarWidget': './src/components/CalendarWidget.tsx', // Calendar widget
        './AppointmentManager': './src/services/AppointmentManager.ts', // Appointment service
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
        // Add other shared dependencies as needed
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
      name: 'CalendarApp',
      filename: 'remoteEntry.js',
      exposes: {
        './CalendarApp': './src/App.tsx',
        './CalendarWidget': './src/components/CalendarWidget.tsx',
        './AppointmentManager': './src/services/AppointmentManager.ts',
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

## Host Application Integration

The host app (SmartCRM) loads the remote calendar module like this:

```javascript
import { loadRemoteComponent } from './utils/dynamicModuleFederation';

const CalendarComponent = await loadRemoteComponent(
  'https://calendar.smartcrm.vip',
  'CalendarApp',
  './CalendarApp'
);
```

## Communication Interface

The remote calendar app should implement these communication patterns:

### Receiving Messages from Host

```javascript
// Listen for messages from host application
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://your-crm-domain.com') return;

  const { type, data } = event.data;

  switch (type) {
    case 'SET_THEME':
      // Apply theme settings
      applyTheme(data.theme, data.mode);
      break;
    case 'INITIAL_DATA_SYNC':
      // Receive initial data from host
      updateCalendarData(data);
      break;
    case 'CRM_READY':
      // Host is ready for communication
      console.log('Host application ready');
      break;
  }
});
```

### Sending Messages to Host

```javascript
// Send messages when user interacts with calendar
function sendMessageToHost(type, data) {
  window.parent.postMessage({
    type,
    data,
    source: 'CalendarApp'
  }, 'https://your-crm-domain.com');
}

// Example usage
function onAppointmentCreate(appointment) {
  sendMessageToHost('APPOINTMENT_CREATED', appointment);
}

function onButtonClick(action, buttonData) {
  sendMessageToHost('BUTTON_CLICK', { action, ...buttonData });
}

function onCalendarReady() {
  sendMessageToHost('CALENDAR_READY', { version: '1.0.0' });
}
```

## Required Dependencies

The remote calendar app should include these dependencies:

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.0.0"
  },
  "devDependencies": {
    "@originjs/vite-plugin-federation": "^1.3.3",
    "vite": "^4.0.0",
    "webpack": "^5.0.0"
  }
}
```

## Build and Deployment

1. Build the remote app with Module Federation enabled
2. Deploy the built files to `https://calendar.smartcrm.vip`
3. Ensure `remoteEntry.js` is accessible at the root
4. The host app will automatically load and integrate the remote module

## Troubleshooting

- **Module not found**: Ensure the remoteEntry.js file is accessible
- **Shared dependencies conflict**: Make sure shared dependencies versions match
- **CORS issues**: Configure CORS headers on the remote server
- **Communication not working**: Check message origins and event listeners