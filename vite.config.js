import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://agent.ops.geniusos.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false
      },
      '/db-api': {
        target: 'https://db.api.geniusos.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/db-api/, ''),
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      // Add aliases for Node.js modules
      path: 'path-browserify',
      stream: 'stream-browserify',
      crypto: 'crypto-browserify',
    }
  },
  define: {
    // Polyfill for process.env
    'process.env': {},
    // Ensure global is defined
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      }
    }
  }
})