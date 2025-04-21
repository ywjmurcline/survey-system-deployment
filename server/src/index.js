const express = require('express');
const http = require('http');
const cors = require('cors');
const surveyRoutes = require('./routes/surveyRoutes');
const authRoutes = require('./routes/auth');  // Add this line
const joinRoutes = require('./routes/join'); 
const presentRoutes = require('./routes/present'); 
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const { join } = require('path');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'https://localhost:3002'], 
  credentials: true
}));

app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/survey-system';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000, // Increased timeout
  socketTimeoutMS: 30000
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('Setting up mock database for development...');
  
  // Setup mock database if connection fails
  global.mockDB = {
    users: [],
    surveys: [],
    responses: [],
    participants: []
  };
});
  
// Socket setup
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);  // Add this line for auth routes
app.use('/api/surveys', surveyRoutes);
app.use('/api/join', joinRoutes);
app.use('/api/present', presentRoutes);


// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
