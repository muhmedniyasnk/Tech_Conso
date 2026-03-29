const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const progressController = require("../controllers/progressController");
const upload = require("../middleware/uploadMiddleware");

// 🔥 Upload / Update Progress (Supervisor)
router.post(
  "/update",
  authMiddleware.verifyToken,
  upload.single("image"),   // field name MUST match frontend
  progressController.updateProgress
);

// 🔥 Get all progress for a project
router.get(
  "/project/:projectId",
  progressController.getProjectProgress
);
router.get('/supervisor', authMiddleware.verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({
      supervisorId: req.user.userId
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});


module.exports = router;