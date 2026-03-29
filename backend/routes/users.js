const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Get profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({
      id: user._id,
      name: user.name,
      farm_name: user.farm_name,
      village: user.village,
      phone: user.phone,
      language: user.language,
      dark_mode: user.dark_mode,
      profile_pic: user.profile_pic
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update profile/settings
router.put('/settings', async (req, res) => {
  try {
    const { name, farm_name, village, language, dark_mode, profile_pic } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name;
    if (farm_name) user.farm_name = farm_name;
    if (village) user.village = village;
    if (language) user.language = language;
    if (dark_mode !== undefined) user.dark_mode = dark_mode;
    if (profile_pic) user.profile_pic = profile_pic;

    await user.save();

    res.json({ 
      message: 'Settings updated', 
      user: {
        id: user._id,
        name: user.name,
        farm_name: user.farm_name,
        village: user.village,
        phone: user.phone,
        language: user.language,
        dark_mode: user.dark_mode,
        profile_pic: user.profile_pic
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
