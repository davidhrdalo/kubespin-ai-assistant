import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        // Main integration components
        'page-view': resolve(__dirname, 'entries/page-view.js'),
        
        // Home screen widgets
        'ai-status': resolve(__dirname, 'entries/ai-status.js'),
        'quick-ai-actions': resolve(__dirname, 'entries/quick-ai-actions.js'),
        'recent-ai-conversations': resolve(__dirname, 'entries/recent-ai-conversations.js'),
        'plugin-installation-status': resolve(__dirname, 'entries/plugin-installation-status.js'),
        
        // Additional pages
        'chat': resolve(__dirname, 'entries/chat.js'),
        'plugin-manager': resolve(__dirname, 'entries/plugin-manager.js'),
        'code-generator': resolve(__dirname, 'entries/code-generator.js'),
        'tool-calls': resolve(__dirname, 'entries/tool-calls.js'),
      },
      external: ['react', 'react-dom', 'react-router-dom'],
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'ReactRouterDOM'
        }
      }
    }
  },
  
  server: {
    port: 3000,
    host: true,
  },
  
  preview: {
    port: 3000,
    host: true,
  },
}) 