import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AIStatusWidget = () => {
  const [status, setStatus] = useState('checking');
  const [aiModel, setAiModel] = useState('');
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      setStatus('checking');
      const response = await axios.get('/health');
      setStatus('connected');
      setAiModel(response.data.aiModel);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error checking AI status:', error);
      setStatus('disconnected');
      setLastChecked(new Date());
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return '#10b981';
      case 'checking':
        return '#f59e0b';
      case 'disconnected':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'checking':
        return 'Checking...';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  const capabilities = [
    '💬 AI Chat',
    '🧩 Plugin Management',
    '⚡ Code Generation',
    '🔧 Tool Calls',
    '📊 System Monitoring'
  ];

  return (
    <div className="ai-widget">
      <div className="ai-widget-header">
        <h3 className="ai-widget-title">AI Assistant Status</h3>
        <button
          onClick={checkStatus}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            color: '#6b7280'
          }}
          title="Refresh status"
        >
          🔄
        </button>
      </div>

      <div className="ai-widget-content">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: getStatusColor(),
              marginRight: '0.5rem'
            }}
          />
          <span style={{ fontWeight: '500' }}>{getStatusText()}</span>
        </div>

        {aiModel && (
          <div style={{ marginBottom: '1rem' }}>
            <strong>Model:</strong> {aiModel}
          </div>
        )}

        {lastChecked && (
          <div style={{ marginBottom: '1rem', fontSize: '0.75rem', color: '#9ca3af' }}>
            Last checked: {lastChecked.toLocaleTimeString()}
          </div>
        )}

        <div>
          <strong>Capabilities:</strong>
          <div style={{ marginTop: '0.5rem' }}>
            {capabilities.map((capability, index) => (
              <div key={index} style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {capability}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStatusWidget; 