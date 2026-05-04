const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const adminRoutes = require("./routes/adminRoutes");
const managerRoutes = require("./routes/managerRoutes");
const projectRoutes = require("./routes/projectRoutes");
const supervisorRoutes = require("./routes/supervisorRoutes");
const progressRoutes = require("./routes/progressRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const messageRoutes = require("./routes/messageRoutes");
const predictionRoutes = require('./routes/prediction.routes');
const stageRoutes = require('./routes/stageRoutes');
const testRoutes = require("./routes/testRoutes");
const billRoutes = require("./routes/billRoutes");

app.use(cors());
app.use(express.json());

app.use('/api/stages', stageRoutes);
app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/prediction', predictionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/supervisor", supervisorRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/resource", resourceRoutes);
app.use("/api/chat", messageRoutes);
app.use("/api/test", testRoutes);
app.use("/api/bills", billRoutes);
app.use("/uploads", express.static("src/uploads"));

app.get("/", (req, res) => res.send("TechConso Backend Running"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join project-specific room
  socket.on('joinRoom', async (projectId) => {
    socket.join(projectId);

    // Send existing messages for this project only
    const messages = await Message.find({ projectId })
      .populate('senderId', 'name role')
      .sort({ createdAt: 1 });

    socket.emit('loadMessages', messages);
  });

  // Save and broadcast to project room only
  socket.on('sendMessage', async (data) => {
    try {
      const newMessage = new Message({
        projectId: data.projectId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message
      });
      await newMessage.save();

      const populated = await Message.findById(newMessage._id)
        .populate('senderId', 'name role');

      // Emit only to users in this project's room
      io.to(data.projectId).emit('receiveMessage', populated);
    } catch (err) {
      console.log('SOCKET SEND ERROR:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
