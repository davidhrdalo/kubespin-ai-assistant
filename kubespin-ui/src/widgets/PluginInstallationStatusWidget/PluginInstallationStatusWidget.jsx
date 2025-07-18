import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      <div className="ai-widget">
        <div className="ai-widget-header">
          <h3 className="ai-widget-title">Plugin Installation Status</h3>
        </div>
        <div className="ai-loading">
          <div className="ai-spinner"></div>
          <span>Loading plugins...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-widget">
      <div className="ai-widget-header">
        <h3 className="ai-widget-title">Plugin Installation Status</h3>
        <button
          onClick={loadInstalledPlugins}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            color: '#6b7280'
          }}
          title="Refresh plugins"
        >
          🔄
        </button>
      </div>

      <div className="ai-widget-content">
        {installedPlugins.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            No plugins installed
          </p>
        ) : (
          <div>
            {installedPlugins.map((plugin) => (
              <div
                key={plugin.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #f3f4f6'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                    {plugin.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    v{plugin.version}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(plugin.status)
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: getStatusColor(plugin.status) }}>
                    {getStatusText(plugin.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            onClick={() => window.location.href = '/plugin/ai-assistant/plugin-manager'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#3b82f6',
              fontWeight: '500'
            }}
          >
            Manage Plugins
          </button>
        </div>
      </div>
    </div>
  );
};

export default PluginInstallationStatusWidget; 