const Message = require("../models/Message");


// Send message
exports.sendMessage = async (req, res) => {

  try {

    const { projectId, senderId, receiverId, message } = req.body;

    const newMessage = new Message({
      projectId,
      senderId,
      receiverId,
      message
    });

    await newMessage.save();

    res.status(201).json({
      message: "Message sent",
      data: newMessage
    });

  } catch (error) {

    console.log("SEND MESSAGE ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};



// Get chat history for a project
exports.getProjectMessages = async (req, res) => {

  try {

    const { projectId } = req.params;

    const messages = await Message.find({ projectId })
      .populate("senderId", "name role")
      .populate("receiverId", "name role")
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {

    console.log("GET MESSAGE ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};