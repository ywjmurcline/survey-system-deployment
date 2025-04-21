// filepath: ./server/src/controllers/surveyController.js
const Survey = require('../models/Survey');

exports.createSurvey = async (req, res) => {
  try {
    // Generate a unique code for the survey
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const survey = new Survey({
      ...req.body,
      code
    });
    
    await survey.save();
    res.status(201).json({ message: 'Survey created successfully', survey });
  } catch (error) {
    res.status(500).json({ message: 'Error creating survey', error: error.message });
  }
};

exports.getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find({});
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching surveys', error: error.message });
  }
};

exports.getSurveyByCode = async (req, res) => {
  try {
    const survey = await Survey.findOne({ code: req.params.code });
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    res.status(200).json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching survey', error: error.message });
  }
};