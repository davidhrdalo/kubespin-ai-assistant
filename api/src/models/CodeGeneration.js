const { v4: uuidv4 } = require('uuid');

class CodeGeneration {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.requirements = data.requirements || '';
    this.language = data.language || 'javascript';
    this.framework = data.framework || 'react';
    this.code = data.code || '';
    this.metadata = data.metadata || {
      estimatedLines: 0,
      complexity: 'low',
      dependencies: []
    };
    this.status = data.status || 'pending'; // pending, generating, completed, failed
    this.error = data.error || null;
    this.generationTime = data.generationTime || 0;
    this.timestamp = data.timestamp || new Date();
    this.tags = data.tags || [];
    this.rating = data.rating || null; // User rating 1-5
  }

  // Update generation status
  updateStatus(status, code = null, error = null) {
    this.status = status;
    if (code !== null) this.code = code;
    if (error !== null) this.error = error;
    return this;
  }

  // Set generated code
  setCode(code, generationTime = 0) {
    this.code = code;
    this.generationTime = generationTime;
    this.status = 'completed';
    return this;
  }

  // Set generation error
  setError(error, generationTime = 0) {
    this.error = error;
    this.generationTime = generationTime;
    this.status = 'failed';
    return this;
  }

  // Add tags
  addTags(tags) {
    this.tags = [...new Set([...this.tags, ...tags])];
    return this;
  }

  // Set user rating
  setRating(rating) {
    if (rating >= 1 && rating <= 5) {
      this.rating = rating;
    }
    return this;
  }

  // Get code generation summary
  getSummary() {
    return {
      id: this.id,
      requirements: this.requirements,
      language: this.language,
      framework: this.framework,
      status: this.status,
      generationTime: this.generationTime,
      timestamp: this.timestamp,
      hasError: !!this.error,
      rating: this.rating
    };
  }

  // Check if generation is completed
  isCompleted() {
    return this.status === 'completed';
  }

  // Check if generation failed
  hasFailed() {
    return this.status === 'failed';
  }

  // Check if generation is in progress
  isGenerating() {
    return this.status === 'generating';
  }

  // Get code or error message
  getOutput() {
    if (this.error) {
      return `Error: ${this.error}`;
    }
    return this.code || 'No code generated';
  }

  // Get estimated code metrics
  getMetrics() {
    const lines = this.code ? this.code.split('\n').length : 0;
    const characters = this.code ? this.code.length : 0;
    
    return {
      lines,
      characters,
      ...this.metadata
    };
  }

  // Export code generation data
  toJSON() {
    return {
      id: this.id,
      requirements: this.requirements,
      language: this.language,
      framework: this.framework,
      code: this.code,
      metadata: this.metadata,
      status: this.status,
      error: this.error,
      generationTime: this.generationTime,
      timestamp: this.timestamp,
      tags: this.tags,
      rating: this.rating
    };
  }

  // Create from JSON data
  static fromJSON(data) {
    return new CodeGeneration(data);
  }

  // Validate code generation data
  static validate(data) {
    const errors = [];
    
    if (!data.requirements) {
      errors.push('Requirements are required');
    }
    
    if (!['pending', 'generating', 'completed', 'failed'].includes(data.status)) {
      errors.push('Invalid generation status');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Create a new code generation instance
  static create(data) {
    return new CodeGeneration({
      ...data,
      timestamp: new Date()
    });
  }

  // Get supported languages
  static getSupportedLanguages() {
    return [
      { name: 'javascript', displayName: 'JavaScript', extensions: ['.js', '.jsx'] },
      { name: 'typescript', displayName: 'TypeScript', extensions: ['.ts', '.tsx'] },
      { name: 'python', displayName: 'Python', extensions: ['.py'] },
      { name: 'java', displayName: 'Java', extensions: ['.java'] },
      { name: 'go', displayName: 'Go', extensions: ['.go'] },
      { name: 'rust', displayName: 'Rust', extensions: ['.rs'] },
      { name: 'csharp', displayName: 'C#', extensions: ['.cs'] },
      { name: 'php', displayName: 'PHP', extensions: ['.php'] }
    ];
  }

  // Get supported frameworks
  static getSupportedFrameworks() {
    return [
      { name: 'react', displayName: 'React', language: 'javascript' },
      { name: 'vue', displayName: 'Vue.js', language: 'javascript' },
      { name: 'angular', displayName: 'Angular', language: 'typescript' },
      { name: 'express', displayName: 'Express.js', language: 'javascript' },
      { name: 'fastapi', displayName: 'FastAPI', language: 'python' },
      { name: 'django', displayName: 'Django', language: 'python' },
      { name: 'spring', displayName: 'Spring Boot', language: 'java' },
      { name: 'gin', displayName: 'Gin', language: 'go' }
    ];
  }
}

module.exports = CodeGeneration; 