const express = require('express');
const router = express.Router();
const Survey = require('../models/Survey');

// Join a survey by code
router.post('/', async (req, res) => {
  try {
    const { code, nickname } = req.body;
    
    console.log(`Join attempt: code=${code}, nickname=${nickname}`);
    
    if (!code || !nickname) {
      return res.status(400).json({ message: 'Survey code and nickname are required' });
    }

    // Find the survey by code (case insensitive)
    const survey = await Survey.findOne({ code: code });
    
    if (!survey) {
      console.log(`Survey not found with code: ${code}`);
      return res.status(404).json({ message: 'Survey not found' });
    }

    if (!survey.isActive) {
      console.log(`Survey ${code} is not alive`);
      return res.status(404).json({ message: 'Survey not accepting answers now' });
    }
    
    // randomly create a user id
    const participantId = `participant-${Date.now()}`;
    
    let surveyId = survey._id;

    res.json({
      surveyId,
      code,
      title: survey.title,
      participantId,
      nickname
    });
    
  } catch (err) {
    console.error('Join survey error:', err);
    res.status(500).json({ message: 'Server error while joining survey' });
  }
});

// Verify a survey exists before joining
router.get('/verify/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    // Find survey by code (case insensitive)
    const survey = await Survey.findOne({ 
      code: new RegExp(`^${code}$`, 'i')
    });
    
    if (!survey) {
      return res.status(404).json({ exists: false });
    }
    
    res.json({ 
      exists: true, 
      title: survey.title,
      isActive: survey.isActive 
    });
    
  } catch (err) {
    console.error('Verify survey error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get survey details for a participant
router.get('/survey/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Participant requesting survey with ID: ${id}`);
    
    // Find survey by ID
    const survey = await Survey.findById(id);
    
    if (!survey) {
      console.log(`Survey not found with ID: ${id}`);
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    console.log(`Found survey: ${survey.title}, isActive: ${survey.isActive}`);
    
    if (!survey.isActive) {
      console.log(`Survey ${id} is inactive`);
      return res.status(403).json({ message: 'This survey is no longer active' });
    }
    
    // Return only the data participants need (not including answers)
    res.json({
      _id: survey._id,
      title: survey.title,
      code: survey.code,
      questions: survey.questions.map(q => ({
        _id: q._id,
        text: q.text,
        type: q.type,
        options: q.options
      }))
    });
  } catch (err) {
    console.error('Error fetching survey for participant:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;