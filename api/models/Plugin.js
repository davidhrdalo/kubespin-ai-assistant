const { v4: uuidv4 } = require('uuid');

class Plugin {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.name = data.name || '';
    this.url = data.url || '';
    this.status = data.status || 'pending'; // pending, installing, installed, failed, uninstalling
    this.version = data.version || '1.0.0';
    this.description = data.description || '';
    this.author = data.author || '';
    this.category = data.category || 'general';
    this.installedAt = data.installedAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.metadata = data.metadata || {};
    this.config = data.config || {};
  }

  // Update plugin status
  updateStatus(status) {
    this.status = status;
    this.updatedAt = new Date();
    return this;
  }

  // Update plugin configuration
  updateConfig(config) {
    this.config = { ...this.config, ...config };
    this.updatedAt = new Date();
    return this;
  }

  // Get plugin info for display
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      status: this.status,
      description: this.description,
      author: this.author,
      category: this.category,
      installedAt: this.installedAt,
      updatedAt: this.updatedAt
    };
  }

  // Check if plugin is active
  isActive() {
    return this.status === 'installed';
  }

  // Check if plugin is installing
  isInstalling() {
    return this.status === 'installing';
  }

  // Check if plugin has failed
  hasFailed() {
    return this.status === 'failed';
  }

  // Export plugin data
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      url: this.url,
      status: this.status,
      version: this.version,
      description: this.description,
      author: this.author,
      category: this.category,
      installedAt: this.installedAt,
      updatedAt: this.updatedAt,
      metadata: this.metadata,
      config: this.config
    };
  }

  // Create from JSON data
  static fromJSON(data) {
    return new Plugin(data);
  }

  // Validate plugin data
  static validate(data) {
    const errors = [];
    
    if (!data.name) {
      errors.push('Plugin name is required');
    }
    
    if (!['pending', 'installing', 'installed', 'failed', 'uninstalling'].includes(data.status)) {
      errors.push('Invalid plugin status');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Create a new plugin instance
  static create(data) {
    return new Plugin({
      ...data,
      installedAt: new Date(),
      updatedAt: new Date()
    });
  }
}

module.exports = Plugin; 