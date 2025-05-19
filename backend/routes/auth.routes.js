const { Router } = require('express');

const {
  registerUser,
  loginUser,
  getUserInfo,
  uploadProfileImage,
} = require('../controllers/auth.controller');

const router = Router();

// Auth api routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/get-user', getUserInfo);
router.post('/upload', uploadProfileImage);

module.exports = router;
