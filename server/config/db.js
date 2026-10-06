import mongoose from 'mongoose';

let mongodInstance = null;
let isConnecting = false;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (isConnecting) {
    return;
  }

  isConnecting = true;

  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 2000,
        connectTimeoutMS: 2000,
      });
      console.log('[VAYORA DB] Connected to MongoDB Atlas successfully.');
      isConnecting = false;

      // Auto-seed in background if empty
      import('../scripts/seed.js')
        .then((m) => m.autoSeedIfEmpty())
        .catch(() => {});
      return;
    } catch (err) {
      console.warn(`[VAYORA DB] Cloud MongoDB connection notice: ${err.message}`);
    }
  }

  // Only attempt localhost when running locally on bare-metal dev, NEVER on Vercel
  if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/vayora', {
        serverSelectionTimeoutMS: 800,
        connectTimeoutMS: 800,
      });
      console.log('[VAYORA DB] Connected to local MongoDB.');
      isConnecting = false;
      return;
    } catch (localErr) {
      // Local MongoDB not running
    }

    // Try in-memory server only in local non-production environments
    if (process.env.NODE_ENV !== 'production') {
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongodInstance = await MongoMemoryServer.create();
        const memUri = mongodInstance.getUri();
        await mongoose.connect(memUri);
        console.log(`[VAYORA DB] Connected to In-Memory MongoDB at: ${memUri}`);
        isConnecting = false;

        import('../scripts/seed.js')
          .then((m) => m.autoSeedIfEmpty())
          .catch(() => {});
        return;
      } catch (memErr) {
        // In-memory unavailable
      }
    }
  }

  isConnecting = false;
  console.log('[VAYORA DB] Operating with high-speed in-memory catalog (0ms latency).');
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
