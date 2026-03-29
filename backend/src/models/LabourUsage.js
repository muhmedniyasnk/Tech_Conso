const mongoose = require("mongoose");

const labourUsageSchema = new mongoose.Schema({

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },

  stageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stage"
  },

  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  numberOfWorkers: {
    type: Number,
    required: true
  },

  workingHours: {
    type: Number
  },

  date: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("LabourUsage", labourUsageSchema);