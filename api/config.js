// AI Assistant API Configuration
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const config = {
  PORT: process.env.AI_ASSISTANT_PORT || 3002,
  NODE_ENV: process.env.NODE_ENV || "development",
  
  // --- OpenAI Configuration ---
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  AI_MODEL: process.env.AI_MODEL || "gpt-4",
  
  // --- Database Configuration ---
  DB_PATH: process.env.AI_ASSISTANT_DB_PATH || path.join(__dirname, "../data/ai_assistant.db"),
  
  // --- CORS Configuration ---
  ALLOWED_ORIGINS: [
    process.env.ADMIN_UI_ORIGIN || "http://localhost:3000",
    "http://localhost:3000",
    "http://localhost:3001"
  ],
  
  // --- Security ---
  JWT_SECRET: process.env.SECRET_KEY || "ai_assistant_secret_key",
  
  // --- Plugin Configuration ---
  PLUGIN_NAME: "kubespin-ai-assistant",
  PLUGIN_VERSION: "1.0.0"
};

// --- Validation and Logging ---
console.log("[AI Assistant Config] Initializing Configuration...");
console.log(`  Node Env: ${config.NODE_ENV}`);
console.log(`  Port: ${config.PORT}`);
console.log(`  AI Model: ${config.AI_MODEL}`);
console.log(`  Database Path: ${config.DB_PATH}`);
console.log(`  OpenAI API Key: ${config.OPENAI_API_KEY ? "Configured" : "NOT SET!"}`);
console.log(`  Allowed CORS Origins:`, config.ALLOWED_ORIGINS);

// Validate required configuration
if (!config.OPENAI_API_KEY) {
  console.warn("[AI Assistant Config] ⚠️  OPENAI_API_KEY not set. AI features will not work.");
}

module.exports = config; 