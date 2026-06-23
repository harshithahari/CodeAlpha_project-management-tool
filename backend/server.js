require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // allow React or other frontend
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// 🔑 Attach io to every request so routes can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ✅ Serve static frontend files (HTML, CSS, JS)
// Since server.js is inside backend/, go up one level to reach frontend/
app.use(express.static(path.join(__dirname, "../frontend"))); 

// ✅ Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// ✅ Project, Task, Comment routes
const projectRoutes = require('./routes/project');
const taskRoutes = require('./routes/task');
const commentRoutes = require('./routes/comment');

app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);

// ❌ Remove the test route that overrides index.html
// app.get('/', (req, res) => {
//   res.send("Backend is running 🚀");
// });

// Socket.io setup
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
