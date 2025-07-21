import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PluginManagerPage = () => {
  const [availablePlugins, setAvailablePlugins] = useState([]);
  const [installedPlugins, setInstalledPlugins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [installingPlugins, setInstallingPlugins] = useState(new Set());

  useEffect(() => {
    loadPlugins();
  }, []);

  const loadPlugins = async () => {
    try {
      setIsLoading(true);
      const [availableRes, installedRes] = await Promise.all([
        axios.get('/api/plugins/available'),
        axios.get('/api/plugins/installed')
      ]);

      setAvailablePlugins(availableRes.data.plugins);
      setInstalledPlugins(installedRes.data.plugins);
    } catch (error) {
      console.error('Error loading plugins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const installPlugin = async (pluginName, pluginUrl) => {
    try {
      setInstallingPlugins(prev => new Set(prev).add(pluginName));
      
      const response = await axios.post('/api/plugins/install', {
        pluginName,
        pluginUrl
      });

      // Update installed plugins list
      setInstalledPlugins(prev => [...prev, response.data.plugin]);
      
      // Remove from available plugins
      setAvailablePlugins(prev => prev.filter(p => p.name !== pluginName));
      
      // Update plugin status after a delay to simulate installation
      setTimeout(() => {
        setInstalledPlugins(prev => 
          prev.map(p => 
            p.name === pluginName 
              ? { ...p, status: 'installed' }
              : p
          )
        );
        setInstallingPlugins(prev => {
          const newSet = new Set(prev);
          newSet.delete(pluginName);
          return newSet;
        });
      }, 2000);

    } catch (error) {
      console.error('Error installing plugin:', error);
      setInstallingPlugins(prev => {
        const newSet = new Set(prev);
        newSet.delete(pluginName);
        return newSet;
      });
    }
  };

  const uninstallPlugin = async (pluginId) => {
    try {
      setInstalledPlugins(prev => prev.filter(p => p.id !== pluginId));
      // In a real implementation, you would call an uninstall API
    } catch (error) {
      console.error('Error uninstalling plugin:', error);
    }
  };

  const PluginCard = ({ plugin, isInstalled = false, onInstall, onUninstall }) => (
    <div className="ai-plugin-card">
      <h3>{plugin.name}</h3>
      <p>{plugin.description}</p>
      
      <div className="ai-plugin-meta">
        <span>Version: {plugin.version}</span>
        <span>Author: {plugin.author}</span>
      </div>

      <div className="ai-plugin-meta">
        <span>Category: {plugin.category}</span>
        {isInstalled && (
          <span className={`ai-plugin-status ${plugin.status}`}>
            {plugin.status}
          </span>
        )}
      </div>

      {isInstalled ? (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="ai-button secondary"
            onClick={() => onUninstall(plugin.id)}
            style={{ fontSize: '0.875rem' }}
          >
            Uninstall
          </button>
          {plugin.status === 'installing' && (
            <div className="ai-loading">
              <div className="ai-spinner"></div>
              <span>Installing...</span>
            </div>
          )}
        </div>
      ) : (
        <button
          className="ai-button"
          onClick={() => onInstall(plugin.name, plugin.url)}
          disabled={installingPlugins.has(plugin.name)}
        >
          {installingPlugins.has(plugin.name) ? 'Installing...' : 'Install'}
        </button>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="ai-container">
        <div className="ai-header">
          <h1>Plugin Manager</h1>
          <p>Install and manage kubespin plugins</p>
        </div>
        <div className="ai-loading">
          <div className="ai-spinner"></div>
          <span>Loading plugins...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-container">
      <div className="ai-header">
        <h1>Plugin Manager</h1>
        <p>Install and manage kubespin plugins</p>
      </div>

      <div className="ai-card">
        <h2>Installed Plugins ({installedPlugins.length})</h2>
        {installedPlugins.length === 0 ? (
          <p>No plugins installed yet. Browse available plugins below.</p>
        ) : (
          <div className="ai-plugin-grid">
            {installedPlugins.map(plugin => (
              <PluginCard
                key={plugin.id}
                plugin={plugin}
                isInstalled={true}
                onUninstall={uninstallPlugin}
              />
            ))}
          </div>
        )}
      </div>

      <div className="ai-card">
        <h2>Available Plugins ({availablePlugins.length})</h2>
        {availablePlugins.length === 0 ? (
          <p>No available plugins found.</p>
        ) : (
          <div className="ai-plugin-grid">
            {availablePlugins.map(plugin => (
              <PluginCard
                key={plugin.name}
                plugin={plugin}
                onInstall={installPlugin}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          className="ai-button secondary"
          onClick={loadPlugins}
        >
          Refresh Plugins
        </button>
      </div>
    </div>
  );
};

export default PluginManagerPage; 