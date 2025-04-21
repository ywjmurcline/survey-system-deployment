const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors(
  
));
app.use(express.json());

// Add debug logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', JSON.stringify(req.body));
  }
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/survey-system')
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Setting up mock database for development...');
    
    // Create mock in-memory data stores
    global.mockDB = {
      users: [],
      surveys: [],
      responses: [],
      participants: []
    };
  });

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/surveys', require('./src/routes/surveyRoutes'));
app.use('/api/join', require('./src/routes/join'));
app.use('/api/present', require('./src/routes/present'));


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


