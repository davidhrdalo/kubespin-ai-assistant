const { v4: uuidv4 } = require('uuid');

class Conversation {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.messages = data.messages || [];
    this.context = data.context || {};
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.metadata = data.metadata || {};
  }

  // Add a message to the conversation
  addMessage(role, content, metadata = {}) {
    const message = {
      id: uuidv4(),
      role, // 'user' or 'assistant'
      content,
      timestamp: new Date(),
      metadata
    };
    
    this.messages.push(message);
    this.updatedAt = new Date();
    return message;
  }

  // Get the last N messages
  getLastMessages(count = 10) {
    return this.messages.slice(-count);
  }

  // Get conversation summary
  getSummary() {
    return {
      id: this.id,
      messageCount: this.messages.length,
      lastMessage: this.messages[this.messages.length - 1],
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Clear conversation
  clear() {
    this.messages = [];
    this.updatedAt = new Date();
  }

  // Export conversation data
  toJSON() {
    return {
      id: this.id,
      messages: this.messages,
      context: this.context,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      metadata: this.metadata
    };
  }

  // Create from JSON data
  static fromJSON(data) {
    return new Conversation(data);
  }

  // Validate conversation data
  static validate(data) {
    const errors = [];
    
    if (!data.id) {
      errors.push('Conversation ID is required');
    }
    
    if (!Array.isArray(data.messages)) {
      errors.push('Messages must be an array');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = Conversation; 