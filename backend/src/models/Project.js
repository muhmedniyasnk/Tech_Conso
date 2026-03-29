const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  location: {
    type: String,
    required: true
  },

  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {
    type: String,
    enum: ["pending", "approved", "ongoing", "completed", "cancelled"],
    default: "pending"
  },

  startDate: {
    type: Date
  },

  expectedEndDate: {
    type: Date
  },

  actualEndDate: {
    type: Date
  }

}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);