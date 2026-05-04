const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Project = require("../models/Project");
const User = require("../models/User");
const ProgressLog = require("../models/ProgressLog");
const Bill = require("../models/Bill");

// GET /api/manager/projects — manager's assigned projects (populated)
router.get("/projects", verifyToken, async (req, res) => {
  try {
    const managerId = req.user.userId || req.user.id;
    const projects = await Project.find({ managerId })
      .populate("clientId", "name email phone")
      .populate("supervisorId", "name email")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

// GET /api/manager/supervisors — unassigned supervisors only
router.get("/supervisors", verifyToken, async (req, res) => {
  try {
    // Find all supervisorIds currently assigned to ongoing/active projects
    const assignedProjects = await Project.find(
      { supervisorId: { $exists: true, $ne: null }, status: { $in: ['ongoing', 'active', 'approved'] } },
      { supervisorId: 1 }
    );
    const assignedIds = assignedProjects.map(p => p.supervisorId.toString());

    const supervisors = await User.find({
      role: 'supervisor',
      _id: { $nin: assignedIds }
    }).select('-password');

    res.json(supervisors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching supervisors' });
  }
});

// GET /api/manager/stats — overview counts
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const managerId = req.user.userId || req.user.id;
    const projects = await Project.find({ managerId });
    const projectIds = projects.map(p => p._id);

    const total     = projects.length;
    const ongoing   = projects.filter(p => ["ongoing", "active"].includes(p.status)).length;
    const completed = projects.filter(p => p.status === "completed").length;
    const pending   = projects.filter(p => p.status === "pending" || p.status === "approved").length;

    // unique clients
    const clientIds = [...new Set(projects.map(p => p.clientId?.toString()).filter(Boolean))];

    // unique supervisors
    const supIds = [...new Set(projects.map(p => p.supervisorId?.toString()).filter(Boolean))];

    // unsigned bills
    const unsignedBills = await Bill.countDocuments({ projectId: { $in: projectIds }, managerSigned: false });

    res.json({ total, ongoing, completed, pending, clients: clientIds.length, supervisors: supIds.length, unsignedBills });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// GET /api/manager/progress/:projectId — progress logs for a project
router.get("/progress/:projectId", verifyToken, async (req, res) => {
  try {
    const logs = await ProgressLog.find({ projectId: req.params.projectId })
      .populate("updatedBy", "name role")
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching progress" });
  }
});

// PUT /api/manager/assign-supervisor/:projectId
router.put("/assign-supervisor/:projectId", verifyToken, async (req, res) => {
  try {
    const { supervisorId } = req.body;

    const supervisor = await User.findById(supervisorId);
    if (!supervisor || supervisor.role !== "supervisor") {
      return res.status(400).json({ message: "Invalid supervisor" });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      { supervisorId, status: "ongoing" },
      { new: true }
    ).populate("supervisorId", "name email")
     .populate("clientId", "name email");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Supervisor assigned", project });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
