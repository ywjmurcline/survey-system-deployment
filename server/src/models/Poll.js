// server/src/models/Poll.js
const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
}, { _id: true });

const pollSchema = new mongoose.Schema({
  roomCode: { type: String, unique: true, index: true },
  question: { type: String, required: true },
  options: [optionSchema],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  participants: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Poll', pollSchema);