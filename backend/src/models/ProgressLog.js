const mongoose = require("mongoose");

const progressLogSchema = new mongoose.Schema({

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },

  

  progressPercentage: {
    type: Number,
    min: 0,
    max: 100
  },

  remarks: String,

  imageUrl: String,

   updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("ProgressLog", progressLogSchema);