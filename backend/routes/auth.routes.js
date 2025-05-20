const { Router } = require('express');

const upload = require('../middlewares/file.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
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
router.get('/get-user', authenticate, getUserInfo);
router.post(
  '/upload-profile-image',
  upload.single('image'),
  uploadProfileImage
);

module.exports = router;
