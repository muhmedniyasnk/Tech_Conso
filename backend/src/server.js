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
app.use('/api/stages', stageRoutes);



// Middleware
app.use(cors());
app.use(express.json());
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
app.use('/api/prediction', predictionRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("TechConso Backend Running");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/supervisor", supervisorRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/resource", resourceRoutes);
app.use("/api/chat", messageRoutes);
app.use("/uploads", express.static("src/uploads"));
// Server start
const PORT = process.env.PORT || 5000;



const http = require('http');
const { Server } = require('socket.io');


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const testRoutes = require("./routes/testRoutes");
app.use("/api/test", testRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // join room (project-based chat)
  socket.on('joinRoom', (projectId) => {
    socket.join(projectId);
  });

  // send message
  socket.on('sendMessage', (data) => {
    // broadcast to same project room
    io.to(data.projectId).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});



const Chat = require('./models/Chat');

io.on('connection', (socket) => {

  socket.on('joinRoom', async (projectId) => {
    socket.join(projectId);

    // 🔥 SEND OLD MESSAGES
    const messages = await Chat.find({ projectId }).sort({ createdAt: 1 });
    socket.emit('loadMessages', messages);
  });

  socket.on('sendMessage', async (data) => {

    // 🔥 SAVE MESSAGE
    const newMessage = new Chat(data);
    await newMessage.save();

    // 🔥 SEND TO ALL USERS IN ROOM
    io.to(data.projectId).emit('receiveMessage', newMessage);
  });

});