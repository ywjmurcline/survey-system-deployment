const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  value: { type: String, required: false }
}, { _id: false, strict: false });

const QuestionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,  // This ensures MongoDB automatically generates the ID
    default: () => new mongoose.Types.ObjectId() // Default value generator
  },
  type: { 
    type: String, 
    required: true,
    // Add ALL possible types your frontend might send
    enum: ['multiple-choice', 'open-ended', 'scale', 'word-cloud', 
           'instruction', 'mc', 'text', 'number', 'checkbox', 'rating',
           'wordcloud', 'quiz-mc']
  },
  text: { 
    type: String, 
    required:  [true, '`text` field is required.'],
  },
  questionText: { type: String },
  title: { type: String }, // Add this field
  options: [OptionSchema],
  settings: {
    type: mongoose.Schema.Types.Mixed, // Allow any settings
    default: {}
  },
  results: {
    type: Map,  // Using Map type for dynamic keys
    of: Number, // With numeric values
    required: true
  },
}, { _id: true, strict: false });

const SurveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [QuestionSchema],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  isActive: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false }, // for our convenience, once the survey has been actiavte once, it should no longer be modified
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { strict: false });

// Keep your existing auto-generate code hook
SurveySchema.pre('save', function(next) {
  if (this.isNew && !this.code) {
    this.code = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

const Survey = mongoose.model('Survey', SurveySchema);

module.exports = Survey;