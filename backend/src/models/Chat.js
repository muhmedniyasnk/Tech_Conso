const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  projectId: String,
  sender: String, // client or supervisor
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chat', chatSchema);