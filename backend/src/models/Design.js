const mongoose = require("mongoose");

const designSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  designerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  designTitle: {
    type: String,
    required: true
  },
  designFileUrl: {
    type: String,
    required: true
  },
  approvalStatus: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING"
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Design", designSchema);
