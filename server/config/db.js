import mongoose from 'mongoose';

let mongodInstance = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[VAYORA DB] Connected to MongoDB at: ${uri}`);
      
      // Auto-seed if database is empty
      try {
        const { autoSeedIfEmpty } = await import('../scripts/seed.js');
        await autoSeedIfEmpty();
      } catch (seedErr) {
        console.warn('[VAYORA DB] Auto-seed check warning:', seedErr.message);
      }
      return;
    } catch (err) {
      console.warn(`[VAYORA DB] Could not connect to configured MONGODB_URI (${err.message}).`);
    }
  }

  // Fallback: Try local MongoDB (e.g. localhost)
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/vayora', {
      serverSelectionTimeoutMS: 2000,
    });
    console.log('[VAYORA DB] Connected to local MongoDB at: mongodb://127.0.0.1:27017/vayora');
    
    try {
      const { autoSeedIfEmpty } = await import('../scripts/seed.js');
      await autoSeedIfEmpty();
    } catch (seedErr) {
      console.warn('[VAYORA DB] Auto-seed check warning:', seedErr.message);
    }
    return;
  } catch (localErr) {
    // Local MongoDB not available
  }

  // Fallback: In development only, try mongodb-memory-server
  if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memUri = mongodInstance.getUri();
      await mongoose.connect(memUri);
      console.log(`[VAYORA DB] Connected to In-Memory MongoDB successfully at: ${memUri}`);

      try {
        const { autoSeedIfEmpty } = await import('../scripts/seed.js');
        await autoSeedIfEmpty();
      } catch (seedErr) {
        console.warn('[VAYORA DB] Auto-seed check warning:', seedErr.message);
      }
      return;
    } catch (memErr) {
      console.warn('[VAYORA DB] In-memory MongoDB failed:', memErr.message);
    }
  }

  console.warn(
    '[VAYORA DB] Notice: No persistent MongoDB connection established. Controllers will serve the rich built-in seed catalog. Set MONGODB_URI in Vercel to enable live database persistence.'
  );
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
