import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';
import federation from '@originjs/vite-plugin-federation';
import { fileURLToPath, URL } from 'node:url';
import alias from '@rollup/plugin-alias';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // federation({
    //   name: 'SmartCRM',
    //   remotes: {
    //     CalendarApp: 'https://calendar.smartcrm.vip/assets/remoteEntry.js',
    //     AnalyticsApp: 'https://analytics.smartcrm.vip/assets/remoteEntry.js',
    //     ContactsApp: 'https://contacts.smartcrm.vip/assets/remoteEntry.js',
    //     AgencyApp: 'https://agency.smartcrm.vip/assets/remoteEntry.js',
    //     PipelineApp: 'https://pipeline.smartcrm.vip/assets/remoteEntry.js',
    //     ResearchApp: 'https://research.smartcrm.vip/assets/remoteEntry.js',
    //     SalesMaxApp: 'https://salesmax.smartcrm.vip/assets/remoteEntry.js',
    //     ReferralsApp: 'https://referrals.smartcrm.vip/assets/remoteEntry.js',
    //     ContentAIApp: 'https://contentai.smartcrm.vip/assets/remoteEntry.js',
    //   },
    //   shared: ['react', 'react-dom', 'react-router-dom'],
    // }),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/api\.gemini\./,
    //         handler: 'NetworkFirst',
    //         options: {
    //         cacheName: 'gemini-api-cache',
    //         expiration: {
    //           maxEntries: 50,
    //           maxAgeSeconds: 5 * 60, // 5 minutes
    //         },
    //       },
    //     },
    //     {
    //       urlPattern: /^https:\/\/.*\.supabase\.co/,
    //       handler: 'NetworkFirst',
    //       options: {
    //         cacheName: 'supabase-api-cache',
    //         expiration: {
    //           maxEntries: 100,
    //           maxAgeSeconds: 30 * 60, // 30 minutes
    //         },
    //       },
    //     },
    //   ],
    // },
    // manifest: {
    //   name: 'SmartCRM Dashboard',
    //   short_name: 'SmartCRM',
    //   description: 'Advanced AI-powered Customer Relationship Management system',
    //   theme_color: '#2563eb',
    //   background_color: '#ffffff',
    //   display: 'standalone',
    //   orientation: 'portrait',
    //   scope: '/',
    //   start_url: '/',
    //   icons: [
    //     {
    //       src: '/android-chrome-192x192.png',
    //       sizes: '192x192',
    //       type: 'image/png',
    //     },
    //     {
    //       src: '/android-chrome-512x512.png',
    //       sizes: '512x512',
    //       type: 'image/png',
    //     },
    //   ],
    // },
    // }),
  ],
  optimizeDeps: {
    include: [
      // Force include simple-peer to avoid util module issues
      'simple-peer',
      // Include lucide-react to ensure proper bundling and avoid dynamic import failures
      'lucide-react',
      // Add UI vendor packages to force prebundling and fix React import issues
      '@radix-ui/react-slot',
      '@radix-ui/react-popover',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-progress',
      '@radix-ui/react-switch',
      '@radix-ui/react-label',
      '@radix-ui/react-separator',
      'framer-motion',
      'react-beautiful-dnd',
      'react-big-calendar',
      'react-calendar',
      'react-select',
      'react-window',
      'recharts',
      'sonner',
      'zustand'
    ]
  },
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@/': fileURLToPath(new URL('./src', import.meta.url)),
      '@components/': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@store/': fileURLToPath(new URL('./src/store', import.meta.url)),
      '@utils/': fileURLToPath(new URL('./src/utils', import.meta.url)),
      // Keep existing Node polyfills
      'events': 'events',
      'util': 'util',
      'stream': 'stream-browserify',
      'buffer': 'buffer'
    },
  },
  build: {
    rollupOptions: {
      external: [],
      plugins: [
        // alias({
        //   entries: {
        //     '@/': fileURLToPath(new URL('./src', import.meta.url)),
        //     '@components/': fileURLToPath(new URL('./src/components', import.meta.url)),
        //     '@store/': fileURLToPath(new URL('./src/store', import.meta.url)),
        //     '@utils/': fileURLToPath(new URL('./src/utils', import.meta.url)),
        //   }
        // })
      ],
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
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});