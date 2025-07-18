-- AI Assistant Database Initialization SQL
-- This file creates the SQLite database schema with all necessary tables and indexes

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create installed_plugins table
CREATE TABLE IF NOT EXISTS installed_plugins (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT,
    status TEXT NOT NULL,
    version TEXT,
    installed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create tool_calls table
CREATE TABLE IF NOT EXISTS tool_calls (
    id TEXT PRIMARY KEY,
    command TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    result TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_plugins_status ON installed_plugins(status);
CREATE INDEX IF NOT EXISTS idx_tool_calls_timestamp ON tool_calls(timestamp);

-- Verify tables were created
.tables
.schema conversations
.schema installed_plugins
.schema tool_calls 