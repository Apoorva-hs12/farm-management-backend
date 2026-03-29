const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, default: 'Cow' },
  name: String,
  tag: String,
  breed: String,
  dob: String,
  dop: String,
  weight: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Animal', animalSchema);
