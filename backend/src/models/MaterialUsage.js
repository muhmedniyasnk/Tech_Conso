const mongoose = require("mongoose");

const materialUsageSchema = new mongoose.Schema({

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

  materialName: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  unit: {
    type: String
  },

  date: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("MaterialUsage", materialUsageSchema);