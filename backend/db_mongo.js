const mongoose = require('mongoose');

// CLOUD DATABASE CONNECTION (MongoDB Atlas)
// IMPORTANT: Replace <db_password> with your actual database user password!
const MONGO_URI = 'mongodb+srv://farm_12:farm%40123@intdes.mxet1n1.mongodb.net/gokulam?retryWrites=true&w=majority&appName=IntDes';

async function initDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB ATLAS (Cloud)!');
  } catch (err) {
    console.error('❌ Cloud Connection Error:', err.message);
    // If password is not replaced, this will fail.
  }
}

module.exports = {
  initDB,
  getDB: () => mongoose.connection
};
