import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ToolCallsPage = () => {
  const [command, setCommand] = useState('');
  const [commandType, setCommandType] = useState('shell');
  const [toolCallHistory, setToolCallHistory] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    loadToolHistory();
  }, []);

  const loadToolHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await axios.get('/api/tools/history');
      setToolCallHistory(response.data.history);
    } catch (error) {
      console.error('Error loading tool history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const executeToolCall = async () => {
    if (!command.trim() || isExecuting) return;

    setIsExecuting(true);
    try {
      const response = await axios.post('/api/tools/execute', {
        command,
        type: commandType
      });

      const newToolCall = response.data.toolCall;
      setToolCallHistory(prev => [newToolCall, ...prev]);
      setCommand('');
    } catch (error) {
      console.error('Error executing tool call:', error);
      const errorToolCall = {
        id: Date.now(),
        command,
        type: commandType,
        status: 'error',
        timestamp: new Date(),
        result: 'Error executing tool call. Please try again.'
      };
      setToolCallHistory(prev => [errorToolCall, ...prev]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      executeToolCall();
    }
  };

  const clearHistory = () => {
    setToolCallHistory([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'executing':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'shell':
        return '💻';
      case 'api':
        return '🌐';
      case 'file':
        return '📁';
      default:
        return '🔧';
    }
  };

  const predefinedCommands = [
    { name: 'List Files', command: 'ls -la', type: 'shell' },
    { name: 'System Info', command: 'uname -a', type: 'shell' },
    { name: 'Disk Usage', command: 'df -h', type: 'shell' },
    { name: 'Memory Usage', command: 'free -h', type: 'shell' },
    { name: 'Network Status', command: 'netstat -tuln', type: 'shell' },
    { name: 'Process List', command: 'ps aux', type: 'shell' }
  ];

  const executePredefinedCommand = (predefinedCommand) => {
    setCommand(predefinedCommand.command);
    setCommandType(predefinedCommand.type);
  };

  return (
    <div className="ai-container">
      <div className="ai-header">
        <h1>Tool Calls</h1>
        <p>Execute system commands and tool calls</p>
      </div>

      <div className="ai-card">
        <h2>Execute Tool Call</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Command:
          </label>
          <textarea
            className="ai-textarea"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your command here... (Press Enter to execute)"
            rows={3}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Command Type:
            </label>
            <select
              className="ai-input"
              value={commandType}
              onChange={(e) => setCommandType(e.target.value)}
            >
              <option value="shell">Shell Command</option>
              <option value="api">API Call</option>
              <option value="file">File Operation</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              &nbsp;
            </label>
            <button
              className="ai-button"
              onClick={executeToolCall}
              disabled={!command.trim() || isExecuting}
              style={{ width: '100%' }}
            >
              {isExecuting ? (
                <>
                  <div className="ai-spinner" style={{ display: 'inline-block', marginRight: '0.5rem' }}></div>
                  Executing...
                </>
              ) : (
                'Execute'
              )}
            </button>
          </div>
        </div>

        <div className="ai-card" style={{ marginTop: '1rem' }}>
          <h3>Quick Commands</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
            {predefinedCommands.map((predefinedCommand, index) => (
              <button
                key={index}
                className="ai-button secondary"
                onClick={() => executePredefinedCommand(predefinedCommand)}
                style={{ fontSize: '0.875rem', textAlign: 'left' }}
              >
                <span style={{ marginRight: '0.5rem' }}>
                  {getTypeIcon(predefinedCommand.type)}
                </span>
                {predefinedCommand.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="ai-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Tool Call History</h2>
          <button
            className="ai-button secondary"
            onClick={clearHistory}
            style={{ fontSize: '0.875rem' }}
          >
            Clear History
          </button>
        </div>

        {isLoadingHistory ? (
          <div className="ai-loading">
            <div className="ai-spinner"></div>
            <span>Loading history...</span>
          </div>
        ) : toolCallHistory.length === 0 ? (
          <p>No tool calls executed yet.</p>
        ) : (
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {toolCallHistory.map((toolCall) => (
              <div key={toolCall.id} className="ai-tool-call">
                <div className="ai-tool-call-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{getTypeIcon(toolCall.type)}</span>
                    <span style={{ fontWeight: '500' }}>
                      {toolCall.type.charAt(0).toUpperCase() + toolCall.type.slice(1)} Command
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: getStatusColor(toolCall.status) + '20',
                        color: getStatusColor(toolCall.status)
                      }}
                    >
                      {toolCall.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      {new Date(toolCall.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="ai-tool-call-command">
                  {toolCall.command}
                </div>

                {toolCall.result && (
                  <div className="ai-tool-call-result">
                    {toolCall.result}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolCallsPage; 