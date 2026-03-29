const mongoose = require('mongoose');

// ✅ MongoDB URI (Priority: ENV > Hardcoded)
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://farm_12:farm%40123@intdes.mxet1n1.mongodb.net/gokulam?retryWrites=true&w=majority&appName=IntDes';

async function initDB() {
  console.log('⏳ Connecting to MongoDB...');
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // ✅ Crash or fail in 5s if Atlas is blocking (Crucial for Railway/Render)
    });
    console.log('✅ Connected to MongoDB ATLAS (Cloud)!');
  } catch (err) {
    console.error('❌ Cloud Connection Error:', err.message);
    if (err.message.includes('bad auth')) {
      console.error('👉 Tip: Check your MONGO_URI password or special characters.');
    } else if (err.message.includes('queryTxt ETIMEOUT')) {
      console.error('👉 Tip: Check your network/firewall settings (whitelist 0.0.0.0/0 on Atlas).');
    }
    // Note: We don't throw error here so server can still start and report health if required.
  }
}

module.exports = {
  initDB,
  getDB: () => mongoose.connection
};
