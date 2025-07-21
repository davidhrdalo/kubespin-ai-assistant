const Database = require('better-sqlite3');
const config = require('../config');
const { initDatabase } = require('./initDatabase');

class DatabaseService {
  constructor() {
    // Use config for database path
    const dbPath = config.DB_PATH;
    
    // Ensure the directory exists
    const dbDir = require('path').dirname(dbPath);
    const fs = require('fs');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    // Initialize database if it doesn't exist
    if (!fs.existsSync(dbPath)) {
      console.log('[Database] Initializing new database...');
      initDatabase();
    }
    
    this.db = new Database(dbPath);
    console.log(`[Database] Connected to: ${dbPath}`);
  }

  // Conversation methods
  saveConversation(id, conversation) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO conversations (id, data, updated_at) 
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `);
    return stmt.run(id, JSON.stringify(conversation));
  }

  getConversation(id) {
    const stmt = this.db.prepare('SELECT data FROM conversations WHERE id = ?');
    const result = stmt.get(id);
    return result ? JSON.parse(result.data) : null;
  }

  getAllConversations() {
    const stmt = this.db.prepare('SELECT id, data, created_at, updated_at FROM conversations ORDER BY updated_at DESC');
    return stmt.all().map(row => ({
      id: row.id,
      conversation: JSON.parse(row.data),
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  }

  deleteConversation(id) {
    const stmt = this.db.prepare('DELETE FROM conversations WHERE id = ?');
    return stmt.run(id);
  }

  // Plugin methods
  savePlugin(plugin) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO installed_plugins (id, name, url, status, version, updated_at) 
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    return stmt.run(plugin.id, plugin.name, plugin.url, plugin.status, plugin.version);
  }

  getPlugin(id) {
    const stmt = this.db.prepare('SELECT * FROM installed_plugins WHERE id = ?');
    return stmt.get(id);
  }

  getAllPlugins() {
    const stmt = this.db.prepare('SELECT * FROM installed_plugins ORDER BY installed_at DESC');
    return stmt.all();
  }

  updatePluginStatus(id, status) {
    const stmt = this.db.prepare(`
      UPDATE installed_plugins SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);
    return stmt.run(status, id);
  }

  deletePlugin(id) {
    const stmt = this.db.prepare('DELETE FROM installed_plugins WHERE id = ?');
    return stmt.run(id);
  }

  // Tool call methods
  saveToolCall(toolCall) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO tool_calls (id, command, type, status, result, timestamp) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      toolCall.id, 
      toolCall.command, 
      toolCall.type, 
      toolCall.status, 
      toolCall.result, 
      toolCall.timestamp
    );
  }

  getToolCall(id) {
    const stmt = this.db.prepare('SELECT * FROM tool_calls WHERE id = ?');
    return stmt.get(id);
  }

  getAllToolCalls() {
    const stmt = this.db.prepare('SELECT * FROM tool_calls ORDER BY timestamp DESC');
    return stmt.all();
  }

  updateToolCallResult(id, result, status = 'completed') {
    const stmt = this.db.prepare(`
      UPDATE tool_calls SET result = ?, status = ? WHERE id = ?
    `);
    return stmt.run(result, status, id);
  }

  // Utility methods
  close() {
    this.db.close();
    console.log('[Database] Connection closed');
  }

  // Get database statistics
  getStats() {
    const conversationsCount = this.db.prepare('SELECT COUNT(*) as count FROM conversations').get().count;
    const pluginsCount = this.db.prepare('SELECT COUNT(*) as count FROM installed_plugins').get().count;
    const toolCallsCount = this.db.prepare('SELECT COUNT(*) as count FROM tool_calls').get().count;
    
    return {
      conversations: conversationsCount,
      plugins: pluginsCount,
      toolCalls: toolCallsCount
    };
  }

  // Test database connection and schema
  testConnection() {
    try {
      // Test if tables exist by querying them
      this.db.prepare('SELECT name FROM sqlite_master WHERE type="table"').all();
      return true;
    } catch (error) {
      console.error('[Database] Schema test failed:', error.message);
      return false;
    }
  }
}

module.exports = DatabaseService; 