import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './PluginInstallationStatusWidget.module.css';

const PluginInstallationStatusWidget = () => {
  const [installedPlugins, setInstalledPlugins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInstalledPlugins();
  }, []);

  const loadInstalledPlugins = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/plugins/installed');
      setInstalledPlugins(response.data.plugins);
    } catch (error) {
      console.error('Error loading installed plugins:', error);
      // Use mock data for demo
      setInstalledPlugins([
        {
          id: '1',
          name: 'kubespin-mongo-ide-session',
          status: 'installed',
          version: '1.0.0',
          installedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) // 7 days ago
        },
        {
          id: '2',
          name: 'kubespin-react-dashboard',
          status: 'installing',
          version: '1.0.0',
          installedAt: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'installed':
        return '#10b981';
      case 'installing':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'installed':
        return 'Installed';
      case 'installing':
        return 'Installing...';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className={styles.aiWidget}>
        <div className={styles.aiWidgetHeader}>
          <h3 className={styles.aiWidgetTitle}>Plugin Installation Status</h3>
        </div>
        <div className={styles.aiLoading}>
          <div className={styles.aiSpinner}></div>
          <span>Loading plugins...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.aiWidget}>
      <div className={styles.aiWidgetHeader}>
        <h3 className={styles.aiWidgetTitle}>Plugin Installation Status</h3>
        <button
          onClick={loadInstalledPlugins}
          className={styles.aiRefreshButton}
          title="Refresh plugins"
        >
          🔄
        </button>
      </div>

      <div className={styles.aiWidgetContent}>
        {installedPlugins.length === 0 ? (
          <p className={styles.aiEmptyState}>
            No plugins installed
          </p>
        ) : (
          <div className={styles.aiPluginsList}>
            {installedPlugins.map((plugin) => (
              <div
                key={plugin.id}
                className={styles.aiPluginItem}
              >
                <div className={styles.aiPluginInfo}>
                  <div className={styles.aiPluginName}>
                    {plugin.name}
                  </div>
                  <div className={styles.aiPluginVersion}>
                    v{plugin.version}
                  </div>
                </div>
                <div className={styles.aiPluginStatus}>
                  <div
                    className={`${styles.aiStatusIndicator} ${styles[plugin.status]}`}
                  />
                  <span className={`${styles.aiStatusText} ${styles[plugin.status]}`}>
                    {getStatusText(plugin.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.aiManageButtonContainer}>
          <button
            onClick={() => window.location.href = '/plugin/ai-assistant/plugin-manager'}
            className={styles.aiManageButton}
          >
            Manage Plugins
          </button>
        </div>
      </div>
    </div>
  );
};

export default PluginInstallationStatusWidget; 