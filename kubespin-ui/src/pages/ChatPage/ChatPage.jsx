import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from './ChatPage.module.css';

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
    <div className={styles.aiContainer}>
      <div className={styles.aiHeader}>
        <h1>AI Assistant Chat</h1>
        <p>Ask me anything about development, plugins, or get help with your projects</p>
      </div>

      <div className={styles.aiChatContainer}>
        <div className={styles.aiChatMessages}>
          {messages.length === 0 && (
            <div className={styles.aiLoading}>
              <p>Start a conversation with the AI assistant...</p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div key={index} className={`${styles.aiMessage} ${styles[message.role]}`}>
              <div className={styles.aiMessageHeader}>
                {message.role === 'user' ? 'You' : 'AI Assistant'}
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className={styles.aiMessageContent}>
                {message.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className={`${styles.aiMessage} ${styles.assistant}`}>
              <div className={styles.aiMessageHeader}>AI Assistant</div>
              <div className={styles.aiLoading}>
                <div className={styles.aiSpinner}></div>
                <span>Thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.aiChatInput}>
          <textarea
            className={styles.aiTextarea}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
            disabled={isLoading}
          />
          <button
            className={styles.aiButton}
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
          >
            Send
          </button>
        </div>

        {messages.length > 0 && (
          <div className={styles.aiClearButton}>
            <button
              className={`${styles.aiButton} ${styles.secondary}`}
              onClick={clearChat}
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