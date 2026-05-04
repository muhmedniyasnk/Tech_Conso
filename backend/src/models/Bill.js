const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },

  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  itemName: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: ["material", "labour", "equipment", "transport", "other"],
    default: "material"
  },

  amount: {
    type: Number,
    required: true
  },

  supplier: {
    type: String
  },

  description: {
    type: String
  },

  billDate: {
    type: Date,
    default: Date.now
  },

  // Receipt / bill image uploaded by supervisor
  billFile: {
    type: String
  },

  // Manager signature
  managerSigned: {
    type: Boolean,
    default: false
  },

  signedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  signedAt: {
    type: Date
  }

}, { timestamps: true });

module.exports = mongoose.model("Bill", billSchema);
