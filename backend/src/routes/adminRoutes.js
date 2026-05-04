const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const total     = await Project.countDocuments();
    const pending   = await Project.countDocuments({ status: 'pending' });
    const active    = await Project.countDocuments({ status: { $in: ['active', 'ongoing', 'approved'] } });
    const completed = await Project.countDocuments({ status: 'completed' });
    const managers  = await User.countDocuments({ role: 'manager' });
    const supervisors = await User.countDocuments({ role: 'supervisor' });
    const clients   = await User.countDocuments({ role: 'client' });

    res.json({ total, pending, active, completed, managers, supervisors, clients });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/projects — all projects with populated client & manager
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('clientId', 'name email')
      .populate('managerId', 'name email')
      .populate('supervisorId', 'name email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/managers
router.get('/managers', async (req, res) => {
  try {
    const managers = await User.find({ role: 'manager' }).select('-password').sort({ createdAt: -1 });
    res.json(managers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/supervisors
router.get('/supervisors', async (req, res) => {
  try {
    const supervisors = await User.find({ role: 'supervisor' }).select('-password').sort({ createdAt: -1 });
    res.json(supervisors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/clients
router.get('/clients', async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' }).select('-password').sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/register-staff — register manager or supervisor
router.post('/register-staff', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!['manager', 'supervisor'].includes(role)) {
      return res.status(400).json({ message: 'Role must be manager or supervisor' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = new User({ name, email, password, phone, role });
    await user.save();

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.log('REGISTER STAFF ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/assign-manager/:projectId
router.put('/assign-manager/:projectId', async (req, res) => {
  try {
    const { managerId } = req.body;

    const manager = await User.findById(managerId);
    if (!manager || manager.role !== 'manager') {
      return res.status(400).json({ message: 'Invalid manager' });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      { managerId, status: 'approved' },
      { new: true }
    ).populate('managerId', 'name email');

    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.json({ message: 'Manager assigned', project });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/staff/:id
router.delete('/staff/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
