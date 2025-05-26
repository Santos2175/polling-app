const User = require('../models/user.model');
const Poll = require('../models/poll.model');
const { generateToken } = require('../utils/token');
const cloudinary = require('../config/cloudinary.config');

// Handler to register user
const registerUser = async (req, res) => {
  try {
    const { username, fullName, email, password, profileImageUrl } = req.body;

    // Validation: Checks the missing field
    if (!username || !fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: username, fullName, email, password',
      });
    }

    // Validation: Checks username format
    // Allows alphanumeric and hyphens only
    const usernameRegex = /^[a-zA-Z0-9-]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        success: false,
        error:
          'Invalid username. Only alphanumeric characters and hyphens are allowed. No space permitted',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: `Email already in use` });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: `Username not available. Try another one`,
      });
    }

    // Create new user
    const user = await User.create({
      username,
      fullName,
      email,
      password,
      profileImageUrl,
    });

    res.status(201).json({
      success: true,
      message: `User created successfully`,
      data: {
        id: user._id,
        user,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
};

// Handler to login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation: Check the missing fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `All fields are required: email , password`,
      });
    }

    // Check credentials
    const user = await User.findOne({ email });
    if (!user || !user.comparePassword(password)) {
      return res
        .status(400)
        .json({ success: false, message: `Invalid Credentials` });
    }

    // Count polls created by user
    const totalPollsCreated = await Poll.countDocuments({ creator: user._id });

    // Count polls the user has voted
    const totalPollsVotes = await Poll.countDocuments({ voters: user._id });

    // Count total polls bookmarked
    const totalPollsBookmarked = user.bookmarkedPolls.length;

    res.status(200).json({
      success: true,
      message: `User logged in successfully`,
      data: {
        id: user._id,
        user: {
          ...user.toObject(),
          totalPollsCreated,
          totalPollsVotes,
          totalPollsBookmarked,
        },
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again later.',
      error: error.message,
    });
  }
};

// Handler to get user info
const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: `User not found` });
    }
    // Count polls created by user
    const totalPollsCreated = await Poll.countDocuments({ creator: user._id });

    // Count polls the user has voted
    const totalPollsVotes = await Poll.countDocuments({ voters: user._id });

    // Count total polls bookmarked
    const totalPollsBookmarked = user.bookmarkedPolls.length;

    // Add new attributes to response
    const userInfo = {
      ...user.toObject(),
      totalPollsCreated,
      totalPollsVotes,
      totalPollsBookmarked,
    };

    res.status(200).json({ success: false, userInfo });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error fetching user info`,
      error: error.message,
    });
  }
};

// Handler to add profile pic
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: 'No files uploaded' });
    }

    // const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${
    //   req.file.filename
    // }`;

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'polling-app/',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    res.status(200).json({ success: true, imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserInfo, uploadProfileImage };
