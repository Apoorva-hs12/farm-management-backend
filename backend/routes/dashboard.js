const express = require('express');
const Animal = require('../models/Animal');
const MilkEntry = require('../models/MilkEntry');
const HealthRecord = require('../models/HealthRecord');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const milkRate = 42.50;

    // Aggregations and counts
    const todayMilkResults = await MilkEntry.aggregate([
      { $match: { user_id: req.user.id, date: today } },
      { $group: { _id: null, total: { $sum: { $add: ["$morning", "$evening"] } } } }
    ]);
    const todayMilkTotal = todayMilkResults[0]?.total || 0;
    const todayEarnings = todayMilkTotal * milkRate;

    const totalAnimalsCount = await Animal.countDocuments({ user_id: req.user.id, active: true });
    const pendingAlertsCount = await HealthRecord.countDocuments({ user_id: req.user.id, date: { $gte: today } });

    const milkTrendResults = await MilkEntry.aggregate([
      { $match: { user_id: req.user.id } },
      { $group: { _id: "$date", total: { $sum: { $add: ["$morning", "$evening"] } } } },
      { $sort: { _id: -1 } },
      { $limit: 7 }
    ]);

    const milkTrend = milkTrendResults.map(item => ({
      date: item._id,
      total: item.total
    })).reverse();

    res.json({
      todayMilk: todayMilkTotal,
      todayEarnings,
      totalAnimals: totalAnimalsCount,
      pendingAlerts: pendingAlertsCount,
      milkTrend
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
