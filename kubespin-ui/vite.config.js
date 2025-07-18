import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        'page-view': './src/page-view.jsx',
        'chat': './src/pages/ChatPage/ChatPage.jsx',
        'plugin-manager': './src/pages/PluginManagerPage/PluginManagerPage.jsx',
        'code-generator': './src/pages/CodeGeneratorPage/CodeGeneratorPage.jsx',
        'tool-calls': './src/pages/ToolCallsPage/ToolCallsPage.jsx',
        'ai-status': './src/widgets/AIStatusWidget/AIStatusWidget.jsx',
        'quick-ai-actions': './src/widgets/QuickAIActionsWidget/QuickAIActionsWidget.jsx',
        'recent-ai-conversations': './src/widgets/RecentAIConversationsWidget/RecentAIConversationsWidget.jsx',
        'plugin-installation-status': './src/widgets/PluginInstallationStatusWidget/PluginInstallationStatusWidget.jsx'
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
}) 