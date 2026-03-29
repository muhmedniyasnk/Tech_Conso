const Project = require("../models/Project");

// Create Project (Client)
exports.createProject = async (req, res) => {
  try {
    const { name, description, location, clientId, expectedEndDate } = req.body;

    const project = new Project({
      name,
      description,
      location,
      clientId,
      expectedEndDate,
      status: "pending"
    });

    await project.save();

    res.status(201).json({
      message: "Project created successfully",
      project
    });

  } catch (error) {
    console.log("CREATE PROJECT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};