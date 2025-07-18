import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        message: inputMessage,
        conversationId,
        context: {
          currentPage: 'chat',
          timestamp: new Date().toISOString()
        }
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setConversationId(response.data.conversationId);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  return (
    <div className="ai-container">
      <div className="ai-header">
        <h1>AI Assistant Chat</h1>
        <p>Ask me anything about development, plugins, or get help with your projects</p>
      </div>

      <div className="ai-chat-container">
        <div className="ai-chat-messages">
          {messages.length === 0 && (
            <div className="ai-loading">
              <p>Start a conversation with the AI assistant...</p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div key={index} className={`ai-message ${message.role}`}>
              <div className="ai-message-header">
                {message.role === 'user' ? 'You' : 'AI Assistant'}
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="ai-message-content">
                {message.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="ai-message assistant">
              <div className="ai-message-header">AI Assistant</div>
              <div className="ai-loading">
                <div className="ai-spinner"></div>
                <span>Thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-chat-input">
          <textarea
            className="ai-textarea"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
            disabled={isLoading}
          />
          <button
            className="ai-button"
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
          >
            Send
          </button>
        </div>

        {messages.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              className="ai-button secondary"
              onClick={clearChat}
              style={{ fontSize: '0.875rem' }}
            >
              Clear Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage; 