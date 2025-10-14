import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  root: './client',
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.gemini\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'gemini-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 minutes
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 60, // 30 minutes
              },
            },
          },
        ],
      },
      manifest: {
        name: 'SmartCRM Dashboard',
        short_name: 'SmartCRM',
        description: 'Advanced AI-powered Customer Relationship Management system',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: [
      // Force include simple-peer to avoid util module issues
      'simple-peer'
    ]
  },
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  resolve: {
    alias: [
      {
        find: '@/',
        replacement: '/src/'
      },
      {
        find: '@components/',
        replacement: '/src/components/'
      },
      {
        find: '@store/',
        replacement: '/src/store/'
      },
      {
        find: '@utils/',
        replacement: '/src/utils/'
      },
      // Keep existing Node polyfills
      { find: 'events', replacement: 'events' },
      { find: 'util', replacement: 'util' },
      { find: 'stream', replacement: 'stream-browserify' },
      { find: 'buffer', replacement: 'buffer' }
    ],
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core vendor chunks
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/@headlessui')) {
            return 'ui-vendor';
          }
          if (id.includes('node_modules/recharts')) {
            return 'charts';
          }
          if (id.includes('node_modules/react-big-calendar')) {
            return 'calendar';
          }

          // Split large service files
          if (id.includes('src/services/openai')) {
            return 'openai-services';
          }
          if (id.includes('src/services/gemini') || id.includes('src/services/gpt5')) {
            return 'ai-providers';
          }
          if (id.includes('src/services/') && !id.includes('openai') && !id.includes('gemini')) {
            return 'core-services';
          }

          // Split AI tools into smaller chunks
          if (id.includes('src/components/aiTools/')) {
            return 'ai-tools';
          }

          // Analytics and reporting
          if (id.includes('src/pages/Analytics') || id.includes('src/components/analytics')) {
            return 'analytics';
          }

          // Communication features
          if (id.includes('src/components/communications') || id.includes('src/pages/Communication')) {
            return 'communications';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
