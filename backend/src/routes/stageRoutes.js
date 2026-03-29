const express = require("express");
const router = express.Router();

const Stage = require("../models/Stage");

// GET stages by project
router.get('/project/:projectId', async (req, res) => {
  try {
    const stages = await Stage.find({
      projectId: req.params.projectId
    });

    res.json(stages);

  } catch (err) {
    console.log("GET STAGES ERROR:", err);
    res.status(500).json({ message: "Error fetching stages" });
  }
});

module.exports = router;