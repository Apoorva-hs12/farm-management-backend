const express = require('express');
const Animal = require('../models/Animal');
const MilkEntry = require('../models/MilkEntry');

const router = express.Router();

// Get entries for specific date
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const animals = await Animal.find({ user_id: req.user.id, active: true });
    
    const entries = await MilkEntry.find({
      user_id: req.user.id,
      date: date
    });

    const results = animals.map(animal => {
      const entry = entries.find(e => e.animal_id.toString() === animal._id.toString());
      return {
        animal_id: animal._id,
        name: animal.name,
        tag: animal.tag,
        morning: entry ? entry.morning : 0,
        evening: entry ? entry.evening : 0
      };
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save/Update entry
router.post('/', async (req, res) => {
  try {
    const { animal_id, date, morning, evening } = req.body;

    await MilkEntry.findOneAndUpdate(
      { user_id: req.user.id, animal_id, date },
      { morning, evening },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Weekly summary
router.get('/weekly', async (req, res) => {
  try {
    // Aggregation for weekly totals
    const history = await MilkEntry.aggregate([
      { $match: { user_id: req.user.id } },
      { 
        $group: { 
          _id: "$date", 
          total_liters: { $sum: { $add: ["$morning", "$evening"] } } 
        } 
      },
      { $sort: { _id: -1 } },
      { $limit: 7 }
    ]);

    const formattedHistory = history.map(item => ({
      date: item._id,
      total_liters: item.total_liters
    })).reverse();

    res.json(formattedHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
