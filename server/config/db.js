const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dns = require('dns');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { generateDemoAccounts } = require('./seedData');

// Resolve cloud MongoDB Atlas SRV records on Windows networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Fallback to default system DNS
}

let isInMemory = false;

const dataDir = path.join(__dirname, '..', 'data');
const dbFilePath = path.join(dataDir, 'db.json');

// Ensure data folder exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load data from disk on startup
const loadPersistentData = () => {
  try {
    if (fs.existsSync(dbFilePath)) {
      const raw = fs.readFileSync(dbFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.users && parsed.users.length > 0) {
        return {
          users: parsed.users || [],
          transactions: parsed.transactions || [],
          assets: parsed.assets || [],
        };
      }
    }
  } catch (err) {
    console.error('Error reading persistent db.json:', err.message);
  }
  return null;
};

// Save data to disk
const savePersistentData = (store) => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing persistent db.json:', err.message);
  }
};

let inMemoryStore = { users: [], transactions: [], assets: [] };

const initializeStore = async () => {
  const loaded = loadPersistentData();
  if (loaded && loaded.users.length > 0) {
    inMemoryStore = loaded;
  } else {
    // Populate rich pre-seeded accounts with 1 year transaction history and 3-year stock portfolio
    const demoData = await generateDemoAccounts();
    inMemoryStore = demoData;
    savePersistentData(inMemoryStore);
  }
};

// Immediately initialize
initializeStore();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense_tracker',
      {
        serverSelectionTimeoutMS: 10000,
      }
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    isInMemory = false;
  } catch (error) {
    console.log(`⚠️ Connection Info: ${error.message}`);
    console.log(`💾 Using Persistent File Database (server/data/db.json) with 1-Year History & 3-Year Stock Portfolio!`);
    isInMemory = true;
  }
};

const getDbMode = () => ({
  isInMemory,
  inMemoryStore,
  saveData: () => savePersistentData(inMemoryStore),
});

module.exports = { connectDB, getDbMode };
