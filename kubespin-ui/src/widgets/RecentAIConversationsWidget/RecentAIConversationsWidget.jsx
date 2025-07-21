import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './RecentAIConversationsWidget.module.css';

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
      <div className={styles.aiWidget}>
        <div className={styles.aiWidgetHeader}>
          <h3 className={styles.aiWidgetTitle}>Recent AI Conversations</h3>
        </div>
        <div className={styles.aiLoading}>
          <div className={styles.aiSpinner}></div>
          <span>Loading conversations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.aiWidget}>
      <div className={styles.aiWidgetHeader}>
        <h3 className={styles.aiWidgetTitle}>Recent AI Conversations</h3>
        <button
          onClick={() => window.location.href = '/plugin/ai-assistant/chat'}
          className={styles.aiViewAllButton}
        >
          View All
        </button>
      </div>

      <div className={styles.aiWidgetContent}>
        {conversations.length === 0 ? (
          <p className={styles.aiEmptyState}>
            No recent conversations
          </p>
        ) : (
          <div className={styles.aiConversationsList}>
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => openChat(conversation.id)}
                className={styles.aiConversationItem}
              >
                <div className={styles.aiConversationHeader}>
                  <strong className={styles.aiConversationTitle}>{conversation.title}</strong>
                  <span className={styles.aiConversationTime}>
                    {formatTimeAgo(conversation.timestamp)}
                  </span>
                </div>
                <p className={styles.aiConversationMessage}>
                  {conversation.lastMessage}
                </p>
                <div className={styles.aiConversationMeta}>
                  <span className={styles.aiMessageCount}>
                    {conversation.messageCount} messages
                  </span>
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