const express = require('express');
const Expense = require('../models/Expense');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { month } = req.query; // YYYY-MM
    
    const result = await Expense.find({
      user_id: req.user.id,
      date: { $regex: new RegExp(`^${month}`) }
    }).sort({ date: -1 });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { category, amount, date, notes, status } = req.body;

    const newExpense = new Expense({
      user_id: req.user.id,
      category,
      amount,
      date,
      notes,
      status: status || 'paid'
    });

    await newExpense.save();
    
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
