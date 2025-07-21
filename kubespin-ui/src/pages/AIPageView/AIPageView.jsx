// ai-assistant/ui/src/AIPageView.jsx
import React, { useState, useEffect } from "react";
import styles from "./AIPageView.module.css";

import { getAIPageViewSidebarConfig } from "./AIPageView.sidebar.js";



// Set up the sidebar configuration when this page loads
useEffect(() => {
  if (setSidebarConfig) {
    const sidebarConfig = getAIPageViewSidebarConfig({
      addLog: (message) => console.log(`[AIPageView] ${message}`),
      handleRefreshPlugins: () => {
        fetchPlugins();
        fetchInstalledPlugins();
      },
    });
    setSidebarConfig(sidebarConfig);
  }
}, [setSidebarConfig]);

const AIPageView = ({
  session,
  // callProxyApi, // Not used in this minimal test
  // addLogToMainUi, // Not used in this minimal test
}) => {
  const [testCounter, setTestCounter] = useState(0); // This was line 11 approx.

  useEffect(() => {
    console.log(
      `[AIPageView-Minimal] useEffect running. Session ID: ${session?.id?.substring(0,8)}. Counter: ${testCounter}`
    );
    const timerId = setInterval(() => {
      // console.log('[AIPageView-Minimal] Timer tick');
    }, 5000);
    return () => {
      console.log(
        `[AIPageView-Minimal] useEffect cleanup. Session ID: ${session?.id?.substring(0,8)}`
      );
      clearInterval(timerId);
    };
  }, [session?.id, testCounter]);

  if (!session || !session.id) {
    return (
      <div className={styles.aiPage}>
        <p className={styles.loadingMessage}>
          [Minimal] Waiting for AI Assistant session data...
        </p>
      </div>
    );
  }

  return (
    <div className={styles.aiPage}>
      <h3>
        [Minimal] AI Assistant View (ID: {session.id.substring(0, 8)})
      </h3>
      <p>Status: {session.status}</p>
      <p>Test Counter: {testCounter}</p>
      <button onClick={() => setTestCounter((c) => c + 1)}>
        Increment Counter
      </button>
      <p>
        <em>
          This is a minimal version for debugging React hook errors.
        </em>
      </p>
    </div>
  );
};

export default AIPageView; 