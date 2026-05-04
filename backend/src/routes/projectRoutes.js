const express = require("express");
const router = express.Router();
const Project = require('../models/Project');
const projectController = require("../controllers/projectController");
const { verifyToken } = require('../middleware/authMiddleware');

// Create Project (Client request)
router.post("/create", projectController.createProject);

// GET client's projects
router.get('/client/:clientId', async (req, res) => {
  try {
    const projects = await Project.find({ clientId: req.params.clientId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching client projects' });
  }
});

// GET pending projects (Admin)
router.get('/pending', async (req, res) => {
  try {
    const projects = await Project.find({ status: 'pending' })
      .populate('clientId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// APPROVE
router.put('/approve/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error approving project' });
  }
});

// REJECT
router.put('/reject/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting project' });
  }
});

// ASSIGN MANAGER
router.put('/assign-manager/:id', async (req, res) => {
  try {
    const { managerId } = req.body;
    if (!managerId) return res.status(400).json({ message: "Manager required" });
    const project = await Project.findByIdAndUpdate(req.params.id, { managerId, status: "active" }, { new: true });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error assigning manager' });
  }
});

// GET manager's projects (fix userId casing)
router.get('/manager', verifyToken, async (req, res) => {
  try {
    const managerId = req.user.userId || req.user.id;
    const projects = await Project.find({ managerId })
      .populate('clientId', 'name email')
      .populate('supervisorId', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching manager projects' });
  }
});

// GET single project by ID (keep last to avoid route conflicts)
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching project' });
  }
});

module.exports = router;
