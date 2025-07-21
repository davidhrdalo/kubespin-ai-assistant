// AI Assistant API - Main Entry Point
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const http = require("http");
const config = require("./config");
const DatabaseService = require("./db/sqliteClient");
const OpenAI = require("openai");
const { v4: uuidv4 } = require("uuid");

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

// Initialize database
const db = new DatabaseService();

async function main() {
  try {
    // Test database connection and schema
    if (!db.testConnection()) {
      throw new Error("Database schema not found. Please ensure the database is properly initialized.");
    }
    
    const stats = db.getStats();
    console.log("[AI Assistant] ✅ Database initialized successfully");
    console.log(`[AI Assistant]    Database stats:`, stats);
  } catch (dbError) {
    console.error("❌ Fatal error: Could not initialize database. AI Assistant cannot start.", dbError);
    process.exit(1);
  }

  const app = express();
  const server = http.createServer(app);

  // --- CORS Configuration ---
  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || config.ALLOWED_ORIGINS.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.error(`CORS Error: Origin ${origin} not allowed.`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));

  // --- Security Middleware ---
  app.use(helmet());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // --- Request Logging ---
  app.use((req, res, next) => {
    console.log(`[AI Assistant] Request: ${req.method} ${req.url}`);
    next();
  });

  // --- Health Check Endpoint ---
  app.get("/health", (req, res) => {
    try {
      const stats = db.getStats();
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        aiModel: config.AI_MODEL,
        database: {
          conversations: stats.conversations,
          plugins: stats.plugins,
          toolCalls: stats.toolCalls
        }
      });
    } catch (error) {
      console.error('Health check error:', error);
      res.status(500).json({ status: 'unhealthy', error: error.message });
    }
  });

  // --- Chat Endpoint ---
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, context = {}, conversationId } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const convId = conversationId || uuidv4();
      let conversation = db.getConversation(convId) || [];
      
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
      const messages = [systemMessage, ...conversation.slice(-10)];

      // Call OpenAI
      const completion = await openai.chat.completions.create({
        model: config.AI_MODEL,
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      const aiResponse = completion.choices[0].message.content;
      
      // Add AI response to conversation
      conversation.push({ role: 'assistant', content: aiResponse, timestamp: new Date() });
      
      // Save conversation to database
      db.saveConversation(convId, conversation);

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

  // --- Plugin Management Endpoints ---
  app.post("/api/plugins/install", async (req, res) => {
    try {
      const { pluginName, pluginUrl } = req.body;
      
      if (!pluginName) {
        return res.status(400).json({ error: 'Plugin name is required' });
      }

      const pluginId = uuidv4();
      const plugin = {
        id: pluginId,
        name: pluginName,
        url: pluginUrl,
        status: 'installing',
        version: '1.0.0'
      };

      db.savePlugin(plugin);

      // Simulate installation process
      setTimeout(() => {
        db.updatePluginStatus(pluginId, 'installed');
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

  app.get("/api/plugins/installed", (req, res) => {
    try {
      const plugins = db.getAllPlugins();
      res.json({ plugins });
    } catch (error) {
      console.error('Get installed plugins error:', error);
      res.status(500).json({ error: 'Failed to get installed plugins' });
    }
  });

  app.get("/api/plugins/available", (req, res) => {
    try {
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

  // --- Tool Calls Endpoint ---
  app.post("/api/tools/execute", async (req, res) => {
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

      db.saveToolCall(toolCall);

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

      db.updateToolCallResult(toolCallId, result, 'completed');

      res.json({
        success: true,
        toolCall: { ...toolCall, result, status: 'completed' },
        result
      });

    } catch (error) {
      console.error('Tool execution error:', error);
      res.status(500).json({ error: 'Failed to execute tool call' });
    }
  });

  // --- Code Generation Endpoint ---
  app.post("/api/code/generate", async (req, res) => {
    try {
      const { requirements, language = 'javascript', framework } = req.body;
      
      if (!requirements) {
        return res.status(400).json({ error: 'Requirements are required' });
      }

      const prompt = `Generate ${language} code for the following requirements: ${requirements}
      ${framework ? `Use ${framework} framework.` : ''}
      
      Provide:
      1. Complete, working code
      2. Brief explanation of the code
      3. Usage instructions
      4. Any dependencies needed`;

      const completion = await openai.chat.completions.create({
        model: config.AI_MODEL,
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

  // --- Conversation Management ---
  app.get("/api/conversations/:id", (req, res) => {
    try {
      const { id } = req.params;
      const conversation = db.getConversation(id);
      
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      res.json({ conversation });
    } catch (error) {
      console.error('Get conversation error:', error);
      res.status(500).json({ error: 'Failed to get conversation' });
    }
  });

  app.get("/api/conversations", (req, res) => {
    try {
      const conversations = db.getAllConversations();
      res.json({ conversations });
    } catch (error) {
      console.error('Get conversations error:', error);
      res.status(500).json({ error: 'Failed to get conversations' });
    }
  });

  app.delete("/api/conversations/:id", (req, res) => {
    try {
      const { id } = req.params;
      const result = db.deleteConversation(id);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      res.json({ success: true, message: 'Conversation deleted' });
    } catch (error) {
      console.error('Delete conversation error:', error);
      res.status(500).json({ error: 'Failed to delete conversation' });
    }
  });

  // --- Tool Call History ---
  app.get("/api/tools/history", (req, res) => {
    try {
      const history = db.getAllToolCalls();
      res.json({ history });
    } catch (error) {
      console.error('Get tool history error:', error);
      res.status(500).json({ error: 'Failed to get tool history' });
    }
  });

  // --- Database Statistics ---
  app.get("/api/stats", (req, res) => {
    try {
      const stats = db.getStats();
      res.json({ stats });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: 'Failed to get statistics' });
    }
  });

  // --- Graceful Shutdown ---
  async function shutdown(signal) {
    console.log(`[AI Assistant] ${signal} signal received. Shutting down gracefully...`);
    
    server.close(async () => {
      console.log("[AI Assistant] HTTP server closed.");
      db.close();
      process.exit(0);
    });
    
    setTimeout(async () => {
      console.error("[AI Assistant] Could not close connections in time, forcing shutdown.");
      db.close();
      process.exit(1);
    }, 10000);
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // --- Start Server ---
  server.listen(config.PORT, () => {
    console.log(`[AI Assistant] 🚀 AI Assistant API listening on port ${config.PORT}`);
    console.log(`[AI Assistant] 🔌 Health check available at http://localhost:${config.PORT}/health`);
    console.log(`[AI Assistant]    Database: ${config.DB_PATH}`);
    console.log(`[AI Assistant]    AI Model: ${config.AI_MODEL}`);
    console.log(`[AI Assistant]    Allowed CORS Origins:`, config.ALLOWED_ORIGINS);
  });
}

main().catch((error) => {
  console.error("❌ Fatal error during AI Assistant startup:", error);
  db.close();
  process.exit(1);
}); 