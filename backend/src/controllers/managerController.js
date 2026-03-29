const Project = require("../models/Project");
const User = require("../models/User");

// Assign Supervisor to Project
exports.assignSupervisor = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { supervisorId } = req.body;

    // Check if supervisor exists
    const supervisor = await User.findById(supervisorId);

    if (!supervisor || supervisor.role !== "supervisor") {
      return res.status(400).json({
        message: "Invalid supervisor"
      });
    }

    // Update project
    const project = await Project.findByIdAndUpdate(
      projectId,
      { supervisorId, status: "ongoing" },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.json({
      message: "Supervisor assigned successfully",
      project
    });

  } catch (error) {
    console.log("ASSIGN SUPERVISOR ERROR:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};