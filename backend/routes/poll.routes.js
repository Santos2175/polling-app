const { Router } = require('express');

const { authenticate } = require('../middlewares/auth.middleware');
const {
  createPoll,
  getAllPolls,
  getVotedPolls,
  getPollById,
  voteOnPoll,
  closePoll,
  bookmarkPoll,
  getBookmarkedPolls,
  deletePoll,
} = require('../controllers/poll.controller');

const router = Router();

// Poll API routes
router.post('/create', authenticate, createPoll);
router.get('/get-all-polls', authenticate, getAllPolls);
router.get('/voted-polls', authenticate, getVotedPolls);
router.get('/:id', authenticate, getPollById);
router.post('/:id/vote', authenticate, voteOnPoll);
router.post('/:id/close', authenticate, closePoll);
router.post('/:id/bookmark', authenticate, bookmarkPoll);
router.get('/user/bookmarked', authenticate, getBookmarkedPolls);
router.delete('/:id/delete', authenticate, deletePoll);

module.exports = router;
