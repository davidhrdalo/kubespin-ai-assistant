import React, { useState } from 'react';
import axios from 'axios';
import styles from './CodeGeneratorPage.module.css';

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
    <div className={styles.aiContainer}>
      <div className={styles.aiHeader}>
        <h1>Code Generator</h1>
        <p>Generate code snippets and components using AI</p>
      </div>

      <div className={styles.aiCard}>
        <h2>Code Requirements</h2>
        <div className={styles.aiFormGroup}>
          <label className={styles.aiLabel}>
            Requirements:
          </label>
          <textarea
            className={styles.aiTextarea}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Describe what code you want to generate... (e.g., 'Create a React component for a user profile card with avatar, name, and bio')"
            rows={4}
          />
        </div>

        <div className={styles.aiFormGrid}>
          <div className={styles.aiFormGroup}>
            <label className={styles.aiLabel}>
              Programming Language:
            </label>
            <select
              className={styles.aiInput}
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

          <div className={styles.aiFormGroup}>
            <label className={styles.aiLabel}>
              Framework (Optional):
            </label>
            <select
              className={styles.aiInput}
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

        <div className={styles.aiButtonGroup}>
          <button
            className={styles.aiButton}
            onClick={generateCode}
            disabled={!requirements.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <div className={styles.aiSpinner}></div>
                Generating...
              </>
            ) : (
              'Generate Code'
            )}
          </button>
          <button
            className={`${styles.aiButton} ${styles.secondary}`}
            onClick={clearForm}
            disabled={isGenerating}
          >
            Clear
          </button>
        </div>
      </div>

      {generatedCode && (
        <div className={styles.aiCard}>
          <h2>Generated Code</h2>
          <div className={styles.aiCodeEditor}>
            <pre>{generatedCode}</pre>
          </div>
          <div className={styles.aiCodeActions}>
            <button
              className={styles.aiButton}
              onClick={() => copyToClipboard(generatedCode)}
            >
              Copy to Clipboard
            </button>
            <button
              className={`${styles.aiButton} ${styles.secondary}`}
              onClick={() => downloadCode(generatedCode, language)}
            >
              Download File
            </button>
          </div>
        </div>
      )}

      {generationHistory.length > 0 && (
        <div className={styles.aiCard}>
          <h2>Recent Generations</h2>
          <div className={styles.aiHistory}>
            {generationHistory.map((item) => (
              <div
                key={item.id}
                className={styles.aiHistoryItem}
                onClick={() => setGeneratedCode(item.code)}
              >
                <div className={styles.aiHistoryHeader}>
                  <span className={styles.aiHistoryTitle}>{item.language}</span>
                  <span className={styles.aiHistoryMeta}>
                    {item.timestamp.toLocaleString()}
                  </span>
                </div>
                <p className={styles.aiHistoryPreview}>
                  {item.requirements.substring(0, 100)}...
                </p>
                <div className={styles.aiHistoryMeta}>
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