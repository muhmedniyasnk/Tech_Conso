const express = require("express");
const router = express.Router();

const managerController = require("../controllers/managerController");

// Assign supervisor to project
router.put("/assign-supervisor/:projectId", managerController.assignSupervisor);

module.exports = router;