import mongoose from 'mongoose';

let isDbConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_interview_prep';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000, // Quick 4-second timeout to avoid long hangs if offline
    });

    isDbConnected = true;
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isDbConnected = false;
    console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`);
    console.warn(`💡 Tip: If you haven't set up local MongoDB or MongoDB Atlas yet, the backend will run in resilient fallback mode.`);
    console.warn(`   To connect MongoDB Atlas, paste your cloud connection string into server/.env (MONGO_URI).`);
    return null;
  }
};

export const getDbStatus = () => ({
  connected: isDbConnected,
  readyState: mongoose.connection.readyState, // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
});
