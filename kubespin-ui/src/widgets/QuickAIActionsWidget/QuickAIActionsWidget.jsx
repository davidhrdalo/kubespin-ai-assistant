import React from 'react';

const QuickAIActionsWidget = () => {
  const quickActions = [
    {
      name: 'Generate React Component',
      description: 'Create a new React component',
      icon: '⚛️',
      action: () => window.location.href = '/plugin/ai-assistant/code-generator'
    },
    {
      name: 'Install Plugin',
      description: 'Browse and install plugins',
      icon: '🧩',
      action: () => window.location.href = '/plugin/ai-assistant/plugin-manager'
    },
    {
      name: 'System Check',
      description: 'Run system diagnostics',
      icon: '🔍',
      action: () => window.location.href = '/plugin/ai-assistant/tool-calls'
    },
    {
      name: 'AI Chat',
      description: 'Start a conversation',
      icon: '💬',
      action: () => window.location.href = '/plugin/ai-assistant/chat'
    }
  ];

  return (
    <div className="ai-widget">
      <div className="ai-widget-header">
        <h3 className="ai-widget-title">Quick AI Actions</h3>
      </div>

      <div className="ai-widget-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '0.75rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{action.icon}</span>
                <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                  {action.name}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {action.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickAIActionsWidget; 