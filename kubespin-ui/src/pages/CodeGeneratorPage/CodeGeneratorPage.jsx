import React, { useState } from 'react';
import axios from 'axios';

const CodeGeneratorPage = () => {
  const [requirements, setRequirements] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [framework, setFramework] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationHistory, setGenerationHistory] = useState([]);

  const languages = [
    'javascript', 'typescript', 'python', 'java', 'c#', 'php', 'go', 'rust',
    'swift', 'kotlin', 'scala', 'ruby', 'dart', 'c++', 'c'
  ];

  const frameworks = {
    javascript: ['react', 'vue', 'angular', 'node', 'express', 'next', 'nuxt'],
    typescript: ['react', 'vue', 'angular', 'node', 'express', 'next', 'nuxt'],
    python: ['django', 'flask', 'fastapi', 'tornado', 'pyramid'],
    java: ['spring', 'quarkus', 'micronaut', 'play'],
    'c#': ['.net', 'asp.net', 'blazor', 'xamarin'],
    php: ['laravel', 'symfony', 'codeigniter', 'slim'],
    go: ['gin', 'echo', 'fiber', 'chi'],
    rust: ['actix', 'rocket', 'warp', 'axum']
  };

  const generateCode = async () => {
    if (!requirements.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const response = await axios.post('/api/code/generate', {
        requirements,
        language,
        framework
      });

      const generatedItem = {
        id: Date.now(),
        requirements,
        language,
        framework,
        code: response.data.code,
        timestamp: new Date()
      };

      setGeneratedCode(response.data.code);
      setGenerationHistory(prev => [generatedItem, ...prev.slice(0, 9)]); // Keep last 10
    } catch (error) {
      console.error('Error generating code:', error);
      setGeneratedCode('Error generating code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log('Code copied to clipboard');
    });
  };

  const downloadCode = (code, language) => {
    const extension = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      'c#': 'cs',
      php: 'php',
      go: 'go',
      rust: 'rs',
      swift: 'swift',
      kotlin: 'kt',
      scala: 'scala',
      ruby: 'rb',
      dart: 'dart',
      'c++': 'cpp',
      c: 'c'
    }[language] || 'txt';

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearForm = () => {
    setRequirements('');
    setLanguage('javascript');
    setFramework('');
    setGeneratedCode('');
  };

  return (
    <div className="ai-container">
      <div className="ai-header">
        <h1>Code Generator</h1>
        <p>Generate code snippets and components using AI</p>
      </div>

      <div className="ai-card">
        <h2>Code Requirements</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Requirements:
          </label>
          <textarea
            className="ai-textarea"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Describe what code you want to generate... (e.g., 'Create a React component for a user profile card with avatar, name, and bio')"
            rows={4}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Programming Language:
            </label>
            <select
              className="ai-input"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Framework (Optional):
            </label>
            <select
              className="ai-input"
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
            >
              <option value="">No framework</option>
              {frameworks[language]?.map(fw => (
                <option key={fw} value={fw}>
                  {fw.charAt(0).toUpperCase() + fw.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            className="ai-button"
            onClick={generateCode}
            disabled={!requirements.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="ai-spinner" style={{ display: 'inline-block', marginRight: '0.5rem' }}></div>
                Generating...
              </>
            ) : (
              'Generate Code'
            )}
          </button>
          <button
            className="ai-button secondary"
            onClick={clearForm}
            disabled={isGenerating}
          >
            Clear
          </button>
        </div>
      </div>

      {generatedCode && (
        <div className="ai-card">
          <h2>Generated Code</h2>
          <div className="ai-code-editor">
            <pre>{generatedCode}</pre>
          </div>
          <div className="ai-code-actions">
            <button
              className="ai-button"
              onClick={() => copyToClipboard(generatedCode)}
            >
              Copy to Clipboard
            </button>
            <button
              className="ai-button secondary"
              onClick={() => downloadCode(generatedCode, language)}
            >
              Download File
            </button>
          </div>
        </div>
      )}

      {generationHistory.length > 0 && (
        <div className="ai-card">
          <h2>Recent Generations</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {generationHistory.map((item) => (
              <div
                key={item.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  cursor: 'pointer'
                }}
                onClick={() => setGeneratedCode(item.code)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong>{item.language}</strong>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {item.timestamp.toLocaleString()}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                  {item.requirements.substring(0, 100)}...
                </p>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {item.framework && `Framework: ${item.framework}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeGeneratorPage; 