const mongoose = require('mongoose');

const milkEntrySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  animal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
  date: { type: String, required: true },
  morning: { type: Number, default: 0 },
  evening: { type: Number, default: 0 },
  rate: { type: Number, default: 42.50 },
  created_at: { type: Date, default: Date.now }
});

// Compound unique index for user, animal and date
milkEntrySchema.index({ user_id: 1, animal_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MilkEntry', milkEntrySchema);
