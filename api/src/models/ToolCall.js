const { v4: uuidv4 } = require('uuid');

class ToolCall {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.command = data.command || '';
    this.type = data.type || 'shell'; // shell, api, file
    this.status = data.status || 'pending'; // pending, executing, completed, failed
    this.result = data.result || null;
    this.error = data.error || null;
    this.executionTime = data.executionTime || 0;
    this.timestamp = data.timestamp || new Date();
    this.metadata = data.metadata || {};
    this.permissions = data.permissions || ['read'];
  }

  // Update tool call status
  updateStatus(status, result = null, error = null) {
    this.status = status;
    if (result !== null) this.result = result;
    if (error !== null) this.error = error;
    return this;
  }

  // Set execution result
  setResult(result, executionTime = 0) {
    this.result = result;
    this.executionTime = executionTime;
    this.status = 'completed';
    return this;
  }

  // Set execution error
  setError(error, executionTime = 0) {
    this.error = error;
    this.executionTime = executionTime;
    this.status = 'failed';
    return this;
  }

  // Get tool call summary
  getSummary() {
    return {
      id: this.id,
      command: this.command,
      type: this.type,
      status: this.status,
      executionTime: this.executionTime,
      timestamp: this.timestamp,
      hasError: !!this.error
    };
  }

  // Check if tool call is completed
  isCompleted() {
    return this.status === 'completed';
  }

  // Check if tool call failed
  hasFailed() {
    return this.status === 'failed';
  }

  // Check if tool call is executing
  isExecuting() {
    return this.status === 'executing';
  }

  // Get result or error message
  getOutput() {
    if (this.error) {
      return `Error: ${this.error}`;
    }
    return this.result || 'No output';
  }

  // Validate tool call permissions
  hasPermission(permission) {
    return this.permissions.includes(permission);
  }

  // Export tool call data
  toJSON() {
    return {
      id: this.id,
      command: this.command,
      type: this.type,
      status: this.status,
      result: this.result,
      error: this.error,
      executionTime: this.executionTime,
      timestamp: this.timestamp,
      metadata: this.metadata,
      permissions: this.permissions
    };
  }

  // Create from JSON data
  static fromJSON(data) {
    return new ToolCall(data);
  }

  // Validate tool call data
  static validate(data) {
    const errors = [];
    
    if (!data.command) {
      errors.push('Command is required');
    }
    
    if (!['shell', 'api', 'file'].includes(data.type)) {
      errors.push('Invalid tool call type');
    }
    
    if (!['pending', 'executing', 'completed', 'failed'].includes(data.status)) {
      errors.push('Invalid tool call status');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Create a new tool call instance
  static create(data) {
    return new ToolCall({
      ...data,
      timestamp: new Date()
    });
  }
}

module.exports = ToolCall; 