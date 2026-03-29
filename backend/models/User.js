const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  farm_name: String,
  village: String,
  phone: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  language: { type: String, default: 'en' },
  dark_mode: { type: Boolean, default: false },
  profile_pic: { type: String, default: '👨‍🌾' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
