const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Survey = require('../src/models/Survey'); // Import the Survey model

// Disable mock database to ensure MongoDB usage
global.mockDB = null;

// Auth middleware
const auth = async (req, res, next) => {
  try {
    if (!req.header('Authorization')) {
      console.log('No Authorization header found');
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log('Token received:', token.substring(0, 15) + '...');
    
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || '665eced222ba5d45aa7e3774cc8d30bb4fc122be7ef6c9e6ec31996bdd78e184a00460c1ab1436c615016dcfc4ece66d3f581fc41c7380adf154a850149ab7c7'
    );
    console.log('Token decoded successfully. User ID:', decoded.userId);
    
    // Set the user ID from token
    req.user = { _id: decoded.userId };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: "Token is not valid", error: err.message });
  }
};

// Use auth middleware for all routes
router.use(auth);

// Get all surveys - now uses MongoDB
router.get('/', async (req, res) => {
  try {
    if (global.mockDB) {
      // Fallback to mock DB if MongoDB isn't connected
      const userSurveys = global.mockDB.surveys.filter(s => s.creator === req.user._id);
      return res.json(userSurveys);
    }
    
    // Get surveys from MongoDB
    const surveys = await Survey.find({ creator: req.user._id });
    res.json(surveys);
  } catch (err) {
    console.error('Error fetching surveys:', err);
    res.status(500).json({ message: 'Server error fetching surveys' });
  }
});

// Create survey route
router.post('/', async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    
    // Validate and transform questions to ensure each has a text field
    const validatedQuestions = questions.map((question, index) => {
      // If there's no text field but there is a questionText field, use that
      if (!question.text && question.questionText) {
        return { ...question, text: question.questionText };
      }
      
      // If neither field exists, add an error message
      if (!question.text && !question.questionText) {
        throw new Error(`Question ${index + 1} is missing required text field`);
      }
      
      return question;
    });
    
    // Create a new survey using the validated questions
    const newSurvey = new Survey({
      title,
      description,
      questions: validatedQuestions,
      creator: req.user._id,
      code: Math.random().toString(36).substring(2, 8).toUpperCase()
    });
    
    // Save to MongoDB
    await newSurvey.save();
    
    res.status(201).json({ 
      message: 'Survey created successfully', 
      survey: newSurvey
    });
  } catch (err) {
    console.error('Create survey error:', err);
    // Send more specific error message to the client
    res.status(400).json({ 
      message: err.message || 'Failed to create survey',
      error: err.name === 'ValidationError' ? Object.values(err.errors).map(e => e.message) : undefined
    });
  }
});

// Helper function to map frontend question types to schema types
function mapQuestionType(type) {
  const typeMap = {
    'mc': 'multiple-choice',
    'instruction': 'open-ended'
  };
  return typeMap[type] || 'open-ended'; // Default fallback
}

// Get a specific survey
router.get('/:id', async (req, res) => {
  try {
    if (global.mockDB) {
      const survey = global.mockDB.surveys.find(s => 
        s._id === req.params.id && s.creator === req.user._id
      );
      if (!survey) return res.status(404).json({ message: 'Survey not found' });
      return res.json(survey);
    }
    
    const survey = await Survey.findOne({ _id: req.params.id, creator: req.user._id });
    if (!survey) return res.status(404).json({ message: 'Survey not found' });
    res.json(survey);
  } catch (err) {
    console.error('Error fetching survey:', err);
    res.status(500).json({ message: 'Server error fetching survey' });
  }
});

// Update a survey
router.put('/:id', async (req, res) => {
  try {
    if (global.mockDB) {
      const index = global.mockDB.surveys.findIndex(s => 
        s._id === req.params.id && s.creator === req.user._id
      );
      if (index === -1) return res.status(404).json({ message: 'Survey not found' });
      
      global.mockDB.surveys[index] = {
        ...global.mockDB.surveys[index],
        ...req.body,
        updatedAt: new Date()
      };
      return res.json({ message: 'Survey updated', survey: global.mockDB.surveys[index] });
    }
    
    const survey = await Survey.findOneAndUpdate(
      { _id: req.params.id, creator: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!survey) return res.status(404).json({ message: 'Survey not found' });
    res.json({ message: 'Survey updated', survey });
  } catch (err) {
    console.error('Error updating survey:', err);
    res.status(500).json({ message: 'Server error updating survey' });
  }
});

// Delete a survey
router.delete('/:id', async (req, res) => {
  try {
    console.log(`DELETE request for survey ${req.params.id}`);
    console.log('User ID:', req.user._id);
    
    // Find survey first to verify it exists
    const survey = await Survey.findOne({ 
      _id: req.params.id, 
      creator: req.user._id 
    });
    
    if (!survey) {
      console.log('Survey not found or not owned by user');
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    console.log('Survey found, attempting to delete');
    // Delete the survey
    await Survey.deleteOne({ _id: req.params.id });
    
    console.log('Survey deleted successfully');
    res.json({ message: 'Survey deleted successfully' });
  } catch (err) {
    console.error('Delete survey error:', err);
    // Send detailed error info
    res.status(500).json({ 
      message: 'Server error deleting survey',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Deactivate a survey
router.patch('/:id/deactivate', async (req, res) => {
  try {
    console.log(`Deactivation request for survey ${req.params.id}`);
    console.log(`User ID from token: ${req.user._id}`);
    
    const survey = await Survey.findOneAndUpdate(
      { _id: req.params.id },
      { isActive: false },
      { new: true }
    );
    
    if (!survey) {
      console.log('Survey not found for deactivation');
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    console.log('Survey deactivated successfully');
    res.json({ message: 'Survey deactivated successfully', survey });
  } catch (err) {
    console.error('Error deactivating survey:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;