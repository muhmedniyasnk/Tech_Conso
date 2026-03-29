const User = require("../models/User");
const Project = require("../models/Project");

// Create Manager
exports.createManager = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const manager = new User({
      name,
      email,
      password,
      phone,
      role: "manager"
    });

    await manager.save();

    res.status(201).json({
      message: "Manager created successfully",
      manager
    });

  } catch (error) {
    console.log("CREATE MANAGER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Assign Manager to Project
exports.assignManager = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { managerId } = req.body;

    // Check if manager exists
    const manager = await User.findById(managerId);
    if (!manager || manager.role !== "manager") {
      return res.status(400).json({ message: "Invalid manager" });
    }

    // Update project
    const project = await Project.findByIdAndUpdate(
      projectId,
      { managerId, status: "approved" },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      message: "Manager assigned successfully",
      project
    });

  } catch (error) {
    console.log("ASSIGN MANAGER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const project = await Project.findByIdAndUpdate(
      projectId,
      { status },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      message: `Project ${status}`,
      project
    });

  } catch (error) {
    console.log("PROJECT STATUS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};