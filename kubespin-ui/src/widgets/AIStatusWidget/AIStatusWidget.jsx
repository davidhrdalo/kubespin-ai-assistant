import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AIStatusWidget.module.css';

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
    <div className={styles.aiWidget}>
      <div className={styles.aiWidgetHeader}>
        <h3 className={styles.aiWidgetTitle}>AI Assistant Status</h3>
        <button
          onClick={checkStatus}
          className={styles.aiRefreshButton}
          title="Refresh status"
        >
          🔄
        </button>
      </div>

      <div className={styles.aiWidgetContent}>
        <div className={styles.aiStatusContainer}>
          <div
            className={`${styles.aiStatusIndicator} ${styles[status]}`}
          />
          <span className={styles.aiStatusText}>{getStatusText()}</span>
        </div>

        {aiModel && (
          <div className={styles.aiModelInfo}>
            <span className={styles.aiModelLabel}>Model:</span>
            <span className={styles.aiModelValue}> {aiModel}</span>
          </div>
        )}

        {lastChecked && (
          <div className={styles.aiLastChecked}>
            Last checked: {lastChecked.toLocaleTimeString()}
          </div>
        )}

        <div className={styles.aiCapabilities}>
          <div className={styles.aiCapabilitiesTitle}>Capabilities:</div>
          <div className={styles.aiCapabilitiesList}>
            {capabilities.map((capability, index) => (
              <div key={index} className={styles.aiCapability}>
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