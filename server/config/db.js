import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodInstance = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vayora';
  
  try {
    // Attempt local or provided MongoDB URI with 4-second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[VAYORA DB] Connected to MongoDB at: ${uri}`);
  } catch (err) {
    console.warn(`[VAYORA DB] Could not connect to external MongoDB (${err.message}). Starting in-memory MongoDB fallback...`);
    try {
      mongodInstance = await MongoMemoryServer.create();
      const memUri = mongodInstance.getUri();
      await mongoose.connect(memUri);
      console.log(`[VAYORA DB] Connected to In-Memory MongoDB successfully at: ${memUri}`);
    } catch (memErr) {
      console.error('[VAYORA DB] Fatal: Failed to initialize in-memory database:', memErr.message);
      process.exit(1);
    }
  }

  // Auto-seed if database is freshly started and empty
  try {
    const { autoSeedIfEmpty } = await import('../scripts/seed.js');
    await autoSeedIfEmpty();
  } catch (seedErr) {
    console.warn('[VAYORA DB] Auto-seed check warning:', seedErr.message);
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
