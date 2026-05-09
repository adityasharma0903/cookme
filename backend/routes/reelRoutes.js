const express = require('express');
const router = express.Router();
const { getReels, createReel, deleteReel } = require('../controllers/reelController');
const { protect, creator } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getReels)
  .post(protect, creator, createReel);

router.route('/:id')
  .delete(protect, creator, deleteReel);

module.exports = router;
