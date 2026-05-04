const ProgressLog = require("../models/ProgressLog");

exports.updateProgress = async (req, res) => {
  try {

    const { projectId, stageId, progressPercentage, remarks } = req.body;

    const imageUrl = req.file ? req.file.filename : null;

    const progress = new ProgressLog({
      projectId,
      updatedBy: req.user.userId || req.user.id,
      progressPercentage,
      remarks,
      imageUrl
    });

    await progress.save();

    res.status(201).json({
      message: "Progress updated successfully",
      progress
    });

  } catch (error) {
    console.log("PROGRESS UPDATE ERROR:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

exports.getProjectProgress = async (req, res) => {
  try {

    const { projectId } = req.params;

    const progressLogs = await ProgressLog.find({ projectId })
      .populate("updatedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(progressLogs);

  } catch (error) {
    console.log("GET PROGRESS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};