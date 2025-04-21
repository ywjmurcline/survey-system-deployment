const express = require('express');
const router = express.Router();
const Survey = require('../models/Survey');
const Response = require('../models/Response');

// Join present by code
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

router.get("/:surveyId/:questionId", async (req, res) => {
    console.log("GET /:surveyId/:questionId request recieved")
    const { surveyId, questionId } = req.params;
    console.log(surveyId, questionId );
    try {
      // 1. Fetch all responses matching surveyId and questionId
      const allResponses = await Response.find({ survey: surveyId }).sort({ createdAt: -1 });
      // const allResponses = await Response.find();


      // console.log(allResponses);
  
      // 2. Filter: keep only the latest response per userId
      const uniqueResponsesMap = new Map();
  
      for (const response of allResponses) {
        if (!uniqueResponsesMap.has(response.user)) {
          uniqueResponsesMap.set(response.user, response);
        }
      }
  
      const uniqueResponses = Array.from(uniqueResponsesMap.values());

      console.log("unique:", uniqueResponses.length)

      let summedAnswers = {}

      for (const response of uniqueResponses) {
        console.log("response", response);
        for (const answer of response.answers) {
          console.log("answer", answer);
          if (answer._id == questionId) {
            // console.log("answer.results", Object.fromEntries(answer.results));
            results = Object.fromEntries(answer.results);
            Object.entries(results).forEach(([key, value]) => {
              if (key in summedAnswers) {
                summedAnswers[key] += value;
              } else {
                summedAnswers[key] = value;
              }
            });
          }
          
        }
      }

      console.log("summedAnswers", summedAnswers);
      
  
      // // 3. Iterate through unique results (example: log or modify)
      // for (const response of uniqueResponses) {
      //   console.log(`User: ${response.userId}, Answer: ${response.answer}`);
      //   // Do any processing needed here
      // }
  
      res.json(summedAnswers);
    } catch (error) {
      console.error("Error retrieving responses:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

module.exports = router;