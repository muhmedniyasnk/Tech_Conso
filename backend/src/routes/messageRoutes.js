const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");


// Send message
router.post("/send", messageController.sendMessage);


// Get chat history
router.get("/project/:projectId", messageController.getProjectMessages);


module.exports = router;