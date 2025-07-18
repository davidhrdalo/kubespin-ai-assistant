const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const OpenAI = require('openai');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory storage for conversations and plugin data
const conversations = new Map();
const installedPlugins = new Map();
const toolCallHistory = new Map();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    aiModel: process.env.AI_MODEL || 'gpt-4'
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context = {}, conversationId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const convId = conversationId || uuidv4();
    const conversation = conversations.get(convId) || [];
    
    // Add user message to conversation
    conversation.push({ role: 'user', content: message, timestamp: new Date() });

    // Prepare system message with context
    const systemMessage = {
      role: 'system',
      content: `You are an AI assistant for the Kubespin development platform. You can:
- Help with code generation and development tasks
- Install and manage plugins
- Execute tool calls and system commands
- Provide development guidance and best practices

Current context: ${JSON.stringify(context)}

Available tools:
- Plugin installation and management
- Code generation
- System command execution
- File operations

Always be helpful, concise, and provide actionable advice.`
    };

    // Prepare messages for OpenAI
    const messages = [systemMessage, ...conversation.slice(-10)]; // Keep last 10 messages for context

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;
    
    // Add AI response to conversation
    conversation.push({ role: 'assistant', content: aiResponse, timestamp: new Date() });
    conversations.set(convId, conversation);

    res.json({
      response: aiResponse,
      conversationId: convId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Plugin management endpoints
app.post('/api/plugins/install', async (req, res) => {
  try {
    const { pluginName, pluginUrl } = req.body;
    
    if (!pluginName) {
      return res.status(400).json({ error: 'Plugin name is required' });
    }

    // Simulate plugin installation
    const pluginId = uuidv4();
    const plugin = {
      id: pluginId,
      name: pluginName,
      url: pluginUrl,
      status: 'installing',
      installedAt: new Date(),
      version: '1.0.0'
    };

    installedPlugins.set(pluginId, plugin);

    // Simulate installation process
    setTimeout(() => {
      plugin.status = 'installed';
    }, 2000);

    res.json({
      success: true,
      plugin,
      message: `Plugin ${pluginName} installation started`
    });

  } catch (error) {
    console.error('Plugin installation error:', error);
    res.status(500).json({ error: 'Failed to install plugin' });
  }
});

app.get('/api/plugins/installed', (req, res) => {
  try {
    const plugins = Array.from(installedPlugins.values());
    res.json({ plugins });
  } catch (error) {
    console.error('Get installed plugins error:', error);
    res.status(500).json({ error: 'Failed to get installed plugins' });
  }
});

app.get('/api/plugins/available', (req, res) => {
  try {
    // Mock available plugins
    const availablePlugins = [
      {
        name: 'kubespin-mongo-ide-session',
        description: 'MongoDB Development Platform',
        version: '1.0.0',
        author: 'Kubespin',
        category: 'Database'
      },
      {
        name: 'kubespin-react-dashboard',
        description: 'React Dashboard Components',
        version: '1.0.0',
        author: 'Kubespin',
        category: 'UI'
      },
      {
        name: 'kubespin-python-api',
        description: 'Python API Framework',
        version: '1.0.0',
        author: 'Kubespin',
        category: 'Backend'
      }
    ];
    
    res.json({ plugins: availablePlugins });
  } catch (error) {
    console.error('Get available plugins error:', error);
    res.status(500).json({ error: 'Failed to get available plugins' });
  }
});

// Tool calls endpoint
app.post('/api/tools/execute', async (req, res) => {
  try {
    const { command, type = 'shell' } = req.body;
    
    if (!command) {
      return res.status(400).json({ error: 'Command is required' });
    }

    const toolCallId = uuidv4();
    const toolCall = {
      id: toolCallId,
      command,
      type,
      status: 'executing',
      timestamp: new Date(),
      result: null
    };

    toolCallHistory.set(toolCallId, toolCall);

    // Simulate tool execution based on type
    let result;
    switch (type) {
      case 'shell':
        result = `Executed shell command: ${command}\nOutput: Command executed successfully`;
        break;
      case 'api':
        result = `API call: ${command}\nResponse: {"status": "success"}`;
        break;
      case 'file':
        result = `File operation: ${command}\nResult: File operation completed`;
        break;
      default:
        result = `Unknown tool type: ${type}`;
    }

    toolCall.status = 'completed';
    toolCall.result = result;

    res.json({
      success: true,
      toolCall,
      result
    });

  } catch (error) {
    console.error('Tool execution error:', error);
    res.status(500).json({ error: 'Failed to execute tool call' });
  }
});

// Code generation endpoint
app.post('/api/code/generate', async (req, res) => {
  try {
    const { requirements, language = 'javascript', framework } = req.body;
    
    if (!requirements) {
      return res.status(400).json({ error: 'Requirements are required' });
    }

    // Prepare prompt for code generation
    const prompt = `Generate ${language} code for the following requirements: ${requirements}
    ${framework ? `Use ${framework} framework.` : ''}
    
    Provide:
    1. Complete, working code
    2. Brief explanation of the code
    3. Usage instructions
    4. Any dependencies needed`;

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert code generator. Generate clean, well-documented, and production-ready code.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const generatedCode = completion.choices[0].message.content;

    res.json({
      success: true,
      code: generatedCode,
      language,
      framework,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Code generation error:', error);
    res.status(500).json({ error: 'Failed to generate code' });
  }
});

// Get conversation history
app.get('/api/conversations/:id', (req, res) => {
  try {
    const { id } = req.params;
    const conversation = conversations.get(id);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ conversation });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
});

// Get tool call history
app.get('/api/tools/history', (req, res) => {
  try {
    const history = Array.from(toolCallHistory.values());
    res.json({ history });
  } catch (error) {
    console.error('Get tool history error:', error);
    res.status(500).json({ error: 'Failed to get tool history' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`AI Assistant Backend running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
}); 