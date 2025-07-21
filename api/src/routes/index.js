const express = require('express');
const router = express.Router();

// Import route modules
const chatRoutes = require('./chatRoutes');
const pluginRoutes = require('./pluginRoutes');
const toolRoutes = require('./toolRoutes');
const codeRoutes = require('./codeRoutes');
const settingsRoutes = require('./settingsRoutes');

// Mount route modules
router.use('/', chatRoutes);
router.use('/', pluginRoutes);
router.use('/', toolRoutes);
router.use('/', codeRoutes);
router.use('/', settingsRoutes);

// Root endpoint
router.get('/', (req, res) => {
  res.json({
    service: 'AI Assistant API',
    version: '1.0.0',
    endpoints: {
      chat: '/chat',
      plugins: '/plugins',
      tools: '/tools',
      code: '/code',
      settings: '/settings'
    }
  });
});

module.exports = router; 