const mongoose = require('mongoose');


const QuestionResult = new mongoose.Schema({
  _id: {type: mongoose.Schema.Types.ObjectId},
  type: { 
    type: String, 
    required: true,
    // Add ALL possible types your frontend might send
    enum: ['multiple-choice', 'open-ended', 'scale', 'word-cloud', 
           'instruction', 'mc', 'text', 'number', 'checkbox', 'rating',
           'wordcloud', 'quiz-mc']
  },
  results: {
    type: Map,  // Using Map type for dynamic keys
    of: Number, // With numeric values
    required: true
  },
  answered: {type: Boolean},
}, {strict: false });

const ResponseSchema = new mongoose.Schema({
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [QuestionResult],
  completed: {
    type: Boolean,
    default: false
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});


const Response = mongoose.model('Response', ResponseSchema);

module.exports = Response;