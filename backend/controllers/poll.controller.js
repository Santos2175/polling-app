const Poll = require('../models/poll.model');

// Handler to create poll
const createPoll = async (req, res) => {
  try {
    const { question, type, options } = req.body;
    const creatorId = req.user.id;

    // Validation: Check the missing field
    if (!question || !type) {
      return res.status(400).json({
        success: false,
        message: `Question and type are required.`,
      });
    }

    let processedOptions = [];

    switch (type) {
      case 'single-choice':
        if (!options || options.length < 2) {
          return res.status(400).json({
            success: false,
            message: 'Single choice poll must have at least 2 options',
          });
        }
        processedOptions = options.map((option) => ({ optionText: option }));
        break;

      case 'rating':
        processedOptions = [1, 2, 3, 4, 5].map((value) => ({
          optionText: value.toString(),
        }));
        break;

      case 'yes/no':
        processedOptions = ['Yes', 'No'].map((value) => ({
          optionText: value,
        }));
        break;

      case 'image-based':
        if (!options || options.length < 2) {
          return res.status(400).json({
            success: false,
            message: `Image based poll must have at least 2 image URLs`,
          });
        }
        processedOptions = options.map((url) => ({ optionText: url }));
        break;

      case 'open-ended':
        processedOptions = []; // No options for open ended
        break;

      default:
        return res
          .status(400)
          .json({ success: false, message: `Invalid poll type` });
    }

    // Create new poll
    const newPoll = await Poll.create({
      question,
      type,
      options: processedOptions,
      creator: creatorId,
    });

    res.status(201).json({ success: true, newPoll });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error creating Poll`,
      error: error.message,
    });
  }
};

// Handler to get all polls
const getAllPolls = async (req, res) => {};

// Handler to get voted polls
const getVotedPolls = async (req, res) => {};

// Handler to get poll by id
const getPollById = async (req, res) => {};

// Handler to vote on poll
const voteOnPoll = async (req, res) => {};

// Handler to close poll
const closePoll = async (req, res) => {};

// Handler to bookmark poll
const bookmarkPoll = async (req, res) => {};

// Handler to get bookmarked polls
const getBookmarkedPolls = async (req, res) => {};

// Handler to delete poll
const deletePoll = async (req, res) => {};

module.exports = {
  createPoll,
  getAllPolls,
  getVotedPolls,
  getPollById,
  voteOnPoll,
  closePoll,
  bookmarkPoll,
  getBookmarkedPolls,
  deletePoll,
};
