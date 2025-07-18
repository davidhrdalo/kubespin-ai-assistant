# AI Assistant Plugin for Kubespin

An AI-powered assistant plugin for the Kubespin development platform that provides intelligent assistance for development tasks, plugin management, and code generation.

## Features

### 🤖 AI Chat
- Interactive AI chat interface for development assistance
- Context-aware conversations
- Support for multiple AI models (GPT-4, etc.)
- Conversation history and management

### 🧩 Plugin Manager
- Browse available kubespin plugins
- Install and uninstall plugins
- Plugin status monitoring
- Version management

### ⚡ Code Generator
- AI-powered code generation
- Support for multiple programming languages
- Framework-specific code generation
- Code download and clipboard integration

### 🔧 Tool Calls
- Execute system commands
- API call execution
- File operations
- Command history and monitoring

### 📊 Dashboard Widgets
- AI Assistant Status
- Quick AI Actions
- Recent AI Conversations
- Plugin Installation Status

## Architecture

### Backend (Node.js/Express)
- **API Server**: Handles AI interactions, plugin management, and tool execution
- **OpenAI Integration**: Powered by OpenAI's GPT models
- **Plugin Management**: Manages kubespin plugin installation and status
- **Tool Execution**: Safe execution of system commands and API calls

### Frontend (React)
- **Modern UI**: Clean, responsive interface built with React
- **Component-based**: Modular components for easy maintenance
- **Real-time Updates**: Live status updates and notifications
- **Mobile Responsive**: Works on all device sizes

## Installation

1. **Clone the plugin**:
   ```bash
   git clone <repository-url>
   cd kubespin-ai-assistant
   ```

2. **Install dependencies**:
   ```bash
   # Backend dependencies
   cd api
   npm install
   
   # Frontend dependencies
   cd ../kubespin-ui
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   # In api/.env
   OPENAI_API_KEY=your_openai_api_key
   PORT=3002
   AI_MODEL=gpt-4
   PLUGIN_MANAGER_URL=http://kubespin-backend-service:3000
   ```

4. **Build and run**:
   ```bash
   # Build UI
   cd kubespin-ui
   npm run build
   
   # Start backend
   cd ../api
   npm start
   ```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for AI functionality | Required |
| `PORT` | Backend server port | 3002 |
| `AI_MODEL` | AI model to use | gpt-4 |
| `PLUGIN_MANAGER_URL` | Kubespin plugin manager URL | http://kubespin-backend-service:3000 |

### Plugin Configuration

The plugin is configured via `plugin.json` with the following sections:

- **Containers**: Docker containers for backend and UI
- **UI**: React components and routing configuration
- **Backend Interactions**: API endpoints and schemas
- **Environment Variables**: Configuration options

## Usage

### AI Chat
1. Navigate to the AI Chat page
2. Type your question or request
3. Get intelligent responses from the AI assistant
4. View conversation history

### Plugin Management
1. Go to the Plugin Manager page
2. Browse available plugins
3. Click "Install" to add plugins
4. Monitor installation status

### Code Generation
1. Visit the Code Generator page
2. Describe the code you need
3. Select programming language and framework
4. Generate and download code

### Tool Calls
1. Access the Tool Calls page
2. Enter system commands or API calls
3. Execute and view results
4. Monitor command history

## API Endpoints

### Chat
- `POST /api/chat` - Send message to AI assistant
- `GET /api/conversations/:id` - Get conversation history

### Plugins
- `GET /api/plugins/available` - List available plugins
- `GET /api/plugins/installed` - List installed plugins
- `POST /api/plugins/install` - Install a plugin

### Code Generation
- `POST /api/code/generate` - Generate code based on requirements

### Tool Execution
- `POST /api/tools/execute` - Execute tool calls
- `GET /api/tools/history` - Get tool call history

### Health Check
- `GET /health` - Service health status

## Development

### Backend Development
```bash
cd api
npm run dev  # Start with nodemon
```

### Frontend Development
```bash
cd kubespin-ui
npm run dev  # Start Vite dev server
```

### Building for Production
```bash
# Build UI
cd kubespin-ui
npm run build

# Build Docker images
docker build -t ai-assistant-backend ./api
docker build -t ai-assistant-ui ./kubespin-ui
```

## Security Considerations

- **API Key Management**: Store OpenAI API keys securely
- **Command Execution**: Validate and sanitize all tool calls
- **Plugin Installation**: Verify plugin sources and integrity
- **Rate Limiting**: Implement rate limiting for AI API calls
- **Input Validation**: Validate all user inputs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

## Roadmap

- [ ] Multi-language support
- [ ] Advanced code analysis
- [ ] Integration with more AI models
- [ ] Plugin marketplace
- [ ] Advanced tool execution
- [ ] Real-time collaboration features 