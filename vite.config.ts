import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    federation({
      name: 'crm_host',
      filename: 'remoteEntry.js',
      exposes: {
        './stores': './client/src/stores/index.ts',
        './services': './client/src/services/index.ts',
        './hooks': './client/src/hooks/index.ts',
        './utils': './client/src/utils/index.ts',
        './contexts': './client/src/contexts/index.ts',
        './types': './client/src/types/index.ts',
        './components/ui': './client/src/components/ui/index.ts',
        './components/common': './client/src/components/common/index.ts'
      },
      remotes: {
        contacts: 'contacts@https://taupe-sprinkles-83c9ee.netlify.app/remoteEntry.js',
        pipeline: 'pipeline@https://cheery-syrniki-b5b6ca.netlify.app/remoteEntry.js',
        analytics: 'analytics@https://resilient-frangipane-6289c8.netlify.app/remoteEntry.js'
      },
      shared: [
        'react',
        'react-dom',
        'zustand',
        '@tanstack/react-query',
        'wouter'
      ]
    }),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [
      "9f38fddb-d049-4cd4-9f57-c41b6a878a9d-00-2xv27ubfspt46.riker.replit.dev",
      ".replit.dev",
      ".repl.co", 
      ".riker.replit.dev",
      "*.riker.replit.dev",
      "localhost",
      "0.0.0.0"
    ]
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['@elevenlabs/convai-widget-embed'],
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/client"),
    emptyOutDir: true,
    rollupOptions: {
      external: ['stream', 'fs', 'path', 'crypto', 'http', 'https', 'url', 'util', 'events', 'buffer', 'os', 'zlib'],
    },
  },
});
