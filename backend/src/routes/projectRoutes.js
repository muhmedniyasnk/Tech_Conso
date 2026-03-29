const express = require("express");
const router = express.Router();
const Project = require('../models/Project');

const projectController = require("../controllers/projectController");
const authMiddleware = require('../middleware/authMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

// Create Project
router.post("/create", projectController.createProject);

// ✅ GET ALL PENDING PROJECTS
router.get('/pending', async (req, res) => {
  try {
    const projects = await Project.find({ status: 'pending' });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// ✅ APPROVE PROJECT
router.put('/approve/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: 'active' },
      { new: true }
    );
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error approving project' });
  }
});

// ✅ REJECT PROJECT
router.put('/reject/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting project' });
  }
});

router.put('/assign-manager/:id', async (req, res) => {
  try {
    const { managerId } = req.body;

    if (!managerId) {
      return res.status(400).json({ message: "Manager required" });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { managerId: managerId,status: "active" },
      { new: true }
    );

    res.json(project);

  } catch (err) {
    console.log("ASSIGN MANAGER ERROR:", err);
    res.status(500).json({ message: 'Error assigning manager' });
  }
});

router.get('/manager', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userid; // from token

    const projects = await Project.find({ managerId: userId });

    res.json(projects);

  } catch (err) {
    console.log("MANAGER PROJECT ERROR:", err);
    res.status(500).json({ message: 'Error fetching manager projects' });
  }
});
module.exports = router;