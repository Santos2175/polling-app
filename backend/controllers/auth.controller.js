const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { generateToken } = require('../utils/token');

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
        .json({ success: false, error: `Email already in use` });
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
        .status(401)
        .json({ success: false, message: `Invalid Credentials` });
    }

    res.status(200).json({
      success: true,
      message: `User logged in successfully`,
      data: {
        id: user._id,
        user: {
          ...user.toObject(),
          totalPollsCreated: 0,
          totalPollsVotes: 0,
          totalPollsBookmarked: 0,
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
const getUserInfo = async (req, res) => {};

// Handler to add profile pic
const uploadProfileImage = async (req, res) => {};

module.exports = { registerUser, loginUser, getUserInfo, uploadProfileImage };
