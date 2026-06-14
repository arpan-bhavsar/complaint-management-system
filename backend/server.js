require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const http = require('http');
const { Server } = require('socket.io');

// Initialize the Express application
const app = express();

const jwt = require('jsonwebtoken');

// Middleware: Allows our app to accept JSON data and talk to the React frontend
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://complaint-management-system-sigma-plum.vercel.app' // Updated to match your exact Vercel URL
  ],
  credentials: true
}));

const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// A simple test route to make sure the server is responding
app.get('/', (req, res) => {
    res.send('Complaint Management API is running...');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// 1. Create a raw HTTP server and wrap your Express app inside it
const server = http.createServer(app);

// 2. Initialize Socket.io and allow your React frontend to talk to it
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your React port
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// 3. Make the 'io' variable available inside your routes!
app.set('io', io);
io.use((socket, next) => {
  // Check if the frontend sent a token in the handshake
  const token = socket.handshake.auth.token;

  if (!token) {
    console.log('🚨 Blocked connection: No token provided');
    return next(new Error('Authentication error'));
  }

  // Verify the token using your secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('🚨 Blocked connection: Invalid or expired token');
      return next(new Error('Authentication error'));
    }

    // Token is valid! Attach the user info to the socket and let them in
    socket.user = decoded;
    next();
  });
});

// 4. Listen for live connections
io.on('connection', (socket) => {
  console.log(`⚡ A user connected via WebSockets: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
  });
});

// 5. Use server.listen INSTEAD of app.listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT} with WebSockets enabled!`);
});