import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    // Minimal server configuration to avoid timer-related issues
    hmr: {
      // Use WebSockets for HMR to avoid polling issues
      protocol: 'ws'
    }
  }
});
