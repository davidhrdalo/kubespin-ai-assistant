import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecentAIConversationsWidget = () => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, you would fetch recent conversations
    // For now, we'll use mock data
    const mockConversations = [
      {
        id: '1',
        title: 'React Component Help',
        lastMessage: 'How do I create a reusable button component?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        messageCount: 5
      },
      {
        id: '2',
        title: 'Plugin Installation',
        lastMessage: 'I need help installing a new plugin',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        messageCount: 3
      },
      {
        id: '3',
        title: 'Code Review',
        lastMessage: 'Can you review this JavaScript function?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        messageCount: 8
      }
    ];

    setTimeout(() => {
      setConversations(mockConversations);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const openChat = (conversationId) => {
    window.location.href = `/plugin/ai-assistant/chat?conversation=${conversationId}`;
  };

  if (isLoading) {
    return (
      <div className="ai-widget">
        <div className="ai-widget-header">
          <h3 className="ai-widget-title">Recent AI Conversations</h3>
        </div>
        <div className="ai-loading">
          <div className="ai-spinner"></div>
          <span>Loading conversations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-widget">
      <div className="ai-widget-header">
        <h3 className="ai-widget-title">Recent AI Conversations</h3>
        <button
          onClick={() => window.location.href = '/plugin/ai-assistant/chat'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            color: '#3b82f6',
            fontWeight: '500'
          }}
        >
          View All
        </button>
      </div>

      <div className="ai-widget-content">
        {conversations.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            No recent conversations
          </p>
        ) : (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => openChat(conversation.id)}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  marginBottom: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.backgroundColor = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <strong style={{ fontSize: '0.875rem' }}>{conversation.title}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    {formatTimeAgo(conversation.timestamp)}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>
                  {conversation.lastMessage}
                </p>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {conversation.messageCount} messages
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentAIConversationsWidget; 