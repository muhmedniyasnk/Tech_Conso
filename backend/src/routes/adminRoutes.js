const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET ADMIN STATS
router.get('/stats', async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const active = await Project.countDocuments({ status: 'active' });
    const completed = await Project.countDocuments({ status: 'completed' });

    res.json({
      projects: totalProjects,
      active,
      completed,
      revenue: 500000 // static for now
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;