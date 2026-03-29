const express = require("express");
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware'); // ✅ FIX
const Project = require('../models/Project');

router.get('/supervisor', authMiddleware.verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({
      supervisorId: req.user.userId
    });

    res.json(projects);

  } catch (err) {
    res.status(500).json({ message: 'Error fetching supervisor projects' });
  }
});

module.exports = router;