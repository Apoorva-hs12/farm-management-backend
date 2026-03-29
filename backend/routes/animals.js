const express = require('express');
const Animal = require('../models/Animal');

const router = express.Router();

// Get all animals for user
router.get('/', async (req, res) => {
  try {
    const animals = await Animal.find({ user_id: req.user.id, active: true });
    
    // Transform _id to id for frontend compatibility
    const formattedAnimals = animals.map(a => ({
      ...a._doc,
      id: a._id
    }));
    
    res.json(formattedAnimals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new animal
router.post('/', async (req, res) => {
  try {
    const { type, name, tag, breed, dob, dop, weight } = req.body;

    const newAnimal = new Animal({
      user_id: req.user.id,
      type,
      name,
      tag,
      breed,
      dob,
      dop,
      weight
    });

    await newAnimal.save();

    res.status(201).json({ id: newAnimal._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
