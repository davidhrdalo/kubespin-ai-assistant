import React from 'react';
import styles from './QuickAIActionsWidget.module.css';

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
    <div className={styles.aiWidget}>
      <div className={styles.aiWidgetHeader}>
        <h3 className={styles.aiWidgetTitle}>Quick AI Actions</h3>
      </div>

      <div className={styles.aiWidgetContent}>
        <div className={styles.aiActionsGrid}>
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={styles.aiActionButton}
            >
              <div className={styles.aiActionHeader}>
                <span className={styles.aiActionIcon}>{action.icon}</span>
                <span className={styles.aiActionName}>
                  {action.name}
                </span>
              </div>
              <span className={styles.aiActionDescription}>
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