const { v4: uuidv4 } = require('uuid');

class Settings {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.openai = data.openai || {
      apiKey: '',
      model: 'gpt-4',
      maxTokens: 4096,
      temperature: 0.7
    };
    this.assistant = data.assistant || {
      name: 'Kubespin AI Assistant',
      description: 'AI-powered assistant for development tasks',
      version: '1.0.0'
    };
    this.features = data.features || {
      codeGeneration: true,
      pluginManagement: true,
      toolExecution: true,
      chatHistory: true
    };
    this.preferences = data.preferences || {
      language: 'en',
      theme: 'dark',
      notifications: true
    };
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Update OpenAI settings
  updateOpenAI(openaiSettings) {
    this.openai = { ...this.openai, ...openaiSettings };
    this.updatedAt = new Date();
    return this;
  }

  // Update assistant settings
  updateAssistant(assistantSettings) {
    this.assistant = { ...this.assistant, ...assistantSettings };
    this.updatedAt = new Date();
    return this;
  }

  // Update feature flags
  updateFeatures(featureSettings) {
    this.features = { ...this.features, ...featureSettings };
    this.updatedAt = new Date();
    return this;
  }

  // Update user preferences
  updatePreferences(preferenceSettings) {
    this.preferences = { ...this.preferences, ...preferenceSettings };
    this.updatedAt = new Date();
    return this;
  }

  // Get OpenAI API key (masked for security)
  getOpenAIKey() {
    return this.openai.apiKey ? '***' : '';
  }

  // Set OpenAI API key
  setOpenAIKey(apiKey) {
    this.openai.apiKey = apiKey;
    this.updatedAt = new Date();
    return this;
  }

  // Check if OpenAI is configured
  isOpenAIConfigured() {
    return !!this.openai.apiKey;
  }

  // Get settings for display (without sensitive data)
  getDisplaySettings() {
    return {
      id: this.id,
      openai: {
        model: this.openai.model,
        maxTokens: this.openai.maxTokens,
        temperature: this.openai.temperature,
        apiKey: this.getOpenAIKey()
      },
      assistant: this.assistant,
      features: this.features,
      preferences: this.preferences,
      updatedAt: this.updatedAt
    };
  }

  // Export settings (without sensitive data)
  toJSON() {
    return {
      id: this.id,
      openai: {
        model: this.openai.model,
        maxTokens: this.openai.maxTokens,
        temperature: this.openai.temperature,
        apiKey: this.getOpenAIKey()
      },
      assistant: this.assistant,
      features: this.features,
      preferences: this.preferences,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Export full settings (including sensitive data)
  toFullJSON() {
    return {
      id: this.id,
      openai: this.openai,
      assistant: this.assistant,
      features: this.features,
      preferences: this.preferences,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Create from JSON data
  static fromJSON(data) {
    return new Settings(data);
  }

  // Validate settings data
  static validate(data) {
    const errors = [];
    
    if (!data.openai) {
      errors.push('OpenAI settings are required');
    }
    
    if (!data.assistant) {
      errors.push('Assistant settings are required');
    }
    
    if (!data.features) {
      errors.push('Feature settings are required');
    }
    
    if (!data.preferences) {
      errors.push('Preference settings are required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Create default settings
  static createDefault() {
    return new Settings({
      openai: {
        apiKey: '',
        model: 'gpt-4',
        maxTokens: 4096,
        temperature: 0.7
      },
      assistant: {
        name: 'Kubespin AI Assistant',
        description: 'AI-powered assistant for development tasks',
        version: '1.0.0'
      },
      features: {
        codeGeneration: true,
        pluginManagement: true,
        toolExecution: true,
        chatHistory: true
      },
      preferences: {
        language: 'en',
        theme: 'dark',
        notifications: true
      }
    });
  }
}

module.exports = Settings; 