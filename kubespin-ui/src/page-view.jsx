import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from './pages/ChatPage/ChatPage.jsx';
import PluginManagerPage from './pages/PluginManagerPage/PluginManagerPage.jsx';
import CodeGeneratorPage from './pages/CodeGeneratorPage/CodeGeneratorPage.jsx';
import ToolCallsPage from './pages/ToolCallsPage/ToolCallsPage.jsx';
import './styles/global.css';

const App = () => {
  return (
    <Router>
      <div className="ai-assistant-app">
        <Routes>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/plugin-manager" element={<PluginManagerPage />} />
          <Route path="/code-generator" element={<CodeGeneratorPage />} />
          <Route path="/tool-calls" element={<ToolCallsPage />} />
          <Route path="/" element={<ChatPage />} />
        </Routes>
      </div>
    </Router>
  );
};

// Initialize the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App; 