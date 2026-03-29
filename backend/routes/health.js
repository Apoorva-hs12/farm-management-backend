const express = require('express');
const HealthRecord = require('../models/HealthRecord');
const Animal = require('../models/Animal'); // Ensure Animal model is registered

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const results = await HealthRecord.find({ user_id: req.user.id })
      .populate('animal_id')
      .sort({ date: -1 });

    const formattedResults = results.map(h => ({
      ...h._doc,
      id: h._id,
      animal_name: h.animal_id ? h.animal_id.name : null,
      animal_tag: h.animal_id ? h.animal_id.tag : null
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { animal_id, type, description, date, vet_name } = req.body;
    
    const newRecord = new HealthRecord({
      user_id: req.user.id,
      animal_id: animal_id || null, // Handle records not tied to a specific animal
      type,
      description,
      date,
      vet_name
    });

    await newRecord.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
