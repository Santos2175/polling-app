const Poll = require('../models/poll.model');
const User = require('../models/user.model');

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
const getAllPolls = async (req, res) => {
  const { type, creatorId, page = 1, limit = 10 } = req.query;
  const filter = {};
  const userId = req.user.id;

  if (type) filter.type = type;
  if (creatorId) filter.creator = creatorId;

  try {
    // Calculate pagination parameters
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    // Fetch all polls with pagination
    const polls = await Poll.find(filter)
      .populate('creator', 'fullName username email profileImageUrl')
      .populate({
        path: 'responses.voterId',
        select: 'fullName username profileImageUrl',
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Add user has voted for each poll
    const updatedPolls = polls.map((poll) => {
      const userHasVoted = poll.voters.some((voterId) =>
        voterId.equals(userId)
      );

      return {
        ...poll.toObject(),
        userHasVoted,
      };
    });

    // Get total of polls for pagination metadata
    const totalPolls = await Poll.countDocuments(filter);

    const stats = await Poll.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          type: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Ensure all types are included in stat even those with zero counts
    const allTypes = [
      { type: 'single-choice', label: 'Single Choice' },
      { type: 'yes/no', label: 'Yes/No' },
      { type: 'image-based', label: 'Image Based' },
      { type: 'rating', label: 'rating' },
      { type: 'open-ended', label: 'Open Ended' },
    ];

    const statsWithDefaults = allTypes
      .map((pollType) => {
        const stat = stats.find((item) => item.type === pollType.type);

        return {
          label: pollType.label,
          type: pollType.type,
          count: stat ? stat.count : 0,
        };
      })
      .sort((a, b) => b.count - a.count);

    res.status(200).json({
      success: true,
      data: {
        polls: updatedPolls,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalPolls / pageSize),
        totalPolls,
        stats: statsWithDefaults,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error getting all polls`,
      error: error.message,
    });
  }
};

// Handler to get voted polls
const getVotedPolls = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user.id;

  try {
    // Calculate the pagination parameters
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    //Fetch polls where user has voted
    const polls = await Poll.find({ voters: userId })
      .populate('creator', 'fullName username email profileImageUrl')
      .populate({
        path: 'responses.voterId',
        select: 'fullName username profileImageUrl',
      })
      .skip(skip)
      .limit(pageSize);

    // Add `userHasVoted` flag to each poll
    const updatedPolls = polls.map((poll) => {
      const userHasVoted = poll.voters.some((voterId) =>
        voterId.equals(userId)
      );

      return {
        ...poll.toObject(),
        userHasVoted,
      };
    });

    // Get total count of voted polls for pagination metadata
    const totalVotedPolls = await Poll.countDocuments({ voters: userId });

    res.status(200).json({
      success: true,
      message: 'Voted polls',
      data: {
        polls: updatedPolls,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalVotedPolls / pageSize),
        totalVotedPolls,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error getting voted polls`,
      error: error.message,
    });
  }
};

// Handler to get poll by id
const getPollById = async (req, res) => {
  const { id } = req.params;

  try {
    const poll = await Poll.findById(id)
      .populate('creator', 'username email')
      .populate('responses.voterId', 'username profileImageUrl fullName');

    if (!poll) {
      return res
        .status(404)
        .json({ success: false, message: `Poll not found` });
    }

    res
      .status(200)
      .json({ success: true, message: 'Poll retreived successfully', poll });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error getting poll`,
      error: error.message,
    });
  }
};

// Handler to vote on poll
const voteOnPoll = async (req, res) => {
  const { id } = req.params;
  const { optionText, responseText } = req.body;
  const voterId = req.user.id;

  try {
    const poll = await Poll.findById(id);

    // Check if poll exists
    if (!poll) {
      return res
        .status(404)
        .json({ success: false, message: `Poll not found` });
    }

    // Check if poll is closed
    if (poll.closed) {
      return res
        .status(400)
        .json({ success: false, message: `Poll is closed.` });
    }

    // Check if user has already voted
    if (poll.voters.includes(voterId)) {
      return res.status(400).json({
        success: false,
        message: `User has already voted on this poll`,
      });
    }

    if (poll.type === 'open-ended') {
      if (!responseText) {
        return res.status(400).json({
          success: false,
          message: `ResponseText is required for open ended polls`,
        });
      }
      poll.responses.push({ voterId, responseText });
    } else {
      if (
        optionText === undefined ||
        optionText < 0 ||
        optionText >= poll.options.length
      ) {
        return res
          .status(400)
          .json({ success: false, message: `Invalid option index` });
      }
      poll.options[optionText].votes += 1;
    }

    // After succesfull voting on poll, update the poll with new voter
    poll.voters.push(voterId);
    await poll.save();

    res
      .status(200)
      .json({ success: true, message: `Successfully voted`, poll });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Voting failed`, error: error.message });
  }
};

// Handler to close poll
const closePoll = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const poll = await Poll.findById(id);

    if (!poll) {
      return res
        .status(404)
        .json({ success: false, message: `Poll not found` });
    }

    // Check if creator and the one who requested to close poll are same
    if (poll.creator.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: `You are not authorized to close this poll`,
      });
    }

    poll.closed = true;
    await poll.save();

    res
      .status(200)
      .json({ success: true, message: `Poll closed successfully.`, poll });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error closing poll`,
      error: error.message,
    });
  }
};

// Handler to bookmark poll
const bookmarkPoll = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: `User not found` });
    }

    // Check if poll is already bookmarked
    const isBookmarked = user.bookmarkedPolls.includes(id);

    if (isBookmarked) {
      // Remove poll from bookmarks
      user.bookmarkedPolls = user.bookmarkedPolls.filter(
        (pollId) => pollId.toString() !== id
      );

      await user.save();
      return res.status(200).json({
        success: true,
        message: `Poll removed from bookmarks`,
        bookmarkedPolls: user.bookmarkedPolls,
      });
    }

    // Add poll to bookmarks
    user.bookmarkedPolls.push(id);
    await user.save();

    res.status(200).json({
      success: true,
      message: `Poll added to bookmarks`,
      bookmarkedPolls: user.bookmarkedPolls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error while bookmarking poll`,
      error: error.message,
    });
  }
};

// Handler to get bookmarked polls
const getBookmarkedPolls = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId)
      .populate({
        path: 'bookmarkedPolls',
        populate: {
          path: 'creator',
          select: 'fullName username profileImageUrl',
        },
      })
      .populate({
        path: 'bookmarkedPolls',
        populate: {
          path: 'responses.voterId',
          select: 'fullName username profileImageUrl',
        },
      });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: `User not found` });
    }

    const bookmarkedPolls = user.bookmarkedPolls;

    // Add `userHasVoted` flag to each bookmarked polls
    const updatedPolls = bookmarkedPolls.map((poll) => {
      const userHasVoted = poll.voters.some((voterId) =>
        voterId.equals(userId)
      );

      return {
        ...poll.toObject(),
        userHasVoted,
      };
    });

    res.status(200).json({
      success: true,
      message: `Bookmarked polls retrieved successfully`,
      bookmarkedPolls: updatedPolls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error getting bookmarked polls`,
      error: error.message,
    });
  }
};

// Handler to delete poll
const deletePoll = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const poll = await Poll.findById(id);

    if (!poll) {
      return res
        .status(404)
        .json({ success: false, message: `Poll not found` });
    }

    // Check if user is authorized to delete poll
    if (poll.creator.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: `You are not authorized to delete this poll.`,
      });
    }

    await Poll.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: `Poll deleted successfully` });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error deleting poll`,
      error: error.message,
    });
  }
};

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
