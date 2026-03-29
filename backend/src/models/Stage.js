const mongoose = require("mongoose");

const stageSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  stageName: {
    type: String,
    enum: [
      "Foundation",
      "Structural",
      "Plumbing_Electrical_Initial",
      "Plastering",
      "Tiles_Work",
      "Painting",
      "Plumbing_Electrical_Final",
      "Finishing_Handover"
    ],
    required: true
  },
  stageSequence: {
    type: Number,
    required: true
  },
  plannedDurationDays: {
    type: Number,
    required: true
  },
  actualDurationDays: {
    type: Number
  },
  status: {
    type: String,
    enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
    default: "PENDING"
  }
});

module.exports = mongoose.model("Stage", stageSchema);
