const mongoose = require('mongoose');

// Poll schema
const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, required: true }, // e.g. yes/no, single-choice, rating, etc
  options: [
    {
      optionText: { type: String, required: true },
      votes: { type: Number, default: 0 }, // For vote tracking on each option
    },
  ],
  responses: [
    {
      voterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For open ended polls
      responseText: { type: String }, // User-submitted text response
      createdAt: { type: Date, default: Date.now },
    },
  ],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // To prevent multiple vote from single user
  createdAt: { type: Date, default: Date.now },
  closed: { type: Boolean, default: false }, // To mark poll as closed
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
