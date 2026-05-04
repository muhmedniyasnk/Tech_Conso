const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Project = require("../models/Project");
const ProgressLog = require("../models/ProgressLog");
const Bill = require("../models/Bill");

// GET /api/supervisor/my-project — supervisor's single assigned project
router.get("/my-project", verifyToken, async (req, res) => {
  try {
    const supervisorId = req.user.userId || req.user.id;
    const project = await Project.findOne({ supervisorId })
      .populate("clientId", "name email phone")
      .populate("managerId", "name email");
    res.json(project || null);
  } catch (err) {
    res.status(500).json({ message: "Error fetching project" });
  }
});

// GET /api/supervisor/stats
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const supervisorId = req.user.userId || req.user.id;
    const project = await Project.findOne({ supervisorId });

    if (!project) return res.json({ hasProject: false });

    const progressCount = await ProgressLog.countDocuments({ projectId: project._id });
    const billsCount    = await Bill.countDocuments({ supervisorId });
    const signedBills   = await Bill.countDocuments({ supervisorId, managerSigned: true });

    // latest progress %
    const latest = await ProgressLog.findOne({ projectId: project._id }).sort({ createdAt: -1 });

    res.json({
      hasProject: true,
      projectName: project.name,
      projectStatus: project.status,
      progressCount,
      billsCount,
      signedBills,
      latestProgress: latest?.progressPercentage || 0
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

module.exports = router;
