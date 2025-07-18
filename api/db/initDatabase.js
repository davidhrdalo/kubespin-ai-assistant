const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const config = require('../config');

const DB_PATH = config.DB_PATH;
const INIT_SQL_PATH = path.join(__dirname, '../../database/init.sql');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
function initDatabase() {
  try {
    const db = new Database(DB_PATH);
    
    // Read and execute initialization SQL
    const initSQL = fs.readFileSync(INIT_SQL_PATH, 'utf8');
    
    // Split SQL into individual statements and execute
    const statements = initSQL.split(';').filter(stmt => stmt.trim());
    
    statements.forEach(statement => {
      if (statement.trim()) {
        db.exec(statement);
      }
    });
    
    console.log('Database initialized successfully');
    db.close();
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Export for use in main application
module.exports = { initDatabase, DB_PATH };

// Run initialization if this script is executed directly
if (require.main === module) {
  try {
    initDatabase();
    console.log('Database setup complete');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
} 