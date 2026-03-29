const mongoose = require("mongoose");

const mlPredictionSchema = new mongoose.Schema({
  stageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stage"
  },
  predictedLabours: {
    type: Number
  },
  predictedCementBags: {
    type: Number
  },
  predictedSandTons: {
    type: Number
  },
  predictedSteelKg: {
    type: Number
  },
  predictedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("MLPrediction", mlPredictionSchema);
