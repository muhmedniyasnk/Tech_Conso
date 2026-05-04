const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");
const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// POST /api/bills/upload — Supervisor uploads a bill with optional receipt image
router.post("/upload", verifyToken, upload.single("billFile"), async (req, res) => {
  try {
    const { projectId, itemName, category, amount, supplier, description, billDate } = req.body;

    if (!projectId || !itemName || !amount) {
      return res.status(400).json({ message: "projectId, itemName and amount are required" });
    }

    const bill = new Bill({
      projectId,
      supervisorId: req.user.id || req.user.userId,
      itemName,
      category: category || "material",
      amount,
      supplier,
      description,
      billDate: billDate || Date.now(),
      billFile: req.file ? req.file.filename : null
    });

    await bill.save();
    res.status(201).json({ message: "Bill uploaded", bill });

  } catch (err) {
    console.log("BILL UPLOAD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/bills/project/:projectId — Get all bills for a project
router.get("/project/:projectId", async (req, res) => {
  try {
    const bills = await Bill.find({ projectId: req.params.projectId })
      .populate("supervisorId", "name role")
      .populate("signedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bills" });
  }
});

// GET /api/bills/supervisor — Get bills uploaded by logged-in supervisor
router.get("/supervisor", verifyToken, async (req, res) => {
  try {
    const supervisorId = req.user.id || req.user.userId;
    const bills = await Bill.find({ supervisorId })
      .populate("projectId", "name")
      .populate("signedBy", "name")
      .sort({ createdAt: -1 });

    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bills" });
  }
});

// GET /api/bills/manager-projects — Bills for all projects managed by logged-in manager
router.get("/manager-projects", verifyToken, async (req, res) => {
  try {
    const Project = require("../models/Project");
    const managerId = req.user.id || req.user.userId;

    const projects = await Project.find({ managerId });
    const projectIds = projects.map(p => p._id);

    const bills = await Bill.find({ projectId: { $in: projectIds } })
      .populate("projectId", "name")
      .populate("supervisorId", "name role")
      .populate("signedBy", "name")
      .sort({ createdAt: -1 });

    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bills" });
  }
});

// PUT /api/bills/sign/:id — Manager signs a bill
router.put("/sign/:id", verifyToken, async (req, res) => {
  try {
    const managerId = req.user.id || req.user.userId;

    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      {
        managerSigned: true,
        signedBy: managerId,
        signedAt: new Date()
      },
      { new: true }
    ).populate("signedBy", "name role");

    if (!bill) return res.status(404).json({ message: "Bill not found" });

    res.json({ message: "Bill signed", bill });
  } catch (err) {
    res.status(500).json({ message: "Error signing bill" });
  }
});

module.exports = router;
